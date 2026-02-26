import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SentRequest {
  id: string;
  recipientName: string;
  recipientAge: number;
  recipientLocation: string;
  recipientOccupation: string;
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
}

export default function SentRequestsScreen() {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ offset: 0, hasMore: true });

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const offset = loadMore ? pagination.offset : 0;
      const response = await apiService.getSentRequests(20, offset);

      if (response.success && response.data) {
        const newRequests = response.data.requests.map((request) => ({
          id: request.id,
          recipientName: request.recipient.name,
          recipientAge: request.recipient.age,
          recipientLocation: request.recipient.location,
          recipientOccupation: request.recipient.occupation,
          message: request.message,
          timestamp: new Date(request.timestamp).toLocaleDateString(),
          status: request.status as SentRequest["status"],
        }));

        if (loadMore) {
          setRequests((prev) => [...prev, ...newRequests]);
        } else {
          setRequests(newRequests);
        }

        setPagination({
          offset: offset + newRequests.length,
          hasMore: response.data.hasMore,
        });
      } else {
        setError(response.message || "Failed to load sent requests");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sent requests",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = (requestId: string) => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this request?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            setRequests((prevRequests) =>
              prevRequests.map((request) =>
                request.id === requestId
                  ? { ...request, status: "declined" }
                  : request,
              ),
            );
          },
        },
      ],
    );
  };

  const renderRequestCard = ({ item }: { item: SentRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.recipientInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.recipientName}>
              {item.recipientName}
            </Text>
            <Text style={styles.recipientAge}>{item.recipientAge}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.recipientDetails}>
              {item.recipientLocation}
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailIcon}>💼</Text>
            <Text style={styles.recipientDetails}>
              {item.recipientOccupation}
            </Text>
          </View>
        </View>
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.requestMessage}>{item.message}</Text>
      </View>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelRequest(item.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === "accepted" && (
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.acceptedText}>✓ Accepted</Text>
          </View>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => router.push("/chat/[id]")}
          >
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === "declined" && (
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, styles.declinedBadge]}>
            <Text style={styles.declinedText}>✕ Declined</Text>
          </View>
        </View>
      )}
    </View>
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

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
    padding: 15,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#E91E63",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  recipientAge: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E91E63",
    marginLeft: 8,
    backgroundColor: "#fce4ec",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  recipientDetails: {
    fontSize: 14,
    color: "#666",
  },
  timestampContainer: {
    backgroundColor: "#fce4ec",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timestamp: {
    fontSize: 12,
    color: "#E91E63",
    fontWeight: "600",
  },
  messageContainer: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  requestMessage: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "center",
    gap: 10,
  },
  statusBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  declinedBadge: {
    backgroundColor: "#ffebee",
  },
  acceptedText: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
  },
  declinedText: {
    fontSize: 14,
    color: "#e53935",
    fontWeight: "bold",
  },
  messageButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
