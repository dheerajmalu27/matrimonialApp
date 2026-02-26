# Matrimonial App API Documentation

## Overview
This document outlines all the APIs used in the matrimonial application, their usage locations, and recommendations for additional data needed to replace dummy/static data with dynamic content.

**Base URL:** `http://192.168.1.12:3000/api/v1`

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User Profile APIs](#user-profile-apis)
3. [Matching APIs](#matching-apis)
4. [Messaging APIs](#messaging-apis)
5. [Connection Request APIs](#connection-request-apis)
6. [Settings APIs](#settings-apis)
7. [Master Data APIs](#master-data-apis)
8. [Additional Data Recommendations](#additional-data-recommendations)

---

## Authentication APIs

### 1. POST /auth/register
**Used In:** `app/register.tsx`
- User registration with comprehensive profile data

**Request Body:**
```
typescript
{
  name: string;
  age: string;
  location: string;
  occupation: string;
  bio: string;
  email: string;
  phone: string;
  religion: string;
  caste: string;
  height: string;
  education: string;
  income: string;
  password: string;
  confirmPassword: string;
}
```

**Current Response (RegisterResponse):**
```
typescript
{
  userId: string;
  email: string;
  name: string;
}
```

**Additional Data Needed:**
- Profile completion percentage
- Verification status
- Welcome message with next steps

---

### 2. POST /auth/login
**Used In:** `app/login.tsx`
- User login with email and password

**Request Body:**
```
typescript
{
  email: string;
  password: string;
}
```

**Current Response (LoginResponse):**
```
typescript
{
  userId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

**Additional Data Needed:**
- User profile image
- Profile completion status
- Last login timestamp
- Notification count

---

### 3. POST /auth/logout
**Used In:** `app/profile.tsx`, `app/(tabs)/_layout.tsx`, `app/settings.tsx`
- Logout user and clear session

**Additional Data Needed:**
- Device token removal
- Session cleanup confirmation

---

### 4. POST /auth/forgot-password
**Used In:** `app/forgot-password.tsx`
- Request password reset OTP

**Request Body:**
```
typescript
{
  email: string;
}
```

**Additional Data Needed:**
- OTP expiration time
- Resend OTP cooldown period

---

### 5. POST /auth/reset-password
**Used In:** `app/forgot-password.tsx`
- Reset password with OTP

**Request Body:**
```
typescript
{
  email: string;
  otp: string;
  newPassword: string;
}
```

**Additional Data Needed:**
- Password reset confirmation details
- Security notification email

---

### 6. POST /auth/refresh
**Used In:** `services/api.ts` (internal)
- Refresh access token

**Request Body:**
```
typescript
{
  refreshToken: string;
}
```

---

## User Profile APIs

### 1. GET /users/me/profile
**Used In:** 
- `app/profile.tsx`
- `app/(tabs)/_layout.tsx` (drawer profile)

**Response (UserProfile):**
```
typescript
{
  id: string;
  name: string;
  age: number;
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
  isOnline: boolean;
  lastActive: string;
  isVerified: boolean;
}
```

**Current Backend Structure (More Detailed):**
```
typescript
{
  id: string;
  email: string;
  mobile: string;
  gender: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  personal: {
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    age: number;
    birthTime: string;
    height: string;
    heightCm: number;
    weight: string;
    weightKg: string;
    maritalStatus: string;
    motherTongue: string;
    aboutMe: string;
    profileImage: string | null;
  };
  religion: {
    religion: string;
    caste: string;
    subCaste: string;
    gotra: string;
    manglik: string | null;
  };
  professional: {
    occupation: string;
    annualIncome: string;
    workLocation: string;
    employer: string;
  };
  education: Array<{
    degree: string;
    college: string;
    university: string;
    yearOfPassing: number;
    highest: boolean;
  }>;
  addresses: Array<{
    type: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  }>;
  family: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    siblings: string;
    familyType: string;
    familyValues: string;
    familyStatus: string;
  };
  lifestyle: {
    diet: string;
    smoking: boolean | null;
    drinking: boolean | null;
    hobbies: string[];
    interests: string[];
  };
  kundli: {
    birthPlace: string;
    birthTime: string;
    manglik: string;
    gotra: string;
    rashi: string;
    nakshatra: string;
    charan: string;
    gan: string;
    nadi: string;
  };
  partnerPreferences: any;
}
```

**Additional Data Needed:**
- Profile view count
- Profile likes count
- Member since date
- Last profile update timestamp
- Premium membership status
- Interest received count

---

### 2. PUT /users/me/profile
**Used In:** `app/profile.tsx`
- Update user profile

**Additional Data Needed:**
- Partial update support
- Bulk update support
- Profile update confirmation with changed fields

---

### 3. GET /users/profile/:userId
**Used In:** `app/profile/[id].tsx`
- Get another user's profile

**Additional Data Needed:**
- Connection status with current user
- Whether user has viewed current user's profile
- Interest sent/received status

---

### 4. GET /users/me/same-city
**Used In:** `app/(tabs)/my-city.tsx`
- Get users from the same city

**Request Parameters:**
```
typescript
{
  limit: number;
  offset: number;
}
```

**Additional Data Needed:**
- User's current city detection
- Distance calculation
- City-wise filtering

---

### 5. GET /users/settings
**Used In:** `app/settings.tsx`
- Get user settings

**Response (UserSettings):**
```
typescript
{
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastActive: boolean;
    showProfileTo: string;
  };
  matchingPreferences: {
    ageRange: { min: number; max: number; };
    locationRadius: number;
    religion: string[];
    caste: string[];
    education: string[];
    incomeRange: { min: number; max: number; };
  };
  account: {
    language: string;
    timezone: string;
  };
}
```

**Additional Data Needed:**
- Setting change history
- Default settings

---

### 6. PUT /users/settings
**Used In:** `app/settings.tsx`
- Update user settings

---

## Matching APIs

### 1. GET /matches/potential
**Used In:** `app/(tabs)/home.tsx`
- Get potential matches based on preferences

**Request Parameters:**
```
typescript
{
  limit: number;
  offset: number;
  city?: string;
  ageMin?: string;
  ageMax?: string;
  location?: string;
  religion?: string;
  caste?: string;
  education?: string;
  occupation?: string;
  income?: string;
  heightMin?: string;
  heightMax?: string;
}
```

**Response (PotentialMatchesResponse):**
```
typescript
{
  matches: PotentialMatch[];
  totalCount: number;
  hasMore: boolean;
}
```

**Current PotentialMatch Structure:**
```
typescript
{
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  religion: string;
  caste: string;
  height: string;
  education: string;
  profileImage: string;
  compatibilityScore: number;
  isVerified: boolean;
  lastActive: string;
}
```

**Additional Data Needed:**
- Distance from user
- Mutual interests
- Family details summary
- Education details
- Profile completeness percentage
- Online status

---

### 2. GET /matches
**Used In:** `app/(tabs)/matches.tsx` (Currently using mock data)
- Get user's matched profiles

**Response (MatchesResponse):**
```
typescript
{
  matches: Match[];
  totalCount: number;
  hasMore: boolean;
}
```

**Additional Data Needed:**
- Last message preview
- Unread message count
- Match timestamp
- Common interests

---

### 3. POST /matches/:userId/like
**Used In:** `app/(tabs)/home.tsx` (via ProfileCard)
- Like a profile

**Response (LikeResponse):**
```
typescript
{
  likedUserId: string;
  isMatch: boolean;
  matchId?: string;
}
```

**Additional Data Needed:**
- Match notification

---

### 4. POST /matches/:userId/dislike
**Used In:** `app/(tabs)/home.tsx` (via ProfileCard)
- Dislike/pass a profile

**Additional Data Needed:**
- Undo functionality support

---

## Messaging APIs

### 1. GET /messages/conversations
**Used In:** `app/(tabs)/messages.tsx`
- Get all conversations

**Response (ConversationsResponse):**
```
typescript
{
  conversations: Conversation[];
}
```

**Current Conversation Structure:**
```
typescript
{
  id: string;
  participant: {
    id: string;
    name: string;
    profileImage?: string;
    isOnline: boolean;
  };
  lastMessage?: {
    id: string;
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}
```

**Additional Data Needed:**
- Typing status
- Message delivery status
- Last seen timestamp

---

### 2. GET /messages/conversations/:conversationId
**Used In:** `app/chat/[id].tsx`
- Get messages for a specific conversation

**Request Parameters:**
```typescript
{
  limit: number;
  before?: string;
}
```

**Response (ConversationMessagesResponse):**
```
typescript
{
  conversationId: string;
  participant: {
    id: string;
    name: string;
    profileImage?: string;
  };
  messages: Message[];
  hasMore: boolean;
}
```

**Current Message Structure:**
```
typescript
{
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  isRead: boolean;
}
```

**Additional Data Needed:**
- Message reactions
- Attachment support (images, documents)
- Read receipts
- Message editing support

---

### 3. POST /messages/conversations/:conversationId
**Used In:** `app/chat/[id].tsx`
- Send a message

**Request Body:**
```
typescript
{
  text: string;
}
```

**Response (SendMessageResponse):**
```
typescript
{
  messageId: string;
  text: string;
  timestamp: string;
  conversationId: string;
  senderId: string;
}
```

**Additional Data Needed:**
- Message status (sent, delivered, read)
- Typing indicators

---

## Connection Request APIs

### 1. POST /requests/send/:userId
**Used In:** `app/profile/[id].tsx` (handleSendInterest)
- Send connection request

**Request Body:**
```
typescript
{
  message: string;
}
```

**Additional Data Needed:**
- Request expiry time
- Reminder notifications

---

### 2. GET /requests/sent
**Used In:** `app/sent-requests.tsx`
- Get sent connection requests

**Request Parameters:**
```
typescript
{
  limit: number;
  offset: number;
}
```

**Response (SentRequestsResponse):**
```
typescript
{
  requests: SentRequest[];
  totalCount: number;
  hasMore: boolean;
}
```

**Current SentRequest Structure:**
```
typescript
{
  id: string;
  recipient: {
    id: string;
    name: string;
    age: number;
    location: string;
    occupation: string;
    profileImage: string;
  };
  message: string;
  timestamp: string;
  status: string;
}
```

**Additional Data Needed:**
- View count of profile
- Last activity of recipient

---

### 3. GET /requests/received
**Used In:** `app/received-requests.tsx` (Currently using mock data)
- Get received connection requests

**Request Parameters:**
```
typescript
{
  limit: number;
  offset: number;
}
```

**Response (ReceivedRequestsResponse):**
```
typescript
{
  requests: ReceivedRequest[];
  totalCount: number;
  hasMore: boolean;
}
```

**Current ReceivedRequest Structure:**
```
typescript
{
  id: string;
  sender: {
    id: string;
    name: string;
    age: number;
    location: string;
    occupation: string;
    bio: string;
    religion: string;
    caste: string;
    height: string;
    education: string;
    income: string;
    profileImage: string;
  };
  message: string;
  timestamp: string;
  status: string;
}
```

**Additional Data Needed:**
- Full profile data for swiping
- More sender details

---

### 4. POST /requests/:requestId/accept
**Used In:** `app/received-requests.tsx`
- Accept a connection request

**Response (AcceptRequestResponse):**
```
typescript
{
  requestId: string;
  senderId: string;
  recipientId: string;
  status: string;
  acceptedAt: string;
  conversationId: string;
}
```

**Additional Data Needed:**
- Auto-create conversation
- Notification to sender

---

### 5. POST /requests/:requestId/decline
**Used In:** `app/received-requests.tsx`
- Decline a connection request

**Response (DeclineRequestResponse):**
```
typescript
{
  requestId: string;
  senderId: string;
  recipientId: string;
  status: string;
  declinedAt: string;
}
```

---

## Settings APIs

### 1. PUT /users/settings
**Used In:** `app/settings.tsx` (Currently using local state)
- Update user settings

**Request Body:**
```
typescript
{
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    showOnlineStatus?: boolean;
    showLastActive?: boolean;
    showProfileTo?: string;
  };
  matchingPreferences?: {
    ageRange?: { min?: number; max?: number; };
    locationRadius?: number;
    religion?: string[];
    caste?: string[];
    education?: string[];
    incomeRange?: { min?: number; max?: number; };
  };
  account?: {
    language?: string;
    timezone?: string;
  };
}
```

---

## Master Data APIs

### 1. GET /master/religions
**Used In:** `components/UserForm.tsx` (static data)
- Get list of religions

**Response:**
```
typescript
{
  id: string;
  name: string;
}[]
```

**Additional Data Needed:**
- Sub-religions
- Associated castes

---

### 2. GET /master/castes
**Used In:** `components/UserForm.tsx` (static data)
- Get list of castes

**Additional Data Needed:**
- Filter by religion
- Sub-castes

---

### 3. GET /master/education
**Used In:** `components/UserForm.tsx` (static data)
- Get education levels

**Additional Data Needed:**
- Fields of study
- Universities/Colleges

---

### 4. GET /master/occupations
**Used In:** `components/UserForm.tsx` (static data)
- Get list of occupations

**Additional Data Needed:**
- Job categories
- Industry types

---

### 5. GET /master/income-ranges
**Used In:** `components/UserForm.tsx` (static data)
- Get income ranges

---

## Additional Data Recommendations

### For Home Screen (Potential Matches)
| Field | Purpose | Priority |
|-------|---------|----------|
| `distance` | Show how far the match is | High |
| `mutualInterests[]` | Common hobbies/interests | High |
| `profileViews` | Number of profile views | Medium |
| `isOnline` | Current online status | High |
| `lastActive` | When user was last active | High |
| `familyType` | Nuclear/Joint family | Medium |
| `motherTongue` | Language preference | Medium |

### For Matches Screen
| Field | Purpose | Priority |
|-------|---------|----------|
| `lastMessage` | Preview of last message | High |
| `unreadCount` | Number of unread messages | High |
| `matchedAt` | When they matched | Medium |
| `isOnline` | Online status | High |
| `lastSeen` | Last active timestamp | Medium |

### For Messages Screen
| Field | Purpose | Priority |
|-------|---------|----------|
| `typingStatus` | Is user typing | High |
| `lastSeen` | Last seen timestamp | High |
| `messageStatus` | Sent/Delivered/Read | High |
| `isOnline` | Online status | High |

### For Profile Screen (Self)
| Field | Purpose | Priority |
|-------|---------|----------|
| `profileViews` | Who viewed profile | High |
| `interestReceived` | Interests received count | High |
| `premiumStatus` | Membership status | High |
| `profileCompletePercentage` | Completion status | High |
| `memberSince` | Account creation date | Medium |
| `shortlistedBy` | Who shortlisted user | Medium |

### For Received Requests Screen
| Field | Purpose | Priority |
|-------|---------|----------|
| `fullProfile` | Complete profile data | High |
| `compatibilityScore` | Match percentage | High |
| `familyDetails` | Family information summary | High |
| `lifestyleDetails` | Diet, hobbies, interests | Medium |

### For Settings Screen
| Field | Purpose | Priority |
|-------|---------|----------|
| `deleteAccount` | Account deletion | High |
| `privacySettings` | Detailed privacy options | High |
| `notificationPreferences` | Granular notification settings | High |
| `blockedUsers` | List of blocked users | Medium |
| `hiddenProfiles` | Hidden profiles list | Medium |

### For Master Data
| Field | Purpose | Priority |
|-------|---------|----------|
| `cities` | List of cities by state | High |
| `states` | List of Indian states | High |
| `countries` | Country list | High |
| `nakshatras` | Nakshatra list | Medium |
| `rashis` | Rashi/Moon sign list | Medium |
| `gotras` | Gotra list | Medium |

---

## Pages Using Mock/Dummy Data

### 1. app/(tabs)/matches.tsx
- **API Used:** GET /matches (Not implemented)
- **Currently Using:** Mock data array
- **Needs:** Real API integration

### 2. app/received-requests.tsx
- **API Used:** GET /requests/received (Not integrated)
- **Currently Using:** Local mock data array
- **Needs:** Real API integration with pagination

### 3. app/profile/[id].tsx
- **API Used:** GET /users/profile/:userId (Hardcoded data)
- **Currently Using:** Static test data
- **Needs:** Real API call to fetch profile

---

## API Endpoints Summary

| Method | Endpoint | Used In | Status |
|--------|----------|---------|--------|
| POST | /auth/register | register.tsx | ✅ Implemented |
| POST | /auth/login | login.tsx | ✅ Implemented |
| POST | /auth/logout | profile.tsx, settings.tsx | ✅ Implemented |
| POST | /auth/forgot-password | forgot-password.tsx | ✅ Implemented |
| POST | /auth/reset-password | forgot-password.tsx | ✅ Implemented |
| POST | /auth/refresh | api.ts (internal) | ✅ Implemented |
| GET | /users/me/profile | profile.tsx, _layout.tsx | ✅ Implemented |
| PUT | /users/me/profile | profile.tsx | ✅ Implemented |
| GET | /users/profile/:userId | profile/[id].tsx | ⚠️ Mock Data |
| GET | /users/me/same-city | my-city.tsx | ✅ Implemented |
| GET | /users/settings | settings.tsx | ⚠️ Local State |
| PUT | /users/settings | settings.tsx | ⚠️ Local State |
| GET | /matches/potential | home.tsx | ✅ Implemented |
| GET | /matches | matches.tsx | ❌ Mock Data |
| POST | /matches/:userId/like | home.tsx | ✅ Implemented |
| POST | /matches/:userId/dislike | home.tsx | ✅ Implemented |
| GET | /messages/conversations | messages.tsx | ✅ Implemented |
| GET | /messages/conversations/:id | chat/[id].tsx | ✅ Implemented |
| POST | /messages/conversations/:id | chat/[id].tsx | ✅ Implemented |
| POST | /requests/send/:userId | profile/[id].tsx | ⚠️ Alert Only |
| GET | /requests/sent | sent-requests.tsx | ✅ Implemented |
| GET | /requests/received | received-requests.tsx | ❌ Mock Data |
| POST | /requests/:id/accept | received-requests.tsx | ⚠️ Alert Only |
| POST | /requests/:id/decline | received-requests.tsx | ⚠️ Alert Only |
| GET | /master/religions | UserForm.tsx | ⚠️ Static Data |
| GET | /master/castes | UserForm.tsx | ⚠️ Static Data |
| GET | /master/education | UserForm.tsx | ⚠️ Static Data |
| GET | /master/occupations | UserForm.tsx | ⚠️ Static Data |
| GET | /master/income-ranges | UserForm.tsx | ⚠️ Static Data |

---

## Recommendations

1. **Implement Pagination** - Add pagination support to all list endpoints
2. **Real-time Updates** - Implement WebSocket for messaging and notifications
3. **Image Upload** - Add API for profile image upload
4. **Search** - Add advanced search API with multiple filters
5. **Notifications** - Add push notification support
6. **Analytics** - Add API for user activity tracking
7. **Privacy Controls** - Add more granular privacy settings
8. **Premium Features** - Add API for premium membership features

---

*Last Updated: 2024*
*Document Version: 1.0*
