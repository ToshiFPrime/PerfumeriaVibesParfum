import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CONFIG,
  verifyPassword,
  createAdminSessionCookieValue,
} from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  try {
    let email = "";
    let password = "";
    let redirectParam = "/admin";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = (body.email as string)?.trim().toLowerCase() || "";
      password = body.password as string || "";
      redirectParam = (body.redirect as string) || "/admin";
    } else {
      const formData = await request.formData();
      email = (formData.get("email") as string)?.trim().toLowerCase() || "";
      password = (formData.get("password") as string) || "";
      redirectParam = (formData.get("redirect") as string) || "/admin";
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Por favor ingresa tu correo y contraseña." },
        { status: 400 }
      );
    }

    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      request.url.startsWith("https");

    // Verificar credenciales de Administrador con Bcrypt
    if (email === ADMIN_CONFIG.email) {
      const isPasswordValid = await verifyPassword(password, ADMIN_CONFIG.passwordHash);

      if (isPasswordValid) {
        const sessionValue = createAdminSessionCookieValue(email);
        const redirectTo = redirectParam.startsWith("/admin") ? redirectParam : "/admin";

        // Si fue envío mediante formulario HTML nativo, redirigir directamente
        if (!contentType.includes("application/json")) {
          const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
          const proto = isHttps ? "https" : "http";
          const targetUrl = forwardedHost ? `${proto}://${forwardedHost}${redirectTo}` : new URL(redirectTo, request.url);
          const response = NextResponse.redirect(targetUrl);
          response.cookies.set("vibes_admin_session", sessionValue, {
            httpOnly: true,
            secure: isHttps,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });
          return response;
        }

        const response = NextResponse.json({
          success: true,
          message: "¡Sesión de administrador verificada!",
          redirectTo,
        });

        // Configurar cookie de sesión HttpOnly
        response.cookies.set("vibes_admin_session", sessionValue, {
          httpOnly: true,
          secure: isHttps,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 días
          path: "/",
        });

        return response;
      }

      return NextResponse.json(
        { success: false, message: "Contraseña administrativa incorrecta." },
        { status: 401 }
      );
    }

    // Acceso para cliente regular
    if (password.length >= 6) {
      return NextResponse.json({
        success: true,
        message: "¡Bienvenido a Vibes Parfum!",
        redirectTo: "/catalogo",
      });
    }

    return NextResponse.json(
      { success: false, message: "Credenciales incorrectas. Verifica tu contraseña." },
      { status: 401 }
    );
  } catch (err) {
    console.error("Error en /api/auth/login:", err);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor de autenticación." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Sesión cerrada." });
  response.cookies.delete("vibes_admin_session");
  return response;
}
