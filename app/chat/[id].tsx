import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { API_CONFIG } from "@/constants/config";
import { apiService } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  isRead: boolean;
  status?: "sending" | "sent" | "failed";
}

interface Conversation {
  id: string;
  participantId: string;
  name: string;
  image?: string;
  gender?: string;
  isOnline: boolean;
}

const formatMessageTime = (timestamp: string) => {
  const messageTime = new Date(timestamp);
  if (Number.isNaN(messageTime.getTime())) {
    return "";
  }

  return messageTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeId = (id: string | number) => {
  const match = String(id).match(/(\d+)/);
  return match ? match[1] : String(id);
};

const getSocketServerUrl = () => {
  return API_CONFIG.BASE_URL.replace(/\/api\/v\d+\/?$/, "");
};

const TYPING_STOP_DELAY_MS = 1000;

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const conversationId = useMemo(() => normalizeId(String(id || "")), [id]);
  const insets = useSafeAreaInsets();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isParticipantTyping, setIsParticipantTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList<Message> | null>(null);
  const isTypingRef = useRef(false);
  const typingStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setCurrentUserId(normalizeId(userId));
        } else {
          setError("Please login again to use chat");
        }
      } catch {
        setError("Failed to initialize chat");
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (currentUserId && conversationId) {
      fetchConversation();
    }
  }, [currentUserId, conversationId]);

  useEffect(() => {
    if (!currentUserId || !conversationId) {
      return;
    }

    const interval = setInterval(() => {
      loadConversationMessages(conversationId, false);
    }, 8000);

    return () => clearInterval(interval);
  }, [currentUserId, conversationId]);

  useEffect(() => {
    if (!currentUserId || !conversationId) {
      return;
    }

    let isMounted = true;

    const setupSocket = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token || !isMounted) {
        return;
      }

      const socket = io(getSocketServerUrl(), {
        transports: ["websocket"],
        auth: { token },
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-conversation", Number(conversationId));
      });

      socket.on("online-users", (onlineUserIds: Array<string | number>) => {
        setConversation((prev) => {
          if (!prev) return prev;
          const isOnline = onlineUserIds
            .map((value) => normalizeId(value))
            .includes(normalizeId(prev.participantId));
          return { ...prev, isOnline };
        });
      });

      socket.on("receive-message", (payload: any) => {
        if (normalizeId(payload?.conversationId) !== conversationId) {
          return;
        }

        const incomingId = String(payload?.id || `socket_${Date.now()}`);
        const incomingMessage: Message = {
          id: incomingId,
          text: String(payload?.text || ""),
          timestamp: String(payload?.timestamp || new Date().toISOString()),
          senderId: normalizeId(String(payload?.senderId || "")),
          isRead: Boolean(payload?.isRead),
          status: "sent",
        };

        if (!incomingMessage.text.trim()) {
          return;
        }

        setMessages((prev) => {
          if (prev.some((message) => message.id === incomingMessage.id)) {
            return prev;
          }
          return [...prev, incomingMessage];
        });

        if (incomingMessage.senderId !== currentUserId) {
          setIsParticipantTyping(false);
          markCurrentConversationAsRead();
        }
      });

      socket.on("typing-start", (payload: { userId?: string | number }) => {
        const typingUserId = normalizeId(String(payload?.userId || ""));
        if (typingUserId && typingUserId !== normalizeId(String(currentUserId || ""))) {
          setIsParticipantTyping(true);
        }
      });

      socket.on("typing-stop", (payload: { userId?: string | number }) => {
        const typingUserId = normalizeId(String(payload?.userId || ""));
        if (typingUserId && typingUserId !== normalizeId(String(currentUserId || ""))) {
          setIsParticipantTyping(false);
        }
      });
    };

    setupSocket();

    return () => {
      if (isTypingRef.current) {
        socketRef.current?.emit("typing-stop", { conversationId: Number(conversationId) });
      }
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
      }
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      setError(null);
      await loadConversationMessages(conversationId, true);
      await markCurrentConversationAsRead();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (
    targetConversationId: string,
    allowErrorState = true,
  ) => {
    try {
      const response = await apiService.getConversationMessages(targetConversationId);

      if (response.success && response.data) {
        const participant = response.data.participant;
        setConversation({
          id: targetConversationId,
          participantId: normalizeId(participant.id),
          name: participant.name,
          image: participant.profileImage,
          gender: participant.gender,
          isOnline: false,
        });

        const mappedMessages = response.data.messages.map((msg) => ({
          id: String(msg.id),
          text: msg.text,
          timestamp: msg.timestamp,
          senderId: normalizeId(String(msg.senderId)),
          isRead: Boolean(msg.isRead),
          status: "sent" as const,
        }));

        setMessages(mappedMessages);
      } else if (allowErrorState) {
        setError(response.message || "Failed to load messages");
      }
    } catch (err) {
      if (allowErrorState) {
        setError(err instanceof Error ? err.message : "Failed to load messages");
      }
    }
  };

  const markCurrentConversationAsRead = async () => {
    try {
      await apiService.markConversationRead(conversationId);
    } catch {
      return;
    }
  };

  const promptUpgradeForVideoCall = () => {
    Alert.alert(
      "Upgrade Required",
      "Video call is available only for Premium users.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Upgrade", onPress: () => router.push("/settings") },
      ],
    );
  };

  const canStartVideoCall = async () => {
    try {
      const monetization = await apiService.getMonetizationConfig();
      if (monetization.success && monetization.data?.user?.activePlan !== "premium") {
        promptUpgradeForVideoCall();
        return false;
      }
      return true;
    } catch {
      return true;
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && conversation) {
      const text = newMessage.trim();
      const temporaryId = `temp_${Date.now()}`;

      if (isTypingRef.current) {
        socketRef.current?.emit("typing-stop", { conversationId: Number(conversationId) });
        isTypingRef.current = false;
      }
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }

      const temporaryMessage: Message = {
        id: temporaryId,
        text,
        timestamp: new Date().toISOString(),
        senderId: String(currentUserId || ""),
        isRead: false,
        status: "sending",
      };

      setMessages((prev) => [...prev, temporaryMessage]);
      setNewMessage("");

      try {
        const response = await apiService.sendMessage(
          conversation.id,
          text,
        );

        if (response.success && response.data) {
          const sentMessage: Message = {
            id: response.data.messageId,
            text: response.data.text,
            timestamp: response.data.timestamp,
            senderId: normalizeId(String(response.data.senderId || currentUserId || "")),
            isRead: false,
            status: "sent",
          };

          setMessages((prev) =>
            prev.map((message) =>
              message.id === temporaryId ? sentMessage : message,
            ),
          );
        } else {
          setMessages((prev) => prev.filter((message) => message.id !== temporaryId));
          setNewMessage(text);
          const message = response.message || "Failed to send message";
          setError(message);
          if (/daily message limit reached/i.test(message)) {
            Alert.alert(
              "Daily Limit Reached",
              "Free users can send up to 5 messages per day. Upgrade to Premium for unlimited messaging.",
              [
                { text: "Later", style: "cancel" },
                { text: "Upgrade", onPress: () => router.push("/settings") },
              ],
            );
          }
        }
      } catch (err) {
        setMessages((prev) => prev.filter((message) => message.id !== temporaryId));
        setNewMessage(text);
        const message = err instanceof Error ? err.message : "Failed to send message";
        setError(message);
        if (/daily message limit reached/i.test(message)) {
          Alert.alert(
            "Daily Limit Reached",
            "Free users can send up to 5 messages per day. Upgrade to Premium for unlimited messaging.",
            [
              { text: "Later", style: "cancel" },
              { text: "Upgrade", onPress: () => router.push("/settings") },
            ],
          );
        }
      }
    }
  };

  const handleMessageInputChange = (text: string) => {
    setNewMessage(text);

    if (!socketRef.current || !conversationId) {
      return;
    }

    if (text.trim().length === 0) {
      if (isTypingRef.current) {
        socketRef.current.emit("typing-stop", { conversationId: Number(conversationId) });
        isTypingRef.current = false;
      }
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }
      return;
    }

    if (!isTypingRef.current) {
      socketRef.current.emit("typing-start", { conversationId: Number(conversationId) });
      isTypingRef.current = true;
    }

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
    }

    typingStopTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        socketRef.current?.emit("typing-stop", { conversationId: Number(conversationId) });
        isTypingRef.current = false;
      }
      typingStopTimeoutRef.current = null;
    }, TYPING_STOP_DELAY_MS);
  };

  const handleStartVideoCall = async () => {
    if (!conversation) return;

    const canCall = await canStartVideoCall();
    if (!canCall) return;

    router.push(
      `/video-call/${conversation.id}?targetUserId=${conversation.participantId}&targetName=${encodeURIComponent(
        conversation.name,
      )}&initiator=1`,
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSent = normalizeId(item.senderId) === normalizeId(String(currentUserId || ""));
    return (
      <View
        style={[
          styles.messageContainer,
          isSent ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={[styles.messageText, isSent && styles.sentMessageText]}>
          {item.text}
        </Text>
        <View style={styles.timestampRow}>
          <Text style={[styles.timestamp, isSent && styles.sentTimestamp]}>
            {formatMessageTime(item.timestamp)}
          </Text>
          {isSent && (
            <Text style={styles.readReceipt}>
              {item.status === "sending" ? "⏳" : item.isRead ? "✓✓" : "✓"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <ThemedText style={styles.loadingText}>Loading chat...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!conversation) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Unable to open conversation</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConversation}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              {conversation.image ? (
                <Image
                  source={{ uri: conversation.image }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    styles.avatarFallback,
                    (conversation.gender || "").toLowerCase() === "female"
                      ? styles.avatarFallbackFemale
                      : (conversation.gender || "").toLowerCase() === "male"
                        ? styles.avatarFallbackMale
                        : styles.avatarFallbackNeutral,
                  ]}
                >
                  <Text style={styles.avatarFallbackText}>
                    {(conversation.gender || "").toLowerCase() === "female"
                      ? "♀"
                      : (conversation.gender || "").toLowerCase() === "male"
                        ? "♂"
                        : "👤"}
                  </Text>
                </View>
              )}
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
                  isParticipantTyping
                    ? styles.typingDot
                    : conversation.isOnline
                      ? styles.onlineDot
                      : styles.offlineDot
                ]} />
                <Text style={styles.headerStatus}>
                  {isParticipantTyping
                    ? "Typing..."
                    : conversation.isOnline
                      ? "Online"
                      : "Offline"}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoCallButton} onPress={handleStartVideoCall}>
              <Text style={styles.callIcon}>🎥</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.errorBanner}
            onPress={() => setError(null)}
          >
            <Text style={styles.errorText}>{error}</Text>
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
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
              onChangeText={handleMessageInputChange}
              onBlur={() => {
                if (isTypingRef.current) {
                  socketRef.current?.emit("typing-stop", { conversationId: Number(conversationId) });
                  isTypingRef.current = false;
                }
                if (typingStopTimeoutRef.current) {
                  clearTimeout(typingStopTimeoutRef.current);
                  typingStopTimeoutRef.current = null;
                }
              }}
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
    marginTop: 8,
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: "#E91E63",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 13,
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
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackFemale: {
    backgroundColor: "#F8BBD0",
  },
  avatarFallbackMale: {
    backgroundColor: "#BBDEFB",
  },
  avatarFallbackNeutral: {
    backgroundColor: "#E0E0E0",
  },
  avatarFallbackText: {
    fontSize: 20,
    color: "#37474F",
    fontWeight: "700",
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
  typingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EAB308",
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  videoCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fce4ec",
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
