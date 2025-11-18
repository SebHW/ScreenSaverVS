import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

const STORAGE_KEY = "screensavervs.theme";
const ACCENT = "#39278D";

const palettes = {
  light: {
    background: "#f6f4ff",
    surface: "#ffffff",
    card: "#f9f7ff",
    text: "#1f1845",
    textSecondary: "#4a3f73",
    border: "#e3ddff",
    muted: "#7e75a8",
    accent: ACCENT,
    accentMuted: "#5b45d9",
    danger: "#ff7d8b",
    success: "#4cd964",
    inputBackground: "#ffffff",
    inputText: "#1f1845",
    placeholder: "#8e85be",
    shadow: "rgba(31, 24, 69, 0.12)",
  },
  dark: {
    background: "#070513",
    surface: "#0f0c1f",
    card: "#17122e",
    text: "#f7f4ff",
    textSecondary: "#beb6e7",
    border: "#2f2850",
    muted: "#9c93ca",
    accent: ACCENT,
    accentMuted: "#5b45d9",
    danger: "#ff9aa7",
    success: "#66ffba",
    inputBackground: "#120d26",
    inputText: "#f7f4ff",
    placeholder: "#877db8",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

const radii = {
  sm: 10,
  md: 18,
  pill: 999,
};

type Scheme = "light" | "dark";

export type Theme = {
  colors: typeof palettes.light;
  spacing: typeof spacing;
  radii: typeof radii;
};

const makeTheme = (scheme: Scheme): Theme => ({
  colors: palettes[scheme],
  spacing,
  radii,
});

type ThemeContextValue = {
  scheme: Scheme;
  theme: Theme;
  toggleTheme: () => void;
  setScheme: (next: Scheme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  scheme: "light",
  theme: makeTheme("light"),
  toggleTheme: () => undefined,
  setScheme: () => undefined,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [storedScheme, setStoredScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && (value === "light" || value === "dark")) {
          setStoredScheme(value);
        }
      } catch (err) {
        console.warn("Theme preference load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveScheme = (storedScheme ?? systemScheme ?? "light") as Scheme;

  const persistScheme = useCallback((next: Scheme) => {
    AsyncStorage.setItem(STORAGE_KEY, next).catch((err) =>
      console.warn("Theme preference save failed", err)
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setStoredScheme((current) => {
      const resolved = (current ?? effectiveScheme) as Scheme;
      const next = resolved === "dark" ? "light" : "dark";
      persistScheme(next);
      return next;
    });
  }, [effectiveScheme, persistScheme]);

  const setScheme = useCallback(
    (next: Scheme) => {
      setStoredScheme(next);
      persistScheme(next);
    },
    [persistScheme]
  );

  const value = useMemo(
    () => ({
      scheme: effectiveScheme,
      theme: makeTheme(effectiveScheme),
      toggleTheme,
      setScheme,
    }),
    [effectiveScheme, setScheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
