import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  image: string;
  isOnline: boolean;
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getConversations();

      if (response.success && response.data) {
        const mappedConversations = response.data.conversations.map((conv) => ({
          id: conv.id,
          name: conv.participant.name,
          lastMessage: conv.lastMessage?.text || "No messages yet",
          timestamp: new Date(conv.updatedAt).toLocaleDateString(),
          unreadCount: conv.unreadCount,
          image:
            conv.participant.profileImage || "https://via.placeholder.com/150",
          isOnline: conv.participant.isOnline,
        }));

        setConversations(mappedConversations);
      } else {
        setError(response.message || "Failed to load conversations");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <Link href={`/chat/${item.id}` as any} asChild>
      <TouchableOpacity style={styles.conversationItem} activeOpacity={0.7}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
          </View>

          <ThemedText style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </ThemedText>
        </View>

        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No conversations yet. Start chatting with potential matches!
            </ThemedText>
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
  listContainer: {
    padding: 15,
  },
  conversationItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#28a745",
    borderWidth: 2,
    borderColor: "#fff",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  unreadBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
