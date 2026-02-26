import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState, useCallback } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Platform,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Dropdown options for matrimonial app-style fields (like Shaadi.com/Tinder)
export const DROPDOWN_OPTIONS = {
  occupation: [
    "Engineer", "Doctor", "Teacher", "Software Developer", "Business Owner",
    "Manager", "Accountant", "Nurse", "Architect", "Lawyer", "Banker",
    "Chef", "Designer", "Marketing", "Sales", "HR Professional",
    "Civil Services", "Defense", "Police", "Consultant", "Writer",
    "Journalist", "Artist", "Musician", "Actor", "Sports Professional",
    "Self Employed", "Retired", "Student", "Other"
  ],
  income: [
    "No Income", "Below ₹1 Lakh", "₹1-2 Lakh", "₹2-3 Lakh", "₹3-4 Lakh",
    "₹4-5 Lakh", "₹5-7 Lakh", "₹7-10 Lakh", "₹10-15 Lakh", 
    "₹15-20 Lakh", "₹20-25 Lakh", "₹25-50 Lakh", "₹50 Lakh - 1 Crore",
    "Above 1 Crore"
  ],
  religion: [
    "Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi",
    "Jewish", "Bahai", "Other"
  ],
  caste: [
    "General", "OBC", "SC", "ST", "Vaishya", "Kshatriya", "Brahmin",
    "Rajput", "Yadav", "Gujjar", "Jat", "Maheshwari", "Oswal", 
    "Aggarwal", "Khatri", "Arora", "Sindhi", "Saraswat", "Kumaoni",
    "Garhwali", "Other"
  ],
  height: [
    "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"",
    "4'8\"", "4'9\"", "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", 
    "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", 
    "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"",
    "6'5\"", "6'6\"", "6'7\"", "6'8\""
  ],
  education: [
    "Below 10th", "10th Pass", "12th Pass", "Diploma", "ITI",
    "Bachelor's Degree", "Master's Degree", "Doctorate/PhD",
    "Professional Degree (CA/CS/CMA)", "Other"
  ],
  siblings: [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"
  ],
  fatherOccupation: [
    "Engineer", "Doctor", "Teacher", "Business Owner", "Farmer",
    "Retired Government Employee", "Private Job", "Self Employed",
    "Advocate", "Chartered Accountant", "Architect", "Manager",
    "Pilot", "Armed Forces", "Police", "Politician", "Writer",
    "Consultant", "Driver", "Worker/Laborer", "Not Employed", "Passed Away", "Other"
  ],
  motherOccupation: [
    "Housewife", "Teacher", "Doctor", "Nurse", "Business Owner",
    "Government Employee", "Private Job", "Self Employed",
    "Retired Government Employee", "Advocate", "Chartered Accountant",
    "Manager", "Artist", "Writer", "Consultant", "Driver",
    "Worker/Laborer", "Other"
  ],
  familyType: [
    "Nuclear", "Joint", "Extended Nuclear", "Other"
  ],
  diet: [
    "Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Jain", 
    "Buddhist", "Halal", "Kosher", "Other"
  ],
  smoking: [
    "No", "Yes", "Occasionally", "Trying to Quit"
  ],
  drinking: [
    "No", "Yes", "Occasionally", "Social Drinker", "Trying to Quit"
  ],
  manglik: [
    "No", "Yes", "Don't Know", "Partial"
  ],
  rashi: [
    "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)",
    "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
  ],
  nakshatra: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", 
    "Uttara Bhadrapada", "Revati"
  ],
  // Multi-select hobbies and interests (like Shaadi.com/Tinder)
  hobbies: [
    "Reading", "Writing", "Cooking", "Traveling", "Photography",
    "Music", "Dancing", "Singing", "Painting", "Gardening",
    "Fitness", "Yoga", "Running", "Cycling", "Swimming",
    "Trekking", "Gaming", "Movies", "TV Shows", "Shopping",
    "Pets", "Art & Craft", "Fashion", "Technology", "Sports",
    "Volunteering", "Investing", "Cooking", "Health & Wellness"
  ],
  interests: [
    "Technology", "Sports", "Music", "Movies", "Travel",
    "Fashion", "Cooking", "Fitness", "Reading", "Writing",
    "Photography", "Art", "Dance", "Yoga", "Meditation",
    "Nature", "Adventure", "Gaming", "Business", "Finance",
    "Politics", "Science", "History", "Spirituality", "Social Work",
    "Automobiles", "Food & Dining", "Shopping", "Health & Wellness"
  ]
};

