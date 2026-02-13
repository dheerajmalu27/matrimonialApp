import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface UserFormData {
  name: string;
  age: string;
  location: string;
  occupation: string;
  bio: string;
  images: string[];
  email: string;
  phone: string;
  religion: string;
  caste: string;
  height: string;
  education: string;
  income: string;
  password?: string;
  confirmPassword?: string;
  // Family Information
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  familyValues: string;
  // Lifestyle & Interests
  diet: string;
  smoking: string;
  drinking: string;
  hobbies: string;
  interests: string;
  // Kundli Details
  birthPlace: string;
  birthTime: string;
  manglik: string;
  rashi: string;
  nakshatra: string;
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  submitButtonText: string;
  isRegistration?: boolean;
  onSignIn?: () => void;
}

export function UserForm({
  initialData = {},
  onSubmit,
  submitButtonText,
  isRegistration = false,
  onSignIn,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData.name || "",
    age: initialData.age || "",
    location: initialData.location || "",
    occupation: initialData.occupation || "",
    bio: initialData.bio || "",
    images: initialData.images || [],
    email: initialData.email || "",
    phone: initialData.phone || "",
    religion: initialData.religion || "",
    caste: initialData.caste || "",
    height: initialData.height || "",
    education: initialData.education || "",
    income: initialData.income || "",
    password: initialData.password || "",
    confirmPassword: initialData.confirmPassword || "",
    // Family Information
    fatherName: initialData.fatherName || "",
    fatherOccupation: initialData.fatherOccupation || "",
    motherName: initialData.motherName || "",
    motherOccupation: initialData.motherOccupation || "",
    siblings: initialData.siblings || "",
    familyType: initialData.familyType || "",
    familyValues: initialData.familyValues || "",
    // Lifestyle & Interests
    diet: initialData.diet || "",
    smoking: initialData.smoking || "",
    drinking: initialData.drinking || "",
    hobbies: initialData.hobbies || "",
    interests: initialData.interests || "",
    // Kundli Details
    birthPlace: initialData.birthPlace || "",
    birthTime: initialData.birthTime || "",
    manglik: initialData.manglik || "",
    rashi: initialData.rashi || "",
    nakshatra: initialData.nakshatra || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const totalSteps = 6; // Updated to include all sections

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos",
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...formData.images, result.assets[0].uri];
      updateField("images", newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateField("images", newImages);
  };

  const updateField = (field: keyof UserFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = React.useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      if (step === 0) {
        // Step 1: Contact Info
        const requiredFields: (keyof UserFormData)[] = [
          "name",
          "email",
          "phone",
          "age",
          "location",
          "occupation",
          "bio",
        ];
        requiredFields.forEach((field) => {
          const value = formData[field];
          if (typeof value === "string" && !value.trim()) {
            newErrors[field] =
              `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
        const age = parseInt(formData.age);
        if (formData.age && (isNaN(age) || age < 18 || age > 100)) {
          newErrors.age = "Please enter a valid age (18-100)";
          isValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
          isValid = false;
        }
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
          newErrors.phone = "Please enter a valid phone number";
          isValid = false;
        }
      } else if (step === 1) {
        // Step 2: Personal Details
        const requiredFields: (keyof UserFormData)[] = [
          "religion",
          "caste",
          "height",
          "education",
          "income",
        ];
        requiredFields.forEach((field) => {
          const value = formData[field];
          if (typeof value === "string" && !value.trim()) {
            newErrors[field] =
              `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
      } else if (step === 2) {
        // Step 3: Family Information
        const requiredFields: (keyof UserFormData)[] = [
          "fatherName",
          "motherName",
          "siblings",
        ];
        requiredFields.forEach((field) => {
          const value = formData[field];
          if (typeof value === "string" && !value.trim()) {
            newErrors[field] =
              `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
      } else if (step === 3) {
        // Step 4: Lifestyle & Interests
        const requiredFields: (keyof UserFormData)[] = [
          "diet",
          "smoking",
          "drinking",
          "hobbies",
          "interests",
        ];
        requiredFields.forEach((field) => {
          const value = formData[field];
          if (typeof value === "string" && !value.trim()) {
            newErrors[field] =
              `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
      } else if (step === 4) {
        // Step 5: Kundli Details
        const requiredFields: (keyof UserFormData)[] = [
          "birthPlace",
          "birthTime",
          "manglik",
          "rashi",
          "nakshatra",
        ];
        requiredFields.forEach((field) => {
          const value = formData[field];
          if (typeof value === "string" && !value.trim()) {
            newErrors[field] =
              `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            isValid = false;
          }
        });
      } else if (step === 5) {
        // Step 6: Security
        if (!formData.password || formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
          isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [formData],
  );

  const isStepValid = React.useMemo(() => {
    let isValid = true;

    if (currentStep === 0) {
      // Step 1: Contact Info
      const requiredFields: (keyof UserFormData)[] = [
        "name",
        "email",
        "phone",
        "age",
        "location",
        "occupation",
        "bio",
      ];
      requiredFields.forEach((field) => {
        const value = formData[field];
        if (typeof value === "string" && !value.trim()) {
          isValid = false;
        }
      });
      const age = parseInt(formData.age);
      if (formData.age && (isNaN(age) || age < 18 || age > 100)) {
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        isValid = false;
      }
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        isValid = false;
      }
    } else if (currentStep === 1) {
      // Step 2: Personal Details
      const requiredFields: (keyof UserFormData)[] = [
        "religion",
        "caste",
        "height",
        "education",
        "income",
      ];
      requiredFields.forEach((field) => {
        const value = formData[field];
        if (typeof value === "string" && !value.trim()) {
          isValid = false;
        }
      });
    } else if (currentStep === 2) {
      // Step 3: Family Information
      const requiredFields: (keyof UserFormData)[] = [
        "fatherName",
        "motherName",
        "siblings",
      ];
      requiredFields.forEach((field) => {
        const value = formData[field];
        if (typeof value === "string" && !value.trim()) {
          isValid = false;
        }
      });
    } else if (currentStep === 3) {
      // Step 4: Lifestyle & Interests
      const requiredFields: (keyof UserFormData)[] = [
        "diet",
        "hobbies",
        "interests",
      ];
      requiredFields.forEach((field) => {
        const value = formData[field];
        if (typeof value === "string" && !value.trim()) {
          isValid = false;
        }
      });
    } else if (currentStep === 4) {
      // Step 5: Kundli Details
      const requiredFields: (keyof UserFormData)[] = [
        "birthPlace",
        "birthTime",
      ];
      requiredFields.forEach((field) => {
        const value = formData[field];
        if (typeof value === "string" && !value.trim()) {
          isValid = false;
        }
      });
    } else if (currentStep === 5) {
      // Step 6: Security
      if (!formData.password || formData.password.length < 6) {
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        isValid = false;
      }
    }

    return isValid;
  }, [formData, currentStep]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      Animated.timing(slideAnim, {
        toValue: -nextStep * screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Alert.alert(
        "Validation Error",
        "Please correct the errors and try again",
      );
    }
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    Animated.timing(slideAnim, {
      toValue: -prevStep * screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    const requiredFields: (keyof UserFormData)[] = [
      "name",
      "age",
      "location",
      "occupation",
      "bio",
      "email",
      "phone",
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        newErrors[field] =
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Age validation
    const age = parseInt(formData.age);
    if (formData.age && (isNaN(age) || age < 18 || age > 100)) {
      newErrors.age = "Please enter a valid age (18-100)";
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation for registration
    if (isRegistration) {
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert(
        "Validation Error",
        "Please correct the errors and try again",
      );
    }
  };

  const renderInput = (
    field: keyof UserFormData,
    label: string,
    placeholder: string,
    keyboardType:
      | "default"
      | "email-address"
      | "phone-pad"
      | "numeric" = "default",
    multiline = false,
    secureTextEntry = false,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError,
        ]}
        placeholder={placeholder}
        value={formData[field] as string}
        onChangeText={(value) => updateField(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ThemedView style={styles.stepContainer}>
            {onSignIn && (
              <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
                <Text style={styles.signInButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            )}
            <ThemedText style={styles.stepTitle}>
              Contact Information
            </ThemedText>

            {renderInput("name", "Full Name", "Enter your full name")}
            {renderInput("email", "Email", "your@email.com", "email-address")}
            {renderInput("phone", "Phone", "+1 (555) 123-4567", "phone-pad")}
            {renderInput("age", "Age", "Enter your age", "numeric")}
            {renderInput("location", "Location", "City, Country")}
            {renderInput("occupation", "Occupation", "Your profession")}
            {renderInput(
              "bio",
              "About Me",
              "Tell us about yourself",
              "default",
              true,
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Images</Text>
              <View style={styles.imageContainer}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {formData.images.length < 6 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={pickImage}
                  >
                    <Text style={styles.addImageText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ThemedView>
        );
      case 1:
        return (
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Personal Details</ThemedText>
            {renderInput(
              "religion",
              "Religion",
              "e.g., Hindu, Muslim, Christian",
            )}
            {renderInput("caste", "Caste/Community", "Your caste or community")}
            {renderInput("height", "Height", "e.g., 5'10\"")}
            {renderInput(
              "education",
              "Education",
              "Your highest qualification",
            )}
            {renderInput("income", "Annual Income", "Your income range")}
          </ThemedView>
        );
      case 2:
        return (
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Family Information</ThemedText>
            {renderInput("fatherName", "Father's Name", "Enter father's name")}
            {renderInput(
              "fatherOccupation",
              "Father's Occupation",
              "Father's profession",
            )}
            {renderInput("motherName", "Mother's Name", "Enter mother's name")}
            {renderInput(
              "motherOccupation",
              "Mother's Occupation",
              "Mother's profession",
            )}
            {renderInput(
              "siblings",
              "Siblings",
              "Number and details of siblings",
            )}
            {renderInput("familyType", "Family Type", "e.g., Nuclear, Joint")}
            {renderInput(
              "familyValues",
              "Family Values",
              "Describe family values",
            )}
          </ThemedView>
        );
      case 3:
        return (
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>
              Lifestyle & Interests
            </ThemedText>
            {renderInput("diet", "Diet", "e.g., Vegetarian, Non-vegetarian")}
            {renderInput("smoking", "Smoking", "Do you smoke? (Yes/No)")}
            {renderInput("drinking", "Drinking", "Do you drink? (Yes/No)")}
            {renderInput("hobbies", "Hobbies", "List your hobbies")}
            {renderInput("interests", "Interests", "List your interests")}
          </ThemedView>
        );
      case 4:
        return (
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Kundli Details</ThemedText>
            {renderInput("birthPlace", "Birth Place", "City, State, Country")}
            {renderInput("birthTime", "Birth Time", "HH:MM format")}
            {renderInput("manglik", "Manglik", "Manglik status")}
            {renderInput("rashi", "Rashi", "Your rashi")}
            {renderInput("nakshatra", "Nakshatra", "Your nakshatra")}
          </ThemedView>
        );
      case 5:
        return (
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepTitle}>Security</ThemedText>
            {renderInput(
              "password",
              "Password",
              "Create a password",
              "default",
              false,
              true,
            )}
            {renderInput(
              "confirmPassword",
              "Confirm Password",
              "Confirm your password",
              "default",
              false,
              true,
            )}
          </ThemedView>
        );
      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < totalSteps - 1 ? (
          <TouchableOpacity
            style={[styles.nextButton, !isStepValid && styles.disabledButton]}
            onPress={handleNext}
            disabled={!isStepValid}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.submitButton, !isStepValid && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!isStepValid}
          >
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedText style={styles.title}>
        {isRegistration ? "Create Account" : "Edit Profile"}
      </ThemedText>
      <View style={styles.sliderWrapper}>
        <Animated.View
          style={[
            styles.sliderContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {[0, 1, 2, 3, 4, 5].map((step) => (
            <View key={step} style={styles.stepWrapper}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
              >
                {renderStep(step)}
              </ScrollView>
            </View>
          ))}
        </Animated.View>
      </View>
      {renderNavigationButtons()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  sliderWrapper: {
    flex: 1,
  },
  sliderContainer: {
    flexDirection: "row",
    width: screenWidth * 6, // totalSteps is 6
  },
  stepWrapper: {
    width: screenWidth,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#dc3545",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addImageText: {
    fontSize: 24,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  backButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  signInButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
