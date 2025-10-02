// modules/usage-open.ts
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, NativeModules, Platform } from "react-native";

const Native = Platform.OS === "android" ? NativeModules.UsageStats : null;

export async function openUsageAccessSettings() {
  if (!Native || Platform.OS !== "android") return;
  try {
    const action: string = await Native.settingsAction(); // "android.settings.USAGE_ACCESS_SETTINGS"
    await IntentLauncher.startActivityAsync(action);
  } catch {
    // Fallback: open app settings (user can navigate to "Special app access" from there)
    await Linking.openSettings();
  }
}