export interface UserFormData {
  name: string;
  age: string;
  birthDate: string; // Added birth date field
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
  hobbies: string; // Changed to string (comma-separated for multi-select)
  interests: string; // Changed to string (comma-separated for multi-select)
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

// Validation helper functions
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return "Mobile number is required";
  const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) return "Please enter a valid 10-digit mobile number";
  return null;
};

const validateAge = (age: string): string | null => {
  if (!age.trim()) return "Age is required";
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return "Please enter a valid age";
  if (ageNum < 18) return "You must be at least 18 years old";
  if (ageNum > 100) return "Please enter a valid age (under 100)";
  return null;
};

const validateName = (name: string): string | null => {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only letters";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length < 8) return "Password should be at least 8 characters";
  return null;
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
};

// Single Select Dropdown Component
interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
}

function Dropdown({ label, value, options, onSelect, placeholder = "Select", error }: DropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.dropdown, error && styles.inputError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.dropdownItem, value === item && styles.dropdownItemSelected]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.dropdownItemText, value === item && styles.dropdownItemTextSelected]}>
                    {item}
                  </Text>
                  {value === item && <Text style={styles.dropdownCheck}>✓</Text>}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Multi-Select Dropdown Component (for hobbies and interests)
interface MultiSelectProps {
  label: string;
  values: string[];
  options: string[];
  onSelect: (values: string[]) => void;
  placeholder?: string;
  error?: string;
}

function MultiSelectDropdown({ label, values, options, onSelect, placeholder = "Select multiple", error }: MultiSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleToggle = (option: string) => {
    if (values.includes(option)) {
      onSelect(values.filter(v => v !== option));
    } else {
      onSelect([...values, option]);
    }
  };

  const handleDone = () => {
    setModalVisible(false);
  };

  const displayText = values.length > 0 
    ? values.length === 1 
      ? values[0] 
      : `${values.length} selected`
    : placeholder;

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.dropdown, error && styles.inputError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, values.length === 0 && styles.dropdownPlaceholder]}>
          {displayText}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {values.length > 0 && (
        <View style={styles.selectedTagsContainer}>
          {values.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.selectedTag}>
              <Text style={styles.selectedTagText}>{item}</Text>
            </View>
          ))}
          {values.length > 3 && (
            <View style={styles.selectedTag}>
              <Text style={styles.selectedTagText}>+{values.length - 3} more</Text>
            </View>
          )}
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.multiSelectInfo}>
              <Text style={styles.multiSelectCount}>{values.length} selected</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = values.includes(item);
                return (
                  <TouchableOpacity 
                    style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                    onPress={() => handleToggle(item)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextSelected]}>
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Date Picker Component (for birth date)
interface DatePickerProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
}

