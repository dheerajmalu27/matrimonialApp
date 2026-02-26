import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

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

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export default function SearchFilter({
  onSearch,
  onFilter,
  onClearFilters,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleApplyFilters = () => {
    // Validate age range
    const minAge = parseInt(filters.ageMin);
    const maxAge = parseInt(filters.ageMax);
    if (filters.ageMin && filters.ageMax && minAge > maxAge) {
      Alert.alert(
        "Invalid Age Range",
        "Minimum age cannot be greater than maximum age",
      );
      return;
    }

    // Validate height range
    const minHeight = parseFloat(filters.heightMin);
    const maxHeight = parseFloat(filters.heightMax);
    if (filters.heightMin && filters.heightMax && minHeight > maxHeight) {
      Alert.alert(
        "Invalid Height Range",
        "Minimum height cannot be greater than maximum height",
      );
      return;
    }

    onFilter(filters);
    setShowFilters(false);
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
    onClearFilters();
    setShowFilters(false);
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderFilterInput = (
    label: string,
    key: keyof FilterOptions,
    placeholder: string,
    keyboardType: "default" | "numeric" = "default",
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={filters[key]}
        onChangeText={(value) => updateFilter(key, value)}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#E91E63" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, location, or occupation..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterIconButton}
          onPress={() => setShowFilters(true)}
        >
          <View style={styles.filterBadge}>
            <IconSymbol name="line.3.horizontal.decrease.circle" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.filterIcon}>🔍</Text>
              <ThemedText style={styles.modalTitle}>Filters</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText style={styles.sectionTitle}>
              👤 Basic Information
            </ThemedText>

            <View style={styles.row}>
              {renderFilterInput("Min Age", "ageMin", "18", "numeric")}
              {renderFilterInput("Max Age", "ageMax", "50", "numeric")}
            </View>

            {renderFilterInput("Location", "location", "City or State")}

            <ThemedText style={styles.sectionTitle}>
              🪔 Personal Details
            </ThemedText>

            {renderFilterInput("Religion", "religion", "e.g., Hindu, Muslim")}
            {renderFilterInput(
              "Caste/Community",
              "caste",
              "Your caste or community",
            )}

            <View style={styles.row}>
              {renderFilterInput("Min Height", "heightMin", "5'0\"", "default")}
              {renderFilterInput("Max Height", "heightMax", "6'0\"", "default")}
            </View>

            <ThemedText style={styles.sectionTitle}>
              🎓 Education & Career
            </ThemedText>

            {renderFilterInput(
              "Education",
              "education",
              "Degree or qualification",
            )}
            {renderFilterInput(
              "Occupation",
              "occupation",
              "Job title or field",
            )}
            {renderFilterInput("Income Range", "income", "Annual income")}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelAction]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.cancelActionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.applyAction]}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyActionText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  filterIconButton: {
    padding: 2,
  },
  filterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E91E63",
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: "#E91E63",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E91E63",
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelAction: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelActionText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  applyAction: {
    backgroundColor: "#E91E63",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  applyActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
