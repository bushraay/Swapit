import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function SkillRecommendationPage() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState("");
  const [recommendedTutors, setRecommendedTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [selectedGender, setSelectedGender] = useState("All");
  const [popupVisible, setPopupVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const tutorsResponse = await axios.get("http://192.168.0.113:5000/recommendedTutors");
        if (tutorsResponse.data.status === "Ok") {
          setRecommendedTutors(tutorsResponse.data.data);
          setFilteredTutors(tutorsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedGender);
  };

  const handleGenderFilter = (Gender) => {
    setSelectedGender(Gender);
    applyFilters(searchQuery, Gender);
  };

  const applyFilters = (search, Gender) => {
    let filtered = recommendedTutors;

    // Apply gender filter first
    if (Gender !== "All") {
      filtered = filtered.filter(tutor => 
        tutor.Gender?.toLowerCase() === Gender.toLowerCase()
      );
    }

    // Then apply search filter
    if (search.trim() !== "") {
      const normalizedQuery = search.trim().toLowerCase();
      filtered = filtered.filter(tutor => {
        const skills = tutor["Skills I Have"]?.toLowerCase() || "";
        return skills.includes(normalizedQuery);
      });
    }

    setFilteredTutors(filtered);
  };

  // Rest of the code remains the same...
  const handleRating = (value) => {
    setRating(value);
  };

  const getMenuItemStyle = (item) => {
    return highlightedItem === item
      ? { backgroundColor: "yellow", borderRadius: 5 }
      : {};
  };
  const handleRating = (value) => {
    setRating(value);
  };
  const handleGenderFilter = (gender) => {
    setSelectedGender(gender);
    if (gender === "All") {
      setFilteredTutors(recommendedTutors);
    } else {
      const genderFilteredTutors = recommendedTutors.filter(
        (tutor) => tutor.gender === gender
      );
      setFilteredTutors(genderFilteredTutors);
    }
  };

  const getMenuItemStyle = (item) => {
    return highlightedItem === item
      ? { backgroundColor: "yellow",  borderRadius: 5 }
      : {};
  };
  
  const renderTutorCard = (tutor, index) => (
    <TouchableOpacity
      key={index}
      style={styles.tutorCard}
      onPress={() => navigation.navigate("TutorProfilePage", { tutor })}
    >
      <Icon name="user-circle" size={50} color="#007B7F" />
      <View style={{ marginTop: 13 }}>
        <Text style={styles.tutorSkills}>
          <Text style={styles.boldText}>Skills:</Text>
          <Text style={styles.skillName}>{tutor["Skills I Have"]}</Text>
        </Text>
      </View>
      <Text style={styles.tutorName}>{tutor.Name}</Text>
      <Text style={styles.tutorLearn}>Learn: {tutor["Skills I Want"]}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.menuIconContainer}
            >
              <Icon name="bars" size={25} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Skill Dashboard</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search for Skills..."
              placeholderTextColor="#777"
            />
          </View>
          {/* Gender Filter Buttons */}
          <View style={styles.filterContainer}>
            {["All", "Male", "Female"].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.filterButton,
                  selectedGender === gender && styles.selectedFilter,
                ]}
                onPress={() => handleGenderFilter(gender)}
              >
                <Text style={styles.filterText}>{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>


          <View style={styles.filterContainer}>
            {["All", "male", "female"].map((Gender) => (
              <TouchableOpacity
                key={Gender}
                style={[
                  styles.filterButton,
                  selectedGender === Gender && styles.selectedFilter,
                ]}
                onPress={() => handleGenderFilter(Gender)}
              >
                <Text style={styles.filterText}>{Gender}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>Recommended Tutors For You:</Text>
            <View style={styles.gridContainer}>
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor, index) => renderTutorCard(tutor, index))
              ) : (
                <Text style={styles.noResults}>No tutors found matching your criteria</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Rest of the component remains the same... */}
        {/* Footer */}
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
            {/* Menu Modal */}
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
        {/* Popup */}
        {popupVisible && (
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Review</Text>
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                  <Icon
                    name="star"
                    size={30}
                    color={star <= rating ? "#FFD700" : "#DDD"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.commentBox}
              placeholder="Share your experience about the user...."
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                console.log("Rating:", rating, "Comment:", comment);
                setPopupVisible(false); // Hide popup after submission
              }}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
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
  searchContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  popupContainer: {
    position: "absolute",
    bottom: 340,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  popupTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  commentBox: {
    height: 60,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007B7F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: { color: "#FFF", fontWeight: "bold" },
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
  contentContainer: {
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tutorCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tutorSkills: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  tutorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tutorLearn: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedFilter: {
    backgroundColor: "#007B7F",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
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
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedFilter: {
    backgroundColor: "#007B7F",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },

});