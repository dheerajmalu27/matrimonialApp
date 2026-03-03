import { ProfileList } from "@/components/profile-list";
import {
  ProfileListError,
  ProfileListInitialLoading,
} from "@/components/profile-list-state";
import { usePaginatedProfileCards } from "@/hooks";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";

/**
 * Shortlisted screen: profiles that current user has shortlisted.
 */
export default function ShortlistedScreen() {
  const fetchShortlistedProfiles = useCallback(
    (limit: number, offset: number) => apiService.getShortlistedProfiles(limit, offset),
    [],
  );

  const {
    profiles,
    isLoading,
    errorMessage,
    fetchProfiles,
    loadMoreProfiles,
    resetProfiles,
  } = usePaginatedProfileCards(fetchShortlistedProfiles, 20);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleLoadMore = useCallback(() => {
    loadMoreProfiles();
  }, [loadMoreProfiles]);

  if (isLoading && profiles.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ProfileListInitialLoading message="Loading shortlisted profiles..." />
      </ThemedView>
    );
  }

  if (errorMessage && profiles.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ProfileListError
          message={errorMessage}
          onRetry={() => {
            resetProfiles();
            fetchProfiles();
          }}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ProfileList
        profiles={profiles}
        isLoadingMore={isLoading && profiles.length > 0}
        onLoadMore={handleLoadMore}
        emptyMessage="You have not shortlisted any profiles yet."
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
