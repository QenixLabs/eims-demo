import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router";
import { driver } from "driver.js";
import { useAuthStore, type PlatformRole } from "@/store/authStore";
import { useTourStore, getTourKey } from "@/store/tourStore";
import { getStepsForPage, type TourStep } from "./tour-steps";
import { useTranslation } from "react-i18next";
import "./driver.css";

interface TourContextValue {
  startTour: (page?: string) => void;
  skipCurrentTour: () => void;
  hasTourForPage: (page: string) => boolean;
  isTourRunning: () => boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

function getPageKeyFromPath(path: string): string {
  if (path === "/") return "dashboard";
  if (path === "/applications") return "applications";
  if (path === "/applications/new") return "new-application";
  if (path.startsWith("/verification/")) return "verification-detail";
  if (path === "/verification") return "verification";
  if (path === "/card-issuance") return "card-issuance";
  if (path.startsWith("/card-issuance/")) return "card-issuance";
  if (path === "/authorities") return "authorities";
  if (path === "/users") return "users";
  if (path === "/audit") return "audit";
  return "";
}

function filterExistingSteps(steps: TourStep[]): TourStep[] {
  return steps.filter((step) => {
    try {
      const el = document.querySelector(step.element);
      return !!el;
    } catch {
      return false;
    }
  });
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const platformUser = useAuthStore((s) => s.platformUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { skipTour, isTourCompleted } = useTourStore();
  const { t } = useTranslation("tour");

  const driverRef = useRef<ReturnType<typeof driver> | null>(null);
  const currentPageKeyRef = useRef<string>("");
  const autoStartedRef = useRef<Set<string>>(new Set());

  const buildDriver = useCallback(
    (steps: TourStep[], pageKey: string) => {
      const existingSteps = filterExistingSteps(steps);
      if (existingSteps.length === 0) return null;

      const userId = platformUser?.id;
      const role = platformUser?.role;
      if (!userId || !role) return null;

      const d = driver({
        showProgress: true,
        progressText: "{{current}} / {{total}}",
        animate: true,
        overlayOpacity: 0.45,
        allowClose: true,
        overlayClickBehavior: "close",
        steps: existingSteps.map((step) => ({
          element: step.element,
          popover: {
            title: step.popover.title,
            description: step.popover.description,
            side: step.popover.side,
            align: step.popover.align,
          },
        })),
        onDestroyed: () => {
          driverRef.current = null;
          currentPageKeyRef.current = "";
        },
        onPopoverRender: (popover, { config, state }) => {
          const isLastStep =
            config.steps && state.activeIndex === config.steps.length - 1;
          const nextBtn = popover.footerButtons.querySelector(
            ".driver-popover-next-btn"
          ) as HTMLButtonElement | null;
          if (nextBtn && isLastStep) {
            nextBtn.textContent = t("finish");
          }
        },
      });

      return d;
    },
    [platformUser, t]
  );

  const startTour = useCallback(
    (page?: string) => {
      if (!platformUser) return;

      const pageKey = page || getPageKeyFromPath(location.pathname);
      if (!pageKey) return;

      const steps = getStepsForPage(platformUser.role as PlatformRole, pageKey, t);
      if (!steps || steps.length === 0) return;

      // Destroy any existing tour
      if (driverRef.current) {
        driverRef.current.destroy();
      }

      const d = buildDriver(steps, pageKey);
      if (!d) return;

      driverRef.current = d;
      currentPageKeyRef.current = pageKey;
      d.drive();
    },
    [platformUser, location.pathname, buildDriver, t]
  );

  const skipCurrentTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    if (platformUser && currentPageKeyRef.current) {
      const key = getTourKey(
        platformUser.id,
        platformUser.role,
        currentPageKeyRef.current
      );
      skipTour(key);
    }
  }, [platformUser, skipTour]);

  const hasTourForPage = useCallback(
    (page: string): boolean => {
      if (!platformUser) return false;
      const steps = getStepsForPage(
        platformUser.role as PlatformRole,
        page,
        t
      );
      return !!steps && steps.length > 0;
    },
    [platformUser, t]
  );

  const isTourRunning = useCallback(() => {
    return !!driverRef.current;
  }, []);

  // Auto-start tour on page change
  useEffect(() => {
    if (!isAuthenticated || !platformUser) return;

    const pageKey = getPageKeyFromPath(location.pathname);
    if (!pageKey) return;

    const role = platformUser.role as PlatformRole;
    const steps = getStepsForPage(role, pageKey, t);
    if (!steps || steps.length === 0) return;

    const tourKey = getTourKey(platformUser.id, role, pageKey);
    if (isTourCompleted(tourKey)) return;
    if (autoStartedRef.current.has(tourKey)) return;

    // Wait for DOM to settle and elements to render
    const timer = setTimeout(() => {
      autoStartedRef.current.add(tourKey);
      const d = buildDriver(steps, pageKey);
      if (d) {
        driverRef.current = d;
        currentPageKeyRef.current = pageKey;
        d.drive();
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [location.pathname, isAuthenticated, platformUser, isTourCompleted, buildDriver, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);

  return (
    <TourContext.Provider
      value={{ startTour, skipCurrentTour, hasTourForPage, isTourRunning }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used within TourProvider");
  }
  return ctx;
}
