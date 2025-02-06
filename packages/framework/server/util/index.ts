export const isPublic = (path: string): boolean => {
  return path.startsWith("/public/") || path === "/favicon.ico" ||
    path === "/ws";
};
