import { apiService } from "@/services/api";
import { API_CONFIG } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Tabs, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io, Socket } from "socket.io-client";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const socketRef = useRef<Socket | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    image: string;
    gender?: "male" | "female" | "other";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    Notifications.setNotificationCategoryAsync("incoming_call", [
      {
        identifier: "ACCEPT_CALL",
        buttonTitle: "Accept",
      },
      {
        identifier: "REJECT_CALL",
        buttonTitle: "Reject",
        options: {
          isDestructive: true,
        },
      },
    ]).catch(() => undefined);

    const registerPushToken = async () => {
      try {
        if (!Device.isDevice) return;

        const permission = await Notifications.getPermissionsAsync();
        let status = permission.status;
        if (status !== "granted") {
          const request = await Notifications.requestPermissionsAsync();
          status = request.status;
        }

        if (status !== "granted") {
          return;
        }

        const projectId =
          (Constants as any)?.expoConfig?.extra?.eas?.projectId ||
          (Constants as any)?.easConfig?.projectId;

        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        if (token?.data) {
          await apiService.registerPushToken(token.data);
        }
      } catch (error) {
        console.error("Push token registration failed:", error);
      }
    };

    const responseSub = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      const data = response?.notification?.request?.content?.data as any;
      if (!data || data.type !== "incoming_video_call") return;

      const conversationId = String(data.conversationId || "");
      const callerId = String(data.callerId || "");
      const callerName = String(data.callerName || "Someone");

      if (!conversationId || !callerId) return;

      if (response.actionIdentifier === "ACCEPT_CALL") {
        socketRef.current?.emit("video-call-response", {
          callerId,
          conversationId,
          status: "accepted",
        });
        router.push(
          `/video-call/${conversationId}?targetUserId=${callerId}&targetName=${encodeURIComponent(
            callerName,
          )}&initiator=0` as any,
        );
      }

      if (response.actionIdentifier === "REJECT_CALL") {
        socketRef.current?.emit("video-call-response", {
          callerId,
          conversationId,
          status: "rejected",
        });
      }
    });

    registerPushToken();

    return () => {
      responseSub.remove();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const setupGlobalCallSocket = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token || !isMounted) return;

      const socketServerUrl = API_CONFIG.BASE_URL.replace(/\/api\/v\d+\/?$/, "");
      const socket = io(socketServerUrl, {
        transports: ["websocket"],
        auth: { token },
      });

      socketRef.current = socket;

      socket.on("video-call-invite", (payload: any) => {
        const callerName = String(payload?.callerName || "Someone");
        const conversationId = String(payload?.conversationId || "");
        const callerId = String(payload?.callerId || "");
        const sessionId = String(payload?.sessionId || "");

        if (!conversationId || !callerId) {
          return;
        }

        Alert.alert(
          "Incoming Video Call",
          `${callerName} is calling you`,
          [
            {
              text: "Reject",
              style: "destructive",
              onPress: () => {
                socket.emit("video-call-response", {
                  callerId,
                  conversationId,
                  status: "rejected",
                  sessionId,
                });
              },
            },
            {
              text: "Accept",
              onPress: () => {
                socket.emit("video-call-response", {
                  callerId,
                  conversationId,
                  status: "accepted",
                  sessionId,
                });
                router.push(
                  `/video-call/${conversationId}?targetUserId=${callerId}&targetName=${encodeURIComponent(
                    callerName,
                  )}&initiator=0` as any,
                );
              },
            },
          ],
        );
      });
    };

    setupGlobalCallSocket();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const getDrawerName = (profile: any): string => {
    return (
      profile?.personal?.fullName ||
      profile?.name ||
      [profile?.personal?.firstName, profile?.personal?.lastName].filter(Boolean).join(" ") ||
      "User"
    );
  };

  const getDrawerImage = (profile: any): string | null => {
    return (
      profile?.personal?.profileImages?.[0] ||
      profile?.profileImages?.[0] ||
      profile?.personal?.profileImage ||
      profile?.profileImage ||
      profile?.images?.[0] ||
      null
    );
  };

  const getDrawerGender = (profile: any): "male" | "female" | "other" => {
    const normalizedGender = String(
      profile?.personal?.gender || profile?.gender || "",
    )
      .trim()
      .toLowerCase();

    if (normalizedGender === "female" || normalizedGender === "f") {
      return "female";
    }

    if (normalizedGender === "male" || normalizedGender === "m") {
      return "male";
    }

    return "other";
  };

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        setUserProfile({
          name: getDrawerName(response.data),
          image: getDrawerImage(response.data) || "",
          gender: getDrawerGender(response.data),
        });
      } else {
        setUserProfile({
          name: "User",
          image: "",
          gender: "other",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to default
      setUserProfile({
        name: "User",
        image: "",
        gender: "other",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = () => {
    fetchUserProfile();
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
        {userProfile?.image ? (
          <Image
            source={{ uri: userProfile.image }}
            style={styles.profileImage}
          />
        ) : (
          <View
            style={[
              styles.profileImageFallback,
              userProfile?.gender === "female"
                ? styles.profileImageFallbackFemale
                : userProfile?.gender === "male"
                  ? styles.profileImageFallbackMale
                  : styles.profileImageFallbackNeutral,
            ]}
          >
            <Text style={styles.profileImageFallbackText}>
              {userProfile?.gender === "female"
                ? "♀"
                : userProfile?.gender === "male"
                  ? "♂"
                  : (userProfile?.name || "U").charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {loading ? "Loading..." : userProfile?.name || "User"}
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
          router.push("/shortlisted");
        }}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Shortlisted</Text>
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
          name="matches"
          options={{
            href: null,
          }}
        />
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
          name="shortlisted"
          options={{
            title: "Shortlist",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="star.fill" color={color} />
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
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="message.fill" color={color} />
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
    backgroundColor: "#f1f1f1",
  },
  profileImageFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageFallbackFemale: {
    backgroundColor: "#E91E63",
  },
  profileImageFallbackMale: {
    backgroundColor: "#1976D2",
  },
  profileImageFallbackNeutral: {
    backgroundColor: "#9E9E9E",
  },
  profileImageFallbackText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
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
