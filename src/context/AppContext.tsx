"use client";

import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { createContext, useContext, useEffect, useState } from "react";
import type { Property } from "@/types/property";
import LoadingSpinner from "../components/LoadingSpinner";

interface AppContextType {
  user: Session["user"] | null;
  status: "loading" | "authenticated" | "unauthenticated";
  session: Session | null;
  handleSignOut: () => void;
  properties: Property[];
  propertiesLoading: boolean;
  propertiesError: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Session["user"] | null>(null);

  // Property state
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) setUser(session.user);
    else setUser(null);
  }, [session]);

  // Fetch properties once at start
  useEffect(() => {
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setPropertiesError(
          err instanceof Error ? err.message : "Unknown error"
        );
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setUser(null);
  };

  const value: AppContextType = {
    user,
    status,
    session,
    handleSignOut,
    properties,
    propertiesLoading,
    propertiesError,
  };

  if (status === "loading" || propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
