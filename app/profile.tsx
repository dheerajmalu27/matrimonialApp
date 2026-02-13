import { ImageSlider } from "@/components/ImageSlider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UserForm } from "@/components/UserForm";
import { apiService } from "@/services/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
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
    highest: boolean;
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

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getUserProfile();
      if (response.success && response.data) {
        setProfile(response.data as any);
      } else {
        setError(response.message || "Failed to load profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async (formData: any) => {
    if (!profile) return;

    try {
      const updateData = {
        personal: {
          ...profile.personal,
          fullName: formData.name,
          age: parseInt(formData.age),
          aboutMe: formData.bio,
          height: formData.height,
        },
        religion: {
          ...profile.religion,
          religion: formData.religion,
          caste: formData.caste,
        },
        professional: {
          ...profile.professional,
          occupation: formData.occupation,
          annualIncome: formData.income,
        },
        addresses: [
          {
            ...profile.addresses[0],
            city:
              formData.location.split(",")[0]?.trim() ||
              profile.addresses[0]?.city ||
              "",
            state:
              formData.location.split(",")[1]?.trim() ||
              profile.addresses[0]?.state ||
              "",
            country: "India",
            type: "permanent",
          },
        ],
        education: formData.education
          ? [
              {
                degree: formData.education,
                college: "",
                university: "",
                yearOfPassing: new Date().getFullYear(),
                highest: true,
              },
            ]
          : profile.education,
        family: profile.family,
        lifestyle: profile.lifestyle,
        kundli: profile.kundli,
        partnerPreferences: profile.partnerPreferences,
      };

      const response = await apiService.updateUserProfile(updateData as any);

      if (response.success) {
        // Refresh profile data
        await fetchUserProfile();
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", response.message || "Failed to update profile");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await apiService.logout();
            router.replace("/login");
          } catch (error) {
            // Even if logout API fails, clear local storage and redirect
            console.error("Logout error:", error);
            router.replace("/login");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchUserProfile}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Profile not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isEditing) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.editHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <ThemedText style={styles.editTitle}>Edit Profile</ThemedText>
            <View style={styles.placeholder} />
          </View>
          <UserForm
            initialData={{
              name: profile.personal?.fullName || "",
              age: profile.personal?.age?.toString() || "",
              location:
                profile.addresses?.length > 0
                  ? `${profile.addresses[0].city}, ${profile.addresses[0].state}`
                  : "",
              occupation: profile.professional?.occupation || "",
              bio: profile.personal?.aboutMe || "",
              images: profile.personal?.profileImage
                ? [profile.personal.profileImage]
                : [],
              email: profile.email || "",
              phone: profile.mobile || "Not specified",
              religion: profile.religion?.religion || "",
              caste: profile.religion?.caste || "",
              height: profile.personal?.height || "",
              education:
                profile.education?.length > 0
                  ? profile.education[0].degree
                  : "",
              income: profile.professional?.annualIncome || "",
            }}
            onSubmit={handleSaveProfile}
            submitButtonText="Save Profile"
          />
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {profile.personal?.profileImage && (
            <ImageSlider
              images={[profile.personal.profileImage]}
              height={120}
            />
          )}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

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

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>About Me</ThemedText>
            <ThemedText style={styles.bio}>
              {profile.personal?.aboutMe || "No description available"}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Basic Information
            </ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Email:</ThemedText>
              <ThemedText style={styles.infoValue}>{profile.email}</ThemedText>
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
                {profile.religion?.religion}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Caste:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.religion?.caste}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Height:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.height}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Weight:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.weight}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Marital Status:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.maritalStatus}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mother Tongue:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {profile.personal?.motherTongue}
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
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  cancelButton: {
    padding: 5,
  },
  cancelButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "500",
  },
  editTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 50,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileInfo: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  occupation: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
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
