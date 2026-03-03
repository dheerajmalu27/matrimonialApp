import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import { convertCmToFeet } from "@/utils/profileCardHelpers";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SentRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAge: number;
  recipientLocation: string;
  recipientOccupation: string;
  recipientHeight: string;
  recipientImage?: string;
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
}

const formatHeightForDisplay = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return convertCmToFeet(value) || `${value} cm`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const numericValue = Number(trimmed);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return convertCmToFeet(numericValue) || `${numericValue} cm`;
    }

    return trimmed;
  }

  return "";
};

export default function SentRequestsScreen() {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSentRequests();
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

  const fetchSentRequests = async (isPullToRefresh = false) => {
    try {
      if (isPullToRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await apiService.getSentRequests(50, 0);

      if (response.success && response.data) {
        const newRequests = response.data.requests.map((request) => ({
          id: String(request.id),
          recipientId: String(request.recipient.id),
          recipientName: request.recipient.name,
          recipientAge: request.recipient.age,
          recipientLocation: request.recipient.location,
          recipientOccupation: request.recipient.occupation,
          recipientHeight: formatHeightForDisplay((request as any)?.recipient?.height),
          recipientImage: request.recipient.profileImage || "",
          message: request.message,
          timestamp: formatTime(request.timestamp),
          status: request.status as SentRequest["status"],
        }));

        setRequests(newRequests);
      } else {
        setRequests([]);
      }
    } catch (err) {
      Alert.alert(
        "Unable to Load",
        err instanceof Error ? err.message : "Failed to load sent requests",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openConversation = async (recipientId: string) => {
    const conversationsResponse = await apiService.getConversations();
    if (conversationsResponse.success && conversationsResponse.data?.conversations) {
      const matchedConversation = conversationsResponse.data.conversations.find(
        (conversation) => String(conversation.participant?.id) === String(recipientId),
      );

      if (matchedConversation?.id) {
        router.push(`/chat/${matchedConversation.id}` as any);
        return;
      }
    }

    const createResponse = await apiService.createConversation(String(recipientId));
    if (createResponse.success && createResponse.data?.id) {
      router.push(`/chat/${createResponse.data.id}` as any);
      return;
    }

    Alert.alert("Chat Not Available", "Unable to open conversation right now.");
  };

  const handleCancelRequest = (request: SentRequest) => {
    Alert.alert(
      "Cancel Request",
      `Cancel your request to ${request.recipientName}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingId(request.id);
              const response = await apiService.cancelConnectionRequest(request.recipientId);
              if (response.success) {
                setRequests((prevRequests) =>
                  prevRequests.map((requestItem) =>
                    requestItem.id === request.id
                      ? { ...requestItem, status: "declined" }
                      : requestItem,
                  ),
                );
              } else {
                Alert.alert("Unable to Cancel", response.message || "Please try again.");
              }
            } catch (error) {
              Alert.alert(
                "Unable to Cancel",
                error instanceof Error ? error.message : "Please try again.",
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  const renderRequestCard = ({ item }: { item: SentRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.profileBlock}>
          {item.recipientImage ? (
            <Image source={{ uri: item.recipientImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>👤</Text>
            </View>
          )}

          <View style={styles.recipientInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.recipientName}>{item.recipientName}</Text>
              <Text style={styles.recipientAge}>{item.recipientAge}</Text>
            </View>
            <Text style={styles.recipientDetails}>{item.recipientLocation}</Text>
            <Text style={styles.recipientDetails}>{item.recipientOccupation}</Text>
            {item.recipientHeight ? (
              <Text style={styles.recipientDetails}>Height: {item.recipientHeight}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.requestMessage}>{item.message}</Text>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusBadge,
            item.status === "accepted"
              ? styles.acceptedBadge
              : item.status === "declined"
                ? styles.declinedBadge
                : styles.pendingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === "accepted"
                ? styles.acceptedText
                : item.status === "declined"
                  ? styles.declinedText
                  : styles.pendingText,
            ]}
          >
            {item.status === "accepted"
              ? "Accepted"
              : item.status === "declined"
                ? "Declined"
                : "Pending"}
          </Text>
        </View>
      </View>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelRequest(item)}
            disabled={processingId === item.id}
          >
            {processingId === item.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.cancelButtonText}>Cancel Request</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {item.status === "accepted" && (
        <View style={styles.acceptedActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push(`/profile/${item.recipientId}` as any)}
          >
            <Text style={styles.secondaryButtonText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => openConversation(item.recipientId)}
          >
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests],
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#E91E63" />
          <ThemedText style={styles.loadingText}>Loading sent requests...</ThemedText>
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
            <ThemedText style={styles.headerTitle}>Sent Requests</ThemedText>
          </View>
          <View style={styles.placeholder} />
        </View>
        <ThemedText style={styles.headerSubtitle}>
          {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
        </ThemedText>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequestCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchSentRequests(true)}
            tintColor="#E91E63"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Sent Requests</Text>
            <Text style={styles.emptySubtitle}>Profiles you connect with will appear here.</Text>
          </View>
        }
      />
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
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
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f2f2f2",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  profileBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 10,
    backgroundColor: "#FCE4EC",
  },
  avatarFallback: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 10,
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    fontSize: 22,
  },
  recipientInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },
  recipientAge: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E91E63",
    marginLeft: 6,
    backgroundColor: "#fce4ec",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recipientDetails: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  timestampContainer: {
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  messageContainer: {
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  requestMessage: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  statusRow: {
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pendingBadge: {
    backgroundColor: "#FFF4E5",
  },
  acceptedBadge: {
    backgroundColor: "#E8F5E9",
  },
  declinedBadge: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  pendingText: {
    color: "#B26A00",
  },
  acceptedText: {
    color: "#2E7D32",
  },
  declinedText: {
    color: "#C62828",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#9e9e9e",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  acceptedActions: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F1F3F5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#495057",
    fontSize: 15,
    fontWeight: "700",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#E91E63",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
