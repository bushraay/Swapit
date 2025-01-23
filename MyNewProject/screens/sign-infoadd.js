import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import LinearGradient from "react-native-linear-gradient";

export default function infoaddPage() {
  const navigation = useNavigation();
  const [portfolioFileName, setPortfolioFileName] = useState("");
  const [skillsHave, setSkillsHave] = useState("");
  const [skillsCategoryHave, setSkillsCategoryHave] = useState(null);
  const [skillsWant, setSkillsWant] = useState("");
  const [skillsCategoryWant, setSkillsCategoryWant] = useState(null);
  const [availability, setAvailability] = useState("");
  const [prefilledUsername, setPrefilledUsername] = useState(""); // State for username
  const [isSkillsCategoryOpen, setIsSkillsCategoryOpen] = useState(false);
  const [isLearningCategoryOpen, setIsLearningCategoryOpen] = useState(false);
  const [skillsCategory, setSkillsCategory] = useState(null);
  const [learningCategory, setLearningCategory] = useState(null);

  // Dropdown items
  const categoryItems = [
    { label: "Programming", value: "Programming" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
  ];
  // Fetch username from AsyncStorage
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const storedUserEmail = await AsyncStorage.getItem("userEmail");
        if (storedUserEmail) {
          setPrefilledUsername(storedUserEmail);
        }
      } catch (error) {
        console.error("Error fetching username from AsyncStorage:", error);
        Alert.alert("Error", "Unable to fetch username.");
      }
    };

    fetchUserEmail();
  }, []);
  
  // const handleLoginNavigation = async () => {
  //   try {
  //     const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
  //     if (isLoggedIn === "true") {
  //       // Navigate to Skill Recommendation if logged in
  //       navigation.navigate("SkillRecommendationPage");
  //     } else {
  //       // Navigate to Login if not logged in
  //       navigation.navigate("LoginPage");
  //     }
  //   } catch (error) {
  //     console.error("Error checking login status:", error);
  //     Alert.alert("Error", "An error occurred while checking login status.");
  //   }
  // };
  const handleLoginAndAddSkills = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
  
      if (isLoggedIn === "true") {
        // User is logged in, proceed with adding skills
        const userEmail = await AsyncStorage.getItem("userEmail");
        const userName = await AsyncStorage.getItem("userName");
        const userAge = await AsyncStorage.getItem("userAge");
  
        if (!userEmail || !userName || !userAge) {
          Alert.alert("Error", "User data not found. Please sign up or log in again.");
          return;
        }
  
        const skillsData = {
          email: userEmail,
          name: userName,
          age: parseInt(userAge, 10),
          skills_i_have: skillsHave,
          category_skills_i_have: skillsCategoryHave,
          skills_i_want: skillsWant,
          category_skills_i_want: skillsCategoryWant,
          availability,
        };
  
        axios
          .post("http://10.20.4.223:5000/AddSkills", skillsData, { timeout: 10000 })
          .then((res) => {
            if (res.status === 201) {
              Alert.alert("Success", res.data.message);
              navigation.navigate("LoginPage");
            } else {
              Alert.alert("Error", "Failed to add skills.");
            }
          })
          .catch((e) => {
            console.error(e);
            Alert.alert("Error", "An error occurred while adding skills.");
          });
      } else {
        navigation.navigate("CreateAccountPage");
      }
    } catch (error) {
      console.error("Error handling login and adding skills:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  
  
  const handlePortfolioSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Limit to PDF files
      });

      if (result.type === "success") {
        setPortfolioFileName(result.name); // Store file name
      } else {
        Alert.alert("Cancelled", "File selection was cancelled.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick a file: " + err.message);
    }
  };

  // const handleAddSkills = async () => {
  //   try {
  //     // Retrieve user data from AsyncStorage
  //     // const userId = await AsyncStorage.getItem("userId");
  //     const userEmail = await AsyncStorage.getItem("userEmail");
  //     const userName = await AsyncStorage.getItem("userName");
  //     const userAge = await AsyncStorage.getItem("userAge");
  
  //     if (!userEmail || !userName || !userAge) {
  //       Alert.alert("Error", "User data not found. Please sign up or log in again.");
  //       return;
  //     }
  
  //     const skillsData = {
  //       user_name: userName,
  //       email: userEmail, // Send email instead of user_id
  //       name: userName,   // User's name from sign-up
  //       age: parseInt(userAge, 10), // Convert age back to integer
  //       skills_i_have: skillsHave,
  //       category_skills_i_have: skillsCategoryHave,
  //       skills_i_want: skillsWant,
  //       category_skills_i_want: skillsCategoryWant,
  //       availability,
  //     };
  
  //     axios
  //       .post("http://10.20.4.53:5000/AddSkills", skillsData, { timeout: 10000 })
  //       .then((res) => {
  //         if (res.status === 201) {
  //           Alert.alert("Success", res.data.message);
  //           console.log("hey");
            
  //           navigation.navigate("LoginPage");
  //           console.log("hey1");
            
  //         } else {
  //           Alert.alert("Error", "Failed to add skills.");
  //         }
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         Alert.alert("Error", "An error occurred while adding skills.");
  //       });
  //   } catch (e) {
  //     console.log(e);
  //     Alert.alert("Error", "An error occurred while retrieving user data.");
  //   }
  // };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Skills</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={prefilledUsername}
              editable={false}
            />
          <Text style={styles.label}>Skills You Have:</Text>
          <TextInput style={styles.input} placeholder="Enter your skills" multiline
          value={skillsHave}
          onChangeText={setSkillsHave} />

          <Text style={styles.label}>Category:</Text>
          <DropDownPicker
            open={isSkillsCategoryOpen} // Use the correct state for "open"
            value={skillsCategoryHave} // Use the state for the value
            items={categoryItems} // Dropdown items
            setOpen={setIsSkillsCategoryOpen} // State updater for open
            setValue={setSkillsCategoryHave} // State updater for value
            setItems={() => {}} // No additional items
            style={styles.dropdown} // Style for dropdown
            placeholder="Select a category"
            listMode="SCROLLVIEW"
            />
          

          <Text style={styles.label}>Skills You Want to Learn:</Text>
          <TextInput style={styles.input} placeholder="Enter skills you want to learn" multiline
            value={skillsWant}
            onChangeText={setSkillsWant} 

            />

          <Text style={styles.label}>Category:</Text>
          <DropDownPicker
            open={isLearningCategoryOpen}
            value={skillsCategoryWant}
            items={categoryItems}
            setOpen={setIsLearningCategoryOpen}
            setValue={setSkillsCategoryWant}
            setItems={() => {}}
            style={styles.dropdown}
            placeholder="Select a category"
            listMode="SCROLLVIEW"
          />
          <Text style={styles.label}>Availability:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your availability (e.g., Friday, Saturday)"
            value={availability}
            onChangeText={setAvailability}
          />

          <View style={styles.portfolioContainer}>
            <TouchableOpacity
              onPress={handlePortfolioSelect}
              style={styles.uploadButton}
            >
              <Text style={styles.uploadButtonText}>Upload your portfolio</Text>
            </TouchableOpacity>
            {portfolioFileName ? (
              <Text style={styles.selectedFileText}>Selected File: {portfolioFileName}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLoginAndAddSkills}>
                    <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>

        
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 MyApp. All rights reserved.</Text>
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
  dropdown: {
    marginBottom: 20,
    borderRadius: 5,
    borderColor: "#CCC",
    height: 50,
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
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownList: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    position: "absolute",
    zIndex: 1,
    width: "100%",
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  portfolioContainer: {
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: "#FFB343",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedFileText: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FFB343",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});