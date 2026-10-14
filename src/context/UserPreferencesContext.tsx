"use client";

import React, { createContext, useContext, useSyncExternalStore, useMemo } from "react";
import type { UserPreferences } from "@/types/preferences";
import { DEFAULT_USER_PREFERENCES } from "@/types/preferences";

interface UserPreferencesContextType {
  preferences: UserPreferences;
  isLoaded: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const STORAGE_KEY = "vibes_user_preferences";

function subscribePreferences(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("vibes_preferences_sync", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vibes_preferences_sync", callback);
  };
}

function getPreferencesSnapshot(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) || "";
}

function getServerPreferencesSnapshot(): string {
  return "";
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const rawPreferences = useSyncExternalStore(
    subscribePreferences,
    getPreferencesSnapshot,
    getServerPreferencesSnapshot
  );

  const preferences = useMemo<UserPreferences>(() => {
    if (!rawPreferences) return DEFAULT_USER_PREFERENCES;
    try {
      const parsed = JSON.parse(rawPreferences);
      return { ...DEFAULT_USER_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_USER_PREFERENCES;
    }
  }, [rawPreferences]);

  const persistPreferences = (next: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("vibes_preferences_sync"));
    } catch (e) {
      console.warn("Error al persistir preferencias de usuario:", e);
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const next = { ...preferences, ...updates };
    persistPreferences(next);
  };

  const resetPreferences = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("vibes_preferences_sync"));
    } catch (e) {
      console.warn("Error al limpiar preferencias de usuario:", e);
    }
  };

  const toggleWishlist = (productId: string) => {
    const exists = preferences.wishlist.includes(productId);
    const nextWishlist = exists
      ? preferences.wishlist.filter((id) => id !== productId)
      : [...preferences.wishlist, productId];
    updatePreferences({ wishlist: nextWishlist });
  };

  const isInWishlist = (productId: string) => {
    return preferences.wishlist.includes(productId);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        isLoaded: true,
        updatePreferences,
        resetPreferences,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error("useUserPreferences debe ser usado dentro de un UserPreferencesProvider");
  }
  return context;
}
