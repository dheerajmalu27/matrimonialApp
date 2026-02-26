import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "../constants/config";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface LoginResponse {
  userId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface RegisterResponse {
  userId: string;
  email: string;
  name: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

interface RegisterData {
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

interface UserProfile {
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

interface PotentialMatch {
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

interface Match {
  id: string;
  user: {
    id: string;
    name: string;
    age: number;
    location: string;
    occupation: string;
    profileImage?: string;
  };
  matchedAt: string;
  lastMessage?: string;
  unreadCount: number;
}

interface Conversation {
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

interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  isRead: boolean;
}

interface UserSettings {
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
    ageRange: {
      min: number;
      max: number;
    };
    locationRadius: number;
    religion: string[];
    caste: string[];
    education: string[];
    incomeRange: {
      min: number;
      max: number;
    };
  };
  account: {
    language: string;
    timezone: string;
  };
}

interface ConnectionRequest {
  id: string;
  recipientId: string;
  senderId: string;
  message: string;
  timestamp: string;
  status: string;
}

interface SentRequest {
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

interface ReceivedRequest {
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

interface LikeResponse {
  likedUserId: string;
  isMatch: boolean;
  matchId?: string;
}

interface DislikeResponse {
  dislikedUserId: string;
}

interface SendMessageResponse {
  messageId: string;
  text: string;
  timestamp: string;
  conversationId: string;
  senderId: string;
}

interface AcceptRequestResponse {
  requestId: string;
  senderId: string;
  recipientId: string;
  status: string;
  acceptedAt: string;
  conversationId: string;
}

interface DeclineRequestResponse {
  requestId: string;
  senderId: string;
  recipientId: string;
  status: string;
  declinedAt: string;
}

interface PotentialMatchesResponse {
  matches: PotentialMatch[];
  totalCount: number;
  hasMore: boolean;
}

interface MatchesResponse {
  matches: Match[];
  totalCount: number;
  hasMore: boolean;
}

interface ConversationsResponse {
  conversations: Conversation[];
}

interface ConversationMessagesResponse {
  conversationId: string;
  participant: {
    id: string;
    name: string;
    profileImage?: string;
  };
  messages: Message[];
  hasMore: boolean;
}

interface SentRequestsResponse {
  requests: SentRequest[];
  totalCount: number;
  hasMore: boolean;
}

interface ReceivedRequestsResponse {
  requests: ReceivedRequest[];
  totalCount: number;
  hasMore: boolean;
}

export interface FilterOptions {
  ageMin: string;
  ageMax: string;
  location: string;
  religion: string;
  caste: string;
  education: string;
  occupation: string;
  income: string;
  heightMin: string;
  heightMax: string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Authentication APIs
  async register(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    const response = await this.makeRequest<RegisterResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    return response;
  }

  async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await this.makeRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Store tokens if login successful
    if (response.success && response.data) {
      console.log(response.data);
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      //  await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      await AsyncStorage.setItem("userId", response.data.userId);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    // Clear stored tokens and cached profile
    await AsyncStorage.multiRemove([
      "accessToken",
      "refreshToken",
      "userId",
      "userProfile",
    ]);
    const response = await this.makeRequest("/auth/logout", {
      method: "POST",
    });
    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response;
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.makeRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
    return response;
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.makeRequest<RefreshTokenResponse>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      },
    );

    // Update access token if refresh successful
    if (response.success && response.data) {
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
    }

    return response;
  }

  // User Profile APIs
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    // Check for cached profile first
    const cachedProfile = await AsyncStorage.getItem("userProfile");
    if (cachedProfile) {
      const profile: UserProfile = JSON.parse(cachedProfile);
      return { success: true, data: profile };
    }

    // Fetch from API if not cached
    const response = await this.makeRequest<UserProfile>("/users/me/profile");

    // Cache the profile if successful
    if (response.success && response.data) {
      await AsyncStorage.setItem("userProfile", JSON.stringify(response.data));
    }

    return response;
  }

  async updateUserProfile(
    data: Partial<UserProfile>,
  ): Promise<ApiResponse<UserProfile>> {
    const response = await this.makeRequest<UserProfile>("/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // Update cached profile if update successful
    if (response.success && response.data) {
      await AsyncStorage.setItem("userProfile", JSON.stringify(response.data));
    }

    return response;
  }

  async getUserProfileById(userId: string): Promise<ApiResponse<UserProfile>> {
    return await this.makeRequest<UserProfile>(`/users/profile/${userId}`);
  }

  // Matching APIs
  async getPotentialMatches(
    limit = 5,
    offset = 0,
    city?: string,
    filters?: FilterOptions,
  ): Promise<ApiResponse<PotentialMatchesResponse>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (city) params.append("city", city);
    if (filters) {
      if (filters.ageMin) params.append("ageMin", filters.ageMin);
      if (filters.ageMax) params.append("ageMax", filters.ageMax);
      if (filters.location) params.append("location", filters.location);
      if (filters.religion) params.append("religion", filters.religion);
      if (filters.caste) params.append("caste", filters.caste);
      if (filters.education) params.append("education", filters.education);
      if (filters.occupation) params.append("occupation", filters.occupation);
      if (filters.income) params.append("income", filters.income);
      if (filters.heightMin) params.append("heightMin", filters.heightMin);
      if (filters.heightMax) params.append("heightMax", filters.heightMax);
    }
    return await this.makeRequest<PotentialMatchesResponse>(
      `/matches/potential?${params}`,
    );
  }

  async getSameCityUsers(
    limit = 20,
    offset = 0,
  ): Promise<ApiResponse<PotentialMatchesResponse>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return await this.makeRequest<PotentialMatchesResponse>(
      `/users/me/same-city?${params}`,
    );
  }

  async likeProfile(userId: string): Promise<ApiResponse<LikeResponse>> {
    return await this.makeRequest<LikeResponse>(`/matches/${userId}/like`, {
      method: "POST",
    });
  }

  async dislikeProfile(userId: string): Promise<ApiResponse<DislikeResponse>> {
    return await this.makeRequest<DislikeResponse>(
      `/matches/${userId}/dislike`,
      {
        method: "POST",
      },
    );
  }

  async getMatches(
    limit = 20,
    offset = 0,
  ): Promise<ApiResponse<MatchesResponse>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return await this.makeRequest<MatchesResponse>(`/matches?${params}`);
  }

  // Messaging APIs
  async getConversations(): Promise<ApiResponse<ConversationsResponse>> {
    return await this.makeRequest<ConversationsResponse>(
      "/messages/conversations",
    );
  }

  async getConversationMessages(
    conversationId: string,
    limit = 50,
    before?: string,
  ): Promise<ApiResponse<ConversationMessagesResponse>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (before) params.append("before", before);
    return await this.makeRequest<ConversationMessagesResponse>(
      `/messages/conversations/${conversationId}?${params}`,
    );
  }

  async sendMessage(
    conversationId: string,
    text: string,
  ): Promise<ApiResponse<SendMessageResponse>> {
    return await this.makeRequest<SendMessageResponse>(
      `/messages/conversations/${conversationId}`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
      },
    );
  }

  // Settings APIs
  async getUserSettings(): Promise<ApiResponse<UserSettings>> {
    return await this.makeRequest<UserSettings>("/users/settings");
  }

  async updateUserSettings(
    data: Partial<UserSettings>,
  ): Promise<ApiResponse<UserSettings>> {
    return await this.makeRequest<UserSettings>("/users/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Connection Request APIs
  async sendConnectionRequest(
    userId: string,
    message: string,
  ): Promise<ApiResponse<ConnectionRequest>> {
    return await this.makeRequest<ConnectionRequest>(
      `/requests/send/${userId}`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
      },
    );
  }

  async getSentRequests(
    limit = 20,
    offset = 0,
  ): Promise<ApiResponse<SentRequestsResponse>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return await this.makeRequest<SentRequestsResponse>(
      `/requests/sent?${params}`,
    );
  }

  async getReceivedRequests(
    limit = 20,
    offset = 0,
  ): Promise<ApiResponse<ReceivedRequestsResponse>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return await this.makeRequest<ReceivedRequestsResponse>(
      `/requests/received?${params}`,
    );
  }

  async acceptConnectionRequest(
    requestId: string,
  ): Promise<ApiResponse<AcceptRequestResponse>> {
    return await this.makeRequest<AcceptRequestResponse>(
      `/requests/${requestId}/accept`,
      {
        method: "POST",
      },
    );
  }

  async declineConnectionRequest(
    requestId: string,
  ): Promise<ApiResponse<DeclineRequestResponse>> {
    return await this.makeRequest<DeclineRequestResponse>(
      `/requests/${requestId}/decline`,
      {
        method: "POST",
      },
    );
  }

  // Master Data APIs
  async getReligions(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return await this.makeRequest<{ id: string; name: string }[]>(
      "/master/religions",
    );
  }

  async getCastes(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return await this.makeRequest<{ id: string; name: string }[]>(
      "/master/castes",
    );
  }

  async getEducationLevels(): Promise<
    ApiResponse<{ id: string; name: string }[]>
  > {
    return await this.makeRequest<{ id: string; name: string }[]>(
      "/master/education",
    );
  }

  async getOccupations(): Promise<ApiResponse<{ id: string; name: string }[]>> {
    return await this.makeRequest<{ id: string; name: string }[]>(
      "/master/occupations",
    );
  }

  async getIncomeRanges(): Promise<
    ApiResponse<{ id: string; name: string }[]>
  > {
    return await this.makeRequest<{ id: string; name: string }[]>(
      "/master/income-ranges",
    );
  }
}

export const apiService = new ApiService();
export default apiService;
