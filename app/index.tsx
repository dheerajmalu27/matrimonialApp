import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      setIsAuthenticated(!!accessToken);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  return isAuthenticated ? (
    <Redirect href="/home" />
  ) : (
    <Redirect href="/login" />
  );
}
