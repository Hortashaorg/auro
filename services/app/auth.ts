import { throwError } from "@package/common";
import { type Context, decode } from "@package/framework";

export const authCodeLoginLogic = async (c: Context) => {
  const code = new URL(c.req.url).searchParams.get("code") ??
    throwError("Missing auth code");

  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ??
    throwError("Missing Google client secret");

  const params = new URLSearchParams({
    client_id:
      "265576274769-68cff0aspvvl895gahvv5i85ta64bi1n.apps.googleusercontent.com",
    redirect_uri: "http://localhost:4000/login",
    client_secret: clientSecret,
    scope: "email",
    grant_type: "authorization_code",
    access_type: "offline",
    code,
  });

  const googleAuthBaseUrl = Deno.env.get("GOOGLE_AUTH_BASE_URL") ??
    throwError("Missing Google auth base URL");

  const res = await fetch(
    `${googleAuthBaseUrl}/token`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: params,
    },
  );

  if (res.ok) {
    const tokens = await res.json() as {
      access_token: string;
      refresh_token: string;
      id_token: string;
      expires_in: number;
    };
    const email = decode(tokens.id_token).payload.email as string ??
      throwError("Missing email");
    return {
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      email,
      expires_in: tokens.expires_in,
    };
  }

  return {
    success: false,
  };
};
