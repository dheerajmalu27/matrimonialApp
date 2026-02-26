import ProfileCard from "@/components/ProfileCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyCityScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ offset: 0, hasMore: true });

  useEffect(() => {
    fetchSameCityUsers();
  }, []);

  const fetchSameCityUsers = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const offset = loadMore ? pagination.offset : 0;
      console.log("Fetching same city users with offset:", offset);
      const response = (await apiService.getSameCityUsers(20, offset)) as any;
      console.log("API Response:", response);

      // Handle direct response format from API
      if (response && response.matches) {
        const newProfiles = response.matches.map((match: any) => ({
          id: match.id,
          name: match.name,
          age: match.age,
          location: match.location,
          occupation: match.occupation || "Occupation not specified",
          image: match.profileImage || "https://via.placeholder.com/150",
          bio: match.bio,
          height: match.height,
          religion: match.religion,
          caste: match.caste,
          isVerified: match.isVerified,
        }));

        console.log("Mapped profiles:", newProfiles);

        if (loadMore) {
          setProfiles((prev) => [...prev, ...newProfiles]);
        } else {
          setProfiles(newProfiles);
        }

        setPagination({
          offset: offset + newProfiles.length,
          hasMore: response.hasMore || false,
        });
      } else {
        console.error("API response not successful:", response);
        setError("Failed to load profiles");
      }
    } catch (err) {
      console.error("Error fetching same city users:", err);
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles;

  const renderProfile = ({ item }: { item: any }) => (
    <ProfileCard profile={item} />
  );

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchSameCityUsers(true);
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
            onPress={() => fetchSameCityUsers()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
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
              No profiles found in your city.
            </ThemedText>
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
    backgroundColor: "#E91E63",
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
});
