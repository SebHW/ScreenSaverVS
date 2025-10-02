import { Linking, NativeModules, Platform } from "react-native";

type PerApp = { packageName: string; appName: string; ms: number };

const Native = Platform.OS === "android" ? NativeModules.UsageStats : null;

export async function ensureUsagePermission() {
  if (!Native || Platform.OS !== "android") return false;
  const ok: boolean = await Native.hasPermission();
  if (ok) return true;
  try {
    const action: string = await Native.settingsAction();
    await Linking.openURL(`intent:${action}#Intent;end`);
  } catch {
    await Linking.openSettings();
  }
  return false;
}

export function getTodayRange() {
  const now = new Date();
  const end = now.getTime();
  now.setHours(0, 0, 0, 0);
  return { start: now.getTime(), end };
}

export async function getTotalMs(start?: number, end?: number) {
  if (!Native || Platform.OS !== "android") return 0;
  const r = getTodayRange();
  return Native.getTotalForegroundTime(start ?? r.start, end ?? r.end);
}

export async function getPerApp(
  start?: number,
  end?: number
): Promise<PerApp[]> {
  if (!Native || Platform.OS !== "android") return [];
  const r = getTodayRange();
  return Native.getPerAppForegroundTimes(start ?? r.start, end ?? r.end);
}
