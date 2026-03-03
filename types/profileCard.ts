export type RequestStatus =
  | "none"
  | "sent"
  | "received"
  | "accepted"
  | "declined";

export interface MatchDetail {
  criteria: string;
  icon: string;
  points: number;
  matched: boolean;
  yourPreference: string;
  theirValue: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  location: string;
  occupation: string;
  image: string;
  bio: string;
  height?: number;
  religion?: string;
  caste?: string;
  isVerified?: boolean;
  compatibility?: number;
  isPremium?: boolean;
  isOnline?: boolean;
  education?: string;
  income?: string;
  images?: string[];
  motherTongue?: string;
  distance?: string;
  mutualInterests?: number[];
  profileViews?: number;
  familyType?: string;
  profileCompletePercentage?: number;
  interestStatus?: string | null;
  interestIsSender?: boolean | null;
  interestId?: string | null;
  requestStatus?: RequestStatus;
}

export interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  compact?: boolean;
}

export interface PremiumPlanInfo {
  displayName: string;
  amountInr: number;
  features: {
    unlimitedInterests: boolean;
    verifiedBadge: boolean;
    advancedSearch: boolean;
    basicMessaging: boolean;
  };
}

export interface PartnerPreferences {
  minAge: number;
  maxAge: number;
  minHeightCm: number;
  maxHeightCm: number;
  religion: string;
  caste: string;
  education: string;
  occupation: string;
  location: string;
  incomeRange: string;
  motherTongue: string;
  kundliMatchRequired: boolean;
  manglikPreference: string;
}
