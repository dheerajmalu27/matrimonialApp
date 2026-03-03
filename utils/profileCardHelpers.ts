import type {
  MatchDetail,
  PartnerPreferences,
  Profile,
  RequestStatus,
} from "@/types/profileCard";

/**
 * Default partner preference values used when user preferences are missing.
 */
export const DEFAULT_PARTNER_PREFERENCES: PartnerPreferences = {
  minAge: 25,
  maxAge: 35,
  minHeightCm: 150,
  maxHeightCm: 180,
  religion: "",
  caste: "",
  education: "",
  occupation: "",
  location: "",
  incomeRange: "",
  motherTongue: "",
  kundliMatchRequired: false,
  manglikPreference: "both",
};

/**
 * Converts backend interest metadata into card request status.
 */
export const getInitialRequestStatus = (profile: Profile): RequestStatus => {
  if (profile.interestStatus === "sent" || profile.interestStatus === "pending") {
    return profile.interestIsSender ? "sent" : "received";
  }

  if (profile.interestStatus === "accepted") return "accepted";
  if (profile.interestStatus === "declined") return "declined";

  return profile.requestStatus || "none";
};

/**
 * Checks whether a value exists in comma-separated preference text.
 */
export const isValueInPreference = (value: string, preference: string): boolean => {
  if (!value || !preference) return false;
  const preferenceArray = preference.split(",").map((item) => item.trim().toLowerCase());
  return preferenceArray.some((item) => value.toLowerCase().includes(item));
};

/**
 * Converts height in centimeters to feet/inches format.
 */
export const convertCmToFeet = (height: number): string => {
  if (!height || height <= 0) return "";

  const totalInches = height / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return `${feet}' ${inches}"`;
};

/**
 * Calculates weighted compatibility details for the match breakdown modal.
 */
export const calculateMatchDetails = (
  profile: Profile,
  preferences: PartnerPreferences,
): MatchDetail[] => {
  const details: MatchDetail[] = [];

  const ageMatch = profile.age >= preferences.minAge && profile.age <= preferences.maxAge;
  details.push({
    criteria: "Age",
    icon: "🎂",
    points: 25,
    matched: ageMatch,
    yourPreference: `${preferences.minAge} - ${preferences.maxAge} years`,
    theirValue: `${profile.age} years`,
  });

  const heightMatch = profile.height
    ? profile.height >= preferences.minHeightCm && profile.height <= preferences.maxHeightCm
    : false;
  details.push({
    criteria: "Height",
    icon: "📏",
    points: 15,
    matched: heightMatch,
    yourPreference: `${preferences.minHeightCm} - ${preferences.maxHeightCm} cm`,
    theirValue: profile.height ? `${profile.height} cm` : "N/A",
  });

  const religionMatch = isValueInPreference(profile.religion || "", preferences.religion);
  const casteMatch = isValueInPreference(profile.caste || "", preferences.caste);
  details.push({
    criteria: "Religion & Caste",
    icon: "🛕",
    points: 20,
    matched: religionMatch && casteMatch,
    yourPreference: preferences.religion || "Any",
    theirValue: `${profile.religion || "N/A"}, ${profile.caste || "N/A"}`,
  });

  const educationMatch = isValueInPreference(profile.education || "", preferences.education);
  details.push({
    criteria: "Education",
    icon: "🎓",
    points: 15,
    matched: educationMatch,
    yourPreference: preferences.education || "Any",
    theirValue: profile.education || "N/A",
  });

  const occupationMatch = isValueInPreference(profile.occupation || "", preferences.occupation);
  details.push({
    criteria: "Occupation",
    icon: "💼",
    points: 10,
    matched: occupationMatch,
    yourPreference: preferences.occupation || "Any",
    theirValue: profile.occupation || "N/A",
  });

  const locationMatch = isValueInPreference(profile.location || "", preferences.location);
  details.push({
    criteria: "Location",
    icon: "📍",
    points: 10,
    matched: locationMatch,
    yourPreference: preferences.location || "Any",
    theirValue: profile.location || "Not specified",
  });

  const incomeMatch = isValueInPreference(profile.income || "", preferences.incomeRange);
  details.push({
    criteria: "Income Range",
    icon: "💰",
    points: 5,
    matched: incomeMatch,
    yourPreference: preferences.incomeRange || "Any",
    theirValue: profile.income || "N/A",
  });

  const motherTongueMatch = isValueInPreference(
    profile.motherTongue || "",
    preferences.motherTongue,
  );
  details.push({
    criteria: "Mother Tongue",
    icon: "🗣",
    points: 5,
    matched: motherTongueMatch,
    yourPreference: preferences.motherTongue || "Any",
    theirValue: profile.motherTongue || "N/A",
  });

  details.push({
    criteria: "Kundli Matching",
    icon: "🔮",
    points: 10,
    matched: preferences.kundliMatchRequired,
    yourPreference: preferences.kundliMatchRequired
      ? `Manglik: ${preferences.manglikPreference}`
      : "Not required",
    theirValue: "Kundli match",
  });

  return details;
};
