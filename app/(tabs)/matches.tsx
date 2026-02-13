import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  image: string;
  compatibility: number;
  lastMessage?: string;
  isOnline: boolean;
}

const mockMatches: Match[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 28,
    location: "Mumbai, India",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    compatibility: 95,
    lastMessage: "Hey! How are you doing?",
    isOnline: true,
  },
  {
    id: "2",
    name: "Rahul Kumar",
    age: 30,
    location: "Delhi, India",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    compatibility: 88,
    lastMessage: "Thanks for the message!",
    isOnline: false,
  },
  {
    id: "3",
    name: "Anjali Patel",
    age: 26,
    location: "Ahmedabad, India",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    compatibility: 92,
    isOnline: true,
  },
  {
    id: "4",
    name: "Vikram Singh",
    age: 32,
    location: "Jaipur, India",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    compatibility: 85,
    isOnline: false,
  },
];

export default function MatchesScreen() {
  const renderMatchItem = ({ item }: { item: Match }) => (
    <Link href={`/profile/${item.id}`} asChild>
      <TouchableOpacity style={styles.matchCard}>
        <View style={styles.matchContent}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            {item.isOnline && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.matchInfo}>
            <View style={styles.nameRow}>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <ThemedText style={styles.age}>{item.age}</ThemedText>
            </View>

            <ThemedText style={styles.location}>{item.location}</ThemedText>

            <View style={styles.compatibilityRow}>
              <ThemedText style={styles.compatibility}>
                {item.compatibility}% Match
              </ThemedText>
              {item.lastMessage && (
                <ThemedText style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </ThemedText>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Matches</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Connect with people who match your preferences
        </ThemedText>
      </View>

      <FlatList
        data={mockMatches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchesList}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  matchesList: {
    padding: 20,
  },
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  matchInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  age: {
    fontSize: 16,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  compatibilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compatibility: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
});
