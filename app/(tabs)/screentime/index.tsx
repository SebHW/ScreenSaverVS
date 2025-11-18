import { openUsageAccessSettings } from "@/modules/usage-open";
import { useScreenTime } from "@/modules/useScreenTime";
import { AppButton } from "@/components/ui/AppButton";
import { useTheme } from "@/theme/ThemeProvider";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.round((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function ScreentimeScreen() {
  const { theme } = useTheme();
  const { ready, totalMs, daily, error, refresh, hasPermission } =
    useScreenTime();

  const styles = useThemedStyles((t) =>
    StyleSheet.create({
      safe: {
        flex: 1,
        backgroundColor: t.colors.background,
      },
      content: {
        padding: t.spacing.lg,
        gap: t.spacing.lg,
        flexGrow: 1,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: t.colors.text,
      },
      permissionCard: {
        padding: t.spacing.lg,
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.card,
        gap: t.spacing.md,
      },
      text: {
        color: t.colors.textSecondary,
        fontSize: 16,
      },
      metricCard: {
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor: t.colors.border,
        padding: t.spacing.lg,
        backgroundColor: t.colors.surface,
      },
      metricValue: {
        fontSize: 28,
        fontWeight: "700",
        color: t.colors.text,
      },
      metricCaption: {
        color: t.colors.textSecondary,
        marginTop: t.spacing.xs,
      },
      listCard: {
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.card,
      },
      listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: t.spacing.lg,
        paddingVertical: t.spacing.sm + 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: t.colors.border,
      },
      listItemText: {
        color: t.colors.text,
      },
      listEmpty: {
        padding: t.spacing.lg,
        color: t.colors.muted,
        textAlign: "center",
      },
    })
  );

  async function pushWeek() {
    // TODO: identify user first
    alert("Uploaded last 7 days");
  }

  if (ready && !hasPermission) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.permissionCard}>
            <Text style={styles.sectionTitle}>Permission needed</Text>
            <Text style={styles.text}>
              Enable usage access so we can read your screen time data.
            </Text>
            <AppButton label="Open settings" onPress={openUsageAccessSettings} />
            <AppButton
              variant="secondary"
              label="I’ve granted it — refresh"
              onPress={refresh}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppButton label="Refresh data" onPress={refresh} />

        {error && (
          <Text style={[styles.text, { color: theme.colors.danger }]}>
            {error}
          </Text>
        )}

        {ready && totalMs != null && (
          <View style={styles.metricCard}>
            <Text style={styles.sectionTitle}>Today</Text>
            <Text style={styles.metricValue}>{fmt(totalMs)}</Text>
            <Text style={styles.metricCaption}>Total screen time</Text>
          </View>
        )}

        <View style={styles.listCard}>
          <Text style={[styles.sectionTitle, { padding: theme.spacing.lg }]}>Last 7 days</Text>
          {daily.length === 0 && (
            <Text style={styles.listEmpty}>No daily data yet.</Text>
          )}
          {daily.map((item) => (
            <View key={item.date} style={styles.listItem}>
              <Text style={styles.listItemText}>{item.date}</Text>
              <Text style={styles.listItemText}>{fmt(item.ms)}</Text>
            </View>
          ))}
        </View>

        <AppButton
          variant="secondary"
          label="Upload last 7 days"
          onPress={pushWeek}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
