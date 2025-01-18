import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const UserReviewPage = ({ navigation }) => {
  const [rating, setRating] = useState(0);

  const handleRatingPress = (index) => {
    setRating(index + 1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>{"<"}</Text>
            </TouchableOpacity>
        <Text style={styles.headerTitle}>User Review</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Icon name="user-circle" size={60} color="#3A3A3A" />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Ahmed Zohaib</Text>
            <Text style={styles.university}>Habib University</Text>
          </View>
        </View>

        {/* Feedback Section */}
        <Text style={styles.feedbackQuestion}>How was your experience?</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRatingPress(index)}>
              <Icon
                name={index < rating ? "star" : "star-o"}
                size={30}
                color="#FFD700" // Gold color
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Description Input */}
        <TextInput
          style={styles.descriptionInput}
          placeholder="Write your feedback..."
          placeholderTextColor="#6B6B6B"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("SkillRecommendationPage")}>
          <Image source={require("../assets/skills.png")} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("RecommendationPage")}>
          <Image source={require("../assets/items.png")} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("MessagingPage")}>
          <Image source={require("../assets/messages.png")} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Myprofile")}>
          <Image source={require("../assets/settings.png")} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#335c67",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  backArrow: {
      fontSize: 20,
      color: "#FFF",
      marginRight: 10,
    },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileDetails: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  university: {
    fontSize: 14,
    color: "#666",
  },
  feedbackQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  descriptionInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F8E8A2",
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#FFB343",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#335c67",
    padding: 10,
  },
  footerIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFF",
  },
});

export default UserReviewPage;
