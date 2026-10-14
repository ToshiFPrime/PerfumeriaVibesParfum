import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger panel administrativo
  if (pathname.startsWith("/admin")) {
    const adminSessionCookie = request.cookies.get("vibes_admin_session");

    let isValid = false;
    if (adminSessionCookie?.value) {
      const val = adminSessionCookie.value;
      if (val === "admin_authenticated_token_v1") {
        isValid = true;
      } else {
        // Intentar parsear Base64
        try {
          const jsonStr = atob(val);
          const data = JSON.parse(jsonStr);
          if (data && (!data.exp || data.exp > Date.now())) {
            isValid = true;
          }
        } catch {}

        // Intentar parsear JSON directo o URL-encoded
        if (!isValid) {
          try {
            let raw = val;
            if (raw.includes("%")) {
              try {
                raw = decodeURIComponent(raw);
              } catch {}
            }
            const data = JSON.parse(raw);
            if (data && (!data.exp || data.exp > Date.now())) {
              isValid = true;
            }
          } catch {}
        }
      }
    }

    // Si no existe la cookie o está expirada, redirigir al login
    if (!isValid) {
      const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const forwardedProto = request.headers.get("x-forwarded-proto") || (forwardedHost?.includes("localhost") ? "http" : "https");

      let loginUrl: URL;
      if (forwardedHost) {
        loginUrl = new URL(`${forwardedProto}://${forwardedHost}/login`);
      } else {
        loginUrl = new URL("/login", request.url);
      }
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - api (rutas API)
     * - _next/static (archivos estáticos)
     * - _next/image (rutas de optimización de imágenes)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/admin/:path*",
  ],
};
