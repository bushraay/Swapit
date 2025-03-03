import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function RecommendationPage() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState("");
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default filter is "All"

  // Categories for filtering
  const categories = ["All", "Books", "Sports", "Electronics", "Stationery", "Accessories"];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://10.20.6.136:5000/recommendedItems");
        if (response.data.status === "Ok") {
          setItems(response.data.data);
          setFilteredItems(response.data.data); // Initially display all items
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    applyFilters(category, searchQuery); // Apply filters when category changes
  };

  const getMenuItemStyle = (item) => {
    return highlightedItem === item
      ? { backgroundColor: "yellow",  borderRadius: 5 }
      : {};
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(selectedCategory, query); // Apply filters when search query changes
  };

  const applyFilters = (category, query) => {
    let filtered = items;

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((item) => item.Category === category);
    }

    // Filter by search query (only item name)
    if (query.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.ItemName.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuIconContainer}
          >
            <Icon name="bars" size={25} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Dashboard</Text>
        </View>

        {/* Search and Filters */}
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search for items..."
              placeholderTextColor="#777"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterButton,
                  selectedCategory === category && styles.selectedFilter,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.filterText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Display Filtered Items */}
          <ScrollView style={styles.scrollContainer}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <Image source={{ uri: item.Image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>Name: {item.ItemName}</Text>
                    <Text style={styles.itemCategory}>
                      Category: {item.Category}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ItemDescriptionPage", { item })
                      }
                    >
                      <Text style={styles.readMore}>Read More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No items available</Text>
            )}
          </ScrollView>
        </View>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("SkillRecommendationPage")}
          >
            <Image
              source={require("../assets/skills.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("RecommendationPage")}
          >
            <Image
              source={require("../assets/items.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("MessagingPage")}
          >
            <Image
              source={require("../assets/messages.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Myprofile")}
          >
            <Image
              source={require("../assets/profile.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
        </View>
        <Modal
                  visible={menuVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setMenuVisible(false)}
                >
                  <View style={styles.menuOverlay}>
                    <View style={styles.menuContainer}>
                      <TouchableOpacity
                        onPress={() => setMenuVisible(false)} // Close the menu
                        style={styles.closeButton}
                      >
                        <Text style={styles.closeText}>Close</Text>
                      </TouchableOpacity>
                              {/* Menu Items */}
                              <TouchableOpacity
                        onPress={() => {
                          setMenuVisible(false); // Close modal
                          navigation.navigate("SettingsPage"); // Navigate to Settings
                        }}
                        style={[styles.menuItem, getMenuItemStyle("Settings")]}
                      >
                        <Text style={styles.menuItemText}>Settings</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setMenuVisible(false); // Close modal
                          navigation.navigate("HistoryPage"); // Navigate to History
                        }}
                        style={[styles.menuItem, getMenuItemStyle("History")]}
                      >
                        <Text style={styles.menuItemText}>History</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setMenuVisible(false); // Close modal
                          setPopupVisible(true); // Show popup for Help and Feedback
                        }}
                        style={[styles.menuItem, getMenuItemStyle("Help and Feedback")]}
                      >
                        <Text style={styles.menuItemText}>Review</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setMenuVisible(false); // Close modal
                          navigation.navigate("LoginPage"); // Navigate to Login
                        }}
                        style={[styles.menuItem, getMenuItemStyle("Log Out")]}
                      >
                        <Text style={styles.menuItemText}>Log Out</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    backgroundColor: "#335c67",
  },
  menuIconContainer: {
    marginRight: 15,
  },
  footer: {
    height: 70,
    backgroundColor: "#335c67",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    alignItems: "center",
  },
  footerIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    marginBottom: 70, // Ensures space above footer
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  filterContainer: {
  flexDirection: "row",
  backgroundColor: "#FFF8E1",
  position: "absolute", // Keep the filters at a fixed position
  top: 56, // Adjust based on the height of the header
  zIndex: 8, // Ensure it stays on top of other content
  width: "100%", // Full width to match the screen
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderColor: "#CCC",
},

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 36,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  selectedFilter: {
    backgroundColor: "#335c67",
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 50,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007B7F",
  },
  itemCategory: {
    fontSize: 14,
    color: "#555555",
    marginVertical: 5,
    fontWeight: "bold",
  },
  readMore: {
    color: "#007B7F",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  noItemsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  menuContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginTop: 50, // Adjust as needed for better visibility
    marginHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    padding: 5,
  },
  closeText: {
    fontSize: 16,
    color: "#007B7F",
    fontWeight: "bold",
  },
  menuItem: {
    fontSize: 18,
    color: "#333",
    marginVertical: 10,
  },
});
