import type { Product, Review } from "@/types";

/**
 * Catálogo Inicial de Fragancias - Estado Limpio para Producción
 * Listo para que el propietario registre sus fragancias reales desde el Panel de Administración.
 */
export const MOCK_PERFUMES: Product[] = [];

/**
 * Reseñas de Productos - Estado Limpio
 */
export const MOCK_REVIEWS: Record<string, Review[]> = {};
