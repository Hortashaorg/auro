import { hashString, throwError } from "@package/common";
import { type Context, decode, getCookie } from "@package/framework";
import { db, schema, sql } from "@package/database";

export const authCodeLoginLogic = async (c: Context) => {
  const code = new URL(c.req.url).searchParams.get("code") ??
    throwError("Missing auth code");

  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ??
    throwError("Missing Google client secret");

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ??
    throwError("Missing Google client ID");

  const url = new URL(c.req.url);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${url.origin}/login`,
    client_secret: clientSecret,
    scope: "email",
    grant_type: "authorization_code",
    access_type: "offline",
    prompt: "consent",
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
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      email,
      expires_in: tokens.expires_in,
      refresh_token_expires_in: 3600 * 3, // 3 days
    } as const;
  }

  return {
    success: false,
  } as const;
};

export const refreshTokenLogic = async (c: Context) => {
  const refreshToken = getCookie(c, "refresh_token");

  if (!refreshToken) {
    return { success: false } as const;
  }

  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") ??
    throwError("Missing Google client secret");

  const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ??
    throwError("Missing Google client ID");

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    scope: "email",
    refresh_token: refreshToken,
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
      id_token: string;
      expires_in: number;
    };

    const email = decode(tokens.id_token).payload.email as string ??
      throwError("Missing email");

    await setAccountTokens(
      tokens.access_token,
      refreshToken,
      email,
    );

    return {
      success: true,
      accessToken: tokens.access_token,
      email,
      expires_in: tokens.expires_in,
    } as const;
  }

  return {
    success: false,
  } as const;
};

export const logoutLogic = async (c: Context) => {
  const accessToken = getCookie(c, "access_token");

  if (!accessToken) {
    return { success: false } as const;
  }
  const accessTokenHash = await hashString(accessToken);

  const auth = await db.query.auth.findFirst({
    where: (auth, { eq }) => eq(auth.accessTokenHash, accessTokenHash),
    with: {
      account: true,
    },
  });

  if (auth?.account) {
    await setAccountTokens(null, null, auth.account.email);
    return {
      success: true,
    } as const;
  }
  throw new Error("Failed to find account");
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
    .onConflictDoUpdate({
      target: accountSchema.email,
      set: {
        email: sql`excluded.email`,
      },
    })
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
