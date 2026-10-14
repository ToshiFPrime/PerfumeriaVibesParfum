import bcrypt from "bcryptjs";
import crypto from "crypto";

// Hash de Bcrypt con factor de costo 12 (Estándar de la industria para contraseñas de alta seguridad)
// Derivado de: "Admin2026!Vibes"
export const DEFAULT_ADMIN_BCRYPT_HASH =
  "$2b$12$TCuAWvZ/29vemSJbxHP/.eJRUh6CFS/5bcgXy.F2CWa9YMfNz5xEK";

export function getAdminPasswordHash(): string {
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash && envHash.startsWith("$2")) {
    return envHash;
  }
  return DEFAULT_ADMIN_BCRYPT_HASH;
}

export const ADMIN_CONFIG = {
  email: (process.env.ADMIN_EMAIL || "admin@vibesparfum.com").toLowerCase(),
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
 * Verificación unificada para la cuenta de administrador:
 * 1. Admite ADMIN_PASSWORD directo desde .env / Vercel para comodidad del dueño.
 * 2. Compara contra Bcrypt hash (ADMIN_PASSWORD_HASH o por defecto).
 */
export async function verifyAdminPassword(plainPassword: string): Promise<boolean> {
  if (!plainPassword) return false;

  // Si se configuró contraseña directa en .env de Vercel
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (configuredPassword && plainPassword === configuredPassword) {
    return true;
  }

  // Comprobar contra hash Bcrypt
  const hash = getAdminPasswordHash();
  return await verifyPassword(plainPassword, hash);
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
 * Genera el payload de sesión administrativa codificado en Base64 para evitar problemas de codificación de cookies
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
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

/**
 * Valida si un valor de cookie representa una sesión administrativa activa y vigente
 */
export function validateAdminSessionValue(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;

  // 1. Probar decodificación Base64
  try {
    const jsonStr = Buffer.from(cookieValue, "base64").toString("utf-8");
    const session: AdminSessionPayload = JSON.parse(jsonStr);
    if (session && (session.role === "super_admin" || session.role === "admin")) {
      if (!session.exp || session.exp > Date.now()) return true;
    }
  } catch {}

  // 2. Probar JSON directo o URL-encoded
  try {
    let raw = cookieValue;
    if (raw.includes("%")) {
      try {
        raw = decodeURIComponent(raw);
      } catch {}
    }
    const session: AdminSessionPayload = JSON.parse(raw);
    if (session && typeof session === "object") {
      if (session.role === "super_admin" || session.role === "admin") {
        if (!session.exp || session.exp > Date.now()) return true;
      }
    }
  } catch {}

  return false;
}
