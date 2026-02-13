# Dynamic Data APIs for Matrimonial Application

This document lists all APIs required to replace hardcoded data in the application with dynamic backend data. Each API includes request and response objects.

## Overview

The application currently has hardcoded data in several pages that needs to be replaced with API calls:

- **Home Page**: Potential matches list
- **My City Page**: City-based matches list
- **Profile Page**: Current user profile data
- **Profile Detail Page**: Other user profile data
- **Sent Requests Page**: List of sent connection requests
- **Received Requests Page**: List of received connection requests
- **Chat Page**: Conversations and messages
- **Search Filters**: Master data for dropdown options

## 1. Potential Matches APIs

### 1.1 Get Potential Matches

**Endpoint:** `GET /api/matches/potential`
**Description:** Get list of potential matches for the user (used in Home and My City pages)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (optional): Number of matches to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `city` (optional): Filter by city for My City page

**Response:**

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "user_456",
        "name": "Jane Smith",
        "age": 26,
        "location": "Pune, India",
        "occupation": "Doctor",
        "bio": "Passionate about helping others and finding true love",
        "religion": "Hindu",
        "caste": "Kayasth",
        "height": "5'4\"",
        "education": "MBBS",
        "profileImage": "https://example.com/images/user_456.jpg",
        "compatibilityScore": 85,
        "isVerified": true,
        "lastActive": "2024-01-14T15:30:00Z"
      }
    ],
    "totalCount": 150,
    "hasMore": true
  }
}
```

## 2. User Profile APIs

### 2.1 Get Current User Profile

**Endpoint:** `GET /api/users/profile`
**Description:** Get current user's profile data

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "age": 30,
    "location": "New York, USA",
    "occupation": "Software Engineer",
    "bio": "Looking for a life partner who shares similar values and interests",
    "images": ["https://example.com/images/user_123_1.jpg"],
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "religion": "Hindu",
    "caste": "Brahmin",
    "height": "5'10\"",
    "education": "Master's in Computer Science",
    "income": "$80,000 - $100,000",
    "isOnline": true,
    "lastActive": "2024-01-15T10:30:00Z",
    "isVerified": true
  }
}
```

### 2.2 Get User Profile by ID

**Endpoint:** `GET /api/users/{userId}/profile`
**Description:** Get another user's profile by ID

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_456",
    "name": "Jane Smith",
    "age": 26,
    "location": "Pune, India",
    "occupation": "Doctor",
    "bio": "Passionate about helping others and finding true love",
    "images": ["https://example.com/images/user_456_1.jpg"],
    "religion": "Hindu",
    "caste": "Kayasth",
    "height": "5'4\"",
    "education": "MBBS",
    "income": "₹6,00,000 - ₹8,00,000",
    "isOnline": false,
    "lastActive": "2024-01-14T15:30:00Z",
    "isVerified": true
  }
}
```

## 3. Connection Request APIs

### 3.1 Get Sent Requests

**Endpoint:** `GET /api/requests/sent`
**Description:** Get list of connection requests sent by the current user

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (optional): Number of requests to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req_123",
        "recipient": {
          "id": "user_456",
          "name": "Jane Smith",
          "age": 26,
          "location": "Pune, India",
          "occupation": "Doctor",
          "profileImage": "https://example.com/images/user_456.jpg"
        },
        "message": "Hi, I found your profile interesting. Would like to connect.",
        "timestamp": "2024-01-15T10:30:00Z",
        "status": "pending"
      }
    ],
    "totalCount": 5,
    "hasMore": false
  }
}
```

### 3.2 Get Received Requests

