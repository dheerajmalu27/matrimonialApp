# API Documentation for Matrimonial Application

## Overview

This matrimonial/dating application requires **15 APIs** to support its core functionality including user authentication, profile management, matching, and messaging.

## API Endpoints

### 1. Authentication APIs

#### 1.1 Register User

**Endpoint:** `POST /api/auth/register`  
**Description:** Register a new user account

**Request Body:**

```json
{
  "name": "John Doe",
  "age": "28",
  "location": "Mumbai, India",
  "occupation": "Software Engineer",
  "bio": "Looking for a life partner who shares similar values",
  "email": "john.doe@example.com",
  "phone": "+91 9876543210",
  "religion": "Hindu",
  "caste": "Brahmin",
  "height": "5'10\"",
  "education": "Bachelor's in Computer Science",
  "income": "₹8,00,000 - ₹10,00,000",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_123",
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
}
```

#### 1.2 Login User

**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticate user and return access token

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "user_123",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### 1.3 Logout User

**Endpoint:** `POST /api/auth/logout`  
**Description:** Logout user and invalidate tokens

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 1.4 Refresh Token

**Endpoint:** `POST /api/auth/refresh`  
**Description:** Refresh access token using refresh token

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 2. User Profile APIs

#### 2.1 Get User Profile

**Endpoint:** `GET /api/users/profile`  
**Description:** Get current user's profile

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
    "age": 28,
    "location": "Mumbai, India",
    "occupation": "Software Engineer",
    "bio": "Looking for a life partner who shares similar values",
    "email": "john.doe@example.com",
    "phone": "+91 9876543210",
    "religion": "Hindu",
    "caste": "Brahmin",
    "height": "5'10\"",
    "education": "Bachelor's in Computer Science",
    "income": "₹8,00,000 - ₹10,00,000",
    "profileImage": "https://example.com/images/user_123.jpg",
    "isOnline": true,
    "lastActive": "2024-01-15T10:30:00Z"
  }
}
```

#### 2.2 Update User Profile

**Endpoint:** `PUT /api/users/profile`  
**Description:** Update current user's profile

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "age": "29",
  "location": "Delhi, India",
  "occupation": "Senior Software Engineer",
  "bio": "Updated bio text",
  "phone": "+91 9876543210",
  "height": "5'11\"",
  "education": "Master's in Computer Science",
  "income": "₹10,00,000 - ₹12,00,000"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "age": 29,
    "location": "Delhi, India",
    "occupation": "Senior Software Engineer",
    "bio": "Updated bio text",
    "email": "john.doe@example.com",
    "phone": "+91 9876543210",
    "religion": "Hindu",
    "caste": "Brahmin",
    "height": "5'11\"",
    "education": "Master's in Computer Science",
    "income": "₹10,00,000 - ₹12,00,000",
    "profileImage": "https://example.com/images/user_123.jpg",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### 2.3 Get Profile by ID

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
    "religion": "Hindu",
    "caste": "Kayasth",
    "height": "5'4\"",
    "education": "MBBS",
    "income": "₹6,00,000 - ₹8,00,000",
    "profileImage": "https://example.com/images/user_456.jpg",
    "isOnline": false,
    "lastActive": "2024-01-14T15:30:00Z"
  }
}
```

### 3. Matching APIs

#### 3.1 Get Potential Matches

**Endpoint:** `GET /api/matches/potential`  
**Description:** Get list of potential matches for the user

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (optional): Number of matches to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

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
        "compatibilityScore": 85
      },
      {
        "id": "user_789",
        "name": "Priya Patel",
        "age": 27,
        "location": "Ahmedabad, India",
        "occupation": "Teacher",
        "bio": "Love teaching and exploring new cultures",
        "religion": "Hindu",
        "caste": "Patel",
        "height": "5'6\"",
        "education": "Master's in Education",
        "profileImage": "https://example.com/images/user_789.jpg",
        "compatibilityScore": 78
      }
    ],
    "totalCount": 150,
    "hasMore": true
  }
}
```

#### 3.2 Like Profile

**Endpoint:** `POST /api/matches/{userId}/like`  
**Description:** Like another user's profile

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile liked successfully",
  "data": {
    "likedUserId": "user_456",
    "isMatch": true,
    "matchId": "match_123"
  }
}
```

