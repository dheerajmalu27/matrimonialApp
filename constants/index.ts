/**
 * Barrel export for constants
 * Provides clean imports throughout the application
 */

// Config exports
export { API_CONFIG, default as API_CONFIG_DEFAULT } from './config';

// Theme exports
export { Colors, Fonts } from './theme';

// Dropdown options exports
export {
  DROPDOWN_OPTIONS,
  AGE_OPTIONS,
  HEIGHT_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  INCOME_OPTIONS,
  INCOME_FILTER_OPTIONS,
  SIBLINGS_OPTIONS,
  FATHER_OCCUPATION_OPTIONS,
  MOTHER_OCCUPATION_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  DIET_OPTIONS,
  SMOKING_OPTIONS,
  DRINKING_OPTIONS,
  HOBBIES_OPTIONS,
  INTERESTS_OPTIONS,
  MANGLIK_OPTIONS,
  RASHI_OPTIONS,
  NAKSHATRA_OPTIONS,
  type DropdownOptionKey,
} from './dropdownOptions';

// Validation exports
export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateAge,
  validateName,
  validateConfirmPassword,
  validateRequired,
} from './validation';
