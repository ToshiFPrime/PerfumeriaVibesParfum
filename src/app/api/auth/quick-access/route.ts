import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CONFIG, createAdminSessionCookieValue } from "@/lib/auth/password";

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") || "admin";
  const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/admin";

  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    request.url.startsWith("https");
  const proto = isHttps ? "https" : "http";

  const targetUrl = forwardedHost
    ? `${proto}://${forwardedHost}${redirectTarget}`
    : new URL(redirectTarget, request.url).toString();

  const response = NextResponse.redirect(targetUrl);

  if (role === "admin") {
    const sessionValue = createAdminSessionCookieValue(ADMIN_CONFIG.email);
    response.cookies.set("vibes_admin_session", sessionValue, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return response;
}
