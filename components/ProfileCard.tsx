// Request status types
type RequestStatus = "none" | "sent" | "received" | "accepted" | "declined";

// Match detail interface
interface MatchDetail {
  criteria: string;
  icon: string;
  points: number;
  matched: boolean;
  yourPreference: string;
  theirValue: string;
}

import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
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
  heightCm?: number;
  religion?: string;
  caste?: string;
  isVerified?: boolean;
  compatibility?: number;
  isPremium?: boolean;
  isOnline?: boolean;
  education?: string;
  income?: string;
  images?: string[];
  motherTongue?: string;
  // Request status from backend
  requestStatus?: RequestStatus;
}

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  compact?: boolean;
}

// User's preferences (dummy data - in real app would come from user's profile)
const userPreferences = {
  minAge: 25,
  maxAge: 35,
  minHeightCm: 150,
  maxHeightCm: 180,
  religion: "Hindu",
  caste: "Brahmin",
  education: "Engineering",
  city: "Jaipur",
  state: "Rajasthan",
  motherTongue: "Gujarati",
  kundliMatchRequired: true,
};

export default function ProfileCard({
  profile,
  showActions = true,
  compact = false,
}: ProfileCardProps) {
  // Local state to manage request status (in real app, this would come from backend)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    profile.requestStatus || "none"
  );
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  // Calculate match details based on the provided logic
  const calculateMatchDetails = (): MatchDetail[] => {
    const details: MatchDetail[] = [];

    // 🎂 Age (25 points)
    const ageMatch = profile.age >= userPreferences.minAge && profile.age <= userPreferences.maxAge;
    details.push({
      criteria: "Age",
      icon: "🎂",
      points: 25,
      matched: ageMatch,
      yourPreference: `${userPreferences.minAge} - ${userPreferences.maxAge} years`,
      theirValue: `${profile.age} years`,
    });

    // 📏 Height (15 points)
    const heightMatch = profile.heightCm 
      ? profile.heightCm >= userPreferences.minHeightCm && profile.heightCm <= userPreferences.maxHeightCm
      : false;
    details.push({
      criteria: "Height",
      icon: "📏",
      points: 15,
      matched: heightMatch,
      yourPreference: `${userPreferences.minHeightCm} - ${userPreferences.maxHeightCm} cm`,
      theirValue: profile.heightCm ? `${profile.heightCm} cm` : "N/A",
    });

    // 🛕 Religion & Caste (20 points)
    const religionMatch = profile.religion === userPreferences.religion;
    const casteMatch = profile.caste === userPreferences.caste;
    const religionCasteMatch = religionMatch && casteMatch;
    details.push({
      criteria: "Religion & Caste",
      icon: "🛕",
      points: 20,
      matched: religionCasteMatch,
      yourPreference: `${userPreferences.religion}, ${userPreferences.caste}`,
      theirValue: `${profile.religion || "N/A"}, ${profile.caste || "N/A"}`,
    });

    // 🎓 Education (15 points)
    const educationMatch = profile.education 
      ? profile.education.toLowerCase().includes(userPreferences.education.toLowerCase())
      : false;
    details.push({
      criteria: "Education",
      icon: "🎓",
      points: 15,
      matched: educationMatch,
      yourPreference: userPreferences.education,
      theirValue: profile.education || "N/A",
    });

    // 📍 Location (10 points)
    const locationParts = profile.location.split(",");
    const cityMatch = locationParts[0]?.trim() === userPreferences.city;
    const stateMatch = locationParts[1]?.trim() === userPreferences.state;
    const locationMatch = cityMatch || stateMatch;
    details.push({
      criteria: "Location",
      icon: "📍",
      points: 10,
      matched: locationMatch,
      yourPreference: `${userPreferences.city}, ${userPreferences.state}`,
      theirValue: profile.location,
    });

    // 🗣 Mother Tongue (5 points)
    const motherTongueMatch = profile.motherTongue === userPreferences.motherTongue;
    details.push({
      criteria: "Mother Tongue",
      icon: "🗣",
      points: 5,
      matched: motherTongueMatch,
      yourPreference: userPreferences.motherTongue,
      theirValue: profile.motherTongue || "N/A",
    });

    // 🔮 Kundli Matching (10 points) - assume non-manglik for demo
    const kundliMatch = userPreferences.kundliMatchRequired;
    details.push({
      criteria: "Kundli Matching",
      icon: "🔮",
      points: 10,
      matched: kundliMatch,
      yourPreference: "Manglik: No",
      theirValue: "Manglik: No (assumed)",
    });

    return details;
  };

  const matchDetails = calculateMatchDetails();
  const matchPercentage = profile.compatibility || Math.round(
    (matchDetails.reduce((acc, d) => acc + (d.matched ? d.points : 0), 0) / 100) * 100
  );

  // Handle sending interest
  const handleSendInterest = () => {
    Alert.alert(
      "Send Interest 💝",
      `Do you want to send an interest to ${profile.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send",
          onPress: () => {
            setRequestStatus("sent");
            Alert.alert("Interest Sent! ✨", `Your interest has been sent to ${profile.name}. They will be notified.`);
          },
        },
      ]
    );
  };

  // Handle canceling sent request
  const handleCancelRequest = () => {
    Alert.alert(
      "Cancel Request",
      `Are you sure you want to cancel your interest request to ${profile.name}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            setRequestStatus("none");
            Alert.alert("Request Cancelled", "Your interest request has been cancelled.");
          },
        },
      ]
    );
  };

  // Handle accepting received request
  const handleAccept = () => {
    Alert.alert(
      "Accept Request 💚",
      `Do you want to accept the interest from ${profile.name}?`,
      [
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setRequestStatus("declined");
            Alert.alert("Request Declined", `You have declined the interest from ${profile.name}.`);
          },
        },
        {
          text: "Accept",
          onPress: () => {
            setRequestStatus("accepted");
            Alert.alert("Request Accepted! 🎉", `You and ${profile.name} are now connected! You can now message each other.`);
          },
        },
      ]
    );
  };

  // Handle sending message (only when connected)
  const handleMessage = () => {
    Alert.alert("Message 💬", `Start conversation with ${profile.name}`);
  };

  // Handle shortlist
  const handleShortlist = () => {
    Alert.alert("Shortlisted! ⭐", `${profile.name} has been short-listed.`);
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

            {/* Compatibility Score - Now Clickable */}
            {profile.compatibility && (
              <TouchableOpacity 
                style={styles.compatibilityBadge}
                onPress={() => setShowMatchDetails(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.compatibilityText}>
                  {matchPercentage}% Match
                </Text>
                <View style={styles.compatibilityBar}>
                  <View 
                    style={[
                      styles.compatibilityFill, 
                      { width: `${matchPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.tapForDetails}>Tap for details</Text>
              </TouchableOpacity>
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

      {/* Action Buttons - Based on Request Status */}
      {showActions && (
        <View style={styles.actions}>
          {/* Case 1: No request sent yet - Show Send Interest button */}
          {requestStatus === "none" && (
            <>
              {/* Shortlist Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={handleShortlist}
              >
                <Text style={styles.shortlistIcon}>⭐</Text>
              </TouchableOpacity>

              {/* Send Interest Button - Primary Action */}
              <TouchableOpacity
                style={styles.sendInterestButton}
                onPress={handleSendInterest}
              >
                <Text style={styles.sendInterestIcon}>💝</Text>
                <Text style={styles.sendInterestText}>Send Interest</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Case 2: Request already sent - Show Cancel Request button */}
          {requestStatus === "sent" && (
            <>
              {/* Shortlist Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={handleShortlist}
              >
                <Text style={styles.shortlistIcon}>⭐</Text>
              </TouchableOpacity>

              {/* Cancel Request Button */}
              <TouchableOpacity
                style={styles.cancelRequestButton}
                onPress={handleCancelRequest}
              >
                <Text style={styles.cancelRequestIcon}>✕</Text>
                <Text style={styles.cancelRequestText}>Cancel Request</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Case 3: Received request - Show Accept and Reject buttons */}
          {requestStatus === "received" && (
            <>
              {/* Reject Button */}
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => {
                  setRequestStatus("declined");
                  Alert.alert("Rejected", `You have declined the request from ${profile.name}.`);
                }}
              >
                <Text style={styles.rejectButtonIcon}>✕</Text>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>

              {/* Accept Button */}
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAccept}
              >
                <Text style={styles.acceptButtonIcon}>✓</Text>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Case 4: Request accepted/Connected - Show Message button */}
          {requestStatus === "accepted" && (
            <>
              {/* Connected Badge */}
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>✓ Connected</Text>
              </View>

              {/* Message Button */}
              <TouchableOpacity
                style={styles.messageButtonMain}
                onPress={handleMessage}
              >
                <Text style={styles.messageButtonIcon}>💬</Text>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Case 5: Request declined - Show Send Interest button again */}
          {requestStatus === "declined" && (
            <>
              {/* Shortlist Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={handleShortlist}
              >
                <Text style={styles.shortlistIcon}>⭐</Text>
              </TouchableOpacity>

              {/* Send Interest Button */}
              <TouchableOpacity
                style={styles.sendInterestButton}
                onPress={handleSendInterest}
              >
                <Text style={styles.sendInterestIcon}>💝</Text>
                <Text style={styles.sendInterestText}>Send Interest</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Match Details Modal */}
      <Modal
        visible={showMatchDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMatchDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Match Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMatchDetails(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.matchScoreContainer}>
              <Text style={styles.matchScoreText}>{matchPercentage}%</Text>
              <Text style={styles.matchScoreLabel}>Overall Match</Text>
            </View>

            <ScrollView style={styles.matchDetailsScroll}>
              {matchDetails.map((detail, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.matchDetailItem,
                    detail.matched ? styles.matchDetailMatched : styles.matchDetailNotMatched
                  ]}
                >
                  <View style={styles.matchDetailHeader}>
                    <Text style={styles.matchDetailIcon}>{detail.icon}</Text>
                    <Text style={styles.matchDetailCriteria}>{detail.criteria}</Text>
                    <View style={[
                      styles.matchDetailBadge,
                      detail.matched ? styles.matchedBadge : styles.notMatchedBadge
                    ]}>
                      <Text style={[
                        styles.matchDetailBadgeText,
                        detail.matched ? styles.matchedBadgeText : styles.notMatchedBadgeText
                      ]}>
                        {detail.matched ? `+${detail.points}` : `0`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.matchDetailContent}>
                    <View style={styles.matchDetailRow}>
                      <Text style={styles.matchDetailLabel}>Your Preference:</Text>
                      <Text style={styles.matchDetailValue}>{detail.yourPreference}</Text>
                    </View>
                    <View style={styles.matchDetailRow}>
                      <Text style={styles.matchDetailLabel}>Their Value:</Text>
                      <Text style={[
                        styles.matchDetailValue,
                        detail.matched ? styles.matchedValue : styles.notMatchedValue
                      ]}>{detail.theirValue}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => {
                setShowMatchDetails(false);
                Alert.alert("Premium Feature", "Upgrade to premium to see more detailed match analysis!");
              }}
            >
              <Text style={styles.viewMoreButtonText}>View Full Compatibility Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tapForDetails: {
    fontSize: 10,
    color: "#E91E63",
    marginTop: 4,
    textAlign: "center",
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
  // Cancel Request Button
  cancelRequestButton: {
    flexDirection: "row",
    backgroundColor: "#6c757d",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#6c757d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  cancelRequestIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 6,
  },
  cancelRequestText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  // Reject Button
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#dc3545",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  rejectButtonIcon: {
    color: "#dc3545",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
  rejectButtonText: {
    color: "#dc3545",
    fontSize: 13,
    fontWeight: "bold",
  },
  // Accept Button
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#28a745",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  // Connected Badge
  connectedBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  connectedBadgeText: {
    color: "#28a745",
    fontSize: 13,
    fontWeight: "bold",
  },
  // Message Button (when connected)
  messageButtonMain: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  messageButtonIcon: {
    color: "#fff",
    fontSize: 16,
    marginRight: 6,
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  matchScoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
  },
  matchScoreText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#28a745",
  },
  matchScoreLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  matchDetailsScroll: {
    padding: 20,
  },
  matchDetailItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  matchDetailMatched: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#a5d6a7",
  },
  matchDetailNotMatched: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  matchDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  matchDetailIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  matchDetailCriteria: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  matchDetailBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchedBadge: {
    backgroundColor: "#28a745",
  },
  notMatchedBadge: {
    backgroundColor: "#dc3545",
  },
  matchDetailBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  matchedBadgeText: {
    color: "#fff",
  },
  notMatchedBadgeText: {
    color: "#fff",
  },
  matchDetailContent: {
    paddingLeft: 28,
  },
  matchDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  matchDetailLabel: {
    fontSize: 12,
    color: "#666",
  },
  matchDetailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  matchedValue: {
    color: "#28a745",
  },
  notMatchedValue: {
    color: "#dc3545",
  },
  viewMoreButton: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#E91E63",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  viewMoreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
