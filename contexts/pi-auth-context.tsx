"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";
import { authApi } from "@/lib/api/auth";
import { userApi } from "@/lib/api/user";
import { setApiAuthToken, removeApiAuthToken, setApiLanguage } from "@/lib/api/client";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
  email?: string;
  phone?: string;
  region?: string;
  avatar?: string;
  walletAddress?: string;
  verified?: boolean;
};

interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[], options?: { onIncomplete?: (error: any) => void }) => Promise<PiAuthResult>;
    };
  }
}

interface PiAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authMessage: string;
  piAccessToken: string | null;
  userData: LoginDTO | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  reinitialize: () => Promise<void>;
  error: string | null;
  isPiAvailable: boolean;
  refreshUserData: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

// Cache pour éviter de charger le SDK plusieurs fois
let sdkLoadPromise: Promise<void> | null = null;
let sdkLoadAttempts = 0;
const MAX_SDK_LOAD_ATTEMPTS = 3;

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "pi_access_token",
  USER_DATA: "pi_user_data",
  LAST_AUTH_TIME: "pi_last_auth_time",
};

const loadPiSDK = (): Promise<void> => {
  // Si déjà en cours de chargement, retourner la promesse existante
  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  // Si déjà chargé, résoudre immédiatement
  if (typeof window !== "undefined" && window.Pi) {
    return Promise.resolve();
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot load SDK in server environment"));
      return;
    }

    const script = document.createElement("script");
    
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not configured"));
      return;
    }
    
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;
    script.id = "pi-network-sdk";

    const timeoutId = setTimeout(() => {
      script.remove();
      sdkLoadPromise = null;
      reject(new Error("SDK loading timeout after 10 seconds"));
    }, 10000);

    script.onload = () => {
      clearTimeout(timeoutId);
      console.log("✅ Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      console.error("❌ Failed to load Pi SDK script");
      sdkLoadPromise = null;
      reject(new Error("Failed to load Pi SDK script. Vérifiez votre connexion internet."));
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
};

// Vérifier si on est dans le navigateur Pi
const isPiBrowser = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!window.Pi || navigator.userAgent.includes("PiBrowser");
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("Initialisation de Pi Network...");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPiAvailable, setIsPiAvailable] = useState(false);

  const isInitialized = useRef(false);
  const authInProgress = useRef(false);

  // Sauvegarder le token dans localStorage
  const saveToken = useCallback((token: string | null, data: LoginDTO | null) => {
    if (token && data) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEYS.LAST_AUTH_TIME, Date.now().toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.LAST_AUTH_TIME);
    }
  }, []);

  // Vérifier si la session est expirée (7 jours)
  const isSessionExpired = useCallback((): boolean => {
    const lastAuthTime = localStorage.getItem(STORAGE_KEYS.LAST_AUTH_TIME);
    if (!lastAuthTime) return true;
    
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - parseInt(lastAuthTime) > sevenDays;
  }, []);

  // Charger la session depuis localStorage
  const loadStoredSession = useCallback((): boolean => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (storedToken && storedUserData && !isSessionExpired()) {
      try {
        const user = JSON.parse(storedUserData);
        setPiAccessToken(storedToken);
        setUserData(user);
        setIsAuthenticated(true);
        setApiAuthToken(storedToken);
        console.log("✅ Session restaurée depuis localStorage");
        return true;
      } catch (err) {
        console.error("Erreur lors du chargement de la session:", err);
        saveToken(null, null);
      }
    } else if (isSessionExpired()) {
      console.log("⏰ Session expirée, nettoyage...");
      saveToken(null, null);
    }
    return false;
  }, [saveToken, isSessionExpired]);

  // Rafraîchir les données utilisateur
  const refreshUserData = useCallback(async () => {
    if (!isAuthenticated || !piAccessToken) return;
    
    try {
      const { data } = await userApi.getProfile();
      if (data) {
        const updatedUser: LoginDTO = {
          id: data.id,
          username: data.name,
          credits_balance: 0,
          terms_accepted: true,
          email: data.email,
          phone: data.phone,
          region: userRegion,
          avatar: data.avatar,
          walletAddress: data.walletAddress,
          verified: data.verified,
        };
        setUserData(updatedUser);
        saveToken(piAccessToken, updatedUser);
      }
    } catch (err) {
      console.warn("Erreur lors du rafraîchissement du profil:", err);
    }
  }, [isAuthenticated, piAccessToken, saveToken]);

  const authenticateAndLogin = async (): Promise<void> => {
    if (!window.Pi) {
      throw new Error("Pi SDK not available");
    }

    setError(null);
    setAuthMessage("Authentification avec Pi Network...");
    
    try {
      const piAuthResult = await window.Pi.authenticate(["username", "wallet_address"], {
        onIncomplete: (error) => {
          console.error("Authentication incomplete:", error);
          throw new Error("Authentication cancelled");
        }
      });

      setAuthMessage("Connexion au serveur...");
      
      const loginRes = await authApi.login(piAuthResult.user.uid, piAuthResult.accessToken);
      
      // Adapter la réponse du backend au format LoginDTO
      const userDataDTO: LoginDTO = {
        id: loginRes.data.user.id,
        username: loginRes.data.user.username || piAuthResult.user.username,
        credits_balance: loginRes.data.user.piBalance || 0,
        terms_accepted: true,
        email: loginRes.data.user.email,
        phone: loginRes.data.user.phone,
        region: loginRes.data.user.region,
        avatar: loginRes.data.user.avatar,
        walletAddress: piAuthResult.user.uid,
        verified: true,
      };

      if (piAuthResult?.accessToken) {
        setPiAccessToken(piAuthResult.accessToken);
        setApiAuthToken(piAuthResult.accessToken);
      }

      setUserData(userDataDTO);
      saveToken(piAuthResult.accessToken, userDataDTO);
      setIsAuthenticated(true);
      
      console.log("✅ Authentification réussie pour:", userDataDTO.username);
    } catch (err: any) {
      console.error("Erreur d'authentification:", err);
      const errorMessage = err.response?.data?.message || err.message || "Erreur lors de l'authentification";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (): Promise<void> => {
    if (authInProgress.current) {
      console.log("Authentification déjà en cours");
      return;
    }

    authInProgress.current = true;
    setIsLoading(true);
    setError(null);
    setAuthMessage("Préparation de l'authentification...");
    
    try {
      // Vérifier si on est dans un navigateur
      if (typeof window === "undefined") {
        throw new Error("L'application ne peut être utilisée que dans un navigateur");
      }

      // Vérifier si on est dans Pi Browser
      if (!isPiBrowser()) {
        setAuthMessage("Ouverture dans Pi Browser...");
        // Afficher un message invitant à ouvrir dans Pi Browser
        setError("Veuillez ouvrir cette application dans le navigateur Pi Network");
        setIsLoading(false);
        authInProgress.current = false;
        return;
      }

      // Charger le SDK si nécessaire
      if (typeof window.Pi === "undefined") {
        setAuthMessage("Chargement du SDK Pi Network...");
        await loadPiSDK();
      }

      // Vérifier que Pi est bien disponible
      if (typeof window.Pi === "undefined") {
        throw new Error("Le SDK Pi Network n'a pas pu être chargé");
      }

      setIsPiAvailable(true);
      setAuthMessage("Initialisation de Pi Network...");
      await window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      });

      await authenticateAndLogin();
    } catch (err: any) {
      console.error("❌ Échec de l'authentification:", err);
      setAuthMessage("Échec de l'authentification");
      setError(err.message || "Une erreur est survenue");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      authInProgress.current = false;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthMessage("Déconnexion en cours...");
    
    try {
      // Appeler l'API de déconnexion si disponible
      if (isAuthenticated && piAccessToken) {
        await authApi.logout().catch(() => {
          console.warn("Erreur lors de la déconnexion API");
        });
      }
    } catch (err) {
      console.warn("Erreur lors de la déconnexion:", err);
    } finally {
      // Nettoyer l'état local
      setPiAccessToken(null);
      setUserData(null);
      setIsAuthenticated(false);
      setError(null);
      removeApiAuthToken();
      saveToken(null, null);
      setAuthMessage("Déconnecté");
      console.log("✅ Utilisateur déconnecté");
    }
  };

  const initializePiAndAuthenticate = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    setIsLoading(true);
    setError(null);
    
    try {
      // D'abord, essayer de restaurer une session existante
      const hasStoredSession = loadStoredSession();
      
      if (hasStoredSession) {
        setAuthMessage("Bienvenue !");
        setIsLoading(false);
        return;
      }
      
      // Vérifier la disponibilité de Pi
      const piAvailable = isPiBrowser();
      setIsPiAvailable(piAvailable);
      
      if (piAvailable) {
        setAuthMessage("Prêt à vous connecter avec Pi Network");
      } else {
        setAuthMessage("Veuillez ouvrir dans Pi Browser");
      }
    } catch (err: any) {
      console.error("Erreur d'initialisation:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadStoredSession]);

  useEffect(() => {
    initializePiAndAuthenticate();
  }, [initializePiAndAuthenticate]);

  const value: PiAuthContextType = {
    isAuthenticated,
    isLoading,
    authMessage,
    piAccessToken,
    userData,
    login,
    logout,
    reinitialize: initializePiAndAuthenticate,
    error,
    isPiAvailable,
    refreshUserData,
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

/**
 * Hook to access Pi Network authentication state and user data
 *
 * Must be used within a component wrapped by PiAuthProvider.
 * Provides read-only access to authentication state and user data.
 *
 * @returns {PiAuthContextType} Authentication state and methods
 * @throws {Error} If used outside of PiAuthProvider
 *
 * @example
 * const { piAccessToken, userData, isAuthenticated, login, logout, refreshUserData } = usePiAuth();
 */
export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}