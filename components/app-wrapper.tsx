"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Version simplifiée sans authentification Pi
export function AppWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simuler un chargement rapide
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-white">🌾</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Chargement...</h2>
          <p className="text-gray-500 mt-2">Préparation de votre espace agricole</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}