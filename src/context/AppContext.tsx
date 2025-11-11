"use client";
import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { createContext, useContext, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

interface AppContextType {
  user: Session["user"] | null;
  status: "loading" | "authenticated" | "unauthenticated";
  session: Session | null;
  handleSignOut: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setUser(null);
  };

  const value: AppContextType = {
    session,
    status,
    user,
    handleSignOut,
  };

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
