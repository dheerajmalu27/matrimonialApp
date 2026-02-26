import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

interface Conversation {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
}

const formatMessageTime = (timestamp: string) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMs = now.getTime() - messageTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return messageTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(messageTime.getFullYear() !== now.getFullYear() && {
        year: "2-digit",
      }),
    });
  }
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setCurrentUserId(userId);
      } catch (err) {
        setError("Failed to initialize chat");
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (currentUserId && id) {
      fetchConversation();
    }
  }, [currentUserId, id]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      await loadConversationMessages(id as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await apiService.getConversationMessages(conversationId);

      if (response.success && response.data) {
        const participant = response.data.participant;
        setConversation({
          id: participant.id,
          name: participant.name,
          image: participant.profileImage || "https://via.placeholder.com/150",
          isOnline: false,
        });

        const mappedMessages = response.data.messages.map((msg) => ({
          id: msg.id,
          text: msg.text,
          timestamp: formatMessageTime(msg.timestamp),
          isSent: msg.senderId === currentUserId,
        }));

        setMessages(mappedMessages);
      } else {
        setError(response.message || "Failed to load messages");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && conversation) {
      try {
        const response = await apiService.sendMessage(
          conversation.id,
          newMessage.trim(),
        );

        if (response.success && response.data) {
          const message: Message = {
            id: response.data.messageId,
            text: response.data.text,
            timestamp: formatMessageTime(response.data.timestamp),
            isSent: true,
          };
          setMessages((prev) => [...prev, message]);
          setNewMessage("");
        } else {
          setError(response.message || "Failed to send message");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={[styles.messageText, item.isSent && styles.sentMessageText]}>
        {item.text}
      </Text>
      <View style={styles.timestampRow}>
        <Text style={[styles.timestamp, item.isSent && styles.sentTimestamp]}>
          {item.timestamp}
        </Text>
        {item.isSent && (
          <Text style={styles.readReceipt}>✓</Text>
        )}
      </View>
    </View>
  );

  if (!conversation) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading chat...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: conversation.image }} 
                style={styles.avatar} 
              />
              {conversation.isOnline && (
                <View style={styles.onlineIndicator}>
                  <View style={styles.onlineDot} />
                </View>
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>
                {conversation.name}
              </Text>
              <View style={styles.statusRow}>
                <View style={[
                  styles.statusDot,
                  conversation.isOnline ? styles.onlineDot : styles.offlineDot
                ]} />
                <Text style={styles.headerStatus}>
                  {conversation.isOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
        />

        {/* Input Area */}
        <View style={[
          styles.inputContainer, 
          { paddingBottom: Math.max(insets.bottom, 15) }
        ]}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
            />
            {newMessage.trim() === "" && (
              <TouchableOpacity style={styles.emojiButton}>
                <Text style={styles.emojiIcon}>😊</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fce4ec",
  },
  backButtonText: {
    fontSize: 22,
    color: "#E91E63",
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#E91E63",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  offlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#999",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  headerStatus: {
    fontSize: 13,
    color: "#666",
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fce4ec",
  },
  callIcon: {
    fontSize: 20,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E91E63",
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  messageText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 21,
  },
  sentMessageText: {
    color: "#fff",
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    color: "#888",
  },
  sentTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  readReceipt: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 20,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f5f5f5",
    borderRadius: 22,
    paddingHorizontal: 5,
    paddingVertical: 5,
    minHeight: 44,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiIcon: {
    fontSize: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "transparent",
  },
  sendButtonText: {
    fontSize: 20,
    color: "#fff",
  },
});
