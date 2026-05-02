/**
 * Display mode store — teaching | production
 * Persisted to LocalStorage key: painmap_worksheet:settings.display_mode
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type DisplayMode = "teaching" | "production";

type State = {
  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;
};

export const useDisplayModeStore = create<State>()(
  persist(
    (set) => ({
      mode: "teaching",
      setMode: (m) => set({ mode: m }),
    }),
    {
      name: "painmap_worksheet:settings.display_mode",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
          };
        }
        return localStorage;
      }),
    },
  ),
);
