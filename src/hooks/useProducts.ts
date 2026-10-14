"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, OlfactoryFamily, Gender } from "@/types";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";

export interface ProductsFilterOptions {
  q?: string;
  brand?: string;
  family?: OlfactoryFamily | string;
  gender?: Gender | string;
  inStock?: boolean;
  limit?: number;
}

export interface UseProductsReturn {
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: ProductsFilterOptions;
  setFilter: <K extends keyof ProductsFilterOptions>(key: K, value: ProductsFilterOptions[K]) => void;
  setFilters: React.Dispatch<React.SetStateAction<ProductsFilterOptions>>;
  resetFilters: () => void;
  refetch: () => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<{ success: boolean; product?: Product; error?: string }>;
}

export function useProducts(initialFilters: ProductsFilterOptions = {}): UseProductsReturn {
  const [filters, setFilters] = useState<ProductsFilterOptions>(initialFilters);
  const [products, setProducts] = useState<Product[]>(MOCK_PERFUMES);
  const [total, setTotal] = useState(MOCK_PERFUMES.length);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.q?.trim()) params.set("q", filters.q.trim());
      if (filters.brand) params.set("brand", filters.brand);
      if (filters.family) params.set("family", filters.family);
      if (filters.gender) params.set("gender", filters.gender);
      if (filters.inStock) params.set("inStock", "true");
      if (filters.limit) params.set("limit", filters.limit.toString());

      const url = `/api/products?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setError(null);
    } catch (err) {
      console.warn("Fallo al consultar /api/products, usando respaldo local:", err);
      let local = MOCK_PERFUMES.filter((p) => p.isActive !== false);
      if (filters.q?.trim()) {
        const q = filters.q.toLowerCase().trim();
        local = local.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.olfactoryFamily.toLowerCase().includes(q)
        );
      }
      if (filters.brand) {
        local = local.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
      }
      if (filters.family) {
        local = local.filter((p) => p.olfactoryFamily.toLowerCase() === filters.family?.toLowerCase());
      }
      if (filters.gender) {
        local = local.filter((p) => p.gender.toLowerCase() === filters.gender?.toLowerCase());
      }
      if (filters.inStock) {
        local = local.filter((p) => p.variants.some((v) => v.stock > 0));
      }

      setProducts(local);
      setTotal(local.length);
      setError(err instanceof Error ? err.message : "Error al cargar catálogo");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let cancelled = false;

    const runAsyncFetch = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.q?.trim()) params.set("q", filters.q.trim());
        if (filters.brand) params.set("brand", filters.brand);
        if (filters.family) params.set("family", filters.family);
        if (filters.gender) params.set("gender", filters.gender);
        if (filters.inStock) params.set("inStock", "true");
        if (filters.limit) params.set("limit", filters.limit.toString());

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();

        if (!cancelled) {
          setProducts(data.products || []);
          setTotal(data.total || 0);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          let local = MOCK_PERFUMES.filter((p) => p.isActive !== false);
          if (filters.q?.trim()) {
            const q = filters.q.toLowerCase().trim();
            local = local.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.olfactoryFamily.toLowerCase().includes(q)
            );
          }
          if (filters.brand) {
            local = local.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
          }
          if (filters.family) {
            local = local.filter((p) => p.olfactoryFamily.toLowerCase() === filters.family?.toLowerCase());
          }
          if (filters.gender) {
            local = local.filter((p) => p.gender.toLowerCase() === filters.gender?.toLowerCase());
          }
          if (filters.inStock) {
            local = local.filter((p) => p.variants.some((v) => v.stock > 0));
          }

          setProducts(local);
          setTotal(local.length);
          setError(err instanceof Error ? err.message : "Error al cargar catálogo");
        }
      }
    };

    runAsyncFetch();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const setFilter = useCallback(
    <K extends keyof ProductsFilterOptions>(key: K, value: ProductsFilterOptions[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const createProduct = useCallback(
    async (productData: Partial<Product>) => {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });

        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.error || "Error al crear el perfume" };
        }

        await fetchProducts();
        return { success: true, product: data.product };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Error de red al crear el producto",
        };
      }
    },
    [fetchProducts]
  );

  return {
    products,
    total,
    isLoading,
    error,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    refetch: fetchProducts,
    createProduct,
  };
}
