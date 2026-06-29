import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient, TOKEN_STORAGE_KEY } from "../api/client";
import { AuthContext } from "./auth-context";
import type { LoginRequest, RegisterRequest, TokenResponse, User } from "../types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<User>("/api/auth/me");
      setUser(response.data);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  async function login(payload: LoginRequest) {
    const response = await apiClient.post<TokenResponse>("/api/auth/login", payload);
    const accessToken = response.data.access_token;

    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);

    const meResponse = await apiClient.get<User>("/api/auth/me");
    setUser(meResponse.data);
  }

  async function register(payload: RegisterRequest) {
    await apiClient.post<User>("/api/auth/register", payload);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [isLoading, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
