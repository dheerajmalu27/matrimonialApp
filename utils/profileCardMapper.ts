/**
 * Maps backend match/user records into a normalized shape expected by `ProfileCard`.
 * Keeps list screens thin and avoids repeating transformation logic.
 */
export interface ProfileCardItem {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  images: string[];
  image: string;
  bio: string;
  height?: number;
  religion?: string;
  caste?: string;
  isVerified?: boolean;
  compatibility?: number;
  motherTongue?: string;
  interestStatus?: string | null;
  interestIsSender?: boolean | null;
  interestId?: string | null;
}

const normalizeLocation = (match: any): string => {
  const directLocation = String(
    match?.location
      || match?.profile?.location
      || match?.personal?.location
      || "",
  ).trim();

  if (directLocation) return directLocation;

  const city = String(match?.city || match?.profile?.city || match?.personal?.city || "").trim();
  const state = String(match?.state || match?.profile?.state || match?.personal?.state || "").trim();
  const cityState = `${city}${city && state ? ", " : ""}${state}`.trim();

  if (cityState) return cityState;

  const firstAddress = Array.isArray(match?.addresses) ? match.addresses[0] : null;
  const addressCity = String(firstAddress?.city || "").trim();
  const addressState = String(firstAddress?.state || "").trim();
  const addressLocation = `${addressCity}${addressCity && addressState ? ", " : ""}${addressState}`.trim();

  return addressLocation || "Location not specified";
};

/**
 * Converts one API match object into a `ProfileCardItem`.
 */
export const mapMatchToProfileCard = (match: any): ProfileCardItem => ({
  id: String(match?.id ?? ""),
  name: match?.name ?? "Unknown",
  age: Number(match?.age ?? 0),
  location: normalizeLocation(match),
  occupation: match?.occupation || "Occupation not specified",
  images: match?.profileImages || (match?.profileImage ? [match.profileImage] : []),
  image:
    match?.profileImages && match.profileImages.length > 0
      ? match.profileImages[0]
      : match?.profileImage || "https://via.placeholder.com/150",
  bio: match?.bio || "",
  height: match?.height != null ? Number(match.height) : undefined,
  religion: match?.religion,
  caste: match?.caste,
  isVerified: Boolean(match?.isVerified),
  compatibility: Number(match?.compatibilityScore ?? 0),
  motherTongue: match?.motherTongue,
  interestStatus: match?.interestStatus ?? null,
  interestIsSender: match?.interestIsSender ?? null,
  interestId: match?.interestId ? String(match.interestId) : null,
});

// TODO: Introduce stricter shared DTO types for backend responses to eliminate `any` usage.
