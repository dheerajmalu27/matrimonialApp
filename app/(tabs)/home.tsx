import { ProfileList } from "@/components/profile-list";
import SearchFilter, { FilterOptions } from "@/components/SearchFilter";
import {
  ProfileListError,
  ProfileListInitialLoading,
} from "@/components/profile-list-state";
import { usePaginatedProfileCards } from "@/hooks";
import { ThemedView } from "@/components/themed-view";
import { apiService } from "@/services/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

const DEFAULT_FILTERS: FilterOptions = {
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
};

/**
 * Home tab: searchable/filterable profile list powered by paginated match APIs.
 */
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const fetchPotentialMatches = useCallback(
    (limit: number, offset: number) =>
      apiService.getPotentialMatches(limit, offset, undefined, filters),
    [filters],
  );

  const {
    profiles,
    isLoading,
    errorMessage,
    hasMore,
    fetchProfiles,
    loadMoreProfiles,
    resetProfiles,
  } = usePaginatedProfileCards(fetchPotentialMatches, 20);

  useEffect(() => {
    // Reset and fetch when server-side filters change.
    resetProfiles();
    fetchProfiles();
  }, [fetchProfiles, resetProfiles]);

  const filteredProfiles = useMemo(() => {
    // Keep text search client-side for instant UX while preserving server-side filter support.
    return profiles.filter((profile) => {
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
    setFilters(DEFAULT_FILTERS);
  };

  const handleLoadMore = useCallback(() => {
    loadMoreProfiles();
  }, [loadMoreProfiles]);

  if (isLoading && profiles.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ProfileListInitialLoading message="Loading profiles..." />
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
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClearFilters={handleClearFilters}
      />
      <ProfileList
        profiles={filteredProfiles}
        isLoadingMore={isLoading && filteredProfiles.length > 0}
        onLoadMore={handleLoadMore}
        emptyMessage="No profiles found matching your criteria."
        emptyActionLabel="Clear Filters"
        onEmptyAction={handleClearFilters}
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
