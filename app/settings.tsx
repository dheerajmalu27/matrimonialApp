import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SettingItem {
  id: string;
  title: string;
  type: "toggle" | "action";
  value?: boolean;
  action?: () => void;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    profileVisibility: true,
    matchNotifications: true,
  });

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleAction = (action: string) => {
    switch (action) {
      case "privacy":
        Alert.alert("Privacy Settings", "Privacy settings will be implemented");
        break;
      case "help":
        Alert.alert("Help & Support", "Help center will be implemented");
        break;
      case "about":
        Alert.alert("About", "App version 1.0.0\n© 2024 Matrimonial App");
        break;
      case "logout":
        Alert.alert("Logout", "Are you sure you want to logout?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => router.replace("/login"),
          },
        ]);
        break;
      default:
        break;
    }
  };

  const settingItems: SettingItem[] = [
    {
      id: "notifications",
      title: "Push Notifications",
      type: "toggle",
      value: settings.notifications,
    },
    {
      id: "locationServices",
      title: "Location Services",
      type: "toggle",
      value: settings.locationServices,
    },
    {
      id: "profileVisibility",
      title: "Profile Visibility",
      type: "toggle",
      value: settings.profileVisibility,
    },
    {
      id: "matchNotifications",
      title: "Match Notifications",
      type: "toggle",
      value: settings.matchNotifications,
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      type: "action",
      action: () => handleAction("privacy"),
    },
    {
      id: "help",
      title: "Help & Support",
      type: "action",
      action: () => handleAction("help"),
    },
    {
      id: "about",
      title: "About",
      type: "action",
      action: () => handleAction("about"),
    },
    {
      id: "logout",
      title: "Logout",
      type: "action",
      action: () => handleAction("logout"),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.id} style={styles.settingItem}>
      <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
      {item.type === "toggle" ? (
        <Switch
          value={item.value}
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: "#767577", true: "#FF6B6B" }}
          thumbColor={item.value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={item.action}>
          <Text style={styles.actionButtonText}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
          {settingItems.slice(0, 4).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Support</ThemedText>
          {settingItems.slice(4, 7).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          {settingItems.slice(7).map(renderSettingItem)}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  settingsSection: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
  },
  actionButton: {
    padding: 5,
  },
  actionButtonText: {
    fontSize: 20,
    color: "#666",
  },
});
