import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Import the icon set

export default function Myprofile() {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
                <Ionicons name="person-circle" size={100} color="#777" style={styles.profileIcon} />
                </View>
             {/* Pencil Icon for Edit */}
                <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => navigation.navigate("Editprofile")}
                >
                    <Ionicons name="pencil" size={18} color="#FFF" />
                </TouchableOpacity>
            <Text style={styles.profileName}>Ahmed Zohaib</Text>
            <View style={styles.profileDetailsContainer}>
                <Text style={styles.profileDetails}>Habib University</Text>
                <Text style={styles.profileAvailability}>Availability: Friday, Saturday</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Image
                    key={index}
                    // source={require("../assets/star-outline.png")} // Replace with your star icon asset
                    style={styles.ratingIcon}
                  />
                ))}
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Skills:</Text>
            <Text style={styles.sectionContent}>• Web Developer</Text>
            <Text style={styles.sectionContent}>• Figma</Text>
          </View>

          {/* Learning Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking to Learn:</Text>
            <Text style={styles.sectionContent}>• Guitar</Text>
            <Text style={styles.sectionContent}>• Piano</Text>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews:</Text>
            <Text style={styles.sectionContent}>
              Really enjoyed studying, in-depth teaching.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("infoaddPage")} // Adjust navigation target
            >
              <Text style={styles.buttonText}>Add Skill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("AddItemPage")} // Adjust navigation target
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
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
            onPress={() => navigation.navigate("MessagingPage")}
          >
            <Image
              source={require("../assets/messages.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Editprofile")}
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
    padding: 15,
    backgroundColor: "#335c67",
  },
  editIcon: {
  position: "absolute",
  top: 10,
  right: 10,
  backgroundColor: "#335c67",
  padding: 6,
  borderRadius: 12,
  elevation: 3,
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
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  profileDetails: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  profileDetailsContainer: {
  alignItems: "center",
  marginBottom: 15,
},
profileAvailability: {
  fontSize: 14,
  color: "#777",
  marginTop: 5,
},

  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratingIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  section: {
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  sectionContent: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFB343",
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
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
    tintColor: "#FFF",
  },
});
