"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "./useDebounce";

export interface SearchResultItem {
  id: string;
  name: string;
  brand: string;
  slug: string;
  image: string;
  gender: string;
  minPrice: number;
}

export interface UseProductSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  results: SearchResultItem[];
  count: number;
  isLoading: boolean;
  error: string | null;
  clear: () => void;
}

export function useProductSearch(debounceMs: number = 250): UseProductSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, debounceMs);
  const cacheRef = useRef<Map<string, { count: number; results: SearchResultItem[] }>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const trimmed = debouncedQuery.trim().toLowerCase();

    if (!trimmed || trimmed.length < 2) {
      const timer = setTimeout(() => {
        if (!cancelled) {
          setResults([]);
          setCount(0);
          setIsLoading(false);
          setError(null);
        }
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    if (cacheRef.current.has(trimmed)) {
      const cached = cacheRef.current.get(trimmed)!;
      const timer = setTimeout(() => {
        if (!cancelled) {
          setResults(cached.results);
          setCount(cached.count);
          setIsLoading(false);
          setError(null);
        }
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    const runSearch = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const items = data.results || [];
        const total = data.count || 0;

        cacheRef.current.set(trimmed, { count: total, results: items });

        if (!cancelled) {
          setResults(items);
          setCount(total);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error en búsqueda");
          setResults([]);
          setCount(0);
          setIsLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setCount(0);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    count,
    isLoading,
    error,
    clear,
  };
}
