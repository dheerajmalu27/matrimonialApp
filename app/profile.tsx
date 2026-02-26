import { ImageSlider } from "@/components/ImageSlider";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UserForm } from "@/components/UserForm";
import { apiService } from "@/services/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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

const safeJoin = (arr: any, separator: string = ", "): string => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.join(separator);
  }
  return "Not specified";
};

const booleanToYesNo = (value: any | null | undefined): string => {
  if (value == true || value == 'true') return "Yes";
  if (value == false || value == 'false') return "No";
  return "Not specified";
};

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
      const hobbiesArray = formData.hobbies ? formData.hobbies.split(',').map((h: string) => h.trim()).filter((h: string) => h) : [];
      const interestsArray = formData.interests ? formData.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i) : [];

      const convertToBoolean = (value: string): boolean | null => {
        if (value === "Yes") return true;
        if (value === "No") return false;
        return null;
      };

      const updateData = {
        personal: {
          ...profile.personal,
          fullName: formData.name,
          age: parseInt(formData.age),
          dateOfBirth: formData.birthDate ? formData.birthDate : profile.personal?.dateOfBirth,
          birthTime: formData.birthTime || profile.personal?.birthTime,
          aboutMe: formData.bio,
          height: formData.height,
        },
        religion: {
          ...profile.religion,
          religion: formData.religion,
          caste: formData.caste,
          manglik: formData.manglik || profile.religion?.manglik,
        },
        professional: {
          ...profile.professional,
          occupation: formData.occupation,
          annualIncome: formData.income,
        },
        addresses: [
          {
            ...(profile.addresses?.[0] || { type: "permanent", city: "", state: "", country: "India", pincode: "" }),
            city: formData.location?.split(",")[0]?.trim() || profile.addresses?.[0]?.city || "",
            state: formData.location?.split(",")[1]?.trim() || profile.addresses?.[0]?.state || "",
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
        family: {
          fatherName: formData.fatherName || "",
          fatherOccupation: formData.fatherOccupation || "",
          motherName: formData.motherName || "",
          motherOccupation: formData.motherOccupation || "",
          siblings: formData.siblings || "",
          familyType: formData.familyType || "",
          familyValues: formData.familyValues || "",
          familyStatus: profile.family?.familyStatus || "",
        },
        lifestyle: {
          diet: formData.diet || "",
          smoking: convertToBoolean(formData.smoking),
          drinking: convertToBoolean(formData.drinking),
          hobbies: hobbiesArray,
          interests: interestsArray,
        },
        kundli: {
          birthPlace: formData.birthPlace || "",
          birthTime: formData.birthTime || "",
          manglik: formData.manglik || "",
          gotra: profile.kundli?.gotra || "",
          rashi: formData.rashi || "",
          nakshatra: formData.nakshatra || "",
          charan: profile.kundli?.charan || "",
          gan: profile.kundli?.gan || "",
          nadi: profile.kundli?.nadi || "",
        },
        partnerPreferences: profile.partnerPreferences,
      };

      const response = await apiService.updateUserProfile(updateData as any);

      if (response.success) {
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
              fatherName: profile.family?.fatherName || "",
              fatherOccupation: profile.family?.fatherOccupation || "",
              motherName: profile.family?.motherName || "",
              motherOccupation: profile.family?.motherOccupation || "",
              siblings: profile.family?.siblings || "",
              familyType: profile.family?.familyType || "",
              familyValues: profile.family?.familyValues || "",
              diet: profile.lifestyle?.diet || "",
              smoking: booleanToYesNo(profile.lifestyle?.smoking),
              drinking: booleanToYesNo(profile.lifestyle?.drinking),
              hobbies: safeJoin(profile.lifestyle?.hobbies, ", "),
              interests: safeJoin(profile.lifestyle?.interests, ", "),
              birthPlace: profile.kundli?.birthPlace || "",
              birthTime: profile.kundli?.birthTime || "",
              manglik: profile.kundli?.manglik || profile.religion?.manglik || "",
              rashi: profile.kundli?.rashi || "",
              nakshatra: profile.kundli?.nakshatra || "",
            }}
            onSubmit={handleSaveProfile}
            submitButtonText="Save Profile"
          />
        </ScrollView>
      </ThemedView>
    );
  }

  // Get profile image for cover
  const profileImage = profile.personal?.profileImage;
  const coverImage = profileImage || "https://via.placeholder.com/400x200";

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: coverImage }} 
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay} />
          
          {/* Profile Actions */}
          <View style={styles.profileActions}>
            <TouchableOpacity 
              style={styles.editProfileBtn}
              onPress={handleEditProfile}
            >
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profileImage || "https://via.placeholder.com/100" }} 
              style={styles.avatar}
            />
            {profile.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
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
            <Text style={styles.locationIcon}>Location:</Text>
            <Text style={styles.locationText}>
              {profile.addresses?.length > 0
                ? `${profile.addresses[0].city}, ${profile.addresses[0].state}`
                : "Not specified"}
            </Text>
          </View>
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
            profile.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <View style={styles.educationIcon}>
                  <Text style={styles.educationIconText}>Edu</Text>
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
              <Text style={styles.workIconText}>Work</Text>
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
                {profile.lifestyle.hobbies.map((hobby, index) => (
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
                {profile.lifestyle.interests.map((interest, index) => (
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

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    color: "#E91E63",
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
  coverContainer: {
    height: 200,
    position: "relative",
  },
  coverImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  profileActions: {
    position: "absolute",
    top: 40,
    right: 15,
  },
  editProfileBtn: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileBtnText: {
    color: "#E91E63",
    fontWeight: "600",
    fontSize: 14,
  },
  profileHeaderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: -60,
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
    marginTop: -50,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#28a745",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedText: {
    color: "#fff",
    fontSize: 10,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
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
    color: "#888",
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
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
    fontSize: 10,
    fontWeight: "bold",
    color: "#1976d2",
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
    fontSize: 10,
    fontWeight: "bold",
    color: "#388e3c",
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
  logoutSection: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dc3545",
  },
  logoutButtonText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 30,
  },
});
