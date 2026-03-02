import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  subtitle?: string;
  type: "toggle" | "action";
  value?: boolean;
  action?: () => void;
}

interface MonetizationFeatures {
  basicMessaging: boolean;
  limitedSearch: boolean;
  advancedSearch: boolean;
  verifiedBadge: boolean;
  unlimitedInterests: boolean;
  dailyInterestsLimit: number | null;
}

interface MonetizationStatus {
  activePlan: "free" | "premium";
  planCode: string;
  usage: {
    interestsSentToday: number;
  };
  features: MonetizationFeatures;
}

interface MonetizationConfig {
  currency: string;
  plans: {
    free: {
      displayName: string;
      priceInr: number;
      features: MonetizationFeatures;
    };
    premium: {
      displayName: string;
      priceInr: number;
      features: MonetizationFeatures;
    };
  };
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    profileVisibility: true,
    matchNotifications: true,
  });
  const [loadingMonetization, setLoadingMonetization] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [monetizationConfig, setMonetizationConfig] = useState<MonetizationConfig | null>(null);
  const [monetizationStatus, setMonetizationStatus] = useState<MonetizationStatus | null>(null);

  const fetchMonetization = async () => {
    try {
      setLoadingMonetization(true);
      const response = await apiService.getMonetizationConfig();
      if (response.success && response.data) {
        setMonetizationConfig(response.data.config as MonetizationConfig);
        setMonetizationStatus(response.data.user as MonetizationStatus);
      } else {
        Alert.alert("Info", response.message || "Unable to load subscription details.");
      }
    } catch (error) {
      console.error("Monetization fetch error:", error);
      Alert.alert("Error", "Failed to load subscription info.");
    } finally {
      setLoadingMonetization(false);
    }
  };

  useEffect(() => {
    fetchMonetization();
  }, []);

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      const orderRes = await apiService.createPremiumOrder();

      if (!orderRes.success || !orderRes.data) {
        Alert.alert("Upgrade", orderRes.message || "Unable to create premium order.");
        return;
      }

      const amount = orderRes.data.plan.amountInr;
      Alert.alert(
        "Razorpay Order Ready",
        `Order created for ₹${amount}.\n\nNext step: connect Razorpay Checkout SDK in app and call verify API after payment success.`,
      );
    } catch (error) {
      console.error("Upgrade error:", error);
      Alert.alert("Error", "Failed to start premium upgrade.");
    } finally {
      setUpgrading(false);
    }
  };

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
      subtitle: "Receive notifications for new messages",
      type: "toggle",
      value: settings.notifications,
    },
    {
      id: "locationServices",
      title: "Location Services",
      subtitle: "Allow app to access your location",
      type: "toggle",
      value: settings.locationServices,
    },
    {
      id: "profileVisibility",
      title: "Profile Visibility",
      subtitle: "Make your profile visible to others",
      type: "toggle",
      value: settings.profileVisibility,
    },
    {
      id: "matchNotifications",
      title: "Match Notifications",
      subtitle: "Get notified when you match with someone",
      type: "toggle",
      value: settings.matchNotifications,
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      subtitle: "Manage your privacy preferences",
      type: "action",
      action: () => handleAction("privacy"),
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      type: "action",
      action: () => handleAction("help"),
    },
    {
      id: "about",
      title: "About",
      subtitle: "App information and version",
      type: "action",
      action: () => handleAction("about"),
    },
    {
      id: "logout",
      title: "Logout",
      subtitle: "Sign out of your account",
      type: "action",
      action: () => handleAction("logout"),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.id} style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      {item.type === "toggle" ? (
        <Switch
          value={item.value}
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: "#e0e0e0", true: "#f8bbd0" }}
          thumbColor={item.value ? "#E91E63" : "#f4f3f4"}
          ios_backgroundColor="#e0e0e0"
        />
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={item.action}>
          <Text style={styles.actionButtonText}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMonetizationSection = () => {
    if (loadingMonetization) {
      return (
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💳</Text>
            <Text style={styles.sectionTitle}>Subscription</Text>
          </View>
          <View style={styles.monetizationLoading}>
            <ActivityIndicator size="small" color="#E91E63" />
            <Text style={styles.settingSubtitle}>Loading plan details...</Text>
          </View>
        </View>
      );
    }

    if (!monetizationConfig || !monetizationStatus) {
      return (
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💳</Text>
            <Text style={styles.sectionTitle}>Subscription</Text>
          </View>
          <View style={styles.monetizationLoading}>
            <Text style={styles.settingSubtitle}>Subscription config not available.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchMonetization}>
              <Text style={styles.refreshButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const freePlan = monetizationConfig.plans.free;
    const premiumPlan = monetizationConfig.plans.premium;
    const activePlanName = monetizationStatus.activePlan === "premium" ? premiumPlan.displayName : freePlan.displayName;
    const freeLimit = freePlan.features.dailyInterestsLimit;

    return (
      <View style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💳</Text>
          <Text style={styles.sectionTitle}>Subscription</Text>
        </View>
        <View style={styles.monetizationCard}>
          <Text style={styles.planLabel}>Current Plan: {activePlanName}</Text>
          <Text style={styles.planUsage}>
            Interests today: {monetizationStatus.usage.interestsSentToday}
            {freeLimit ? ` / ${freeLimit} (Free Limit)` : ""}
          </Text>

          <View style={styles.featuresBlock}>
            <Text style={styles.featuresTitle}>Free Tier</Text>
            <Text style={styles.featuresText}>- Daily interests: {freeLimit ?? "Unlimited"}</Text>
            <Text style={styles.featuresText}>- Basic messaging: {freePlan.features.basicMessaging ? "Yes" : "No"}</Text>
            <Text style={styles.featuresText}>- Limited search: {freePlan.features.limitedSearch ? "Yes" : "No"}</Text>
            <Text style={styles.featuresText}>- Verified badge: {freePlan.features.verifiedBadge ? "Yes" : "No"}</Text>
            <Text style={styles.featuresText}>- Advanced search: {freePlan.features.advancedSearch ? "Yes" : "No"}</Text>
          </View>

          <View style={styles.featuresBlock}>
            <Text style={styles.featuresTitle}>Premium ({premiumPlan.displayName})</Text>
            <Text style={styles.featuresText}>- Price: ₹{premiumPlan.priceInr}/year</Text>
            <Text style={styles.featuresText}>- Unlimited interests: {premiumPlan.features.unlimitedInterests ? "Yes" : "No"}</Text>
            <Text style={styles.featuresText}>- Verified badge: {premiumPlan.features.verifiedBadge ? "Yes" : "No"}</Text>
            <Text style={styles.featuresText}>- Advanced search: {premiumPlan.features.advancedSearch ? "Yes" : "No"}</Text>
          </View>

          <View style={styles.monetizationActions}>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchMonetization}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>

            {monetizationStatus.activePlan !== "premium" && (
              <TouchableOpacity
                style={[styles.upgradeButton, upgrading && styles.buttonDisabled]}
                onPress={handleUpgrade}
                disabled={upgrading}
              >
                <Text style={styles.upgradeButtonText}>{upgrading ? "Creating Order..." : "Upgrade"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>⚙️</Text>
            </View>
            <ThemedText style={styles.headerTitle}>Settings</ThemedText>
          </View>
        </View>

        {/* Account Settings Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👤</Text>
            <Text style={styles.sectionTitle}>Account Settings</Text>
          </View>
          <View style={styles.sectionContent}>
            {settingItems.slice(0, 4).map(renderSettingItem)}
          </View>
        </View>

        {renderMonetizationSection()}

        {/* Support Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>💬</Text>
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          <View style={styles.sectionContent}>
            {settingItems.slice(4, 7).map(renderSettingItem)}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔐</Text>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <View style={styles.sectionContent}>
            {settingItems.slice(7).map(renderSettingItem)}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Matrimonial App v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Made with ❤️</Text>
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
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E91E63",
  },
  settingsSection: {
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E91E63",
  },
  sectionContent: {
    paddingHorizontal: 5,
  },
  monetizationLoading: {
    paddingVertical: 18,
    paddingHorizontal: 15,
    alignItems: "center",
    gap: 8,
  },
  monetizationCard: {
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  planLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  planUsage: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  featuresBlock: {
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 10,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E91E63",
    marginBottom: 4,
  },
  featuresText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 2,
  },
  monetizationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  refreshButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  upgradeButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actionButton: {
    padding: 3,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 20,
    color: "#E91E63",
    fontWeight: "bold",
  },
  appInfo: {
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: "#888",
  },
  appInfoSubtext: {
    fontSize: 16,
    marginTop: 5,
  },
});
