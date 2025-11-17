// modules/usage-open.ts
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform } from "react-native";

const USAGE_SETTINGS_ACTION =
  IntentLauncher.ActivityAction?.USAGE_ACCESS_SETTINGS ??
  "android.settings.USAGE_ACCESS_SETTINGS";

export async function openUsageAccessSettings() {
  if (Platform.OS !== "android") return;
  try {
    await IntentLauncher.startActivityAsync(USAGE_SETTINGS_ACTION);
  } catch {
    // Fallback: open general app settings so users can navigate manually.
    await Linking.openSettings();
  }
}
