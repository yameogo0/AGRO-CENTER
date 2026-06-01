"use client";

import { PiAuthProvider } from "@/contexts/pi-auth-context";
import { AppWrapper } from "@/components/app-wrapper";
import { setBaseURL, setGlobalTimeout } from "@/lib/api";
import { useEffect } from "react";

// Configuration API
if (typeof window !== "undefined") {
  setBaseURL(process.env.NEXT_PUBLIC_API_URL || "https://api.agromc.com");
  setGlobalTimeout(45000);
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PiAuthProvider>
      <AppWrapper>{children}</AppWrapper>
    </PiAuthProvider>
  );
}