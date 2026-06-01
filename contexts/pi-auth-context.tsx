"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";
import { api, setApiAuthToken, removeApiAuthToken } from "@/lib/api";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
  email?: string;
  phone?: string;
  region?: string;
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
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[]) => Promise<PiAuthResult>;
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
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

// Cache pour éviter de charger le SDK plusieurs fois
let sdkLoadPromise: Promise<void> | null = null;

const loadPiSDK = (): Promise<void> => {
  // Si déjà en cours de chargement, retourner la promesse existante
  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  // Si déjà chargé, résoudre immédiatement
  if (typeof window.Pi !== "undefined") {
    return Promise.resolve();
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not configured"));
      return;
    }
    
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;
    script.id = "pi-network-sdk";

    script.onload = () => {
      console.log("✅ Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("❌ Failed to load Pi SDK script");
      sdkLoadPromise = null;
      reject(new Error("Failed to load Pi SDK script. Vérifiez votre connexion internet."));
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
};

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "pi_access_token",
  USER_DATA: "pi_user_data",
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("Initialisation de Pi Network...");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sauvegarder le token dans localStorage
  const saveToken = useCallback((token: string | null, data: LoginDTO | null) => {
    if (token && data) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }, []);

  // Charger la session depuis localStorage
  const loadStoredSession = useCallback(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (storedToken && storedUserData) {
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
    }
    return false;
  }, [saveToken]);

  const authenticateAndLogin = async (): Promise<void> => {
    setError(null);
    setAuthMessage("Authentification avec Pi Network...");
    
    try {
      const piAuthResult = await window.Pi.authenticate(["username", "email"]);

      setAuthMessage("Connexion au serveur...");
      
      const loginRes = await api.post<LoginDTO>(BACKEND_URLS.LOGIN, {
        pi_auth_token: piAuthResult.accessToken,
        pi_user_id: piAuthResult.user.uid,
        pi_username: piAuthResult.user.username,
      });

      if (piAuthResult?.accessToken) {
        setPiAccessToken(piAuthResult.accessToken);
        setApiAuthToken(piAuthResult.accessToken);
      }

      setUserData(loginRes.data);
      saveToken(piAuthResult.accessToken, loginRes.data);
      setIsAuthenticated(true);
      
      console.log("✅ Authentification réussie pour:", loginRes.data.username);
    } catch (err: any) {
      console.error("Erreur d'authentification:", err);
      const errorMessage = err.response?.data?.message || err.message || "Erreur lors de l'authentification";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAuthMessage("Préparation de l'authentification...");
    
    try {
      // Vérifier si Pi est disponible
      if (typeof window === "undefined") {
        throw new Error("L'application ne peut être utilisée que dans un navigateur");
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
    }
  };

  const logout = async (): Promise<void> => {
    setAuthMessage("Déconnexion en cours...");
    
    try {
      // Appeler l'API de déconnexion si disponible
      if (isAuthenticated && piAccessToken) {
        await api.post(BACKEND_URLS.LOGOUT || "/auth/logout", {}).catch(() => {
          // Ignorer les erreurs de déconnexion API
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
    setIsLoading(true);
    setError(null);
    
    try {
      // D'abord, essayer de restaurer une session existante
      const hasStoredSession = loadStoredSession();
      
      if (hasStoredSession) {
        // Vérifier si le token est toujours valide (optionnel)
        setAuthMessage("Session restaurée");
        setIsLoading(false);
        return;
      }
      
      // Si pas de session, ne pas tenter l'authentification automatique
      // L'utilisateur devra cliquer sur "Se connecter"
      setAuthMessage("Connectez-vous avec Pi Network");
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
 * const { piAccessToken, userData, isAuthenticated, login, logout } = usePiAuth();
 */
export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}