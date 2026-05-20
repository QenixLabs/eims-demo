import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  completedTours: Record<string, boolean>;
  skipTour: (key: string) => void;
  resetTour: (key: string) => void;
  resetAllTours: () => void;
  isTourCompleted: (key: string) => boolean;
}

function getTourKey(userId: number, role: string, page: string): string {
  return `${userId}-${role}-${page}`;
}

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      completedTours: {},

      skipTour: (key) =>
        set((state) => ({
          completedTours: { ...state.completedTours, [key]: true },
        })),

      resetTour: (key) =>
        set((state) => {
          const next = { ...state.completedTours };
          delete next[key];
          return { completedTours: next };
        }),

      resetAllTours: () => set({ completedTours: {} }),

      isTourCompleted: (key) => !!get().completedTours[key],
    }),
    {
      name: "eims-tour-storage",
    }
  )
);

export { getTourKey };
