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

import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "./themed-text";
import { apiService } from "../services/api";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  image: string;
  bio: string;
  height?: number;
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
  // New fields from enhanced API
  distance?: string;
  mutualInterests?: number[];
  profileViews?: number;
  familyType?: string;
  profileCompletePercentage?: number;
  // Interest status from backend
  interestStatus?: string | null;
  interestIsSender?: boolean | null;
  interestId?: string | null;
  // Legacy request status
  requestStatus?: RequestStatus;
}

interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  compact?: boolean;
}

interface PremiumPlanInfo {
  displayName: string;
  amountInr: number;
  features: {
    unlimitedInterests: boolean;
    verifiedBadge: boolean;
    advancedSearch: boolean;
    basicMessaging: boolean;
  };
}

// Helper function to check if a value exists in a comma-separated preference string
const isValueInPreference = (value: string, preference: string): boolean => {
  if (!value || !preference) return false;
  const preferenceArray = preference.split(",").map((p) => p.trim().toLowerCase());
  return preferenceArray.some((p) => value.toLowerCase().includes(p));
};

// Helper function to convert height from CM to feet/inches format
const convertCmToFeet = (height: number): string => {
  if (!height || height <= 0) return "";
  
  // Convert cm to inches (1 inch = 2.54 cm)
  const totalInches = height / 2.54;
  
  // Calculate feet and remaining inches
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  // Return formatted string (e.g., "5' 6\"")
  return `${feet}' ${inches}"`;
};

