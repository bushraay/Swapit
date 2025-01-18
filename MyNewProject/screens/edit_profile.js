import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker"; // Import dropdown picker

export default function EditProfile() {
  const navigation = useNavigation();

  // State hooks for each field
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [skillsYouHave, setSkillsYouHave] = useState("");
  const [skillsCategory, setSkillsCategory] = useState(null);
  const [skillsYouWantToLearn, setSkillsYouWantToLearn] = useState("");
  const [learningCategory, setLearningCategory] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [availability, setAvailability] = useState("");

  // State for dropdown open/close
  const [isSkillsCategoryOpen, setIsSkillsCategoryOpen] = useState(false);
  const [isLearningCategoryOpen, setIsLearningCategoryOpen] = useState(false);

  // Dropdown items
  const categoryItems = [
    { label: "Programming", value: "Programming" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
  ];

  const handleSave = () => {
    if (
      !age ||
      !email ||
      !university ||
      !skillsYouHave ||
      !skillsCategory ||
      !skillsYouWantToLearn ||
      !learningCategory ||
      !username ||
      !password ||
      !availability
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    Alert.alert("Success", "Profile updated successfully!");
    navigation.navigate("Myprofile");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Info</Text>
        </View>

        {/* Form Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileCard}>
            <Ionicons name="person-circle" size={100} color="#777" style={styles.profileIcon} />
            <Text style={styles.profileTitle}>My Profile</Text>
            <Text style={styles.profileSubtitle}>Ahmed Zohaib</Text>
          </View>

          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>University:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your university"
            value={university}
            onChangeText={setUniversity}
          />

          <Text style={styles.label}>Skills You Have:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter skills you have"
            value={skillsYouHave}
            onChangeText={setSkillsYouHave}
            multiline
          />

          <Text style={styles.label}>Category:</Text>
          <DropDownPicker
            open={isSkillsCategoryOpen}
            value={skillsCategory}
            items={categoryItems}
            setOpen={setIsSkillsCategoryOpen}
            setValue={setSkillsCategory}
            setItems={() => {}}
            style={styles.dropdown}
            placeholder="Select a category"
            listMode="SCROLLVIEW"
          />

          <Text style={styles.label}>Skills You Want To Learn:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter skills you want to learn"
            value={skillsYouWantToLearn}
            onChangeText={setSkillsYouWantToLearn}
            multiline
          />

          <Text style={styles.label}>Category:</Text>
          <DropDownPicker
            open={isLearningCategoryOpen}
            value={learningCategory}
            items={categoryItems}
            setOpen={setIsLearningCategoryOpen}
            setValue={setLearningCategory}
            setItems={() => {}}
            style={styles.dropdown}
            placeholder="Select a category"
            listMode="SCROLLVIEW"
          />

          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Availability:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Weekends"
            value={availability}
            onChangeText={setAvailability}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
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
  dropdown: {
    marginBottom: 20,
    borderRadius: 5,
    borderColor: "#CCC",
    height: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#335c67",
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
    flexGrow: 1, 
    padding: 20,
    paddingBottom: 100, 
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileSubtitle: {
    fontSize: 16,
    color: "#777",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007B7F",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#FFB343",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
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
    tintColor: "#FFFFFF",
  },
});
