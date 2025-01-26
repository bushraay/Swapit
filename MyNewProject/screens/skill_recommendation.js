import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

export default function SkillRecommendationPage() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState("");
  const [allRecommendedTutors, setAllRecommendedTutors] = useState([]);
  const [displayedTutors, setDisplayedTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const tutorsResponse = await axios.get("http://192.168.100.174:5000/recommendedTutors");
        if (tutorsResponse.data.status === "Ok") {
          console.log("Fetched Tutors:", tutorsResponse.data.data); // Log fetched data
          setAllRecommendedTutors(tutorsResponse.data.data);
          setDisplayedTutors(tutorsResponse.data.data.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
    } else {
      setIsSearching(true);
      const normalizedQuery = query.trim().toLowerCase();
      const filtered = allRecommendedTutors.filter((tutor) => {
        // Ensure "Skills I Have" exists and is a string
        const skills = tutor["Skills I Have"]?.toLowerCase() || "";
        return skills.includes(normalizedQuery);
      });
      console.log("Search Results:", filtered); // Log search results
      setSearchResults(filtered);
    }
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

          <View style={styles.contentContainer}>
            {!isSearching ? (
              <>
                <Text style={styles.sectionTitle}>Recommended Tutors For You:</Text>
                <View style={styles.gridContainer}>
                  {displayedTutors.map((tutor, index) => renderTutorCard(tutor, index))}
                </View>
              </>
            ) : (
              <View style={styles.gridContainer}>
                {searchResults.length > 0 ? (
                  searchResults.map((tutor, index) => renderTutorCard(tutor, index))
                ) : (
                  <Text style={styles.noResults}>No tutors found for this skill</Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
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
            onPress={() => navigation.navigate("MessagingPage", { previousScreen: 'SkillRecommendationPage' })}
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
});
