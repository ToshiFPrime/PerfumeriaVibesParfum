"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface BaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  side?: "right" | "left";
  footer?: React.ReactNode;
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function BaseDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "md",
  side = "right",
  footer,
}: BaseDrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const isRight = side === "right";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 ${
          isRight ? "right-0 pl-10" : "left-0 pr-10"
        } max-w-full flex`}
      >
        <div
          className={`w-screen ${MAX_WIDTH_CLASSES[maxWidth]} bg-zinc-950 ${
            isRight ? "border-l border-zinc-800" : "border-r border-zinc-800"
          } flex flex-col shadow-2xl animate-in ${
            isRight ? "slide-in-from-right" : "slide-in-from-left"
          } duration-300`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-2.5">
              {icon && <div className="shrink-0 text-white">{icon}</div>}
              <div>
                {title && (
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Optional Fixed Footer */}
          {footer && (
            <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-900/40">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
