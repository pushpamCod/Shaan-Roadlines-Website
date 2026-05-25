import { useUserStore } from "@/store";
import { AuthClient } from "@dfinity/auth-client";
import type { Principal } from "@dfinity/principal";
import { useCallback, useEffect, useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  authClient: AuthClient | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    authClient: null,
  });
  const { user, logout: storeLogout } = useUserStore();

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setAuthState({
        isAuthenticated,
        principal: isAuthenticated ? client.getIdentity().getPrincipal() : null,
        authClient: client,
      });
    });
  }, []);

  const login = useCallback(async () => {
    const client = authState.authClient || (await AuthClient.create());
    await new Promise<void>((resolve, reject) => {
      client.login({
        identityProvider:
          (import.meta.env.VITE_INTERNET_IDENTITY_URL as string | undefined) ??
          "https://identity.ic0.app",
        onSuccess: () => resolve(),
        onError: (err) => reject(new Error(err)),
      });
    });
    const principal = client.getIdentity().getPrincipal();
    setAuthState({ isAuthenticated: true, principal, authClient: client });
  }, [authState.authClient]);

  const logout = useCallback(async () => {
    if (authState.authClient) {
      await authState.authClient.logout();
    }
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: false,
      principal: null,
    }));
    storeLogout();
  }, [authState.authClient, storeLogout]);

  return {
    isAuthenticated: authState.isAuthenticated,
    principal: authState.principal,
    login,
    logout,
    loginStatus: authState.isAuthenticated ? "success" : "idle",
    user,
  };
}
