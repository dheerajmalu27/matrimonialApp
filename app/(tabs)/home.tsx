import ProfileCard from "@/components/ProfileCard";
import SearchFilter, { FilterOptions } from "@/components/SearchFilter";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for profiles
const mockProfiles = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 28,
    location: "Mumbai, Maharashtra",
    occupation: "Software Engineer",
    image: "https://via.placeholder.com/150",
    bio: "Passionate about technology and travel. Looking for a life partner who shares similar values.",
    height: "5'6\"",
    religion: "Hindu",
    caste: "Brahmin",
    isVerified: true,
    compatibility: 85,
  },
  {
    id: "2",
    name: "Rahul Verma",
    age: 32,
    location: "Delhi, NCR",
    occupation: "Doctor",
    image: "https://via.placeholder.com/150",
    bio: "Dedicated medical professional seeking a compassionate partner for a meaningful relationship.",
    height: "5'10\"",
    religion: "Hindu",
    caste: "Kayastha",
    isVerified: true,
    compatibility: 78,
  },
  {
    id: "3",
    name: "Anjali Patel",
    age: 26,
    location: "Ahmedabad, Gujarat",
    occupation: "Teacher",
    image: "https://via.placeholder.com/150",
    bio: "Love teaching and learning. Seeking someone who values education and family.",
    height: "5'4\"",
    religion: "Hindu",
    caste: "Patel",
    isVerified: false,
    compatibility: 92,
  },
  {
    id: "4",
    name: "Vikram Singh",
    age: 30,
    location: "Jaipur, Rajasthan",
    occupation: "Business Owner",
    image: "https://via.placeholder.com/150",
    bio: "Entrepreneur with a passion for culture and tradition. Looking for a partner to build a future together.",
    height: "6'0\"",
    religion: "Sikh",
    caste: "Jat",
    isVerified: true,
    compatibility: 70,
  },
  {
    id: "5",
    name: "Kavita Gupta",
    age: 29,
    location: "Bangalore, Karnataka",
    occupation: "Designer",
    image: "https://via.placeholder.com/150",
    bio: "Creative soul with a love for art and innovation. Seeking a supportive and understanding partner.",
    height: "5'7\"",
    religion: "Hindu",
    caste: "Gupta",
    isVerified: false,
    compatibility: 88,
  },
];

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ offset: 0, hasMore: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    ageMin: "",
    ageMax: "",
    location: "",
    religion: "",
    caste: "",
    education: "",
    occupation: "",
    income: "",
    heightMin: "",
    heightMax: "",
  });

  useEffect(() => {
    fetchPotentialMatches();
  }, [filters]);

  const fetchPotentialMatches = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const offset = loadMore ? pagination.offset : 0;
      const response = await apiService.getPotentialMatches(
        20,
        offset,
        undefined,
        filters,
      );

      if (response.success && response.data) {
        const newProfiles = response.data.matches.map((match) => ({
          id: match.id,
          name: match.name,
          age: match.age,
          location: match.location || "Location not specified",
          occupation: match.occupation || "Occupation not specified",
          image: match.profileImage || "https://via.placeholder.com/150",
          bio: match.bio,
          height: match.height,
          religion: match.religion,
          caste: match.caste,
          isVerified: match.isVerified,
          compatibility: match.compatibilityScore,
        }));

        if (loadMore) {
          setProfiles((prev) => [...prev, ...newProfiles]);
        } else {
          setProfiles(newProfiles);
        }

        setPagination({
          offset: offset + newProfiles.length,
          hasMore: response.data.hasMore,
        });
      } else {
        setError(response.message || "Failed to load profiles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // Search query filter (client-side)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          profile.name.toLowerCase().includes(query) ||
          profile.location.toLowerCase().includes(query) ||
          profile.occupation.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [searchQuery, profiles]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      ageMin: "",
      ageMax: "",
      location: "",
      religion: "",
      caste: "",
      education: "",
      occupation: "",
      income: "",
      heightMin: "",
      heightMax: "",
    });
  };

  const renderProfile = ({ item }: { item: any }) => (
    <ProfileCard profile={item} />
  );

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchPotentialMatches(true);
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>
            Loading profiles...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPotentialMatches()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
      />
      <FlatList
        data={filteredProfiles}
        renderItem={renderProfile}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && profiles.length > 0 ? (
            <View style={styles.loadingMoreContainer}>
              <ThemedText style={styles.loadingMoreText}>
                Loading more...
              </ThemedText>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No profiles found matching your criteria.
            </ThemedText>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 15,
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingMoreText: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
