import { API_CONFIG } from "@/constants/config";
import apiClient from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { io, Socket } from "socket.io-client";

type CallStatus =
  | "connecting"
  | "ringing"
  | "connected"
  | "ended"
  | "timeout"
  | "busy"
  | "rejected"
  | "unavailable";

const normalizeId = (value: string | number | undefined) => {
  const match = String(value || "").match(/(\d+)/);
  return match ? match[1] : String(value || "");
};

export default function VideoCallScreen() {
  const { id, targetUserId, targetName, initiator } = useLocalSearchParams();
  const conversationId = useMemo(() => normalizeId(String(id || "")), [id]);
  const receiverId = useMemo(() => normalizeId(String(targetUserId || "")), [targetUserId]);
  const isInitiator = String(initiator || "1") === "1";

  const [status, setStatus] = useState<CallStatus>("connecting");
  const [loading, setLoading] = useState(true);
  const [ringCountdown, setRingCountdown] = useState<number>(30);
  const [sessionId, setSessionId] = useState<string>("");
  const [callerName, setCallerName] = useState<string>("Matrimonial User");
  const socketRef = useRef<Socket | null>(null);

  const isRetryAllowed = isInitiator && ["ended", "timeout", "busy", "rejected", "unavailable"].includes(status);

  useEffect(() => {
    let isMounted = true;

    const connectCallSocket = async () => {
      try {
        const monetization = await apiClient.getMonetizationConfig();
        if (monetization.success && monetization.data?.user?.activePlan !== "premium") {
          Alert.alert(
            "Upgrade Required",
            "Video call is available only for Premium users.",
            [
              { text: "Later", style: "cancel", onPress: () => router.back() },
              { text: "Upgrade", onPress: () => router.replace("/settings") },
            ],
          );
          return;
        }

        const token = await AsyncStorage.getItem("accessToken");
        const userProfileStr = await AsyncStorage.getItem("userProfile");
        const userProfile = userProfileStr ? JSON.parse(userProfileStr) : null;
        const resolvedCallerName =
          userProfile?.personal?.fullName || userProfile?.name || "Matrimonial User";
        setCallerName(resolvedCallerName);

        if (!token || !conversationId || !receiverId) {
          Alert.alert("Call Error", "Unable to start video call.");
          router.back();
          return;
        }

        const socketServerUrl = API_CONFIG.BASE_URL.replace(/\/api\/v\d+\/?$/, "");
        const socket = io(socketServerUrl, {
          transports: ["websocket"],
          auth: { token },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          setLoading(false);
          if (isInitiator) {
            setStatus("ringing");
            socket.emit("video-call-invite", {
              targetUserId: Number(receiverId),
              conversationId: Number(conversationId),
              callerName: resolvedCallerName,
            });
          } else {
            setStatus("connected");
          }
        });

        socket.on("video-call-invite", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;
          if (payload?.sessionId) {
            setSessionId(String(payload.sessionId));
          }
        });

        socket.on("video-call-response", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;

          if (payload?.sessionId) {
            setSessionId(String(payload.sessionId));
          }

          if (payload?.status === "accepted") {
            setStatus("connected");
          } else if (payload?.status === "rejected") {
            setStatus("rejected");
            Alert.alert("Call Rejected", `${decodeURIComponent(String(targetName || "User"))} rejected the call.`);
          }
        });

        socket.on("video-call-busy", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;
          setStatus("busy");
        });

        socket.on("video-call-timeout", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;
          if (payload?.sessionId) {
            setSessionId(String(payload.sessionId));
          }
          setStatus("timeout");
        });

        socket.on("video-call-unavailable", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;
          setStatus("unavailable");
          if (payload?.reason === "TARGET_NOT_PREMIUM") {
            Alert.alert(
              "Call Not Available",
              "The other user needs Premium to use video calls.",
              [{ text: "OK", onPress: () => router.back() }],
            );
          } else {
            Alert.alert("User Offline", `${decodeURIComponent(String(targetName || "User"))} is not available. You can retry.`);
          }
        });

        socket.on("video-call-upgrade-required", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;
          setStatus("ended");
          Alert.alert(
            "Upgrade Required",
            "Video call is available only for Premium users.",
            [
              { text: "Later", style: "cancel", onPress: () => router.back() },
              { text: "Upgrade", onPress: () => router.replace("/settings") },
            ],
          );
        });

        socket.on("video-call-cancel", (payload: any) => {
          if (normalizeId(payload?.conversationId) !== conversationId) return;
          setStatus("ended");
          if (payload?.reason === "TIMEOUT") {
            setStatus("timeout");
          } else {
            Alert.alert("Call Ended", "The caller ended the call.");
            router.back();
          }
        });
      } catch (error) {
        console.error("Video call setup error:", error);
        Alert.alert("Call Error", "Unable to initialize video call.");
        router.back();
      }
    };

    if (isMounted) {
      connectCallSocket();
    }

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, isInitiator, receiverId, targetName]);

  useEffect(() => {
    if (!isInitiator || status !== "ringing") {
      setRingCountdown(30);
      return;
    }

    const interval = setInterval(() => {
      setRingCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isInitiator, status]);

  const endCall = () => {
    socketRef.current?.emit("video-call-cancel", {
      targetUserId: Number(receiverId),
      conversationId: Number(conversationId),
      sessionId: sessionId || undefined,
    });
    setStatus("ended");
    router.back();
  };

  const retryCall = () => {
    if (!socketRef.current) {
      Alert.alert("Retry Failed", "Call connection is not available. Please try again.");
      return;
    }

    setStatus("ringing");
    socketRef.current.emit("video-call-invite", {
      targetUserId: Number(receiverId),
      conversationId: Number(conversationId),
      callerName,
    });
  };

  const getStatusLabel = () => {
    if (status === "ringing") return "Ringing...";
    if (status === "connected") return "Connected";
    if (status === "timeout") return "No answer. Timed out.";
    if (status === "busy") return "User is on another call";
    if (status === "rejected") return "Call rejected";
    if (status === "unavailable") return "User unavailable";
    if (status === "ended") return "Ended";
    return "Connecting...";
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.title}>Video Call</Text>
        <Text style={styles.name}>{decodeURIComponent(String(targetName || "User"))}</Text>

        {loading && <ActivityIndicator size="large" color="#fff" />}

        {!loading && (
          <>
            <Text style={styles.status}>{getStatusLabel()}</Text>
            {isInitiator && status === "ringing" ? (
              <Text style={styles.countdown}>Auto timeout in {ringCountdown}s</Text>
            ) : null}
          </>
        )}

        <Text style={styles.note}>
          Camera/WebRTC media stream integration can be added next on top of this call signaling flow.
        </Text>
      </View>

      <View style={styles.actionsRow}>
        {isRetryAllowed ? (
          <TouchableOpacity style={styles.retryButton} onPress={retryCall}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <Text style={styles.endCallText}>{status === "connected" || status === "ringing" ? "End Call" : "Close"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "space-between",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    color: "#E5E7EB",
    marginTop: 14,
    marginBottom: 8,
  },
  countdown: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  note: {
    marginTop: 8,
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  actionsRow: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  endCallButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
  },
  endCallText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
