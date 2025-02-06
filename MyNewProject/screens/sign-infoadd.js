import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

export default function InfoAddPage() {
  const navigation = useNavigation();
  const [portfolioFileName, setPortfolioFileName] = useState("");
  const [availability, setAvailability] = useState("");
  const [prefilledUsername, setPrefilledUsername] = useState("");
  const [skillsList, setSkillsList] = useState([
    { skill: "", category: null, isCategoryOpen: false },
  ]);
  const [skillsWantList, setSkillsWantList] = useState([
    { skill: "", category: null, isCategoryOpen: false },
  ]);

  const categoryItems = [
    { label: "Programming", value: "Programming" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
  ];

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

  // Functions for "Skills You Have"
  const addSkillCategoryPair = () => {
    setSkillsList([
      ...skillsList,
      { skill: "", category: null, isCategoryOpen: false },
    ]);
  };

  const removeSkillCategoryPair = (index) => {
    if (skillsList.length > 1) {
      const updatedList = skillsList.filter((_, i) => i !== index);
      setSkillsList(updatedList);
    } else {
      Alert.alert("Error", "At least one skill and category is required.");
    }
  };

  const updateSkillCategoryPair = (index, field, value) => {
    const updatedList = [...skillsList];
    updatedList[index][field] = value;
    setSkillsList(updatedList);
  };

  // Functions for "Skills You Want to Learn"
  const addSkillCategoryPairWant = () => {
    setSkillsWantList([
      ...skillsWantList,
      { skill: "", category: null, isCategoryOpen: false },
    ]);
  };

  const removeSkillCategoryPairWant = (index) => {
    if (skillsWantList.length > 1) {
      const updatedList = skillsWantList.filter((_, i) => i !== index);
      setSkillsWantList(updatedList);
    } else {
      Alert.alert("Error", "At least one skill and category is required.");
    }
  };

  const updateSkillCategoryPairWant = (index, field, value) => {
    const updatedList = [...skillsWantList];
    updatedList[index][field] = value;
    setSkillsWantList(updatedList);
  };

  const handleLoginAndAddSkills = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("userEmail");
      
      if (!userEmail) {
        Alert.alert("Error", "User email not found. Please log in first.");
        return;
      }
  
      const skillsData = {
        email: userEmail,
        skills_i_have: skillsList.map((item) => ({
          skill: item.skill,
          category: item.category,
        })),
        skills_i_want: skillsWantList.map((item) => ({
          skill: item.skill,
          category: item.category,
        })),
        availability,
      };
  
      console.log("Sending skills data:", skillsData);
  
      const response = await axios.post(
        "http://192.168.0.103:5000/AddSkills",
        skillsData,
        { timeout: 10000 }
      );
  
      if (response.status === 201) {
        Alert.alert("Success", response.data.message);
  
        // Check if the user is logged in
        const isUserLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        
        if (isUserLoggedIn === "true") {
          // Navigate to skill dashboard if logged in
          navigation.navigate("SkillRecommendationPage");
        } else {
          // Navigate to login page if not logged in
          navigation.navigate("LoginPage");
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
          .post("http://10.20.5.46:5000/AddSkills", skillsData, { timeout: 10000 })
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
        Alert.alert("Error", "Failed to add skills.");
      }
    } catch (error) {
      console.error("Error in handleLoginAndAddSkills:", error);
  
      if (error.response) {
        Alert.alert("Error", `Server error: ${error.response.data.message}`);
      } else if (error.request) {
        Alert.alert("Error", "No response from the server. Check your network connection.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };
  



  const handlePortfolioSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.type === "success") {
        setPortfolioFileName(result.name);
      } else {
        Alert.alert("Cancelled", "File selection was cancelled.");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick a file: " + err.message);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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

          {/* Skills You Have Section */}
          <Text style={styles.label}>Skills You Have:</Text>
          {skillsList.map((item, index) => (
            <View key={index} style={styles.skillContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your skills"
                value={item.skill}
                onChangeText={(text) =>
                  updateSkillCategoryPair(index, "skill", text)
                }
              />
              <DropDownPicker
                open={item.isCategoryOpen}
                value={item.category}
                items={categoryItems}
                setOpen={(open) => {
                  const updatedList = [...skillsList];
                  updatedList[index].isCategoryOpen = open;
                  setSkillsList(updatedList);
                }}
                setValue={(callback) => {
                  const updatedList = [...skillsList];
                  updatedList[index].category = callback(updatedList[index].category);
                  setSkillsList(updatedList);
                }}
                style={styles.dropdown}
                placeholder="Select a category"
                listMode="SCROLLVIEW"
              />
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addSkillCategoryPair}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSkillCategoryPair(index)}
                  disabled={skillsList.length === 1}
                >
                  <Text style={styles.removeButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Skills You Want to Learn Section */}
          <Text style={styles.label}>Skills You Want to Learn:</Text>
          {skillsWantList.map((item, index) => (
            <View key={index} style={styles.skillContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter skills you want to learn"
                value={item.skill}
                onChangeText={(text) =>
                  updateSkillCategoryPairWant(index, "skill", text)
                }
              />
              <DropDownPicker
                open={item.isCategoryOpen}
                value={item.category}
                items={categoryItems}
                setOpen={(open) => {
                  const updatedList = [...skillsWantList];
                  updatedList[index].isCategoryOpen = open;
                  setSkillsWantList(updatedList);
                }}
                setValue={(callback) => {
                  const updatedList = [...skillsWantList];
                  updatedList[index].category = callback(
                    updatedList[index].category
                  );
                  setSkillsWantList(updatedList);
                }}
                style={styles.dropdown}
                placeholder="Select a category"
                listMode="SCROLLVIEW"
              />
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addSkillCategoryPairWant}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSkillCategoryPairWant(index)}
                  disabled={skillsWantList.length === 1}
                >
                  <Text style={styles.removeButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

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
              <Text style={styles.selectedFileText}>
                Selected File: {portfolioFileName}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLoginAndAddSkills}
          >
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
  skillContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#FFB343",
    width: 26,
    height: 26,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#FFB343",
    width: 26,
    height: 26,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
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
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
