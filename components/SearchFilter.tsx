// Pre-defined options for dropdowns (similar to Shaadi.com, Tinder)
const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => (i + 18).toString());
const HEIGHT_OPTIONS = [
  "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"",
  "7'0\""
];

const RELIGION_OPTIONS = [
  "Hindu", "Muslim", "Christian", "Sikh", "Parsi", "Jain", "Buddhist", "Jewish", "Other"
];

const CASTE_OPTIONS = [
  "General", "OBC", "SC", "ST", "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Other"
];

const EDUCATION_OPTIONS = [
  "High School", "Diploma", "Bachelor's", "Master's", "Doctorate", "Professional",
  "Engineering", "Medical", "Law", "Arts", "Commerce", "Science", "Other"
];

const OCCUPATION_OPTIONS = [
  "Engineer", "Doctor", "Teacher", "Business", "Software", "Manager", "Consultant",
  "Architect", "Lawyer", "CA", "Banker", "Government", "Defence", "Healthcare",
  "Marketing", "Sales", "HR", "Finance", "IT", "Other"
];

const INCOME_OPTIONS = [
  "Below ₹1 LPA", "₹1-3 LPA", "₹3-5 LPA", "₹5-8 LPA", "₹8-10 LPA",
  "₹10-15 LPA", "₹15-20 LPA", "₹20-30 LPA", "₹30-50 LPA", "Above ₹50 LPA"
];

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
  FlatList,
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

// Custom Dropdown Component
interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

function Dropdown({ label, value, options, onSelect, placeholder = "Select..." }: DropdownProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onSelect(option);
    setShowModal(false);
    setSearchText("");
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.input, styles.dropdownButton]}
        onPress={() => setShowModal(true)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{label}</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setSearchText(""); }}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.dropdownSearchInput}
              placeholder="Search..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.optionItem, item === value && styles.selectedOption]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, item === value && styles.selectedOptionText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
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
    if (filters.heightMin && filters.heightMax) {
      const minHeightIdx = HEIGHT_OPTIONS.indexOf(filters.heightMin);
      const maxHeightIdx = HEIGHT_OPTIONS.indexOf(filters.heightMax);
      if (minHeightIdx > maxHeightIdx) {
        Alert.alert(
          "Invalid Height Range",
          "Minimum height cannot be greater than maximum height",
        );
        return;
      }
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
              <View style={styles.halfInput}>
                <Dropdown
                  label="Min Age"
                  value={filters.ageMin}
                  options={AGE_OPTIONS}
                  onSelect={(value) => updateFilter("ageMin", value)}
                  placeholder="Select min age"
                />
              </View>
              <View style={styles.halfInput}>
                <Dropdown
                  label="Max Age"
                  value={filters.ageMax}
                  options={AGE_OPTIONS}
                  onSelect={(value) => updateFilter("ageMax", value)}
                  placeholder="Select max age"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="City or State"
                placeholderTextColor="#999"
                value={filters.location}
                onChangeText={(value) => updateFilter("location", value)}
              />
            </View>

            <ThemedText style={styles.sectionTitle}>
              🪔 Personal Details
            </ThemedText>

            <Dropdown
              label="Religion"
              value={filters.religion}
              options={RELIGION_OPTIONS}
              onSelect={(value) => updateFilter("religion", value)}
              placeholder="Select religion"
            />
            
            <Dropdown
              label="Caste/Community"
              value={filters.caste}
              options={CASTE_OPTIONS}
              onSelect={(value) => updateFilter("caste", value)}
              placeholder="Select caste"
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Dropdown
                  label="Min Height"
                  value={filters.heightMin}
                  options={HEIGHT_OPTIONS}
                  onSelect={(value) => updateFilter("heightMin", value)}
                  placeholder="Select height"
                />
              </View>
              <View style={styles.halfInput}>
                <Dropdown
                  label="Max Height"
                  value={filters.heightMax}
                  options={HEIGHT_OPTIONS}
                  onSelect={(value) => updateFilter("heightMax", value)}
                  placeholder="Select height"
                />
              </View>
            </View>

            <ThemedText style={styles.sectionTitle}>
              🎓 Education & Career
            </ThemedText>

            <Dropdown
              label="Education"
              value={filters.education}
              options={EDUCATION_OPTIONS}
              onSelect={(value) => updateFilter("education", value)}
              placeholder="Select education"
            />
            
            <Dropdown
              label="Occupation"
              value={filters.occupation}
              options={OCCUPATION_OPTIONS}
              onSelect={(value) => updateFilter("occupation", value)}
              placeholder="Select occupation"
            />
            
            <Dropdown
              label="Income Range"
              value={filters.income}
              options={INCOME_OPTIONS}
              onSelect={(value) => updateFilter("income", value)}
              placeholder="Select income range"
            />

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
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#E91E63",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
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
  // Dropdown modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
  dropdownSearchInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    margin: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#ffe4e6",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#E91E63",
    fontWeight: "600",
  },
});
