import { openUsageAccessSettings } from "@/modules/usage-open";
import { useScreenTime } from "@/modules/useScreenTime";
import { Button, FlatList, Text, View } from "react-native";

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.round((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function ScreentimeScreen() {
  const { ready, totalMs, perApp, daily, error, refresh, hasPermission } =
    useScreenTime();

  async function pushWeek() {
    // TODO: identify user first
    alert("Uploaded last 7 days");
  }

  if (ready && !hasPermission) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text>To show screen time, allow “Usage access”.</Text>
        <Button
          title="Open Usage Access settings"
          onPress={openUsageAccessSettings}
        />
        <Button title="I’ve granted it — Refresh" onPress={refresh} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Button title="Refresh" onPress={refresh} />

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {ready && totalMs != null && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Today: {fmt(totalMs)}
          </Text>
        </View>
      )}

      {/* Last 7 days */}
      <Text style={{ marginTop: 12, fontWeight: "700" }}>Last 7 days</Text>
      <FlatList
        data={daily}
        keyExtractor={(i) => i.date}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 6,
            }}
          >
            <Text>{item.date}</Text>
            <Text>{fmt(item.ms)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ opacity: 0.6 }}>No daily data yet.</Text>
        }
      />
      <Button title="Upload last 7 days" onPress={pushWeek} />
    </View>
  );
}
