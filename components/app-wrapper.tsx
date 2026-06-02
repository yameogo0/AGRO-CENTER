"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { Loader2, Wifi, WifiOff, Pi, CheckCircle, AlertCircle } from "lucide-react";

interface AppWrapperProps {
  children: ReactNode;
  language?: string;
}

// Traductions complètes
const translations = {
  fr: {
    loading: "Chargement de votre espace agricole...",
    initializing: "Initialisation de l'application",
    connectingPi: "Connexion à Pi Network",
    loadingData: "Chargement de vos données",
    almostReady: "Préparation de votre tableau de bord",
    offline: "Connexion internet perdue. Mode hors ligne actif.",
    piRequired: "Veuillez ouvrir cette application dans le navigateur Pi Network",
    retry: "Réessayer",
    continueOffline: "Continuer hors ligne",
    continueDemo: "Continuer (mode démo)",
    welcome: "Bienvenue sur Agro Multicenter",
    checkingAuth: "Vérification de l'authentification...",
    almostThere: "Plus qu'un instant...",
  },
  en: {
    loading: "Loading your agricultural space...",
    initializing: "Initializing application",
    connectingPi: "Connecting to Pi Network",
    loadingData: "Loading your data",
    almostReady: "Preparing your dashboard",
    offline: "Internet connection lost. Offline mode active.",
    piRequired: "Please open this application in Pi Network browser",
    retry: "Retry",
    continueOffline: "Continue offline",
    continueDemo: "Continue (demo mode)",
    welcome: "Welcome to Agro Multicenter",
    checkingAuth: "Checking authentication...",
    almostThere: "Almost there...",
  },
  es: {
    loading: "Cargando su espacio agrícola...",
    initializing: "Inicializando aplicación",
    connectingPi: "Conectando a Pi Network",
    loadingData: "Cargando sus datos",
    almostReady: "Preparando su tablero",
    offline: "Conexión a internet perdida. Modo offline activo.",
    piRequired: "Por favor, abra esta aplicación en el navegador Pi Network",
    retry: "Reintentar",
    continueOffline: "Continuar sin conexión",
    continueDemo: "Continuar (modo demo)",
    welcome: "Bienvenido a Agro Multicenter",
    checkingAuth: "Verificando autenticación...",
    almostThere: "Casi listo...",
  },
  pt: {
    loading: "Carregando seu espaço agrícola...",
    initializing: "Inicializando aplicação",
    connectingPi: "Conectando à Pi Network",
    loadingData: "Carregando seus dados",
    almostReady: "Preparando seu painel",
    offline: "Conexão com a internet perdida. Modo offline ativo.",
    piRequired: "Por favor, abra este aplicativo no navegador Pi Network",
    retry: "Tentar novamente",
    continueOffline: "Continuar offline",
    continueDemo: "Continuar (modo demo)",
    welcome: "Bem-vindo ao Agro Multicenter",
    checkingAuth: "Verificando autenticação...",
    almostThere: "Quase pronto...",
  },
};

// Étapes de chargement
const loadingSteps = [
  { key: "initializing", duration: 600, progress: 15 },
  { key: "checkingAuth", duration: 800, progress: 35 },
  { key: "connectingPi", duration: 1000, progress: 55 },
  { key: "loadingData", duration: 800, progress: 80 },
  { key: "almostReady", duration: 600, progress: 100 },
];

