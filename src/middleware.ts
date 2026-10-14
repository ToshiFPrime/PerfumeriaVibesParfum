import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger panel administrativo
  if (pathname.startsWith("/admin")) {
    const adminSessionCookie = request.cookies.get("vibes_admin_session");

    let isValid = false;
    if (adminSessionCookie?.value) {
      if (adminSessionCookie.value === "admin_authenticated_token_v1") {
        isValid = true;
      } else {
        try {
          const data = JSON.parse(adminSessionCookie.value);
          if (data && (!data.exp || data.exp > Date.now())) {
            isValid = true;
          }
        } catch {
          isValid = false;
        }
      }
    }

    // Si no existe la cookie o está expirada, redirigir al login
    if (!isValid) {
      const loginUrl = new URL("/login", request.url);
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
