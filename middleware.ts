import { NextRequest, NextResponse } from "next/server";
import { isAdminRequestPath } from "@/lib/admin-routes";

export function middleware(request: NextRequest) {
  const isAdmin = isAdminRequestPath(request.nextUrl.pathname);

  if (!isAdmin) {
    const response = NextResponse.next();
    if (request.nextUrl.pathname.startsWith("/site-visit/")) {
      response.headers.set("Cache-Control", "no-store, max-age=0");
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }
    return response;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="HydroSense Admin"' },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const [username, password] = atob(base64).split(":");
  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD;
  if (!validPass || username !== validUser || password !== validPass) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="HydroSense Admin"' },
    });
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/quotes",
    "/api/quotes/:path*",
    "/site-visit/:path*",
  ],
};
