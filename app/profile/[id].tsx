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

import { ImageSlider } from "@/components/ImageSlider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Profile {
  id: string;
  email: string;
  mobile: string;
  gender: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  personal: {
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    age: number;
    birthTime: string;
    height: string;
    heightCm: number;
    weight: string;
    weightKg: string;
    maritalStatus: string;
    motherTongue: string;
    aboutMe: string;
    profileImage: string | null;
  };
  religion: {
    religion: string;
    caste: string;
    subCaste: string;
    gotra: string;
    manglik: string | null;
  };
  professional: {
    occupation: string;
    annualIncome: string;
    workLocation: string;
    employer: string;
  };
  education: Array<{
    degree: string;
    college: string;
    university: string;
    yearOfPassing: number;
  }>;
  addresses: Array<{
    type: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  }>;
  family: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    siblings: string;
    familyType: string;
    familyValues: string;
    familyStatus: string;
  };
  lifestyle: {
    diet: string;
    smoking: boolean | null;
    drinking: boolean | null;
    hobbies: string[];
    interests: string[];
  };
  kundli: {
    birthPlace: string;
    birthTime: string;
    manglik: string;
    gotra: string;
    rashi: string;
    nakshatra: string;
    charan: string;
    gan: string;
    nadi: string;
  };
  partnerPreferences: any;
  images?: string[];
}

