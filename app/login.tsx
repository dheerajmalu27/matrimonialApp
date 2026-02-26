import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import { Link, router } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Image,
} from "react-native";

// Validation helper functions (like Shaadi.com/Tinder)
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., name@example.com)";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validateField = useCallback((field: "email" | "password", value: string): string | null => {
    if (field === "email") {
      return validateEmail(value);
    } else if (field === "password") {
      return validatePassword(value);
    }
    return null;
  }, []);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const error = validateField("email", value);
      setErrors((prev) => ({ ...prev, email: error || undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const error = validateField("password", value);
      setErrors((prev) => ({ ...prev, password: error || undefined }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : password;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return isValid;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log(email);
      const response = await apiService.login(email, password);
      console.log(response);
      if (response.success) {
        Alert.alert("Success", "Login successful!");
        router.replace("/home");
      } else {
        Alert.alert(
          "Error",
          response.message || "Login failed. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    field: "email" | "password",
    label: string,
    placeholder: string,
    keyboardType: "email-address" | "default" = "default",
    secureTextEntry: boolean = false
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
            hasError && styles.inputError,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={field === "email" ? email : password}
          onChangeText={field === "email" ? handleEmailChange : handlePasswordChange}
          onBlur={() => handleBlur(field)}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.content}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💐</Text>
          </View>
          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>Find your perfect match</ThemedText>
        </View>

        <View style={styles.form}>
          {renderInput("email", "Email Address", "your@email.com", "email-address")}
          {renderInput("password", "Password", "Enter your password", "default", true)}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/register" style={styles.link}>
            <Text style={styles.linkText}>Sign Up</Text>
          </Link>
        </View>

        {/* Decorative hearts */}
        <View style={styles.decorativeHearts}>
          <Text style={styles.heart}>❤️</Text>
          <Text style={styles.heart}>💕</Text>
          <Text style={styles.heart}>❤️</Text>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fce4ec",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#E91E63",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#E91E63",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowColor: "transparent",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#666",
    fontSize: 15,
  },
  link: {
    marginLeft: 5,
  },
  linkText: {
    color: "#E91E63",
    fontWeight: "bold",
    fontSize: 15,
  },
  // New styles for validation (like Shaadi.com/Tinder)
  inputGroup: {
    marginBottom: 5,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  requiredStar: {
    color: "#E91E63",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  inputError: {
    borderColor: "#E91E63",
    borderWidth: 2,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: "#fce4ec",
    padding: 8,
    borderRadius: 6,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  errorText: {
    color: "#c62828",
    fontSize: 13,
    flex: 1,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    color: "#E91E63",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  decorativeHearts: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  heart: {
    fontSize: 24,
    marginHorizontal: 8,
  },
});
