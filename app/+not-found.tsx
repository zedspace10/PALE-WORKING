import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { StarField } from "@/components/StarField";
import { useColors } from "@/hooks/useColors";

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StarField count={60} containerOpacity={0.5} />
        <Text style={[styles.title, { color: colors.foreground }]}>
          Nothing here
        </Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          This page does not exist.
        </Text>
        <Link href="/" style={styles.link} accessibilityRole="link">
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Back to Home
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: { fontSize: 22, lineHeight: 28, fontFamily: "Inter_600SemiBold" },
  body: { fontSize: 15, lineHeight: 22, fontFamily: "Inter_400Regular" },
  link: { marginTop: 12, paddingVertical: 12 },
  linkText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
