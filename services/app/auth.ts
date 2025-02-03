import { hashString, throwError } from "@package/common";
import { type Context, decode, getCookie } from "@package/framework";
import { db, eq, lt, schema, sql } from "@package/database";
import type { CustomContext } from "@context/index.ts";

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

    await setAuth(
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
      refresh_token_expires_in: 3600 * 72, // 3 days
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

    await setAuth(
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
  const refreshToken = getCookie(c, "refresh_token");

  if (refreshToken) {
    await deleteAuth(refreshToken);
    return {
      success: true,
    } as const;
  }
  throw new Error("Do not have refresh token");
};

export const deleteExpiredAuth = async () => {
  const sessionSchema = schema.session;
  await db.delete(sessionSchema).where(
    lt(sessionSchema.expire, Temporal.Now.instant()),
  );
};

export const deleteAuth = async (refreshToken: string) => {
  const sessionSchema = schema.session;
  const refreshTokenHash = await hashString(refreshToken);
  await db.delete(sessionSchema).where(
    eq(sessionSchema.refreshTokenHash, refreshTokenHash),
  );
};

export const validateUser = async (customContext: CustomContext) => {
  if (!customContext.session) {
    return true;
  }

  if (
    customContext.session.expire.epochMilliseconds <
      Temporal.Now.instant().epochMilliseconds
  ) {
    await deleteExpiredAuth();
    return false;
  }
  return true;
};

export const setAuth = async (
  accessToken: string,
  refreshToken: string,
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

  const sessionSchema = schema.session;

  await db.insert(sessionSchema).values({
    accountId: account.id,
    refreshTokenHash: await hashString(refreshToken),
    accessTokenHash: await hashString(accessToken),
    expire: Temporal.Now.instant().add({ hours: 72 }),
  });
};
