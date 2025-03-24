import { hashString, throwError } from "@package/common";
import { db, eq, schema, sql } from "@package/database";

export const afterLoginHook = async (
  loginResult: {
    success: true;
    accessToken: string;
    refreshToken: string;
    email: string;
    expires_in: number;
    refresh_token_expires_in: number;
  } | {
    success: false;
    error: unknown;
  },
) => {
  if (loginResult.success) {
    await setAuth(
      loginResult.accessToken,
      loginResult.refreshToken,
      loginResult.email,
    );
  }
};

export const refreshHook = async (
  refreshResult: {
    success: true;
    accessToken: string;
    refreshToken: string;
    email: string;
    expires_in: number;
  } | {
    success: false;
    error: unknown;
  },
) => {
  if (refreshResult.success) {
    await setAuth(
      refreshResult.accessToken,
      refreshResult.refreshToken,
      refreshResult.email,
    );
  }
};

export const beforeLogoutHook = async (logoutInfo: {
  refreshToken: string;
  email: string;
}) => {
  await deleteAuth(logoutInfo.refreshToken);
};

const deleteAuth = async (refreshToken: string) => {
  const sessionSchema = schema.session;
  const refreshTokenHash = await hashString(refreshToken);
  await db.delete(sessionSchema).where(
    eq(sessionSchema.refreshTokenHash, refreshTokenHash),
  );
};

const setAuth = async (
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
  }).onConflictDoUpdate({
    target: [sessionSchema.refreshTokenHash],
    set: {
      accessTokenHash: await hashString(accessToken),
    },
  });
};
