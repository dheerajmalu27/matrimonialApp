import { ImageSlider } from "@/components/ImageSlider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "../../components/ui/icon-symbol";

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
}

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        height: "2'3\"",
        heightCm: 69,
        weight: "68.00 kg",
        weightKg: "68.00",
        maritalStatus: "never_married",
        motherTongue: "Gujarati",
        aboutMe: "Simple and family oriented",
        profileImage: null, // Add image URL if available
      },
      religion: {
        religion: "Hindu",
        caste: "General",
        subCaste: "",
        gotra: "",
        manglik: null,
      },
      professional: {
        occupation: "jkjkjj",
        annualIncome: "Not specified",
        workLocation: "Not specified",
        employer: "Not specified",
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
        fatherName: "Not specified",
        fatherOccupation: "Not specified",
        motherName: "Not specified",
        motherOccupation: "Not specified",
        siblings: "Not specified",
        familyType: "Not specified",
        familyValues: "Not specified",
        familyStatus: "",
      },
      lifestyle: {
        diet: "Not specified",
        smoking: null,
        drinking: null,
        hobbies: [],
        interests: [],
      },
      kundli: {
        birthPlace: "Jaipur, Rajasthan",
        birthTime: "05:45:00",
        manglik: "Not specified",
        gotra: "",
        rashi: "Not specified",
        nakshatra: "",
        charan: "",
        gan: "",
        nadi: "",
      },
      partnerPreferences: null,
    };

    setProfile(hardcodedProfile);
    setLoading(false);
  }, [id]);

  const handleLike = () => {
    // TODO: Implement like functionality
    alert("Profile liked!");
  };

  const handleSendRequest = () => {
    // TODO: Implement send request functionality
    alert("Request sent!");
  };

  const handleMessage = () => {
    // Navigate to chat screen
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
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {profile.personal?.profileImage && (
          <View style={styles.profileImageContainer}>
            <ImageSlider
              images={[profile.personal.profileImage]}
              height={300}
            />
          </View>
        )}

        <View style={styles.profileInfo}>
          <ThemedText style={styles.name}>
            {profile.personal?.fullName}, {profile.personal?.age}
          </ThemedText>
          <ThemedText style={styles.location}>
            {profile.addresses?.length > 0
              ? `${profile.addresses[0].city}, ${profile.addresses[0].state}, ${profile.addresses[0].country}`
              : "Location not specified"}
          </ThemedText>
          <ThemedText style={styles.occupation}>
            {profile.professional?.occupation || "Occupation not specified"}
          </ThemedText>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
            >
              <Text style={styles.actionButtonText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={handleLike}
            >
              <IconSymbol name="heart.fill" size={20} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.sendRequestButton]}
              onPress={handleSendRequest}
            >
              <Text style={styles.actionButtonText}>📨</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.messageButton]}
              onPress={handleMessage}
            >
              <Text style={styles.actionButtonText}>💬</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>About Me</ThemedText>
            <ThemedText style={styles.bio}>
              {profile.personal?.aboutMe || "Not specified"}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Basic Information
            </ThemedText>
            {profile.personal?.profileImage && (
              <View style={styles.profileImageContainer}>
                <ImageSlider
                  images={[profile.personal.profileImage]}
                  height={300}
                />
              </View>
            )}
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.email || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Phone:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.mobile || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Religion:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.religion?.religion || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Caste:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.religion?.caste || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Height:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.height || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Weight:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.weight || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Marital Status:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.maritalStatus || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mother Tongue:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.motherTongue || "Not specified"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Professional Information
            </ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Occupation:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.professional?.occupation || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Annual Income:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.professional?.annualIncome || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Work Location:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.professional?.workLocation || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Employer:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.professional?.employer || "Not specified"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Education</ThemedText>
            {profile.education?.length > 0 ? (
              profile.education.map(
                (
                  edu: {
                    degree: string;
                    college: string;
                    university: string;
                    yearOfPassing: number;
                  },
                  index: number,
                ) => (
                  <View key={index} style={styles.infoRow}>
                    <ThemedText style={styles.infoLabel}>
                      {edu.degree}
                    </ThemedText>
                    <ThemedText style={styles.infoValue}>
                      {edu.college}, {edu.university} ({edu.yearOfPassing})
                    </ThemedText>
                  </View>
                ),
              )
            ) : (
              <ThemedText style={styles.bio}>
                No education information available
              </ThemedText>
            )}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Family Information
            </ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Father's Name:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.fatherName || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>
                Father's Occupation:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.fatherOccupation || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mother's Name:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.motherName || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>
                Mother's Occupation:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.motherOccupation || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Siblings:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.siblings || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Family Type:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.familyType || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Family Values:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.family?.familyValues || "Not specified"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Lifestyle & Interests
            </ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Diet:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.lifestyle?.diet || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Smoking:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.lifestyle?.smoking === null
                  ? "Not specified"
                  : profile.lifestyle.smoking
                    ? "Yes"
                    : "No"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Drinking:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.lifestyle?.drinking === null
                  ? "Not specified"
                  : profile.lifestyle.drinking
                    ? "Yes"
                    : "No"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Hobbies:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.lifestyle?.hobbies?.length > 0
                  ? profile.lifestyle.hobbies.join(", ")
                  : "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Interests:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.lifestyle?.interests?.length > 0
                  ? profile.lifestyle.interests.join(", ")
                  : "Not specified"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Kundli Details</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Birth Place:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.kundli?.birthPlace}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Birth Time:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.kundli?.birthTime}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Manglik:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.kundli?.manglik || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Rashi:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.kundli?.rashi || "Not specified"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Nakshatra:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.kundli?.nakshatra}
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "bold",
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
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  profileInfo: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  occupation: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
  },
  likeButton: {
    backgroundColor: "#28a745",
  },
  messageButton: {
    backgroundColor: "#007bff",
  },
  sendRequestButton: {
    backgroundColor: "#FF6B6B",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
});