#### 3.3 Dislike Profile

**Endpoint:** `POST /api/matches/{userId}/dislike`  
**Description:** Dislike another user's profile

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile disliked successfully",
  "data": {
    "dislikedUserId": "user_456"
  }
}
```

#### 3.4 Get Matches

**Endpoint:** `GET /api/matches`  
**Description:** Get list of mutual matches

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `limit` (optional): Number of matches to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "match_123",
        "user": {
          "id": "user_456",
          "name": "Jane Smith",
          "age": 26,
          "location": "Pune, India",
          "occupation": "Doctor",
          "profileImage": "https://example.com/images/user_456.jpg"
        },
        "matchedAt": "2024-01-10T14:30:00Z",
        "lastMessage": "Hi! We matched!",
        "unreadCount": 1
      },
      {
        "id": "match_124",
        "user": {
          "id": "user_789",
          "name": "Priya Patel",
          "age": 27,
          "location": "Ahmedabad, India",
          "occupation": "Teacher",
          "profileImage": "https://example.com/images/user_789.jpg"
        },
        "matchedAt": "2024-01-08T09:15:00Z",
        "lastMessage": null,
        "unreadCount": 0
      }
    ],
    "totalCount": 5,
    "hasMore": false
  }
}
```

### 4. Messaging APIs

#### 4.1 Get Conversations

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
      },
      {
        "id": "conv_124",
        "participant": {
          "id": "user_789",
          "name": "Priya Patel",
          "profileImage": "https://example.com/images/user_789.jpg",
          "isOnline": false
        },
        "lastMessage": {
          "id": "msg_790",
          "text": "Thank you for your interest",
          "timestamp": "2024-01-14T16:45:00Z",
          "isRead": true
        },
        "unreadCount": 0,
        "updatedAt": "2024-01-14T16:45:00Z"
      }
    ]
  }
}
```

#### 4.2 Get Messages for Conversation

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
        "text": "Hi! I saw your profile and thought we might be a good match!",
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
      },
      {
        "id": "msg_787",
        "text": "We both love traveling and have similar career goals.",
        "timestamp": "2024-01-15T10:10:00Z",
        "senderId": "user_456",
        "isRead": true
      },
      {
        "id": "msg_788",
        "text": "That's great! I'd love to hear more about your recent trips.",
        "timestamp": "2024-01-15T10:15:00Z",
        "senderId": "user_123",
        "isRead": true
      },
      {
        "id": "msg_789",
        "text": "Sure! Last month I went to Goa. The beaches were amazing.",
        "timestamp": "2024-01-15T10:30:00Z",
        "senderId": "user_456",
        "isRead": false
      }
    ],
    "hasMore": false
  }
}
```

#### 4.3 Send Message

**Endpoint:** `POST /api/messages/conversations/{conversationId}`  
**Description:** Send a message in a conversation

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "text": "That sounds wonderful! I've always wanted to visit Goa."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "msg_790",
    "text": "That sounds wonderful! I've always wanted to visit Goa.",
    "timestamp": "2024-01-15T10:35:00Z",
    "conversationId": "conv_123",
    "senderId": "user_123"
  }
}
```

### 5. Settings APIs

#### 5.1 Get User Settings

**Endpoint:** `GET /api/users/settings`  
**Description:** Get current user's settings

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "privacy": {
      "showOnlineStatus": true,
      "showLastActive": true,
      "showProfileTo": "matches_only"
    },
    "matchingPreferences": {
      "ageRange": {
        "min": 22,
        "max": 35
      },
      "locationRadius": 50,
      "religion": ["Hindu", "Jain"],
      "caste": ["Brahmin", "Kayasth"],
      "education": ["Bachelor's", "Master's", "PhD"],
      "incomeRange": {
        "min": 300000,
        "max": 2000000
      }
    },
    "account": {
      "language": "en",
      "timezone": "Asia/Kolkata"
    }
  }
}
```

#### 5.2 Update User Settings

