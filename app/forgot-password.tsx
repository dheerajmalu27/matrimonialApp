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
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Validation helper function
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., name@example.com)";
  return null;
};

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateField = useCallback((field: string, value: string): string | null => {
    if (field === "email") {
      return validateEmail(value);
    } else if (field === "otp") {
      if (!value.trim()) return "OTP is required";
      if (value.length !== 6) return "Please enter a valid 6-digit OTP";
      return null;
    } else if (field === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      return null;
    } else if (field === "confirmPassword") {
      if (!value) return "Please confirm your password";
      if (value !== newPassword) return "Passwords do not match";
      return null;
    }
    return null;
  }, [newPassword]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) {
      const error = validateField("email", value);
      setEmailError(error);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const error = validateField("email", email);
    setEmailError(error);
  };

  const handleOtpChange = (value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    setOtp(numericValue);
    if (otpError) {
      const error = validateField("otp", numericValue);
      setOtpError(error);
    }
  };

  const handleOtpBlur = () => {
    const error = validateField("otp", otp);
    setOtpError(error);
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (passwordError) {
      const error = validateField("password", value);
      setPasswordError(error);
    }
  };

  const handlePasswordBlur = () => {
    const error = validateField("password", newPassword);
    setPasswordError(error);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordError) {
      const error = validateField("confirmPassword", value);
      setConfirmPasswordError(error);
    }
  };

  const handleConfirmPasswordBlur = () => {
    const error = validateField("confirmPassword", confirmPassword);
    setConfirmPasswordError(error);
  };

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    
    // Validate email first
    const emailValidationError = validateField("email", email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setEmailTouched(true);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.forgotPassword(email);
      
      if (response.success) {
        setOtpSent(true);
        Alert.alert("Success", "OTP has been sent to your email address.");
      } else {
        Alert.alert("Error", response.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    
    // Validate all fields
    let hasError = false;

    const otpValidationError = validateField("otp", otp);
    if (otpValidationError) {
      setOtpError(otpValidationError);
      hasError = true;
    }

    const passwordValidationError = validateField("password", newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      hasError = true;
    }

    const confirmPasswordValidationError = validateField("confirmPassword", confirmPassword);
    if (confirmPasswordValidationError) {
      setConfirmPasswordError(confirmPasswordValidationError);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await apiService.resetPassword(email, otp, newPassword);
      
      if (response.success) {
        Alert.alert("Success", "Password has been reset successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderEmailInput = () => (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="your@email.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={handleEmailChange}
        onBlur={handleEmailBlur}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {emailError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{emailError}</Text>
        </View>
      )}
    </View>
  );

  const renderOtpInput = () => (
    <View style={styles.inputGroup}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Enter OTP</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      <TextInput
        style={[styles.input, otpError && styles.inputError]}
        placeholder="6-digit OTP"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={handleOtpChange}
        onBlur={handleOtpBlur}
        keyboardType="number-pad"
        maxLength={6}
        autoCapitalize="none"
      />
      {otpError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{otpError}</Text>
        </View>
      )}
    </View>
  );

  const renderPasswordInputs = () => (
    <>
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>New Password</Text>
          <Text style={styles.requiredStar}>*</Text>
        </View>
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Create a new password"
          placeholderTextColor="#999"
          value={newPassword}
          onChangeText={handlePasswordChange}
          onBlur={handlePasswordBlur}
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Confirm Password</Text>
          <Text style={styles.requiredStar}>*</Text>
        </View>
        <TextInput
          style={[styles.input, confirmPasswordError && styles.inputError]}
          placeholder="Re-enter your password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          onBlur={handleConfirmPasswordBlur}
          secureTextEntry
          autoCapitalize="none"
        />
        {confirmPasswordError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={[styles.content, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Logo/Title */}
        <View style={styles.titleContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🔐</Text>
          </View>
          <ThemedText style={styles.title}>Forgot Password?</ThemedText>
          <ThemedText style={styles.subtitle}>
            {otpSent 
              ? "Enter the OTP and create a new password" 
              : "Enter your email to receive OTP"}
          </ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {!otpSent ? (
            <>
              {renderEmailInput()}
              
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.emailDisplay}>
                <Text style={styles.emailDisplayText}>
                  📧 {email}
                </Text>
                <TouchableOpacity onPress={() => setOtpSent(false)}>
                  <Text style={styles.changeEmailText}>Change</Text>
                </TouchableOpacity>
              </View>

              {renderOtpInput()}
              {renderPasswordInputs()}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Back to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Link href="/login" style={styles.link}>
            <Text style={styles.linkText}>Login</Text>
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
    paddingHorizontal: 25,
  },
  header: {
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: "#E91E63",
    fontWeight: "bold",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#E91E63",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
    paddingHorizontal: 20,
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
  emailDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fce4ec",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  emailDisplayText: {
    fontSize: 14,
    color: "#333",
  },
  changeEmailText: {
    color: "#E91E63",
    fontWeight: "600",
    fontSize: 14,
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
