"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ShippingRate } from "@/types";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";

export interface UseShippingReturn {
  departments: ShippingRate[];
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  currentRate: ShippingRate | undefined;
  calculateShippingCost: (deptName: string, subtotal: number) => number;
  isFreeShipping: boolean;
  courierInfo: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useShipping(initialDepartment: string = "La Paz", subtotal: number = 0): UseShippingReturn {
  const [departments, setDepartments] = useState<ShippingRate[]>(BOLIVIA_DEPARTMENTS);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment);
  const [courierInfo, setCourierInfo] = useState("Encomienda Asegurada con Protección Especial de Frascos");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shipping");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      if (Array.isArray(data.departments) && data.departments.length > 0) {
        setDepartments(data.departments);
      }
      if (data.nationalCourier) {
        setCourierInfo(data.nationalCourier);
      }
    } catch (err) {
      console.warn("Fallo al consultar /api/shipping, usando tarifas locales:", err);
      setDepartments(BOLIVIA_DEPARTMENTS);
      setError(err instanceof Error ? err.message : "Error al cargar tarifas de envío");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadRates = async () => {
      try {
        const res = await fetch("/api/shipping");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          if (Array.isArray(data.departments) && data.departments.length > 0) {
            setDepartments(data.departments);
          }
          if (data.nationalCourier) {
            setCourierInfo(data.nationalCourier);
          }
        }
      } catch {
        // En caso de fallo silencioso, BOLIVIA_DEPARTMENTS ya está inicializado
      }
    };

    loadRates();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentRate = useMemo(() => {
    return (
      departments.find((d) => d.department.toLowerCase() === selectedDepartment.toLowerCase()) ||
      departments[0]
    );
  }, [departments, selectedDepartment]);

  const calculateShippingCost = useCallback(
    (deptName: string, amount: number) => {
      const rate = departments.find(
        (d) => d.department.toLowerCase() === deptName.toLowerCase()
      );
      if (!rate) return 25; // Tarifa nacional estándar
      if (rate.freeShippingAbove && amount >= rate.freeShippingAbove) {
        return 0; // Envío bonificado gratis
      }
      return rate.cost;
    },
    [departments]
  );

  const isFreeShipping = useMemo(() => {
    if (!currentRate || !currentRate.freeShippingAbove) return false;
    return subtotal >= currentRate.freeShippingAbove;
  }, [currentRate, subtotal]);

  return {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    currentRate,
    calculateShippingCost,
    isFreeShipping,
    courierInfo,
    isLoading,
    error,
    refetch: fetchRates,
  };
}
