import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres.placeholder:password@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

// Usar connection pooler para serverless en Vercel (evita agotar límites de conexiones)
const client = postgres(connectionString, {
  prepare: false,
  ssl: "require",
  max: 1, // Recomendado para funciones serverless en Vercel
});

export const db = drizzle(client, { schema });
