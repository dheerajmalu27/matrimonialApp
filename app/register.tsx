import { apiService } from "@/services/api";
import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import { UserForm, UserFormData } from "../components/UserForm";

export default function RegisterScreen() {
  const handleSubmit = async (data: UserFormData) => {
    try {
      // Ensure password fields are provided for registration
      if (!data.password || !data.confirmPassword) {
        Alert.alert("Error", "Password is required for registration.");
        return;
      }

      const registerData = {
        name: data.name,
        age: data.age,
        location: data.location,
        occupation: data.occupation,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
        religion: data.religion,
        caste: data.caste,
        height: data.height,
        education: data.education,
        income: data.income,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await apiService.register(registerData);

      if (response.success) {
        Alert.alert("Success", "Registration successful! Please login.");
        router.push("/login");
      } else {
        Alert.alert(
          "Error",
          response.message || "Registration failed. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <UserForm
      onSubmit={handleSubmit}
      submitButtonText="Register"
      isRegistration={true}
      onSignIn={handleSignIn}
    />
  );
}
