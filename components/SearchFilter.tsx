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
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, location, or occupation..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>🔽</Text>
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
            <ThemedText style={styles.modalTitle}>Filters</ThemedText>
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
              Basic Information
            </ThemedText>

            <View style={styles.row}>
              {renderFilterInput("Min Age", "ageMin", "18", "numeric")}
              {renderFilterInput("Max Age", "ageMax", "50", "numeric")}
            </View>

            {renderFilterInput("Location", "location", "City or State")}

            <ThemedText style={styles.sectionTitle}>
              Personal Details
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
              Education & Career
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
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    marginRight: 10,
  },
  searchButton: {
    width: 50,
    height: 45,
    backgroundColor: "#FF6B6B",
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  filterButton: {
    width: 50,
    height: 45,
    backgroundColor: "#f8f9fa",
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 10,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
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
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "500",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
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
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelAction: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelActionText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  applyAction: {
    backgroundColor: "#FF6B6B",
  },
  applyActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
