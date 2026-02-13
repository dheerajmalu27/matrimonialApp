import { Link } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  image: string;
  bio: string;
  height?: string;
  religion?: string;
  caste?: string;
  isVerified?: boolean;
  compatibility?: number;
}

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  compact?: boolean;
}

export default function ProfileCard({
  profile,
  showActions = true,
  compact = false,
}: ProfileCardProps) {
  const handleLike = () => {
    Alert.alert("Like", `You liked ${profile.name}!`);
    // TODO: Implement like functionality
  };

  const handleReject = () => {
    Alert.alert("Pass", `You passed on ${profile.name}`);
    // TODO: Implement reject functionality
  };

  const handleMessage = () => {
    Alert.alert("Message", `Start conversation with ${profile.name}`);
    // TODO: Implement messaging functionality
  };

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Link href={`/profile/${profile.id}`} asChild>
        <TouchableOpacity style={styles.cardContent} activeOpacity={0.7}>
          <Image
            source={{ uri: profile.image || "https://via.placeholder.com/150" }}
            style={[styles.avatar, compact && styles.compactAvatar]}
          />
          <View style={[styles.info, compact && styles.compactInfo]}>
            <View style={styles.nameRow}>
              <ThemedText style={[styles.name, compact && styles.compactName]}>
                {profile.name}
              </ThemedText>
              {profile.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>

            <ThemedText
              style={[styles.details, compact && styles.compactDetails]}
            >
              {profile.age} yrs • {profile.location}
            </ThemedText>

            <ThemedText
              style={[styles.occupation, compact && styles.compactOccupation]}
            >
              {profile.occupation}
            </ThemedText>

            {(profile.height || profile.religion || profile.caste) && (
              <View style={styles.additionalDetails}>
                <Text style={styles.detailItem}>
                  {profile.height && `${profile.height} • `}
                  {profile.religion && `${profile.religion} • `}
                  {profile.caste && profile.caste}
                </Text>
              </View>
            )}

            {profile.compatibility && (
              <ThemedText style={styles.compatibility}>
                {profile.compatibility}% Match
              </ThemedText>
            )}

            {!compact && (
              <ThemedText style={styles.bio} numberOfLines={2}>
                {profile.bio}
              </ThemedText>
            )}
          </View>
        </TouchableOpacity>
      </Link>

      {showActions && (
        <View style={styles.actions}>
          <View style={styles.leftButtons}>
            <TouchableOpacity
              style={[styles.iconButton, styles.likeButton]}
              onPress={handleLike}
            >
              <IconSymbol name="heart.fill" size={20} color="#FF6B6B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, styles.messageButton]}
              onPress={handleMessage}
            >
              <IconSymbol name="message.fill" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.textButton, styles.interestButton]}
            onPress={handleReject}
          >
            <Text style={styles.textButtonText}>Send Interest</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  compactCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  cardContent: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  compactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 1,
  },
  compactInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  compactName: {
    fontSize: 16,
  },
  verifiedBadge: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  compactDetails: {
    fontSize: 12,
  },
  occupation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  compactOccupation: {
    fontSize: 12,
    marginBottom: 2,
  },
  additionalDetails: {
    marginBottom: 6,
  },
  detailItem: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  compatibility: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 6,
  },
  bio: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#fff",
  },
  leftButtons: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  textButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  interestButton: {
    backgroundColor: "#FF6B6B",
  },
  likeButton: {
    // No background color, using border
  },
  messageButton: {
    // No background color, using border
  },
  textButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