export function AppWrapper({ children, language = "fr" }: AppWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const [showPiWarning, setShowPiWarning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("initializing");
  const [hasAutoContinued, setHasAutoContinued] = useState(false);

  const isOnline = useOnlineStatus();
  const { isAuthenticated, isLoading: isPiLoading, login, error: piError } = usePiAuth();

  const t = translations[language as keyof typeof translations] || translations.fr;
  const currentStep = loadingSteps[currentStepIndex];

  // Animation de progression du chargement
  useEffect(() => {
    if (!isInitializing || isReady) return;

    let animationFrameId: number;
    let stepIndex = 0;
    let startTime = 0;
    let currentProgress = 0;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const step = loadingSteps[stepIndex];
      
      if (!step) return;

      const startProgress = currentProgress;
      const endProgress = step.progress;
      const duration = step.duration;
      
      const newProgress = Math.min(
        startProgress + (elapsed / duration) * (endProgress - startProgress),
        endProgress
      );
      
      setProgress(Math.floor(newProgress));
      setLoadingMessage(step.key);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        setProgress(endProgress);
        currentProgress = endProgress;
        stepIndex++;
        setCurrentStepIndex(stepIndex);

        if (stepIndex < loadingSteps.length) {
          startTime = 0;
          animationFrameId = requestAnimationFrame(animateProgress);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInitializing, isReady]);

  // Vérification de l'authentification Pi
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAuth = async () => {
      // Si déjà authentifié, passer directement
      if (isAuthenticated) {
        setIsInitializing(false);
        setIsReady(true);
        return;
      }

      // Attendre que le chargement Pi soit terminé
      if (!isPiLoading) {
        // Si erreur Pi (hors Pi Browser)
        if (piError && (piError.includes("Pi Browser") || piError.includes("Pi Network"))) {
          setShowPiWarning(true);
          setIsInitializing(false);
          return;
        }
        
        // Si pas authentifié, laisser l'utilisateur se connecter
        // mais permettre de continuer après un délai
        if (!hasAutoContinued) {
          timeoutId = setTimeout(() => {
            if (!isAuthenticated && !showPiWarning) {
              setShowPiWarning(true);
              setHasAutoContinued(true);
            }
          }, 5000);
        }
        
        setIsInitializing(false);
        setIsReady(true);
      }
    };

    checkAuth();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isPiLoading, piError, hasAutoContinued]);

  // Forcer l'initialisation après un certain temps
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isInitializing && !isReady) {
        setIsInitializing(false);
        setIsReady(true);
      }
    }, 12000); // 12 secondes max

    return () => clearTimeout(timeout);
  }, [isInitializing, isReady]);

  // Gestion du mode hors ligne
  useEffect(() => {
    if (!isOnline && !showOfflineWarning && isReady) {
      setShowOfflineWarning(true);
    }
  }, [isOnline, showOfflineWarning, isReady]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleContinueOffline = useCallback(() => {
    setShowOfflineWarning(false);
    setIsReady(true);
  }, []);

  const handleContinueWithoutPi = useCallback(async () => {
    setShowPiWarning(false);
    setIsReady(true);
    // Tenter une connexion anonyme ou en mode démo
    try {
      await login();
    } catch (err) {
      console.warn("Demo mode:", err);
    }
  }, [login]);

  // Écran de chargement principal
  if (isInitializing && !isReady) {
    const stepMessage = currentStep?.key || "initializing";
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-green-100 animate-fade-in">
            {/* Logo animé */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl animate-bounce-subtle">🌾</span>
                </div>
                <div className="absolute -inset-1">
                  <div className="w-24 h-24 rounded-full border-4 border-green-500/20" />
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-green-500 border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
                </div>
              </div>
            </div>

            {/* Titre */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                AGRO MULTICENTER HINOS
              </h2>
              <p className="text-gray-500 text-sm mt-1 animate-pulse">
                {t[stepMessage as keyof typeof t] || t.loading}
              </p>
            </div>

            {/* Barre de progression */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  {progress < 100 && (
                    <Loader2 className="h-3 w-3 animate-spin text-green-500" />
                  )}
                  {progress >= 100 && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                  {t[stepMessage as keyof typeof t] || t.initializing}
                </span>
                <span className="text-green-600 font-medium">{progress}%</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </div>

            {/* Points d'animation */}
            <div className="flex justify-center gap-2 mt-6">
              {loadingSteps.map((step, i) => (
                <div
                  key={step.key}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    progress >= step.progress 
                      ? 'bg-green-500 opacity-100 scale-100' 
                      : 'bg-gray-300 opacity-50 scale-75'
                  }`}
                />
              ))}
            </div>

            {/* Version */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Version 2.1.0 • © 2024 Agro Multicenter Hinos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Avertissement hors ligne
  if (showOfflineWarning && !isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <WifiOff className="h-10 w-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">⚠️ {t.offline}</h2>
          <p className="text-gray-500 text-sm mb-6">
            Certaines fonctionnalités peuvent être limitées sans connexion internet.
            Vos données seront synchronisées automatiquement lors du retour de la connexion.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              🔄 {t.retry}
            </button>
            <button
              onClick={handleContinueOffline}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              📱 {t.continueOffline}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Avertissement Pi Browser
  if (showPiWarning) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Pi className="h-10 w-10 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">π {t.piRequired}</h2>
          <p className="text-gray-500 text-sm mb-6">
            Pour utiliser toutes les fonctionnalités de paiement et d'authentification, 
            veuillez ouvrir cette application dans le navigateur Pi Network.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              🔄 {t.retry}
            </button>
            <button
              onClick={handleContinueWithoutPi}
              className="w-full border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              📱 {t.continueDemo}
            </button>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Mode démo: certaines fonctionnalités premium sont limitées
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook pour accéder à l'état du wrapper
export function useAppWrapper() {
  const [isOnline, setIsOnline] = useState(true);
  const [isPiAvailable, setIsPiAvailable] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setIsPiAvailable(!!(typeof window !== "undefined" && window.Pi));
  }, []);

  return { isOnline, isPiAvailable };
}