import { useRouter } from "expo-router";
import { Button, SafeAreaView } from "react-native";

export default function Login() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Button title="Sign in" onPress={() => router.replace("/")} />
    </SafeAreaView>
  );
}
