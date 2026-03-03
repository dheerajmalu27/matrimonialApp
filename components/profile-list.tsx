import ProfileCard from "@/components/ProfileCard";
import {
  ProfileListEmpty,
  ProfileListLoadingMore,
} from "@/components/profile-list-state";
import type { ProfileCardItem } from "@/utils/profileCardMapper";
import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";

interface ProfileListProps {
  profiles: ProfileCardItem[];
  isLoadingMore: boolean;
  onLoadMore: () => void;
  emptyMessage: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

/**
 * Shared profile list renderer for card-based screens.
 */
export function ProfileList({
  profiles,
  isLoadingMore,
  onLoadMore,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
}: ProfileListProps) {
  const renderProfile = useCallback(
    ({ item }: { item: ProfileCardItem }) => <ProfileCard profile={item} />,
    [],
  );

  return (
    <FlatList
      data={profiles}
      renderItem={renderProfile}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingMore ? <ProfileListLoadingMore message="Loading more..." /> : null
      }
      ListEmptyComponent={
        <ProfileListEmpty
          message={emptyMessage}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
});

// TODO: Add optional pull-to-refresh support for list screens that need manual refresh.