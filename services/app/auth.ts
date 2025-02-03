import { hashString, throwError } from "@package/common";
import { type Context, decode } from "@package/framework";
import { db, schema } from "@package/database";

export const authCodeLoginLogic = async (c: Context) => {
  const code = new URL(c.req.url).searchParams.get("code") ??
    throwError("Missing auth code");

  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ??
    throwError("Missing Google client secret");

  const params = new URLSearchParams({
    client_id: Deno.env.get("GOOGLE_CLIENT_ID") ??
      throwError("Missing Google client ID"),
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

    await setAccountTokens(
      tokens.access_token,
      tokens.refresh_token,
      email,
    );

    return {
      success: true as true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      email,
      expires_in: tokens.expires_in,
    };
  }

  return {
    success: false,
  } as const;
};

export const setAccountTokens = async (
  accessToken: string | null,
  refreshToken: string | null,
  email: string,
) => {
  const accountSchema = schema.account;

  const account = (await db
    .insert(accountSchema)
    .values({ email })
    .onConflictDoNothing()
    .returning())[0] ?? throwError("Failed to create or read account");

  const authSchema = schema.auth;

  await db.insert(authSchema).values({
    accountId: account.id,
    refreshTokenHash: refreshToken ? await hashString(refreshToken) : null,
    accessTokenHash: accessToken ? await hashString(accessToken) : null,
  }).onConflictDoUpdate({
    target: authSchema.accountId,
    set: {
      accessTokenHash: accessToken ? await hashString(accessToken) : null,
      refreshTokenHash: refreshToken ? await hashString(refreshToken) : null,
    },
  });
};
