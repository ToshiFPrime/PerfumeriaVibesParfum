"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Vibes Parfum PWA Service Worker registrado con éxito:", registration.scope);
          })
          .catch((error) => {
            console.warn("Fallo en registro de Service Worker PWA:", error);
          });
      });
    }
  }, []);

  return null;
}
