import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SkillMatchingPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { skill } = route.params; // Get the skill passed from SkillDescriptionPage

  // Sample data of tutors
  // const tutors = [
  //   { name: "James Smith", skills: "ReactNative", learn: "Photoshop" },
  //   { name: "Robbie Harrison", skills: "HTML&CSS", learn: "Python" },
  //   { name: "Elvin Bond", skills: "ReactNative", learn: "JavaScript" },
  //   { name: "Neha Mayumi", skills: "HTML&CSS", learn: "React" },
  // ];

  // Filter tutors based on the selected skill
  const filteredTutors = tutors.filter((tutor) => tutor.skills === skill);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backArrow}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Tutor Recommendation</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TouchableOpacity style={styles.searchIconContainer}>
                <Image
                  source={require("../assets/search.png")}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.searchBar}
                placeholder={`${skill}`} // Dynamically set the placeholder
                placeholderTextColor="#888"
                editable={false} // Make it non-editable for this use case
              />
            </View>

            {/* Tutors List */}
            <View contentContainerStyle={styles.tutorsContainer}>
              {filteredTutors.map((tutor, index) => (
                <View key={index} style={styles.tutorCard}>
                  <Image
                    source={require("../assets/profile.png")}
                    style={styles.tutorIcon}
                  />
                  <Text style={styles.tutorName}>{tutor.name}</Text>
                  <Text style={styles.tutorSkill}>Skills: {tutor.skills}</Text>
                  <Text style={styles.tutorLearn}>Learn: {tutor.learn}</Text>
                  <TouchableOpacity
                    style={styles.swapButton}
                    onPress={() =>
                      navigation.navigate("MessagingPage", {
                        tutorName: tutor.name,
                        tutorSkills: tutor.skills,
                        tutorLearn: tutor.learn,
                      })
                    }
                  >
                    <Text style={styles.swapButtonText}>Interested</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  mainContent: {
    flex: 1,
    marginBottom: 70, // Leave space for footer
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    backgroundColor: "#335c67", // Gold color
  },
  backArrow: {
    fontSize: 20,
    color: "#FFF",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 20, // Added space below the search bar
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    paddingHorizontal: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  tutorsContainer: {
    padding: 20,
  },
  tutorCard: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center", // Center align content
  },
  tutorIcon: {
    width: 60,
    height: 60,
    marginBottom: 10, // Space between the icon and the name
  },
  tutorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tutorSkill: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  tutorLearn: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  swapButton: {
    marginTop: 10,
    backgroundColor: "#FFB343",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  swapButtonText: {
    color: "#FFF",
    fontWeight: "bold",
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
