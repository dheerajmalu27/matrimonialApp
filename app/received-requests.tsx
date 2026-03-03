import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import { convertCmToFeet } from "@/utils/profileCardHelpers";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Swiper from "react-native-deck-swiper";

const { width, height } = Dimensions.get("window");

interface Request {
  id: string;
  senderId: string;
  senderName: string;
  senderAge: number;
  senderLocation: string;
  senderOccupation: string;
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
  image: string;
  bio: string;
  religion: string;
  caste: string;
  height: string;
  education: string;
  income: string;
}

const normalizeEntityId = (value: string | number | undefined) => {
  const match = String(value || "").match(/(\d+)/);
  return match ? match[1] : String(value || "");
};

const getFirstText = (...values: Array<unknown>) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const getLocationText = (sender: any, request: any) => {
  const directLocation = getFirstText(
    sender?.profile?.location,
    sender?.user_profile?.location,
    sender?.location,
    sender?.personal?.location,
    sender?.address?.location,
    request?.sender?.location,
  );

  if (directLocation) return directLocation;

  const city = getFirstText(
    sender?.city,
    sender?.profile?.city,
    sender?.user_profile?.city,
    request?.sender_city,
  );
  const state = getFirstText(
    sender?.state,
    sender?.profile?.state,
    sender?.user_profile?.state,
    request?.sender_state,
  );

  const cityState = `${city}${city && state ? ", " : ""}${state}`.trim();
  return cityState || "Location not available";
};

const getProfileImage = (sender: any, request: any) => {
  return getFirstText(
    Array.isArray(sender?.profileImages) ? sender.profileImages[0] : "",
    Array.isArray(sender?.profile?.profileImages) ? sender.profile.profileImages[0] : "",
    Array.isArray(sender?.user_profile?.profileImages) ? sender.user_profile.profileImages[0] : "",
    sender?.profileImage,
    sender?.profile_image,
    sender?.profile?.profileImage,
    sender?.profile?.profile_image,
    sender?.user_profile?.profileImage,
    sender?.user_profile?.profile_image,
    request?.sender_photo,
  );
};

const formatHeightForDisplay = (...values: Array<unknown>) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return convertCmToFeet(value) || `${value} cm`;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;

      const numericValue = Number(trimmed);
      if (Number.isFinite(numericValue) && numericValue > 0) {
        return convertCmToFeet(numericValue) || `${numericValue} cm`;
      }

      return trimmed;
    }
  }

  return "Not specified";
};

