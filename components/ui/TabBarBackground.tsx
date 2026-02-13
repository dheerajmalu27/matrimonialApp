import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "white" }]} />
  );
}

export function useTabBarHeight() {
  const { bottom } = useSafeAreaInsets();
  const height = useBottomTabBarHeight();
  return height - bottom;
}
