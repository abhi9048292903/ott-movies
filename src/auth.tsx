import { createContext, createElement, useContext, useMemo, useState, type ReactNode } from "react";

type AuthState = {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("ott_token"));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("ott_role"));

  const value = useMemo<AuthState>(
    () => ({
      token,
      role,
      login: (nextToken, nextRole) => {
        localStorage.setItem("ott_token", nextToken);
        localStorage.setItem("ott_role", nextRole);
        setToken(nextToken);
        setRole(nextRole);
      },
      logout: () => {
        localStorage.removeItem("ott_token");
        localStorage.removeItem("ott_role");
        setToken(null);
        setRole(null);
      },
    }),
    [token, role],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
