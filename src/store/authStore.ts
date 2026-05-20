import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlatformRole =
  | "super_admin"
  | "authority_admin"
  | "operator"
  | "verification_officer";

export interface PlatformUser {
  id: number;
  name: string;
  email: string;
  role: PlatformRole;
  authorityId: number | null;
  isActive: boolean;
}

interface AuthState {
  platformUser: PlatformUser | null;
  oauthUser: any | null;
  isAuthenticated: boolean;
  setPlatformUser: (user: PlatformUser | null) => void;
  setOAuthUser: (user: any | null) => void;
  logout: () => void;
  hasRole: (roles: PlatformRole[]) => boolean;
  isSuperAdmin: () => boolean;
  isAuthorityAdmin: () => boolean;
  isOperator: () => boolean;
  isVerificationOfficer: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      platformUser: null,
      oauthUser: null,
      isAuthenticated: false,

      setPlatformUser: (user) =>
        set({
          platformUser: user,
          isAuthenticated: !!user,
        }),

      setOAuthUser: (user) =>
        set({
          oauthUser: user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          platformUser: null,
          oauthUser: null,
          isAuthenticated: false,
        }),

      hasRole: (roles) => {
        const { platformUser } = get();
        if (!platformUser) return false;
        return roles.includes(platformUser.role);
      },

      isSuperAdmin: () => {
        const { platformUser } = get();
        return platformUser?.role === "super_admin";
      },

      isAuthorityAdmin: () => {
        const { platformUser } = get();
        return platformUser?.role === "authority_admin";
      },

      isOperator: () => {
        const { platformUser } = get();
        return platformUser?.role === "operator";
      },

      isVerificationOfficer: () => {
        const { platformUser } = get();
        return platformUser?.role === "verification_officer";
      },
    }),
    {
      name: "eims-auth-storage",
      partialize: (state) => ({
        platformUser: state.platformUser,
        oauthUser: state.oauthUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