export default function ProfileCard({
  profile,
  showActions = true,
  compact = false,
}: ProfileCardProps) {
  // Determine request status from backend interestStatus (props) or fallback to local state
  // Backend interestStatus: 'pending', 'accepted', 'declined', null
  // Frontend RequestStatus: 'sent', 'received', 'accepted', 'declined', 'none'
  
const getInitialStatus = (): RequestStatus => {
    if (profile.interestStatus === 'sent') {
      return profile.interestIsSender ? 'sent' : 'received';
    }
    if (profile.interestStatus === 'pending') {
      return profile.interestIsSender ? 'sent' : 'received';
    }
    if (profile.interestStatus === 'accepted') return 'accepted';
    if (profile.interestStatus === 'declined') return 'declined';
    return profile.requestStatus || "none";
  };

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(getInitialStatus());
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [shortlistEntryId, setShortlistEntryId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState<PremiumPlanInfo>({
    displayName: "Premium",
    amountInr: 1200,
    features: {
      unlimitedInterests: true,
      verifiedBadge: true,
      advancedSearch: true,
      basicMessaging: true,
    },
  });

// Default preferences (used as fallback when no user preferences are found)
  const defaultPreferences = {
    minAge: 25,
    maxAge: 35,
    minHeightCm: 150,
    maxHeightCm: 180,
    religion: "",
    caste: "",
    education: "",
    occupation: "",
    location: "",
    incomeRange: "",
    motherTongue: "",
    kundliMatchRequired: false,
    manglikPreference: "both",
  };

// User's preferences - loaded from localStorage (initialized with defaults to avoid null errors)
  const [userPreferences, setUserPreferences] = useState<any>(defaultPreferences);

  // Load user preferences from localStorage
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const userProfileStr = await AsyncStorage.getItem("userProfile");
        
        if (userProfileStr) {
          const userProfile = JSON.parse(userProfileStr);
         
          
          // Check for partnerPreference property
          if (userProfile.partnerPreference && userProfile.partnerPreference.minAge !== undefined) {
          await  setUserPreferences(userProfile.partnerPreference);
            console.log("Successfully loaded partnerPreference:", JSON.stringify(userProfile.partnerPreference));
          } else {
            console.log("No valid partnerPreference found, using defaults");
          }
        } else {
          console.log("No userProfile found in localStorage, using defaults");
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };
    
    loadUserPreferences();
  }, []);

  useEffect(() => {
    const loadShortlistStatus = async () => {
      try {
        const shortlistResponse = await apiService.getShortlists();
        const shortlistItems = shortlistResponse.data || [];
        const currentEntry = shortlistItems.find(
          (item: any) => String(item.shortlistedUserId) === String(profile.id)
        );

        if (currentEntry) {
          setIsShortlisted(true);
          setShortlistEntryId(String(currentEntry.id));
        } else {
          setIsShortlisted(false);
          setShortlistEntryId(null);
        }
      } catch (error) {
        console.error("Error loading shortlist status:", error);
      }
    };

    if (profile?.id) {
      loadShortlistStatus();
    }
  }, [profile?.id]);

  const openUpgradeModal = async () => {
    setShowUpgradeModal(true);
    try {
      const response = await apiService.getMonetizationConfig();
      if (response.success && response.data?.config?.plans?.premium) {
        const premium = response.data.config.plans.premium;
        setPremiumPlan({
          displayName: premium.displayName || "Premium",
          amountInr: premium.priceInr || 1200,
          features: {
            unlimitedInterests: Boolean(premium.features?.unlimitedInterests),
            verifiedBadge: Boolean(premium.features?.verifiedBadge),
            advancedSearch: Boolean(premium.features?.advancedSearch),
            basicMessaging: Boolean(premium.features?.basicMessaging),
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch premium plan:", error);
    }
  };

  const handlePurchasePremium = async () => {
    try {
      setUpgradeLoading(true);

      const orderResponse = await apiService.createPremiumOrder();
      if (!orderResponse.success || !orderResponse.data) {
        Alert.alert("Payment Error", orderResponse.message || "Unable to create payment order.");
        return;
      }

      const { keyId, order, plan } = orderResponse.data;

      let userName = "Matrimonial User";
      try {
        const userProfileStr = await AsyncStorage.getItem("userProfile");
        if (userProfileStr) {
          const parsed = JSON.parse(userProfileStr);
          userName = parsed?.personal?.fullName || parsed?.name || userName;
        }
      } catch (e) {
        console.error("Failed to read user profile for prefill:", e);
      }

      let RazorpayCheckout: any = null;
      try {
        const razorpayModule = await import("react-native-razorpay");
        RazorpayCheckout = razorpayModule.default;
      } catch (importError) {
        Alert.alert(
          "Razorpay SDK Missing",
          "Install and configure react-native-razorpay in your app build to complete in-app payment.",
        );
        return;
      }

      const paymentResult = await RazorpayCheckout.open({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Matrimonial Premium",
        description: `${plan.displayName} Plan`,
        order_id: order.id,
        prefill: {
          name: userName,
        },
        theme: {
          color: "#E91E63",
        },
      });

      const verifyResponse = await apiService.verifyPremiumPayment({
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_signature: paymentResult.razorpay_signature,
      });

      if (verifyResponse.success) {
        setShowUpgradeModal(false);
        Alert.alert("Payment Successful", "Premium plan activated successfully.");
      } else {
        Alert.alert("Verification Failed", verifyResponse.message || "Payment verification failed.");
      }
    } catch (error: any) {
      console.error("Premium purchase error:", error);
      const message = error?.description || error?.message || "Payment cancelled or failed.";
      Alert.alert("Payment Failed", message);
    } finally {
      setUpgradeLoading(false);
    }
  };

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
    const heightMatch = profile.height 
      ? profile.height >= userPreferences.minHeightCm && profile.height <= userPreferences.maxHeightCm
      : false;
    details.push({
      criteria: "Height",
      icon: "📏",
      points: 15,
      matched: heightMatch,
      yourPreference: `${userPreferences.minHeightCm} - ${userPreferences.maxHeightCm} cm`,
      theirValue: profile.height ? `${profile.height} cm` : "N/A",
    });

    // 🛕 Religion & Caste (20 points) - Multi-value support
    const religionMatch = isValueInPreference(profile.religion || "", userPreferences.religion);
    const casteMatch = isValueInPreference(profile.caste || "", userPreferences.caste);
    const religionCasteMatch = religionMatch && casteMatch;
    details.push({
      criteria: "Religion & Caste",
      icon: "🛕",
      points: 20,
      matched: religionCasteMatch,
      yourPreference: userPreferences.religion || "Any",
      theirValue: `${profile.religion || "N/A"}, ${profile.caste || "N/A"}`,
    });

    // 🎓 Education (15 points) - Multi-value support
    const educationMatch = isValueInPreference(profile.education || "", userPreferences.education);
    details.push({
      criteria: "Education",
      icon: "🎓",
      points: 15,
      matched: educationMatch,
      yourPreference: userPreferences.education || "Any",
      theirValue: profile.education || "N/A",
    });

    // 💼 Occupation (10 points) - Multi-value support
    const occupationMatch = isValueInPreference(profile.occupation || "", userPreferences.occupation);
    details.push({
      criteria: "Occupation",
      icon: "💼",
      points: 10,
      matched: occupationMatch,
      yourPreference: userPreferences.occupation || "Any",
      theirValue: profile.occupation || "N/A",
    });

    // 📍 Location (10 points) - Multi-value support
    const locationMatch = isValueInPreference(profile.location || "", userPreferences.location);
    details.push({
      criteria: "Location",
      icon: "📍",
      points: 10,
      matched: locationMatch,
      yourPreference: userPreferences.location || "Any",
      theirValue: profile.location || "Not specified",
    });

    // 💰 Income (5 points) - Multi-value support
    const incomeMatch = isValueInPreference(profile.income || "", userPreferences.incomeRange);
    details.push({
      criteria: "Income Range",
      icon: "💰",
      points: 5,
      matched: incomeMatch,
      yourPreference: userPreferences.incomeRange || "Any",
      theirValue: profile.income || "N/A",
    });

    // 🗣 Mother Tongue (5 points) - Multi-value support
    
    const motherTongueMatch = isValueInPreference(profile.motherTongue || "", userPreferences.motherTongue);
   
    details.push({
      criteria: "Mother Tongue",
      icon: "🗣",
      points: 5,
      matched: motherTongueMatch,
      yourPreference: userPreferences.motherTongue || "Any",
      theirValue: profile.motherTongue || "N/A",
    });

    // 🔮 Kundli Matching (10 points)
    const kundliMatch = userPreferences.kundliMatchRequired;
    details.push({
      criteria: "Kundli Matching",
      icon: "🔮",
      points: 10,
      matched: kundliMatch,
      yourPreference: userPreferences.kundliMatchRequired ? `Manglik: ${userPreferences.manglikPreference}` : "Not required",
      theirValue: "Kundli match",
    });

    return details;
  };

  const matchDetails = calculateMatchDetails();
  const matchPercentage =  Math.round(
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
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.sendInterest(profile.id);
              
              if (response.success) {
                setRequestStatus("sent");
                Alert.alert("Interest Sent! ✨", `Your interest has been sent to ${profile.name}. They will be notified.`);
              } else {
                Alert.alert("Error", response.message || "Failed to send interest. Please try again.");
              }
            } catch (error) {
              console.error("Error sending interest:", error);
              const message = error instanceof Error ? error.message : "";
              const normalizedMessage = message.toLowerCase();
              const isLimitError =
                normalizedMessage.includes("limit") ||
                normalizedMessage.includes("premium") ||
                normalizedMessage.includes("daily interests");

              if (isLimitError) {
                openUpgradeModal();
              } else {
                Alert.alert("Error", "Failed to send interest. Please check your connection and try again.");
              }
            } finally {
              setLoading(false);
            }
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
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.cancelInterest(profile.id);
              
              if (response.success) {
                setRequestStatus("none");
                Alert.alert("Request Cancelled", "Your interest request has been cancelled.");
              } else {
                Alert.alert("Error", response.message || "Failed to cancel interest. Please try again.");
              }
            } catch (error) {
              console.error("Error canceling interest:", error);
              Alert.alert("Error", "Failed to cancel interest. Please check your connection and try again.");
            } finally {
              setLoading(false);
            }
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
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.rejectInterest(profile.id);
              
              if (response.success) {
                setRequestStatus("declined");
                Alert.alert("Request Declined", `You have declined the interest from ${profile.name}.`);
              } else {
                Alert.alert("Error", response.message || "Failed to reject interest. Please try again.");
              }
            } catch (error) {
              console.error("Error rejecting interest:", error);
              Alert.alert("Error", "Failed to reject interest. Please check your connection and try again.");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          text: "Accept",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.acceptInterest(profile.id);
              
              if (response.success) {
                setRequestStatus("accepted");
                Alert.alert("Request Accepted! 🎉", `You and ${profile.name} are now connected! You can now message each other.`);
              } else {
                Alert.alert("Error", response.message || "Failed to accept interest. Please try again.");
              }
            } catch (error) {
              console.error("Error accepting interest:", error);
              Alert.alert("Error", "Failed to accept interest. Please check your connection and try again.");
            } finally {
              setLoading(false);
            }
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
    if (!profile?.id) return;

    if (isShortlisted && shortlistEntryId) {
      Alert.alert(
        "Remove Shortlist",
        `Remove ${profile.name} from your shortlist?`,
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                const response = await apiService.removeFromShortlist(shortlistEntryId);
                if (response.success) {
                  setIsShortlisted(false);
                  setShortlistEntryId(null);
                  Alert.alert("Removed", `${profile.name} removed from shortlist.`);
                } else {
                  Alert.alert("Error", response.message || "Failed to remove from shortlist. Please try again.");
                }
              } catch (error) {
                console.error("Error removing shortlist:", error);
                Alert.alert("Error", "Failed to remove from shortlist. Please check your connection and try again.");
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      "Shortlist ⭐",
      `Add ${profile.name} to your shortlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.addToShortlist(profile.id);
              if (response.success) {
                const shortlistResponse = await apiService.getShortlists();
                const shortlistItems = shortlistResponse.data || [];
                const currentEntry = shortlistItems.find(
                  (item: any) => String(item.shortlistedUserId) === String(profile.id)
                );

                setIsShortlisted(true);
                setShortlistEntryId(currentEntry ? String(currentEntry.id) : null);
                Alert.alert("Shortlisted! ⭐", `${profile.name} has been short-listed.`);
              } else {
                Alert.alert("Error", response.message || "Failed to shortlist profile. Please try again.");
              }
            } catch (error) {
              console.error("Error adding shortlist:", error);
              Alert.alert("Error", "Failed to shortlist profile. Please check your connection and try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
              {profile.distance && (
                <View style={styles.distanceTag}>
                  <Text style={styles.distanceTagText}>{profile.distance}</Text>
                </View>
              )}
              {profile.isOnline && (
                <View style={styles.onlineTag}>
                  <Text style={styles.onlineTagText}>Active Now</Text>
                </View>
              )}
            </View>

{/* Tags for Religion, Caste, Height */}
            <View style={styles.tagsRow}>
              {(profile.height || profile.height) && (
                <View style={styles.heightTag}>
                  <Text style={styles.heightTagText}>📏 {profile.height ? convertCmToFeet(profile.height) : profile.height}</Text>
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
                onPress={async () => {
                  try {
                    setLoading(true);
                    const response = await apiService.rejectInterest(profile.id);
                    
                    if (response.success) {
                      setRequestStatus("declined");
                      Alert.alert("Rejected", `You have declined the request from ${profile.name}.`);
                    } else {
                      Alert.alert("Error", response.message || "Failed to reject interest. Please try again.");
                    }
                  } catch (error) {
                    console.error("Error rejecting interest:", error);
                    Alert.alert("Error", "Failed to reject interest. Please check your connection and try again.");
                  } finally {
                    setLoading(false);
                  }
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

      <Modal
        visible={showUpgradeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upgrade to {premiumPlan.displayName}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowUpgradeModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.premiumPlanContainer}>
              <Text style={styles.premiumPrice}>₹{premiumPlan.amountInr}/year</Text>
              <Text style={styles.premiumSubtitle}>Unlock better matches and unlimited actions</Text>

              <View style={styles.premiumFeatureItem}>
                <Text style={styles.premiumFeatureIcon}>💝</Text>
                <Text style={styles.premiumFeatureText}>
                  {premiumPlan.features.unlimitedInterests ? "Unlimited interests" : "Interest access enabled"}
                </Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <Text style={styles.premiumFeatureIcon}>✅</Text>
                <Text style={styles.premiumFeatureText}>
                  {premiumPlan.features.verifiedBadge ? "Verified badge" : "Profile trust boost"}
                </Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <Text style={styles.premiumFeatureIcon}>🔎</Text>
                <Text style={styles.premiumFeatureText}>
                  {premiumPlan.features.advancedSearch ? "Advanced search" : "Better search visibility"}
                </Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <Text style={styles.premiumFeatureIcon}>💬</Text>
                <Text style={styles.premiumFeatureText}>
                  {premiumPlan.features.basicMessaging ? "Messaging access" : "Messaging unlocked"}
                </Text>
              </View>
            </View>

            <View style={styles.premiumActionRow}>
              <TouchableOpacity
                style={styles.premiumLaterButton}
                onPress={() => {
                  setShowUpgradeModal(false);
                  router.push("/settings");
                }}
              >
                <Text style={styles.premiumLaterText}>View Plans</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.premiumBuyButton, upgradeLoading && styles.premiumBuyButtonDisabled]}
                onPress={handlePurchasePremium}
                disabled={upgradeLoading}
              >
                {upgradeLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.premiumBuyText}>Purchase Plan</Text>
                )}
              </TouchableOpacity>
            </View>
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
  distanceTag: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  distanceTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
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
  premiumPlanContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  premiumPrice: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#E91E63",
    textAlign: "center",
  },
  premiumSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  premiumFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  premiumFeatureIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  premiumFeatureText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  premiumActionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  premiumLaterButton: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  premiumLaterText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "700",
  },
  premiumBuyButton: {
    flex: 1,
    backgroundColor: "#E91E63",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  premiumBuyButtonDisabled: {
    opacity: 0.7,
  },
  premiumBuyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
