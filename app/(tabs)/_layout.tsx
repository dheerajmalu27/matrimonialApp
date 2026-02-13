import { apiService } from "@/services/api";
import { Tabs, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const [userProfile, setUserProfile] = useState<{
    name: string;
    image: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        setUserProfile({
          name: response.data.name,
          image: response.data.images?.[0] || "https://via.placeholder.com/60",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to default
      setUserProfile({
        name: "User",
        image: "https://via.placeholder.com/60",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen(false));
  };

  const renderDrawerContent = () => (
    <View
      style={[
        styles.drawerContent,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/profile");
        }}
        style={styles.profileHeader}
      >
        <IconSymbol
          size={50}
          name="person.circle.fill"
          color="#FF6B6B"
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {userProfile?.name || "Loading..."}
          </Text>
          <Text style={styles.viewProfileText}>View profile</Text>
        </View>
        <IconSymbol
          size={20}
          name="chevron.right"
          color="#666"
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/home");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={closeDrawer} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Find Partners</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/profile");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>My Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/sent-requests");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Sent Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/received-requests");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Received Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/messages");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/settings");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          closeDrawer();
          router.push("/change-password");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Logout",
              style: "destructive",
              onPress: async () => {
                closeDrawer();
                try {
                  await apiService.logout();
                  router.replace("/login");
                } catch (error) {
                  console.error("Logout error:", error);
                  router.replace("/login");
                }
              },
            },
          ]);
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={isDrawerOpen}
        transparent={true}
        onRequestClose={closeDrawer}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDrawer}
        >
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {renderDrawerContent()}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={openDrawer} style={styles.headerButton}>
              <IconSymbol
                size={24}
                name="line.horizontal.3"
                color={Colors[colorScheme ?? "light"].tint}
              />
            </TouchableOpacity>
          ),
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {
              justifyContent: "space-around",
            },
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: "Matches",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="heart.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="message.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-city"
          options={{
            title: "Nearby",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="location.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
  },
  drawerContainer: {
    width: 280,
    height: "100%",
  },
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  viewProfileText: {
    fontSize: 14,
    color: "#666",
  },
  chevronIcon: {
    marginLeft: 10,
  },
  drawerHeader: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: "#666",
    opacity: 0.7,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  drawerFooter: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  headerButton: {
    marginLeft: 15,
  },
  floatingButton: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
