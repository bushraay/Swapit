import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfile() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [skillsCategory, setSkillsCategory] = useState(null);
  const [learningCategory, setLearningCategory] = useState(null);
  const [isSkillsCategoryOpen, setIsSkillsCategoryOpen] = useState(false);
  const [isLearningCategoryOpen, setIsLearningCategoryOpen] = useState(false);

  const categoryItems = [
    { label: "Programming", value: "Programming" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");

        if (!email) {
          setError("Email not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://10.20.2.150:5000/getUserProfileByEmail?email=${email}`
        );
        setUserData(response.data.data);
      } catch (err) {
        setError("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = () => {
    console.log("Profile updated!");
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Form */}
          <View style={styles.profileForm}>
            <Text style={styles.label}>Age:</Text>
            <TextInput
              style={styles.input}
              value={userData.Age}
              onChangeText={(text) => setUserData({ ...userData, Age: text })}
              placeholder="Enter your age"
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) =>
                setUserData({ ...userData, Email: text })
              }
              placeholder="Enter your email"
            />

            <Text style={styles.label}>University:</Text>
            <TextInput
              style={styles.input}
              value={userData.university}
              onChangeText={(text) =>
                setUserData({ ...userData, university: text })
              }
              placeholder="Enter your university"
            />

            <Text style={styles.label}>Skills You Have:</Text>
            <TextInput
              style={styles.input}
              value={userData["Skills I Have"]}
              onChangeText={(text) =>
                setUserData({ ...userData, "Skills I Have": text })
              }
              placeholder="Enter skills you have"
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
              value={userData["Skills I Want"]}
              onChangeText={(text) =>
                setUserData({ ...userData, "Skills I Want": text })
              }
              placeholder="Enter skills you want to learn"
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
              value={userData.user_name}
              onChangeText={(text) =>
                setUserData({ ...userData, Username: text })
              }
              placeholder="Enter your username"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={userData.Password}
              onChangeText={(text) =>
                setUserData({ ...userData, Password: text })
              }
              placeholder="Enter your password"
            />

            <Text style={styles.label}>Availability:</Text>
            <TextInput
              style={styles.input}
              value={userData.Availability}
              onChangeText={(text) =>
                setUserData({ ...userData, Availability: text })
              }
              placeholder="e.g., Weekends"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 70, // Space for footer
  },
  profileForm: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007B7F",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  dropdown: {
    marginBottom: 20,
    borderRadius: 5,
    borderColor: "#CCC",
    height: 50,
  },
  saveButton: {
    backgroundColor: "#FFB343",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // footer: {
  //   height: 70,
  //   backgroundColor: "#335c67",
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   alignItems: "center",
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
  // footerButton: {
  //   alignItems: "center",
  // },
  footer: { height: 70, backgroundColor: "#335c67", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0 },
  footerButton: { alignItems: "center" },
  footerIcon: { width: 30, height: 30, tintColor: "#FFF" },

});
