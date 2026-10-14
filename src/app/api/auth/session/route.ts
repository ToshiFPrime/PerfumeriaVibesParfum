import { NextRequest, NextResponse } from "next/server";

// GET: Verifica el estado de la sesión administrativa actual
export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("vibes_admin_session");

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({
      authenticated: false,
      role: null,
      user: null,
    });
  }

  if (sessionCookie.value === "admin_authenticated_token_v1") {
    return NextResponse.json({
      authenticated: true,
      role: "admin",
      user: "admin@vibesparfum.com",
    });
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    // Verificar si expiró
    if (sessionData.exp && sessionData.exp < Date.now()) {
      return NextResponse.json({
        authenticated: false,
        role: null,
        user: null,
        expired: true,
      });
    }

    return NextResponse.json({
      authenticated: true,
      role: sessionData.role || "admin",
      user: sessionData.user || "admin",
      loginTime: sessionData.loginTime,
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
      role: null,
      user: null,
    });
  }
}
