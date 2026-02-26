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
          <Text style={styles.recipientName}>
            {item.recipientName}, {item.recipientAge}
          </Text>
          <Text style={styles.recipientDetails}>
            {item.recipientLocation} • {item.recipientOccupation}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      <Text style={styles.requestMessage}>{item.message}</Text>

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
          <Text style={styles.acceptedText}>✓ Request Accepted</Text>
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
          <Text style={styles.declinedText}>✗ Request Declined</Text>
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
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
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
    padding: 20,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  recipientDetails: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  requestMessage: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusContainer: {
    alignItems: "center",
  },
  acceptedText: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: 10,
  },
  declinedText: {
    fontSize: 16,
    color: "#dc3545",
    fontWeight: "bold",
  },
  messageButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