function DatePicker({ label, value, onSelect, placeholder = "Select date", error }: DatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value ? parseInt(value.split('/')[0]) : 2000);
  const [selectedMonth, setSelectedMonth] = useState(value ? parseInt(value.split('/')[1]) : 1);
  const [selectedDay, setSelectedDay] = useState(value ? parseInt(value.split('/')[2]) : 1);

  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDone = () => {
    const formattedDate = `${selectedYear}/${selectedMonth.toString().padStart(2, '0')}/${selectedDay.toString().padStart(2, '0')}`;
    onSelect(formattedDate);
    setModalVisible(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(parts[1]) - 1]} ${parts[2]}, ${parts[0]}`;
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.dropdown, error && styles.inputError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>📅</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Year</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity 
                      key={year}
                      style={[styles.datePickerItem, selectedYear === year && styles.datePickerItemSelected]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[styles.datePickerText, selectedYear === year && styles.datePickerTextSelected]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Month</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity 
                      key={month}
                      style={[styles.datePickerItem, selectedMonth === index + 1 && styles.datePickerItemSelected]}
                      onPress={() => setSelectedMonth(index + 1)}
                    >
                      <Text style={[styles.datePickerText, selectedMonth === index + 1 && styles.datePickerTextSelected]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Day</Text>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {days.map((day) => (
                    <TouchableOpacity 
                      key={day}
                      style={[styles.datePickerItem, selectedDay === day && styles.datePickerItemSelected]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[styles.datePickerText, selectedDay === day && styles.datePickerTextSelected]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Confirm Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
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
    birthDate: initialData.birthDate || "",
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
    fatherName: initialData.fatherName || "",
    fatherOccupation: initialData.fatherOccupation || "",
    motherName: initialData.motherName || "",
    motherOccupation: initialData.motherOccupation || "",
    siblings: initialData.siblings || "",
    familyType: initialData.familyType || "",
    familyValues: initialData.familyValues || "",
    diet: initialData.diet || "",
    smoking: initialData.smoking || "",
    drinking: initialData.drinking || "",
    hobbies: initialData.hobbies || "",
    interests: initialData.interests || "",
    birthPlace: initialData.birthPlace || "",
    birthTime: initialData.birthTime || "",
    manglik: initialData.manglik || "",
    rashi: initialData.rashi || "",
    nakshatra: initialData.nakshatra || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const totalSteps = 6;

  const validateField = useCallback((field: keyof UserFormData, value: string): string | null => {
    switch (field) {
      case "name": return validateName(value);
      case "email": return validateEmail(value);
      case "phone": return validatePhone(value);
      case "age": return validateAge(value);
      case "birthDate": return validateRequired(value, "Birth date");
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(formData.password || "", value);
      case "location": return validateRequired(value, "Location");
      case "occupation": return validateRequired(value, "Occupation");
      case "bio": return validateRequired(value, "About me");
      case "religion": return validateRequired(value, "Religion");
      case "caste": return validateRequired(value, "Caste");
      case "height": return validateRequired(value, "Height");
      case "education": return validateRequired(value, "Education");
      case "income": return validateRequired(value, "Income");
      case "fatherName": return validateRequired(value, "Father's name");
      case "motherName": return validateRequired(value, "Mother's name");
      case "siblings": return validateRequired(value, "Siblings");
      case "diet": return validateRequired(value, "Diet");
      case "hobbies": return validateRequired(value, "Hobbies");
      case "interests": return validateRequired(value, "Interests");
      case "birthPlace": return validateRequired(value, "Birth place");
      default: return null;
    }
  }, [formData.password]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant permission to access your photos.");
      return;
    }

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
    
    if (typeof value === "string") {
      const error = validateField(field, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) newErrors[field] = error;
        else delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 0) {
      const fieldsToValidate: (keyof UserFormData)[] = [
        "name", "email", "phone", "birthDate", "age", "location", "occupation", "bio"
      ];
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, formData[field] as string);
        if (error) { newErrors[field] = error; isValid = false; }
      });
    } else if (step === 1) {
      const fieldsToValidate: (keyof UserFormData)[] = [
        "religion", "caste", "height", "education", "income"
      ];
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, formData[field] as string);
        if (error) { newErrors[field] = error; isValid = false; }
      });
    } else if (step === 2) {
      const fieldsToValidate: (keyof UserFormData)[] = [
        "fatherName", "motherName", "siblings"
      ];
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, formData[field] as string);
        if (error) { newErrors[field] = error; isValid = false; }
      });
    } else if (step === 3) {
      const fieldsToValidate: (keyof UserFormData)[] = [
        "diet", "hobbies", "interests"
      ];
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, formData[field] as string);
        if (error) { newErrors[field] = error; isValid = false; }
      });
    } else if (step === 5 && isRegistration) {
      const passwordError = validatePassword(formData.password || "");
      if (passwordError) { newErrors.password = passwordError; isValid = false; }
      const confirmError = validateConfirmPassword(formData.password || "", formData.confirmPassword || "");
      if (confirmError) { newErrors.confirmPassword = confirmError; isValid = false; }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    Keyboard.dismiss();
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      Animated.timing(slideAnim, {
        toValue: -nextStep * screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      });
    } else {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
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
    let isValid = true;

    const fieldsToValidate: (keyof UserFormData)[] = isRegistration
      ? ["name", "email", "phone", "birthDate", "age", "location", "occupation", "bio", 
          "religion", "caste", "height", "education", "income", "password", "confirmPassword"]
      : ["name", "email", "phone", "birthDate", "age", "location", "occupation", "bio"];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field] as string);
      if (error) { newErrors[field] = error; isValid = false; }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
    }
  };

  const renderInput = (
    field: keyof UserFormData,
    label: string,
    placeholder: string,
    keyboardType: "default" | "email-address" | "phone-pad" | "numeric" = "default",
    multiline = false,
    secureTextEntry = false,
  ) => {
    const hasError = !!errors[field];
    
    return (
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.requiredStar}>*</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            hasError && styles.inputError,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={formData[field] as string}
          onChangeText={(value) => updateField(field, value)}
          keyboardType={keyboardType}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          numberOfLines={multiline ? 3 : 1}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDropdown = (field: keyof UserFormData, label: string, options: string[]) => {
    return (
      <Dropdown
        label={label}
        value={formData[field] as string}
        options={options}
        onSelect={(value) => updateField(field, value)}
        placeholder={`Select ${label}`}
        error={errors[field]}
      />
    );
  };

  const renderMultiSelect = (field: "hobbies" | "interests", label: string, options: string[]) => {
    const currentValues = formData[field] ? (formData[field] as string).split(',').filter(v => v) : [];
    return (
      <MultiSelectDropdown
        label={label}
        values={currentValues}
        options={options}
        onSelect={(values) => updateField(field, values.join(','))}
        placeholder={`Select ${label}`}
        error={errors[field]}
      />
    );
  };

  const renderDatePicker = (field: "birthDate", label: string) => {
    return (
      <DatePicker
        label={label}
        value={formData[field] as string}
        onSelect={(value) => {
          updateField(field, value);
          // Calculate age from birth date
          const parts = value.split('/');
          if (parts.length === 3) {
            const birthYear = parseInt(parts[0]);
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            if (age >= 18 && age <= 100) {
              updateField("age", age.toString());
            }
          }
        }}
        placeholder="Select your birth date"
        error={errors[field]}
      />
    );
  };

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            {onSignIn && (
              <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
                <Text style={styles.signInButtonText}>Already have an account? Sign In</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.stepTitle}>📱 Contact Information</Text>
            <Text style={styles.stepSubtitle}>Let others know how to reach you</Text>

            {renderInput("name", "Full Name", "Enter your full name")}
            {renderInput("email", "Email Address", "your@email.com", "email-address")}
            {renderInput("phone", "Mobile Number", "Enter 10-digit mobile number", "phone-pad")}
            {renderDatePicker("birthDate", "Birth Date")}
            {renderInput("age", "Age", "Enter your age (18+)", "numeric")}
            {renderInput("location", "Location", "City, State, Country")}
            {renderDropdown("occupation", "Occupation", DROPDOWN_OPTIONS.occupation)}
            {renderInput("bio", "About Me", "Tell others about yourself...", "default", true)}

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Profile Photo</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <View style={styles.imageContainer}>
                {formData.images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {formData.images.length < 6 && (
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    <Text style={styles.addImageText}>+</Text>
                    <Text style={styles.addImageLabel}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
              {formData.images.length === 0 && (
                <Text style={styles.imageHint}>Add at least one photo to get more responses</Text>
              )}
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>👤 Personal Details</Text>
            <Text style={styles.stepSubtitle}>Help others know more about you</Text>

            {renderDropdown("religion", "Religion", DROPDOWN_OPTIONS.religion)}
            {renderDropdown("caste", "Caste/Community", DROPDOWN_OPTIONS.caste)}
            {renderDropdown("height", "Height", DROPDOWN_OPTIONS.height)}
            {renderDropdown("education", "Education", DROPDOWN_OPTIONS.education)}
            {renderDropdown("income", "Annual Income", DROPDOWN_OPTIONS.income)}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>👨‍👩‍👧 Family Information</Text>
            <Text style={styles.stepSubtitle}>Tell us about your family</Text>

            {renderInput("fatherName", "Father's Name", "Enter father's full name")}
            {renderDropdown("fatherOccupation", "Father's Occupation", DROPDOWN_OPTIONS.fatherOccupation)}
            {renderInput("motherName", "Mother's Name", "Enter mother's full name")}
            {renderDropdown("motherOccupation", "Mother's Occupation", DROPDOWN_OPTIONS.motherOccupation)}
            {renderDropdown("siblings", "Number of Siblings", DROPDOWN_OPTIONS.siblings)}
            {renderDropdown("familyType", "Family Type", DROPDOWN_OPTIONS.familyType)}
            {renderInput("familyValues", "Family Values", "e.g., Traditional, Liberal")}
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>🎯 Lifestyle & Interests</Text>
            <Text style={styles.stepSubtitle}>Share your lifestyle preferences</Text>

            {renderDropdown("diet", "Diet", DROPDOWN_OPTIONS.diet)}
            {renderDropdown("smoking", "Smoking", DROPDOWN_OPTIONS.smoking)}
            {renderDropdown("drinking", "Drinking", DROPDOWN_OPTIONS.drinking)}
            {renderMultiSelect("hobbies", "Hobbies", DROPDOWN_OPTIONS.hobbies)}
            {renderMultiSelect("interests", "Interests", DROPDOWN_OPTIONS.interests)}
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>🔮 Kundli Details</Text>
            <Text style={styles.stepSubtitle}>Birth details for compatibility (Optional)</Text>

            {renderInput("birthPlace", "Birth Place", "City, State, Country")}
            {renderInput("birthTime", "Birth Time", "e.g., 10:30 AM")}
            {renderDropdown("manglik", "Manglik Status", DROPDOWN_OPTIONS.manglik)}
            {renderDropdown("rashi", "Rashi (Moon Sign)", DROPDOWN_OPTIONS.rashi)}
            {renderDropdown("nakshatra", "Nakshatra", DROPDOWN_OPTIONS.nakshatra)}
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>🔐 Security</Text>
            <Text style={styles.stepSubtitle}>Create a secure password</Text>

            {renderInput("password", "Password", "Create a strong password", "default", false, true)}
            {renderInput("confirmPassword", "Confirm Password", "Re-enter your password", "default", false, true)}
            
            <View style={styles.passwordHint}>
              <Text style={styles.passwordHintTitle}>Password Tips:</Text>
              <Text style={styles.passwordHintText}>• At least 8 characters</Text>
              <Text style={styles.passwordHintText}>• Include uppercase & lowercase letters</Text>
              <Text style={styles.passwordHintText}>• Include numbers and symbols</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderStepIndicators = () => {
    const steps = [
      { num: 1, title: "Contact" },
      { num: 2, title: "Personal" },
      { num: 3, title: "Family" },
      { num: 4, title: "Lifestyle" },
      { num: 5, title: "Kundli" },
      { num: 6, title: "Security" },
    ];

    return (
      <View style={styles.stepIndicators}>
        {steps.map((step, index) => (
          <View key={step.num} style={styles.stepIndicatorItem}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= index && styles.stepCircleActive,
                currentStep === index && styles.stepCircleCurrent,
              ]}
            >
              <Text style={[styles.stepNumber, currentStep >= index && styles.stepNumberActive]}>
                {currentStep > index ? "✓" : step.num}
              </Text>
            </View>
            <Text style={[styles.stepTitleText, currentStep >= index && styles.stepTitleActive]}>
              {step.title}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderNavigationButtons = () => {
    return (
      <View style={styles.buttonContainer}>
        {currentStep > 0 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton} />
        )}
        
        {currentStep < totalSteps - 1 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {renderStepIndicators()}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[styles.sliderContainer, { transform: [{ translateX: slideAnim }] }]}
        >
          {[0, 1, 2, 3, 4, 5].map((step) => (
            <View key={step} style={styles.stepWrapper}>
              {renderStep(step)}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
      {renderNavigationButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  sliderContainer: { flexDirection: "row" },
  stepWrapper: { width: screenWidth },
  stepContainer: { padding: 20 },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  stepIndicatorItem: { alignItems: "center" },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: "#FF6B6B" },
  stepCircleCurrent: { backgroundColor: "#FF6B6B", borderWidth: 3, borderColor: "#ffcccc" },
  stepNumber: { fontSize: 12, fontWeight: "bold", color: "#999" },
  stepNumberActive: { color: "#fff" },
  stepTitleText: { fontSize: 10, color: "#999" },
  stepTitleActive: { color: "#FF6B6B", fontWeight: "600" },
  stepTitle: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 5, textAlign: "center" },
  stepSubtitle: { fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center" },
  inputGroup: { marginBottom: 18 },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 15, fontWeight: "600", color: "#333" },
  requiredStar: { color: "#FF6B6B", fontSize: 16, fontWeight: "bold", marginLeft: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  multilineInput: { height: 100, textAlignVertical: "top" },
  inputError: { borderColor: "#FF6B6B", borderWidth: 2 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "#fff5f5",
    padding: 8,
    borderRadius: 6,
  },
  errorIcon: { fontSize: 14, marginRight: 6 },
  errorText: { color: "#dc3545", fontSize: 13, flex: 1 },
  
  // Dropdown styles
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fff",
  },
  dropdownText: { fontSize: 16, color: "#333", flex: 1 },
  dropdownPlaceholder: { color: "#999" },
  dropdownArrow: { fontSize: 12, color: "#666", marginLeft: 10 },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  modalClose: { fontSize: 20, color: "#666", padding: 5 },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemSelected: { backgroundColor: "#fff5f5" },
  dropdownItemText: { fontSize: 16, color: "#333" },
  dropdownItemTextSelected: { color: "#FF6B6B", fontWeight: "600" },
  dropdownCheck: { fontSize: 16, color: "#FF6B6B", fontWeight: "bold" },

  // Multi-select styles
  multiSelectInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  multiSelectCount: { fontSize: 14, color: "#666" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  selectedTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  selectedTag: {
    backgroundColor: "#FF6B6B",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: { color: "#fff", fontSize: 12 },
  doneButton: {
    backgroundColor: "#FF6B6B",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  doneButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Date picker styles
  datePickerContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 250,
  },
  datePickerColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  datePickerScroll: {
    flex: 1,
  },
  datePickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  datePickerItemSelected: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  datePickerText: { fontSize: 14, color: "#333" },
  datePickerTextSelected: { color: "#fff", fontWeight: "bold" },

  // Image styles
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  imageWrapper: { position: "relative", marginRight: 10, marginBottom: 10 },
  imagePreview: { width: 80, height: 80, borderRadius: 10 },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addImageText: { fontSize: 24, color: "#666" },
  addImageLabel: { fontSize: 10, color: "#666", marginTop: 2 },
  imageHint: { fontSize: 12, color: "#FF6B6B", marginTop: 8, fontStyle: "italic" },

  // Button styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  placeholderButton: { width: 80 },
  backButton: { backgroundColor: "#6c757d", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10 },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  nextButton: { backgroundColor: "#FF6B6B", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10 },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  submitButton: { backgroundColor: "#28a745", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  signInButton: { alignSelf: "center", marginBottom: 20 },
  signInButtonText: { color: "#FF6B6B", fontSize: 15, fontWeight: "600", textDecorationLine: "underline" },
  passwordHint: { backgroundColor: "#f0f8ff", padding: 15, borderRadius: 10, marginTop: 10 },
  passwordHintTitle: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  passwordHintText: { fontSize: 12, color: "#666", marginBottom: 4 },
});
