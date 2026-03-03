import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Shows full-screen loading content for profile list screens.
 */
export function ProfileListInitialLoading({
  message = "Loading profiles...",
}: LoadingStateProps) {
  return (
    <View style={styles.centerContainer}>
      <ThemedText style={styles.helperText}>{message}</ThemedText>
    </View>
  );
}

/**
 * Shows a retryable full-screen error state for profile lists.
 */
export function ProfileListError({
  message,
  onRetry,
  retryLabel = "Retry",
}: ErrorStateProps) {
  return (
    <View style={styles.centerContainer}>
      <ThemedText style={styles.errorText}>{message}</ThemedText>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>{retryLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Shows pagination footer loading text while additional profiles are fetched.
 */
export function ProfileListLoadingMore({
  message = "Loading more...",
}: LoadingStateProps) {
  return (
    <View style={styles.loadingMoreContainer}>
      <ThemedText style={styles.loadingMoreText}>{message}</ThemedText>
    </View>
  );
}

/**
 * Shows the empty state for profile lists with optional action button.
 */
export function ProfileListEmpty({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.helperText}>{message}</ThemedText>
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.retryButton} onPress={onAction}>
          <Text style={styles.retryButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  helperText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
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
    paddingHorizontal: 20,
  },
});

// TODO: Move colors to the theme palette after list-state components adopt theme tokens.