**Endpoint:** `PUT /api/users/settings`  
**Description:** Update current user's settings

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "notifications": {
    "email": true,
    "push": false,
    "sms": true
  },
  "privacy": {
    "showOnlineStatus": false,
    "showLastActive": false,
    "showProfileTo": "everyone"
  },
  "matchingPreferences": {
    "ageRange": {
      "min": 25,
      "max": 32
    },
    "locationRadius": 30,
    "religion": ["Hindu"],
    "caste": ["Brahmin"],
    "education": ["Master's", "PhD"],
    "incomeRange": {
      "min": 500000,
      "max": 1500000
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "notifications": {
      "email": true,
      "push": false,
      "sms": true
    },
    "privacy": {
      "showOnlineStatus": false,
      "showLastActive": false,
      "showProfileTo": "everyone"
    },
    "matchingPreferences": {
      "ageRange": {
        "min": 25,
        "max": 32
      },
      "locationRadius": 30,
      "religion": ["Hindu"],
      "caste": ["Brahmin"],
      "education": ["Master's", "PhD"],
      "incomeRange": {
        "min": 500000,
        "max": 1500000
      }
    },
    "account": {
      "language": "en",
      "timezone": "Asia/Kolkata"
    }
  }
}
```

### 6. Connection Request APIs

#### 6.1 Send Connection Request

**Endpoint:** `POST /api/requests/send/{userId}`  
**Description:** Send a connection request to another user

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "message": "Hi, I found your profile interesting. Would like to connect."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "data": {
    "requestId": "req_123",
    "recipientId": "user_456",
    "senderId": "user_123",
    "message": "Hi, I found your profile interesting. Would like to connect.",
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "pending"
  }
}
```

#### 6.2 Get Sent Requests

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
      },
      {
        "id": "req_124",
        "recipient": {
          "id": "user_789",
          "name": "Priya Patel",
          "age": 27,
          "location": "Ahmedabad, India",
          "occupation": "Teacher",
          "profileImage": "https://example.com/images/user_789.jpg"
        },
        "message": "Hello! Your profile caught my attention. Let's chat!",
        "timestamp": "2024-01-14T16:45:00Z",
        "status": "accepted"
      }
    ],
    "totalCount": 5,
    "hasMore": false
  }
}
```

#### 6.3 Get Received Requests

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
      },
      {
        "id": "req_126",
        "sender": {
          "id": "user_789",
          "name": "Priya Patel",
          "age": 27,
          "location": "Ahmedabad, India",
          "occupation": "Teacher",
          "bio": "Love teaching and exploring new cultures",
          "religion": "Hindu",
          "caste": "Patel",
          "height": "5'6\"",
          "education": "Master's in Education",
          "income": "₹5,00,000 - ₹7,00,000",
          "profileImage": "https://example.com/images/user_789.jpg"
        },
        "message": "Hello! Your profile caught my attention. Let's chat!",
        "timestamp": "2024-01-14T16:45:00Z",
        "status": "pending"
      }
    ],
    "totalCount": 2,
    "hasMore": false
  }
}
```

#### 6.4 Accept Connection Request

**Endpoint:** `POST /api/requests/{requestId}/accept`  
**Description:** Accept a received connection request

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Connection request accepted successfully",
  "data": {
    "requestId": "req_125",
    "senderId": "user_456",
    "recipientId": "user_123",
    "status": "accepted",
    "acceptedAt": "2024-01-15T11:00:00Z",
    "conversationId": "conv_123"
  }
}
```

#### 6.5 Decline Connection Request

**Endpoint:** `POST /api/requests/{requestId}/decline`  
**Description:** Decline a received connection request

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Connection request declined successfully",
  "data": {
    "requestId": "req_125",
    "senderId": "user_456",
    "recipientId": "user_123",
    "status": "declined",
    "declinedAt": "2024-01-15T11:00:00Z"
  }
}
```

## Summary

- **Total APIs Required:** 19
- **Authentication:** 4 APIs
- **User Profiles:** 3 APIs
- **Matching:** 4 APIs
- **Messaging:** 3 APIs
- **Settings:** 2 APIs
- **Connection Requests:** 3 APIs

All APIs follow RESTful conventions and include proper authentication via JWT tokens. Error responses follow a consistent format with appropriate HTTP status codes.
