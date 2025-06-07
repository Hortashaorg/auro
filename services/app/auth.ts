import { hashString } from "@package/common";
import { db, queries } from "@package/database";

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
  const refreshTokenHash = await hashString(refreshToken);
  await queries.sessions.deleteSession(refreshTokenHash);
};

const setAuth = async (
  accessToken: string,
  refreshToken: string,
  email: string,
) => {
  await db.transaction(async (tx) => {
    const account = await queries.accounts.setAccount({
      email,
    }, tx);

    await queries.sessions.setSession({
      accountId: account.id,
      refreshTokenHash: await hashString(refreshToken),
      accessTokenHash: await hashString(accessToken),
      expire: Temporal.Now.instant().add({ hours: 72 }),
    }, tx);
  });
};
