import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
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
              <View style={styles.ageContainer}>
                <Text style={styles.age}>{item.age}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <ThemedText style={styles.location}>{item.location}</ThemedText>
            </View>

            <View style={styles.compatibilityRow}>
              <View style={styles.compatibilityBadge}>
                <Text style={styles.compatibilityIcon}>💖</Text>
                <ThemedText style={styles.compatibility}>
                  {item.compatibility}% Match
                </ThemedText>
              </View>
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
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.headerIcon}>💘</Text>
          </View>
          <ThemedText style={styles.headerTitle}>Your Matches</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Connect with people who match your preferences
          </ThemedText>
        </View>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E91E63",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  matchesList: {
    padding: 15,
  },
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#E91E63",
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
    width: 65,
    height: 65,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#E91E63",
  },
  onlineIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
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
  ageContainer: {
    backgroundColor: "#fce4ec",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  age: {
    fontSize: 14,
    color: "#E91E63",
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  compatibilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compatibilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fce4ec",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compatibilityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  compatibility: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#E91E63",
  },
  lastMessage: {
    fontSize: 13,
    color: "#888",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
});
