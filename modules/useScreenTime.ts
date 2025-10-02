import * as React from "react";
import { NativeModules, Platform } from "react-native";

type PerApp = { packageName: string; appName: string; ms: number };
type DayTotal = { date: string; ms: number };

const Native: any = Platform.OS === "android" ? NativeModules.UsageStats : null;

function getTodayRange() {
  const now = new Date();
  const end = now.getTime();
  now.setHours(0, 0, 0, 0);
  return { start: now.getTime(), end };
}

export function useScreenTime() {
  const [ready, setReady] = React.useState(false);
  const [totalMs, setTotalMs] = React.useState<number | null>(null);
  const [perApp, setPerApp] = React.useState<PerApp[]>([]);
  const [daily, setDaily] = React.useState<DayTotal[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);

  const refresh = React.useCallback(async () => {
    setReady(false);
    setError(null);

    if (Platform.OS !== "android" || !Native) {
      setError("Android only");
      setReady(true);
      return;
    }

    try {
      const granted: boolean = await Native.hasPermission();
      setHasPermission(granted);

      if (!granted) {
        setTotalMs(null);
        setPerApp([]);
        setDaily([]);
        setReady(true);
        return;
      }

      const { start, end } = getTodayRange();
      const [t, apps, days] = await Promise.all([
        Native.getTotalForegroundTime(start, end) as Promise<number>,
        Native.getPerAppForegroundTimes(start, end) as Promise<PerApp[]>,
        Native.getDailyTotals(7) as Promise<DayTotal[]>,
      ]);

      setTotalMs(t);
      setPerApp((apps || []).sort((a, b) => b.ms - a.ms));
      setDaily(days || []);
      setReady(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load usage");
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { ready, totalMs, perApp, daily, error, refresh, hasPermission };
}
