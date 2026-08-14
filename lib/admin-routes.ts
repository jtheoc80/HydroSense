export function isPublicQuoteApiPath(pathname: string): boolean {
  return pathname.startsWith("/api/quotes/public/");
}

export function isQuoteApiWithOwnAuth(pathname: string): boolean {
  return (
    isPublicQuoteApiPath(pathname) || pathname === "/api/quotes/expire-stale"
  );
}

export function isAdminRequestPath(pathname: string): boolean {
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return true;
  }

  return pathname.startsWith("/api/quotes") && !isQuoteApiWithOwnAuth(pathname);
}
