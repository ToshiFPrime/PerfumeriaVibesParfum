"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_CONFIG,
  verifyAdminPassword,
  createAdminSessionCookieValue,
} from "@/lib/auth/password";

export interface LoginResult {
  success: boolean;
  message: string;
  redirectTo?: string;
}

export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<LoginResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectTarget = (formData.get("redirect") as string) || "/admin";

  if (!email || !password) {
    return { success: false, message: "Por favor ingresa tu correo y contraseña." };
  }

  // Comprobar credenciales de administrador usando verificación criptográfica Bcrypt
  if (email === ADMIN_CONFIG.email) {
    const isPasswordValid = await verifyAdminPassword(password);

    if (isPasswordValid) {
      const cookieStore = await cookies();
      const sessionValue = createAdminSessionCookieValue(email);

      cookieStore.set("vibes_admin_session", sessionValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días de validez
        path: "/",
      });

      return {
        success: true,
        message: "¡Sesión de administrador iniciada correctamente!",
        redirectTo: redirectTarget.startsWith("/admin") ? redirectTarget : "/admin",
      };
    }

    return {
      success: false,
      message: "Contraseña administrativa incorrecta.",
    };
  }

  // Validación para usuarios clientes de la boutique
  if (password.length >= 6) {
    return {
      success: true,
      message: "¡Bienvenido a Vibes Parfum! Redirigiendo al catálogo...",
      redirectTo: "/catalogo",
    };
  }

  return {
    success: false,
    message: "Credenciales incorrectas. Verifica tu correo y contraseña.",
  };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete("vibes_admin_session");
  redirect("/login");
}
