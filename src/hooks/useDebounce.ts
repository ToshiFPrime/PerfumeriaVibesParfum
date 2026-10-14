"use client";

import { useState, useEffect } from "react";

/**
 * Hook para retrasar la actualización de un valor hasta que haya pasado un tiempo de inactividad.
 * Ideal para optimizar barras de búsqueda, reduciendo re-renders innecesarios y consumo de memoria.
 *
 * @param value Valor reactivo a debouncear
 * @param delay Tiempo de espera en milisegundos (por defecto 250ms)
 * @returns El valor estabilizado tras el retraso
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
