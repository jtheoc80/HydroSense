import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith("/admin")
    || request.nextUrl.pathname.startsWith("/api/admin");

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
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/site-visit/:path*"],
};
