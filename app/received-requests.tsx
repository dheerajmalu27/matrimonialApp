import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";

const { width, height } = Dimensions.get("window");

interface Request {
  id: string;
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

export default function ReceivedRequestsScreen() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      senderName: "Rahul Kumar",
      senderAge: 30,
      senderLocation: "Mumbai, India",
      senderOccupation: "Engineer",
      message: "Hi, I found your profile interesting. Would like to connect.",
      timestamp: "2 hours ago",
      status: "pending",
      image: "https://via.placeholder.com/400x600",
      bio: "Passionate engineer looking for a life partner who shares similar values and interests.",
      religion: "Hindu",
      caste: "Brahmin",
      height: "5'10\"",
      education: "Bachelor's in Engineering",
      income: "₹12,00,000 - ₹15,00,000",
    },
    {
      id: "2",
      senderName: "Amit Singh",
      senderAge: 28,
      senderLocation: "Delhi, India",
      senderOccupation: "Doctor",
      message: "Hello! Your profile caught my attention. Let's chat!",
      timestamp: "1 day ago",
      status: "pending",
      image: "https://via.placeholder.com/400x600",
      bio: "Dedicated medical professional seeking a compassionate partner for a meaningful relationship.",
      religion: "Sikh",
      caste: "Jat",
      height: "5'11\"",
      education: "MBBS, MD",
      income: "₹15,00,000 - ₹20,00,000",
    },
    {
      id: "3",
      senderName: "Vikram Patel",
      senderAge: 32,
      senderLocation: "Ahmedabad, India",
      senderOccupation: "Businessman",
      message:
        "I think we would be a great match. Looking forward to your response.",
      timestamp: "3 days ago",
      status: "pending",
      image: "https://via.placeholder.com/400x600",
      bio: "Entrepreneur with a passion for culture and tradition. Looking for a partner to build a future together.",
      religion: "Hindu",
      caste: "Patel",
      height: "6'0\"",
      education: "MBA",
      income: "₹25,00,000+",
    },
  ]);

  const handleAcceptRequest = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, status: "accepted" } : request,
      ),
    );
    Alert.alert("Success", "Request accepted! You can now start chatting.");
  };

  const handleDeclineRequest = (requestId: string) => {
    Alert.alert(
      "Decline Request",
      "Are you sure you want to decline this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
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

  const renderRequestCard = (item: Request) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardName}>
          {item.senderName}, {item.senderAge}
        </Text>
        <Text style={styles.cardLocation}>{item.senderLocation}</Text>
        <Text style={styles.cardOccupation}>{item.senderOccupation}</Text>
        <Text style={styles.cardBio}>{item.bio}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => handleDeclineRequest(item.id)}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item.id)}
        >
          <Text style={styles.actionButtonText}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const onSwipedLeft = (cardIndex: number) => {
    const request = requests[cardIndex];
    handleDeclineRequest(request.id);
  };

  const onSwipedRight = (cardIndex: number) => {
    const request = requests[cardIndex];
    handleAcceptRequest(request.id);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Received Requests</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {requests.filter((r) => r.status === "pending").length} pending
          requests
        </ThemedText>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          cards={requests.filter((r) => r.status === "pending")}
          renderCard={renderRequestCard}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
          cardIndex={0}
          backgroundColor="#f8f9fa"
          stackSize={3}
          stackSeparation={15}
          cardVerticalMargin={10}
          overlayLabels={{
            left: {
              title: "DECLINE",
              style: {
                label: {
                  backgroundColor: "#dc3545",
                  borderColor: "#dc3545",
                  color: "#fff",
                  borderWidth: 1,
                  fontSize: 24,
                  fontWeight: "bold",
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: "ACCEPT",
              style: {
                label: {
                  backgroundColor: "#28a745",
                  borderColor: "#28a745",
                  color: "#fff",
                  borderWidth: 1,
                  fontSize: 24,
                  fontWeight: "bold",
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
        />
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
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  swiperContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "#fff",
    margin: 1,
  },
  cardImage: {
    width: "100%",
    height: height * 0.5,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardDetails: {
    padding: 20,
    flex: 1,
  },
  cardName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardLocation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  cardOccupation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  cardBio: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 15,
  },
  cardInfo: {
    marginBottom: 15,
  },
  cardInfoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  declineButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
