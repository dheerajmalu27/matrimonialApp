/**
 * Validation helper functions
 * Consolidated validation logic for reuse across the application
 */

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., name@example.com)";
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

// Phone validation (Indian format)
export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return "Mobile number is required";
  const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) return "Please enter a valid 10-digit mobile number";
  return null;
};

// Age validation
export const validateAge = (age: string): string | null => {
  if (!age.trim()) return "Age is required";
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return "Please enter a valid age";
  if (ageNum < 18) return "You must be at least 18 years old";
  if (ageNum > 100) return "Please enter a valid age (under 100)";
  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only letters";
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
};
