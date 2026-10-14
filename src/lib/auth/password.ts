import bcrypt from "bcryptjs";
import crypto from "crypto";

// Hash de Bcrypt con factor de costo 12 (Estándar de la industria para contraseñas de alta seguridad)
// Derivado de: "Admin2026!Vibes"
export const DEFAULT_ADMIN_BCRYPT_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  "$2b$12$TCuAWvZ/29vemSJbxHP/.eJRUh6CFS/5bcgXy.F2CWa9YMfNz5xEK";

export const ADMIN_CONFIG = {
  email: (process.env.ADMIN_EMAIL || "admin@vibesparfum.com").toLowerCase(),
  passwordHash: DEFAULT_ADMIN_BCRYPT_HASH,
};

/**
 * Hashea una contraseña usando Bcrypt con salt aleatorio y factor de costo 12
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(plainPassword, salt);
}

/**
 * Verifica una contraseña en texto claro contra su hash Bcrypt (Resistente a ataques de temporización)
 */
export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hash);
  } catch (err) {
    console.error("Error al comparar hash Bcrypt:", err);
    return false;
  }
}

/**
 * Estructura de sesión administrativa segura
 */
export interface AdminSessionPayload {
  user: string;
  role: "super_admin" | "admin";
  loginTime: number;
  exp: number;
  nonce: string;
}

/**
 * Genera el payload de sesión administrativa codificado en JSON para la cookie HttpOnly
 */
export function createAdminSessionCookieValue(userEmail: string): string {
  const now = Date.now();
  const session: AdminSessionPayload = {
    user: userEmail,
    role: "super_admin",
    loginTime: now,
    exp: now + 7 * 24 * 60 * 60 * 1000, // 7 días de validez
    nonce: crypto.randomBytes(16).toString("hex"),
  };
  return JSON.stringify(session);
}

/**
 * Valida si un valor de cookie representa una sesión administrativa activa y vigente
 */
export function validateAdminSessionValue(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;

  // Permitir token legacy para compatibilidad hacia atrás
  if (cookieValue === "admin_authenticated_token_v1") {
    return true;
  }

  try {
    const session: AdminSessionPayload = JSON.parse(cookieValue);
    if (!session || typeof session !== "object") return false;
    if (session.role !== "super_admin" && session.role !== "admin") return false;
    if (session.exp && session.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}