const booleanToYesNo = (value: any | null | undefined): string => {
  if (value == true || value == 'true') return "Yes";
  if (value == false || value == 'false') return "No";
  return "Not specified";
};

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("none");
  const [showMatchDetails, setShowMatchDetails] = useState(false);

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

  // Handle sending interest
  const handleSendInterest = () => {
    if (!profile) return;
    Alert.alert(
      "Send Interest 💝",
      `Do you want to send an interest to ${profile.personal?.fullName || "this profile"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () => {
            setRequestStatus("sent");
            Alert.alert("Interest Sent! ✨", "Your interest has been sent. They will be notified.");
          },
        },
      ]
    );
  };

  // Handle canceling sent request
  const handleCancelRequest = () => {
    if (!profile) return;
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel your interest request?",
      [
        { text: "No", style: "cancel" },
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
    if (!profile) return;
    Alert.alert(
      "Accept Request 💚",
      "Do you want to accept this interest?",
      [
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setRequestStatus("declined");
            Alert.alert("Rejected", "You have declined this request.");
          },
        },
        {
          text: "Accept",
          onPress: () => {
            setRequestStatus("accepted");
            Alert.alert("Request Accepted! 🎉", "You are now connected! You can now message each other.");
          },
        },
      ]
    );
  };

  // Handle shortlist
  const handleShortlist = () => {
    if (!profile) return;
    Alert.alert("Shortlisted! ⭐", `${profile.personal?.fullName || "This profile"} has been short-listed.`);
  };

  // Calculate match details based on the provided logic
  const calculateMatchDetails = (): MatchDetail[] => {
    if (!profile) return [];

    const details: MatchDetail[] = [];
    let score = 0;

    // 🎂 Age (25 points)
    const profileAge = profile.personal?.age || 0;
    const ageMatch = profileAge >= userPreferences.minAge && profileAge <= userPreferences.maxAge;
    if (ageMatch) score += 25;
    details.push({
      criteria: "Age",
      icon: "🎂",
      points: 25,
      matched: ageMatch,
      yourPreference: `${userPreferences.minAge} - ${userPreferences.maxAge} years`,
      theirValue: `${profileAge} years`,
    });

    // 📏 Height (15 points)
    const profileHeight = profile.personal?.heightCm || 0;
    const heightMatch = profileHeight >= userPreferences.minHeightCm && profileHeight <= userPreferences.maxHeightCm;
    if (heightMatch) score += 15;
    details.push({
      criteria: "Height",
      icon: "📏",
      points: 15,
      matched: heightMatch,
      yourPreference: `${userPreferences.minHeightCm} - ${userPreferences.maxHeightCm} cm`,
      theirValue: `${profileHeight} cm`,
    });

    // 🛕 Religion & Caste (20 points)
    const religionMatch = profile.religion?.religion === userPreferences.religion;
    const casteMatch = profile.religion?.caste === userPreferences.caste;
    const religionCasteMatch = religionMatch && casteMatch;
    if (religionCasteMatch) score += 20;
    details.push({
      criteria: "Religion & Caste",
      icon: "🛕",
      points: 20,
      matched: religionCasteMatch,
      yourPreference: `${userPreferences.religion}, ${userPreferences.caste}`,
      theirValue: `${profile.religion?.religion || "N/A"}, ${profile.religion?.caste || "N/A"}`,
    });

    // 🎓 Education (15 points)
    const profileEducation = profile.education?.[0]?.degree || "";
    const educationMatch = profileEducation.toLowerCase().includes(userPreferences.education.toLowerCase());
    if (educationMatch) score += 15;
    details.push({
      criteria: "Education",
      icon: "🎓",
      points: 15,
      matched: educationMatch,
      yourPreference: userPreferences.education,
      theirValue: profileEducation || "N/A",
    });

    // 📍 Location (10 points)
    const profileCity = profile.addresses?.[0]?.city || "";
    const profileState = profile.addresses?.[0]?.state || "";
    const locationMatch = profileCity === userPreferences.city || profileState === userPreferences.state;
    if (locationMatch) score += 10;
    details.push({
      criteria: "Location",
      icon: "📍",
      points: 10,
      matched: locationMatch,
      yourPreference: `${userPreferences.city}, ${userPreferences.state}`,
      theirValue: `${profileCity}, ${profileState}`,
    });

    // 🗣 Mother Tongue (5 points)
    const motherTongueMatch = profile.personal?.motherTongue === userPreferences.motherTongue;
    if (motherTongueMatch) score += 5;
    details.push({
      criteria: "Mother Tongue",
      icon: "🗣",
      points: 5,
      matched: motherTongueMatch,
      yourPreference: userPreferences.motherTongue,
      theirValue: profile.personal?.motherTongue || "N/A",
    });

    // 🔮 Kundli Matching (10 points)
    const kundliMatch = userPreferences.kundliMatchRequired && profile.kundli?.manglik === "No";
    if (kundliMatch) score += 10;
    details.push({
      criteria: "Kundli Matching",
      icon: "🔮",
      points: 10,
      matched: kundliMatch,
      yourPreference: "Manglik: No",
      theirValue: `Manglik: ${profile.kundli?.manglik || "N/A"}`,
    });

    return details;
  };

  const matchDetails = calculateMatchDetails();
  const matchPercentage = Math.round((matchDetails.reduce((acc, d) => acc + (d.matched ? d.points : 0), 0) / 100) * 100);

  useEffect(() => {
    // Hardcoded profile data as per user feedback
    const hardcodedProfile = {
      id: "test-profile",
      email: "test2@example.com",
      mobile: "Not specified",
      gender: "female",
      isVerified: false,
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      personal: {
        firstName: "Test",
        lastName: "User",
        fullName: "Test User",
        dateOfBirth: "1990-01-01",
        age: 34,
        birthTime: "05:45:00",
        height: "5'6\"",
        heightCm: 168,
        weight: "68.00 kg",
        weightKg: "68.00",
        maritalStatus: "Never Married",
        motherTongue: "Gujarati",
        aboutMe: "Simple and family oriented. Looking for a genuine partner who values relationships and has a positive outlook towards life.",
        profileImage: null,
      },
      religion: {
        religion: "Hindu",
        caste: "Brahmin",
        subCaste: "",
        gotra: " Kashyap",
        manglik: "No",
      },
      professional: {
        occupation: "Software Engineer",
        annualIncome: "₹10,00,000",
        workLocation: "Ahmedabad, Gujarat",
        employer: "Tech Company",
      },
      education: [
        {
          degree: "M.Tech",
          college: "IIT Delhi",
          university: "IIT",
          yearOfPassing: 2018,
        },
      ],
      addresses: [
        {
          type: "permanent",
          city: "Jaipur",
          state: "Rajasthan",
          country: "India",
          pincode: "302001",
        },
      ],
      family: {
        fatherName: "Ramesh Kumar",
        fatherOccupation: "Business",
        motherName: "Sunita Kumar",
        motherOccupation: "Housewife",
        siblings: "1 Brother",
        familyType: "Nuclear",
        familyValues: "Traditional",
        familyStatus: "Middle Class",
      },
      lifestyle: {
        diet: "Vegetarian",
        smoking: false,
        drinking: false,
        hobbies: ["Reading", "Cooking", "Traveling"],
        interests: ["Music", "Movies", "Yoga"],
      },
      kundli: {
        birthPlace: "Jaipur, Rajasthan",
        birthTime: "05:45:00",
        manglik: "No",
        gotra: "Kashyap",
        rashi: "Taurus",
        nakshatra: "Rohini",
        charan: "2",
        gan: "Dev",
        nadi: "Madhya",
      },
      partnerPreferences: null,
      images: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
      ],
    };

    setProfile(hardcodedProfile);
    setLoading(false);
  }, [id]);

  const handleLike = () => {
    Alert.alert("Profile liked!");
  };

  const handleSendRequest = () => {
    Alert.alert("Request sent!");
  };

  const handleMessage = () => {
    router.push(`/chat/${id}`);
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Profile not found</ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // Get profile images for slider
  const profileImages = profile.images && profile.images.length > 0 
    ? profile.images 
    : [profile.personal?.profileImage || "https://via.placeholder.com/400x300"];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <ImageSlider 
            images={profileImages} 
            height={400}
            showIndicators={true}
          />
          
          {/* Back Button Overlay */}
          <TouchableOpacity 
            style={styles.backButtonOverlay}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonOverlayText}>←</Text>
          </TouchableOpacity>

          {/* Match Percentage Badge - Clickable */}
          <TouchableOpacity 
            style={styles.matchBadge}
            onPress={() => setShowMatchDetails(true)}
          >
            <Text style={styles.matchBadgeText}>{matchPercentage}% Match</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile.personal?.profileImage || "https://via.placeholder.com/100" }} 
              style={styles.avatar}
            />
            {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.profileName}>
            {profile.personal?.fullName}, {profile.personal?.age}
          </Text>
          
          <View style={styles.profileTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.religion?.religion}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.religion?.caste}</Text>
            </View>
            {profile.personal?.maritalStatus && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{profile.personal?.maritalStatus}</Text>
              </View>
            )}
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.professional?.occupation || "N/A"}</Text>
              <Text style={styles.statLabel}>Occupation</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.professional?.annualIncome || "N/A"}</Text>
              <Text style={styles.statLabel}>Income</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.personal?.height || "N/A"}</Text>
              <Text style={styles.statLabel}>Height</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              {profile.addresses?.length > 0
                ? `${profile.addresses[0].city}, ${profile.addresses[0].state}`
                : "Not specified"}
            </Text>
          </View>
        </View>

        {/* Action Buttons - Based on Request Status */}
        <View style={styles.actionButtonsContainer}>
          {requestStatus === "none" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  if (profile) {
                    Alert.alert("Passed", `You passed on ${profile.personal?.fullName || "this profile"}`);
                  }
                }}
              >
                <Text style={styles.actionButtonIcon}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={handleShortlist}
              >
                <Text style={styles.actionButtonIcon}>⭐</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.interestButton]}
                onPress={handleSendInterest}
              >
                <Text style={styles.actionButtonIcon}>💝</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.chatButton]}
                onPress={() => {
                  Alert.alert("Premium", "Upgrade to premium to chat with this user");
                }}
              >
                <Text style={styles.actionButtonIcon}>💬</Text>
              </TouchableOpacity>
            </>
          )}

          {requestStatus === "sent" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  if (profile) {
                    Alert.alert("Passed", `You passed on ${profile.personal?.fullName || "this profile"}`);
                  }
                }}
              >
                <Text style={styles.actionButtonIcon}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={handleShortlist}
              >
                <Text style={styles.actionButtonIcon}>⭐</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.sentButton]}
                onPress={handleCancelRequest}
              >
                <Text style={styles.actionButtonIcon}>⏳</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.chatButton]}
                onPress={() => {
                  Alert.alert("Premium", "Upgrade to premium to chat with this user");
                }}
              >
                <Text style={styles.actionButtonIcon}>💬</Text>
              </TouchableOpacity>
            </>
          )}

          {requestStatus === "received" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  setRequestStatus("declined");
                  Alert.alert("Rejected", "You have declined this request");
                }}
              >
                <Text style={styles.actionButtonIcon}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={handleAccept}
              >
                <Text style={styles.actionButtonIcon}>✓</Text>
              </TouchableOpacity>
            </>
          )}

          {requestStatus === "accepted" && (
            <>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>✓ Connected</Text>
              </View>
              <TouchableOpacity
                style={[styles.actionButton, styles.chatButton]}
                onPress={handleMessage}
              >
                <Text style={styles.actionButtonIcon}>💬</Text>
              </TouchableOpacity>
            </>
          )}

          {requestStatus === "declined" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => {
                  if (profile) {
                    Alert.alert("Passed", `You passed on ${profile.personal?.fullName || "this profile"}`);
                  }
                }}
              >
                <Text style={styles.actionButtonIcon}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={handleShortlist}
              >
                <Text style={styles.actionButtonIcon}>⭐</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.interestButton]}
                onPress={handleSendInterest}
              >
                <Text style={styles.actionButtonIcon}>💝</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.chatButton]}
                onPress={() => {
                  Alert.alert("Premium", "Upgrade to premium to chat with this user");
                }}
              >
                <Text style={styles.actionButtonIcon}>💬</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* About Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            {profile.personal?.aboutMe || "No description available"}
          </Text>
        </View>

        {/* Basic Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mother Tongue</Text>
              <Text style={styles.infoValue}>{profile.personal?.motherTongue || "N/A"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{profile.personal?.weight || "N/A"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Birth Place</Text>
              <Text style={styles.infoValue}>{profile.kundli?.birthPlace || "N/A"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Birth Time</Text>
              <Text style={styles.infoValue}>{profile.kundli?.birthTime || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Education & Career */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Education & Career</Text>
          
          {profile.education?.length > 0 ? (
            profile.education.map((edu: any, index: number) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationIcon}>
                  <Text style={styles.educationIconText}>🎓</Text>
                </View>
                <View style={styles.educationInfo}>
                  <Text style={styles.educationDegree}>{edu.degree}</Text>
                  <Text style={styles.educationCollege}>{edu.college}</Text>
                  <Text style={styles.educationYear}>{edu.university} - {edu.yearOfPassing}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No education details added</Text>
          )}

          <View style={styles.workItem}>
            <View style={styles.workIcon}>
              <Text style={styles.workIconText}>💼</Text>
            </View>
            <View style={styles.workInfo}>
              <Text style={styles.workRole}>{profile.professional?.occupation || "Not specified"}</Text>
              <Text style={styles.workPlace}>{profile.professional?.employer || "N/A"}</Text>
              <Text style={styles.workLocation}>{profile.professional?.workLocation || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Family Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          
          <View style={styles.familyGrid}>
            <View style={styles.familyItem}>
              <Text style={styles.familyLabel}>Father</Text>
              <Text style={styles.familyValue}>{profile.family?.fatherName || "N/A"}</Text>
              <Text style={styles.familyOccupation}>{profile.family?.fatherOccupation || ""}</Text>
            </View>
            <View style={styles.familyItem}>
              <Text style={styles.familyLabel}>Mother</Text>
              <Text style={styles.familyValue}>{profile.family?.motherName || "N/A"}</Text>
              <Text style={styles.familyOccupation}>{profile.family?.motherOccupation || ""}</Text>
            </View>
          </View>

          <View style={styles.familyDetails}>
            <View style={styles.familyDetailItem}>
              <Text style={styles.familyDetailLabel}>Siblings</Text>
              <Text style={styles.familyDetailValue}>{profile.family?.siblings || "N/A"}</Text>
            </View>
            <View style={styles.familyDetailItem}>
              <Text style={styles.familyDetailLabel}>Family Type</Text>
              <Text style={styles.familyDetailValue}>{profile.family?.familyType || "N/A"}</Text>
            </View>
            <View style={styles.familyDetailItem}>
              <Text style={styles.familyDetailLabel}>Family Values</Text>
              <Text style={styles.familyDetailValue}>{profile.family?.familyValues || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Lifestyle */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          
          <View style={styles.lifestyleGrid}>
            <View style={styles.lifestyleItem}>
              <Text style={styles.lifestyleLabel}>Diet</Text>
              <Text style={styles.lifestyleValue}>{profile.lifestyle?.diet || "N/A"}</Text>
            </View>
            <View style={styles.lifestyleItem}>
              <Text style={styles.lifestyleLabel}>Smoking</Text>
              <Text style={styles.lifestyleValue}>{booleanToYesNo(profile.lifestyle?.smoking)}</Text>
            </View>
            <View style={styles.lifestyleItem}>
              <Text style={styles.lifestyleLabel}>Drinking</Text>
              <Text style={styles.lifestyleValue}>{booleanToYesNo(profile.lifestyle?.drinking)}</Text>
            </View>
          </View>

          {Array.isArray(profile.lifestyle?.hobbies) && profile.lifestyle.hobbies.length > 0 && (
            <View style={styles.hobbiesSection}>
              <Text style={styles.hobbiesLabel}>Hobbies</Text>
              <View style={styles.hobbiesTags}>
                {profile.lifestyle.hobbies.map((hobby: string, index: number) => (
                  <View key={index} style={styles.hobbyTag}>
                    <Text style={styles.hobbyTagText}>{hobby}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {Array.isArray(profile.lifestyle?.interests) && profile.lifestyle.interests.length > 0 && (
            <View style={styles.hobbiesSection}>
              <Text style={styles.hobbiesLabel}>Interests</Text>
              <View style={styles.hobbiesTags}>
                {profile.lifestyle.interests.map((interest: string, index: number) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestTagText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Astro Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Astro Details</Text>
          
          <View style={styles.astroGrid}>
            <View style={styles.astroItem}>
              <Text style={styles.astroLabel}>Manglik</Text>
              <Text style={styles.astroValue}>{profile.kundli?.manglik || profile.religion?.manglik || "N/A"}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroLabel}>Rashi</Text>
              <Text style={styles.astroValue}>{profile.kundli?.rashi || "N/A"}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroLabel}>Nakshatra</Text>
              <Text style={styles.astroValue}>{profile.kundli?.nakshatra || "N/A"}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroLabel}>Gotra</Text>
              <Text style={styles.astroValue}>{profile.religion?.gotra || profile.kundli?.gotra || "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

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
    </ThemedView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sliderContainer: {
    position: "relative",
  },
  backButtonOverlay: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonOverlayText: {
    fontSize: 20,
    color: "#E91E63",
    fontWeight: "bold",
  },
  matchBadge: {
    position: "absolute",
    top: 40,
    right: 15,
    backgroundColor: "#28a745",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  matchBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  profileHeaderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: -30,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    marginTop: -60,
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#28a745",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  verifiedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  profileTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#fce4ec",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#f48fb1",
  },
  tagText: {
    color: "#c2185b",
    fontSize: 12,
    fontWeight: "500",
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rejectButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#dc3545",
  },
  likeButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E91E63",
  },
  requestButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#28a745",
  },
  chatButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007bff",
  },
  shortlistButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  interestButton: {
    backgroundColor: "#E91E63",
    borderWidth: 2,
    borderColor: "#E91E63",
  },
  sentButton: {
    backgroundColor: "#6c757d",
    borderWidth: 2,
    borderColor: "#6c757d",
  },
  acceptButton: {
    backgroundColor: "#28a745",
    borderWidth: 2,
    borderColor: "#28a745",
  },
  connectedBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
  },
  connectedBadgeText: {
    color: "#28a745",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButtonIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#E91E63",
  },
  aboutText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  noDataText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  educationItem: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  educationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  educationIconText: {
    fontSize: 16,
  },
  educationInfo: {
    flex: 1,
  },
  educationDegree: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  educationCollege: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  educationYear: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  workItem: {
    flexDirection: "row",
    marginTop: 4,
  },
  workIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  workIconText: {
    fontSize: 16,
  },
  workInfo: {
    flex: 1,
  },
  workRole: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  workPlace: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  workLocation: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  familyGrid: {
    flexDirection: "row",
    marginBottom: 15,
  },
  familyItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  familyLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  familyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  familyOccupation: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  familyDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  familyDetailItem: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: 8,
  },
  familyDetailLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  familyDetailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  lifestyleGrid: {
    flexDirection: "row",
    marginBottom: 15,
  },
  lifestyleItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginHorizontal: 3,
  },
  lifestyleLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
  },
  lifestyleValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  hobbiesSection: {
    marginTop: 8,
  },
  hobbiesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  hobbiesTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hobbyTag: {
    backgroundColor: "#fff3e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ffb74d",
  },
  hobbyTagText: {
    color: "#e65100",
    fontSize: 12,
    fontWeight: "500",
  },
  interestTag: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#81c784",
  },
  interestTagText: {
    color: "#2e7d32",
    fontSize: 12,
    fontWeight: "500",
  },
  astroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  astroItem: {
    width: "50%",
    paddingVertical: 10,
  },
  astroLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  astroValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  bottomPadding: {
    height: 30,
  },
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