export default function ReceivedRequestsScreen() {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [swiperResetKey, setSwiperResetKey] = useState(0);

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Recently";

    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const fetchReceivedRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReceivedRequests(50, 0);

      if (!response.success || !response.data) {
        setRequests([]);
        return;
      }

      const responseData: any = response.data as any;
      const rawRequests: any[] = Array.isArray(responseData?.requests)
        ? responseData.requests
        : Array.isArray(responseData)
          ? responseData
          : [];

      const mappedRequests: Request[] = rawRequests
        .map((request) => {
          const sender = request?.sender || request?.user || request || {};
          const senderProfile = sender?.profile || sender?.user_profile || {};
          const senderId = normalizeEntityId(
            sender?.id || request?.sender_id || request?.senderId || request?.id || "",
          );
          const senderName = getFirstText(
            sender?.name,
            sender?.fullName,
            senderProfile?.fullName,
            `${request?.sender_first_name || ""} ${request?.sender_last_name || ""}`.trim(),
          ) || "Unknown";

          const rawStatus = String(request?.status || request?.interestStatus || "").toLowerCase();
          const normalizedStatus: Request["status"] =
            rawStatus === "sent" || rawStatus === "pending"
              ? "pending"
              : rawStatus === "accepted"
                ? "accepted"
                : "declined";

          return {
            id: String(request?.requestId || request?.interestId || request?.id || ""),
            senderId,
            senderName,
            senderAge: Number(sender?.age || request?.sender_age || senderProfile?.age || 0),
            senderLocation: getLocationText(sender, request),
            senderOccupation: getFirstText(
              sender?.occupation,
              senderProfile?.occupation,
              sender?.profession,
              sender?.user_profession?.occupation,
              sender?.userProfession?.occupation,
            ) || "Occupation not available",
            message: request?.message || "Hi, I'd like to connect with you.",
            timestamp: formatTime(String(request?.timestamp || request?.created_at || "")),
            status: normalizedStatus,
            image: getProfileImage(sender, request) || getFirstText(request?.profileImage),
            bio: getFirstText(
              sender?.bio,
              senderProfile?.bio,
            ) || "No bio added yet.",
            religion: getFirstText(
              senderProfile?.religion,
              sender?.religion,
            ) || "Not specified",
            caste: getFirstText(
              senderProfile?.caste,
              sender?.caste,
            ) || "Not specified",
            height: formatHeightForDisplay(
              senderProfile?.height,
              sender?.height,
              request?.sender_height,
            ),
            education: getFirstText(
              sender?.education,
              senderProfile?.education,
              sender?.user_education?.highestEducation,
              sender?.userEducation?.highestEducation,
              request?.sender_education,
            ) || "Not specified",
            income: getFirstText(
              sender?.income,
              senderProfile?.income,
              sender?.user_profession?.annualIncome,
              sender?.userProfession?.annualIncome,
            ) || "Not specified",
          };
        })
        .filter((request) => request.senderId)
        .filter((request) => request.status === "pending");

      setRequests(mappedRequests);
    } catch (error) {
      console.error("Failed to load received requests:", error);
      Alert.alert("Error", "Unable to load received requests right now.");
    } finally {
      setLoading(false);
    }
  };

  const removeRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== requestId));
    setSwiperResetKey((prev) => prev + 1);
  };

  const handleAcceptRequest = async (request: Request) => {
    try {
      setProcessingId(request.id);
      const response = await apiService.acceptConnectionRequest(request.senderId);

      if (response.success) {
        removeRequest(request.id);
        Alert.alert("Request Accepted", `You can now chat with ${request.senderName}.`);
        return;
      }

      Alert.alert("Unable to Accept", response.message || "Please try again.");
    } catch (error) {
      Alert.alert(
        "Unable to Accept",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const performDeclineRequest = async (request: Request) => {
    try {
      setProcessingId(request.id);
      const response = await apiService.declineConnectionRequest(request.senderId);

      if (response.success) {
        removeRequest(request.id);
        return;
      }

      Alert.alert("Unable to Decline", response.message || "Please try again.");
    } catch (error) {
      Alert.alert(
        "Unable to Decline",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineRequest = (request: Request) => {
    Alert.alert("Decline Request", `Decline ${request.senderName}'s request?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: () => performDeclineRequest(request),
      },
    ]);
  };

  const renderRequestCard = (item: Request) => {
    if (!item) {
      return <View style={styles.emptyCard} />;
    }

    return (
      <View style={styles.card}>
        <ImageBackground
          source={{ uri: item.image || "https://via.placeholder.com/400x600" }}
          style={styles.cardImage}
          imageStyle={styles.cardImageStyle}
        >
          <View style={styles.gradientOverlay}>
            <View style={styles.topRow}>
              <View style={styles.timePill}>
                <Text style={styles.timePillText}>{item.timestamp}</Text>
              </View>
            </View>

            <View style={styles.profileBlock}>
              <Text style={styles.cardName}>
                {item.senderName}
                {item.senderAge ? `, ${item.senderAge}` : ""}
              </Text>
              <Text style={styles.profileSubText}>{item.senderLocation}</Text>
              <Text style={styles.profileSubText}>{item.senderOccupation}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.cardDetails}>
          <Text style={styles.requestMessage}>{item.message}</Text>

          <View style={styles.metaChipsRow}>
            <View style={styles.metaChip}><Text style={styles.metaChipText}>{item.religion}</Text></View>
            <View style={styles.metaChip}><Text style={styles.metaChipText}>{item.caste}</Text></View>
            <View style={styles.metaChip}><Text style={styles.metaChipText}>{item.height}</Text></View>
          </View>

          <Text style={styles.cardBio} numberOfLines={3}>{item.bio}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Education</Text>
            <Text style={styles.metaValue}>{item.education}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Income</Text>
            <Text style={styles.metaValue}>{item.income}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            disabled={processingId === item.id}
            onPress={() => handleDeclineRequest(item)}
          >
            <Text style={styles.declineButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            disabled={processingId === item.id}
            onPress={() => handleAcceptRequest(item)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onSwipedLeft = (cardIndex: number) => {
    const request = pendingRequests[cardIndex];
    if (!request) return;
    performDeclineRequest(request);
  };

  const onSwipedRight = (cardIndex: number) => {
    const request = pendingRequests[cardIndex];
    if (!request) return;
    handleAcceptRequest(request);
  };

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const pendingCount = pendingRequests.length;

  if (loading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}> 
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#E91E63" />
          <ThemedText style={styles.loadingText}>Loading requests...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle}>Received Requests</ThemedText>
          </View>
          <View style={styles.placeholder} />
        </View>
        <ThemedText style={styles.headerSubtitle}>
          {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
        </ThemedText>
      </View>

      <View style={styles.swiperContainer}>
        {pendingCount === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySubtitle}>New interests will appear here.</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchReceivedRequests}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Swiper
            key={`received-requests-${swiperResetKey}-${pendingCount}`}
            cards={pendingRequests}
            renderCard={renderRequestCard}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            cardIndex={0}
            backgroundColor="transparent"
            stackSize={3}
            stackSeparation={14}
            cardVerticalMargin={4}
            cardHorizontalMargin={14}
            useViewOverflow={Platform.OS === "ios"}
            overlayLabels={{
              left: {
                title: "REJECT",
                style: {
                  label: {
                    backgroundColor: "#EF4444",
                    borderColor: "#EF4444",
                    color: "#fff",
                    borderWidth: 1,
                    fontSize: 20,
                    fontWeight: "700",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 10,
                    overflow: "hidden",
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    marginTop: 26,
                    marginLeft: -20,
                  },
                },
              },
              right: {
                title: "ACCEPT",
                style: {
                  label: {
                    backgroundColor: "#E91E63",
                    borderColor: "#E91E63",
                    color: "#fff",
                    borderWidth: 1,
                    fontSize: 20,
                    fontWeight: "700",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 10,
                    overflow: "hidden",
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginTop: 26,
                    marginLeft: 20,
                  },
                },
              },
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            disableBottomSwipe
            disableTopSwipe
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: "#E91E63",
    fontWeight: "bold",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E91E63",
  },
  placeholder: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  swiperContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  emptyTitle: {
    fontSize: 22,
    color: "#222",
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: "#E91E63",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "#fff",
  },
  card: {
    borderRadius: 22,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f1f1",
    height: height * 0.78,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 7,
  },
  cardImage: {
    width: "100%",
    height: height * 0.44,
    justifyContent: "space-between",
  },
  cardImageStyle: {
    resizeMode: "cover",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  timePill: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timePillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  profileBlock: {
    gap: 3,
  },
  cardDetails: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    flex: 1,
  },
  cardName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  profileSubText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.95,
  },
  requestMessage: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: "500",
  },
  metaChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  metaChip: {
    backgroundColor: "#FCE4EC",
    borderColor: "#F8BBD0",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  metaChipText: {
    fontSize: 12,
    color: "#C2185B",
    fontWeight: "600",
  },
  cardBio: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  metaLabel: {
    color: "#8a8a8a",
    fontSize: 12,
  },
  metaValue: {
    color: "#444",
    fontSize: 13,
    fontWeight: "600",
    maxWidth: "65%",
    textAlign: "right",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#E91E63",
  },
  declineButton: {
    backgroundColor: "#F1F3F5",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  declineButtonText: {
    color: "#495057",
    fontSize: 16,
    fontWeight: "700",
  },
});
