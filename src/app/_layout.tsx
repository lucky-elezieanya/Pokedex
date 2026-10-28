import "./globals.css"
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2563eb",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