**Endpoint:** `GET /api/requests/received`
**Description:** Get list of connection requests received by the current user

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (optional): Number of requests to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req_125",
        "sender": {
          "id": "user_456",
          "name": "Jane Smith",
          "age": 26,
          "location": "Pune, India",
          "occupation": "Doctor",
          "bio": "Passionate about helping others and finding true love",
          "religion": "Hindu",
          "caste": "Kayasth",
          "height": "5'4\"",
          "education": "MBBS",
          "income": "₹6,00,000 - ₹8,00,000",
          "profileImage": "https://example.com/images/user_456.jpg"
        },
        "message": "Hi, I found your profile interesting. Would like to connect.",
        "timestamp": "2024-01-15T10:30:00Z",
        "status": "pending"
      }
    ],
    "totalCount": 2,
    "hasMore": false
  }
}
```

## 4. Messaging APIs

### 4.1 Get Conversations

**Endpoint:** `GET /api/messages/conversations`
**Description:** Get list of user conversations

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_123",
        "participant": {
          "id": "user_456",
          "name": "Jane Smith",
          "profileImage": "https://example.com/images/user_456.jpg",
          "isOnline": true
        },
        "lastMessage": {
          "id": "msg_789",
          "text": "Hi! We matched!",
          "timestamp": "2024-01-15T10:30:00Z",
          "isRead": false
        },
        "unreadCount": 2,
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 4.2 Get Messages for Conversation

**Endpoint:** `GET /api/messages/conversations/{conversationId}`
**Description:** Get messages for a specific conversation

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (optional): Number of messages to return (default: 50)
- `before` (optional): Get messages before this message ID

**Response:**

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "participant": {
      "id": "user_456",
      "name": "Jane Smith",
      "profileImage": "https://example.com/images/user_456.jpg"
    },
    "messages": [
      {
        "id": "msg_785",
        "text": "Hi, I saw your profile and thought we might be a good match!",
        "timestamp": "2024-01-15T10:00:00Z",
        "senderId": "user_456",
        "isRead": true
      },
      {
        "id": "msg_786",
        "text": "Thank you! I think so too. What made you interested?",
        "timestamp": "2024-01-15T10:05:00Z",
        "senderId": "user_123",
        "isRead": true
      }
    ],
    "hasMore": false
  }
}
```

## 5. Master Data APIs (for Filter Dropdowns)

### 5.1 Get Religions

**Endpoint:** `GET /api/master/religions`
**Description:** Get list of available religions for filters

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": "hindu", "name": "Hindu" },
    { "id": "muslim", "name": "Muslim" },
    { "id": "christian", "name": "Christian" },
    { "id": "sikh", "name": "Sikh" },
    { "id": "jain", "name": "Jain" },
    { "id": "buddhist", "name": "Buddhist" },
    { "id": "other", "name": "Other" }
  ]
}
```

### 5.2 Get Castes

**Endpoint:** `GET /api/master/castes`
**Description:** Get list of available castes/communities for filters

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": "brahmin", "name": "Brahmin" },
    { "id": "kayasth", "name": "Kayasth" },
    { "id": "patel", "name": "Patel" },
    { "id": "gupta", "name": "Gupta" },
    { "id": "jat", "name": "Jat" },
    { "id": "other", "name": "Other" }
  ]
}
```

### 5.3 Get Education Levels

**Endpoint:** `GET /api/master/education`
**Description:** Get list of available education levels for filters

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": "high_school", "name": "High School" },
    { "id": "bachelors", "name": "Bachelor's Degree" },
    { "id": "masters", "name": "Master's Degree" },
    { "id": "phd", "name": "PhD" },
    { "id": "diploma", "name": "Diploma" },
    { "id": "other", "name": "Other" }
  ]
}
```

### 5.4 Get Occupations

**Endpoint:** `GET /api/master/occupations`
**Description:** Get list of available occupations for filters

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": "engineer", "name": "Engineer" },
    { "id": "doctor", "name": "Doctor" },
    { "id": "teacher", "name": "Teacher" },
    { "id": "business_owner", "name": "Business Owner" },
    { "id": "designer", "name": "Designer" },
    { "id": "other", "name": "Other" }
  ]
}
```

### 5.5 Get Income Ranges

**Endpoint:** `GET /api/master/income-ranges`
**Description:** Get list of available income ranges for filters

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": "under_3l", "name": "Under ₹3,00,000" },
    { "id": "3l_to_5l", "name": "₹3,00,000 - ₹5,00,000" },
    { "id": "5l_to_8l", "name": "₹5,00,000 - ₹8,00,000" },
    { "id": "8l_to_12l", "name": "₹8,00,000 - ₹12,00,000" },
    { "id": "12l_to_20l", "name": "₹12,00,000 - ₹20,00,000" },
    { "id": "above_20l", "name": "Above ₹20,00,000" }
  ]
}
```

## Summary

**Total APIs Required for Dynamic Data:** 11

- **Potential Matches:** 1 API
- **User Profiles:** 2 APIs
- **Connection Requests:** 2 APIs
- **Messaging:** 2 APIs
- **Master Data:** 5 APIs

All APIs follow RESTful conventions and include proper authentication via JWT tokens. Error responses follow a consistent format with appropriate HTTP status codes.

## Implementation Priority

1. **High Priority:** User profiles, potential matches, connection requests
2. **Medium Priority:** Messaging APIs
3. **Low Priority:** Master data APIs (can start with hardcoded values and replace later)
