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
  isPremium?: boolean;
  isOnline?: boolean;
  education?: string;
  income?: string;
  images?: string[];
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
    Alert.alert("❤️ Liked!", `${profile.name} has been added to your likes.`);
  };

  const handleReject = () => {
    Alert.alert("Passed", `You passed on ${profile.name}`);
  };

  const handleMessage = () => {
    Alert.alert("Message", `Start conversation with ${profile.name}`);
  };

  const handleShortlist = () => {
    Alert.alert("Shortlisted!", `${profile.name} has been short-listed.`);
  };

  // Calculate image count for indicator
  const imageCount = profile.images?.length || (profile.image ? 1 : 0);

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <Link href={`/profile/${profile.id}`} asChild>
        <TouchableOpacity style={styles.cardContent} activeOpacity={0.85}>
          {/* Avatar Section with Overlays */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profile.image || "https://via.placeholder.com/150" }}
                style={[styles.avatar, compact && styles.compactAvatar]}
              />
              
              {/* Online Status Indicator */}
              {profile.isOnline && (
                <View style={styles.onlineIndicator}>
                  <View style={styles.onlineDot} />
                </View>
              )}
              
              {/* Verified Badge */}
              {profile.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
              
              {/* Premium Badge */}
              {profile.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>⭐ Premium</Text>
                </View>
              )}
            </View>
            
            {/* Image Count Indicator */}
            {imageCount > 1 && (
              <View style={styles.imageCountBadge}>
                <Text style={styles.imageCountText}>📷 {imageCount}</Text>
              </View>
            )}
          </View>

          {/* Info Section */}
          <View style={[styles.info, compact && styles.compactInfo]}>
            {/* Name and Age with Premium Crown */}
            <View style={styles.nameRow}>
              <ThemedText style={[styles.name, compact && styles.compactName]}>
                {profile.name}, {profile.age}
              </ThemedText>
              {profile.isPremium && (
                <Text style={styles.crownIcon}>👑</Text>
              )}
            </View>

            {/* Location with Icon */}
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <ThemedText style={styles.location}>
                {profile.location}
              </ThemedText>
              {profile.isOnline && (
                <View style={styles.onlineTag}>
                  <Text style={styles.onlineTagText}>Active Now</Text>
                </View>
              )}
            </View>

            {/* Tags for Religion, Caste, Height */}
            <View style={styles.tagsRow}>
              {profile.height && (
                <View style={styles.heightTag}>
                  <Text style={styles.heightTagText}>📏 {profile.height}</Text>
                </View>
              )}
              {profile.religion && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.religion}</Text>
                </View>
              )}
              {profile.caste && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.caste}</Text>
                </View>
              )}
            </View>

            {/* Occupation and Education */}
            <View style={styles.careerRow}>
              <Text style={styles.careerIcon}>💼</Text>
              <ThemedText style={styles.occupation}>
                {profile.occupation}
              </ThemedText>
              {profile.education && (
                <Text style={styles.educationText}> • {profile.education}</Text>
              )}
            </View>

            {/* Income */}
            {profile.income && (
              <View style={styles.incomeRow}>
                <Text style={styles.incomeIcon}>💰</Text>
                <Text style={styles.incomeText}>{profile.income}</Text>
              </View>
            )}

            {/* Compatibility Score */}
            {profile.compatibility && (
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityText}>
                  {profile.compatibility}% Match
                </Text>
                <View style={styles.compatibilityBar}>
                  <View 
                    style={[
                      styles.compatibilityFill, 
                      { width: `${profile.compatibility}%` }
                    ]} 
                  />
                </View>
              </View>
            )}

            {/* Bio/About */}
            {!compact && profile.bio && (
              <View style={styles.bioContainer}>
                <Text style={styles.bioLabel}>About</Text>
                <ThemedText style={styles.bio} numberOfLines={2}>
                  {profile.bio}
                </ThemedText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Link>

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actions}>
          {/* Shortlist Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shortlistButton]}
            onPress={handleShortlist}
          >
            <Text style={styles.shortlistIcon}>⭐</Text>
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}
          >
            <Text style={styles.likeIcon}>♥</Text>
          </TouchableOpacity>

          {/* Message Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={handleMessage}
          >
            <Text style={styles.messageIcon}>💬</Text>
          </TouchableOpacity>

          {/* Send Interest Button */}
          <TouchableOpacity
            style={styles.sendInterestButton}
            onPress={handleReject}
          >
            <Text style={styles.sendInterestIcon}>✓</Text>
            <Text style={styles.sendInterestText}>Send Interest</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    overflow: "hidden",
  },
  compactCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 14,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#E91E63",
  },
  compactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  verifiedBadge: {
    position: "absolute",
    top: 0,
    right: -2,
    backgroundColor: "#2196F3",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  verifiedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  premiumBadge: {
    position: "absolute",
    bottom: 5,
    right: -5,
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumText: {
    color: "#333",
    fontSize: 9,
    fontWeight: "bold",
  },
  imageCountBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
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
    flexWrap: "wrap",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  compactName: {
    fontSize: 18,
  },
  crownIcon: {
    fontSize: 16,
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 13,
    color: "#555",
    flex: 1,
  },
  onlineTag: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  onlineTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  heightTag: {
    backgroundColor: "#fff3e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffb74d",
  },
  heightTagText: {
    color: "#e65100",
    fontSize: 11,
    fontWeight: "600",
  },
  tag: {
    backgroundColor: "#fce4ec",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f48fb1",
  },
  tagText: {
    color: "#c2185b",
    fontSize: 11,
    fontWeight: "600",
  },
  careerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  careerIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  occupation: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  educationText: {
    fontSize: 13,
    color: "#666",
  },
  incomeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  incomeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  incomeText: {
    fontSize: 13,
    color: "#28a745",
    fontWeight: "600",
  },
  compatibilityBadge: {
    backgroundColor: "#fce4ec",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  compatibilityText: {
    color: "#E91E63",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },
  compatibilityBar: {
    height: 4,
    backgroundColor: "#f8bbd0",
    borderRadius: 2,
    overflow: "hidden",
  },
  compatibilityFill: {
    height: "100%",
    backgroundColor: "#E91E63",
    borderRadius: 2,
  },
  bioContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  bioLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  bio: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafafa",
    gap: 8,
  },
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  shortlistButton: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  shortlistIcon: {
    fontSize: 20,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: "#E91E63",
  },
  likeIcon: {
    fontSize: 22,
    color: "#E91E63",
  },
  messageButton: {
    borderWidth: 2,
    borderColor: "#007bff",
  },
  messageIcon: {
    fontSize: 20,
  },
  sendInterestButton: {
    flexDirection: "row",
    backgroundColor: "#E91E63",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  sendInterestIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  sendInterestText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
