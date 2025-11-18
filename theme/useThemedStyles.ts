import { useMemo } from "react";
import { Theme, useTheme } from "./ThemeProvider";

export type ThemedStyles<T> = T extends (...args: any[]) => infer R ? R : never;

export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
