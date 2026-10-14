"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import type { FilterState } from "@/types";
import { BaseDrawer } from "./BaseDrawer";

export interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  onReset: () => void;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  totalMatches,
  onReset,
}: MobileFiltersDrawerProps) {
  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros del Catálogo"
      subtitle={`${totalMatches} fragancias disponibles`}
      icon={<SlidersHorizontal className="w-4 h-4 text-emerald-400" />}
      maxWidth="md"
    >
      <div className="p-4">
        <CatalogFilters
          filters={filters}
          setFilters={setFilters}
          totalMatches={totalMatches}
          onReset={onReset}
          isMobileModal={true}
          onCloseMobile={onClose}
        />
      </div>
    </BaseDrawer>
  );
}
