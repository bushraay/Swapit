import React, { useState, useEffect} from "react";
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState("");
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const INITIAL_ITEMS_TO_SHOW = 6;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://192.168.100.174:5000/recommendedItems");
        if (response.data.status === "Ok") {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setIsSearching(false);
      setShowAllItems(false);
      try {
        const response = await axios.get("http://192.168.100.174:5000/recommendedItems");
        if (response.data.status === "Ok") {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    } else {
      setIsSearching(true);
      setShowAllItems(true);
      try {
        const response = await axios.get(`http://192.168.100.174:5000/searchItems?query=${encodeURIComponent(query)}`);
        if (response.data.status === "Ok") {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error searching items:", error);
      }
      const searchTerms = query.toLowerCase().split(" ");
      
      const scoredResults = items.map(item => {
        let score = 0;
        const matchTerms = (text, weight) => {
          if (!text) return 0;
          return searchTerms.reduce((acc, term) => {
            return acc + (text.toLowerCase().includes(term) ? weight : 0);
          }, 0);
        };

        score += matchTerms(item.ItemName, 5);
        score += matchTerms(item.PersonName, 4);
        score += matchTerms(item.Category, 3);
        score += matchTerms(item.Condition, 2);
        score += matchTerms(item.Description, 1);

        return { item, score };
      });

      const filteredResults = scoredResults
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(result => result.item);

      setSearchResults(filteredResults);
    }
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    return words.length > 20 ? words.slice(0, 20).join(" ") + "..." : description;
  };

  const getMenuItemStyle = (item) => {
    return highlightedItem === item
      ? { backgroundColor: "yellow",  borderRadius: 5 }
      : {};
  };

  const renderItemCard = (item, index) => (
    <View key={index} style={styles.itemCard}>
      <Image source={{ uri: item.Image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.ItemName}</Text>
        <Text style={styles.itemName}>Owner Name: {item.PersonName}</Text>
        <Text style={styles.itemCategory}>Category: {item.Category}</Text>
        <Text style={styles.itemCondition}>Condition: {item.Condition}</Text>
        <Text style={styles.itemDescription}>
          {truncateDescription(item.Description)}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ItemDescriptionPage", { 
              item: {
                Image: item.Image, 
                ItemName: item.ItemName, 
                PersonName: item.PersonName, 
                Category: item.Category, 
                Condition: item.Condition, 
                Description: item.Description
              } 
            })
          }
        >
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItems = () => {
    const displayItems = !isSearching ? items : searchResults;
    const itemsToDisplay = (!isSearching && !showAllItems) 
      ? displayItems.slice(0, INITIAL_ITEMS_TO_SHOW) 
      : displayItems;

    return (
      <>
        {itemsToDisplay.map((item, index) => renderItemCard(item, index))}
        {!isSearching && !showAllItems && items.length > INITIAL_ITEMS_TO_SHOW && (
          <TouchableOpacity 
            style={styles.showMoreButton} 
            onPress={() => setShowAllItems(true)}
          >
            <Text style={styles.showMoreText}>Show More Items</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuIconContainer}
          >
            <Icon name="bars" size={25} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Dashboard</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for items..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Image
              source={require("../assets/search.png")}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {items.length > 0 ? (
            renderItems()
          ) : (
            <Text style={styles.noItemsText}>No items available</Text>
          )}
        </ScrollView>

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
            onPress={() => navigation.navigate("MessagingPage",{previousScreen:'RecommendationPage'})}
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
                onPress={() => setMenuVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("SettingsPage")}
                onPressIn={() => setHighlightedItem("Settings")}
                onPressOut={() => setHighlightedItem("")}
                style={[styles.menuItem, getMenuItemStyle("Settings")]}
              >
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => navigation.navigate("HistoryPage")}
                onPressIn={() => setHighlightedItem("History")}
                onPressOut={() => setHighlightedItem("")}
                style={[styles.menuItem, getMenuItemStyle("History")]}
              >
                <Text style={styles.menuItemText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("HelpFeedbackPage")}
                onPressIn={() => setHighlightedItem("Help and Feedback")}
                onPressOut={() => setHighlightedItem("")}
                style={[styles.menuItem, getMenuItemStyle("Help and Feedback")]}
              >
                <Text style={styles.menuItemText}>Help and Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginPage")}
                onPressIn={() => setHighlightedItem("Log Out")}
                onPressOut={() => setHighlightedItem("")}
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
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  backArrow: {
    fontSize: 20,
    color: "#FFF",
    marginRight: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
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
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 34,
    height: 34,
    tintColor: "#FFFFF",
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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
    marginTop: 50,
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
  LogoutItem: {
    fontSize: 18,
    color: "#333",
    fontWeight: 'bold',
    marginVertical: 10,
  },
  plusIcon: {
    width: 20,
    height: 20,
    tintColor: "#007B7F",
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 80,
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
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 14,
    color: "#555555",
    marginTop: 10,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12,
    color: "#555555",
  },
  readMore: {
    color: "#007B7F",
    fontSize: 14,
    marginTop: 15,
    fontWeight: "bold",
    textDecorationLine: "underline",
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
});