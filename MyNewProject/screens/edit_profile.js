import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


import DropDownPicker from "react-native-dropdown-picker"; // Import dropdown picker

export default function EditProfile() {
  const navigation = useNavigation();

  // States to store user profile data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the email from AsyncStorage
        const email = await AsyncStorage.getItem('userEmail');

        if (!email) {
          setError("Email not found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch the user profile using the email
        const response = await axios.get(`http://10.20.5.46:5000/getUserProfileByEmail?email=${email}`);
        setUserData(response.data.data);  // Assuming the API returns the user data inside `data`
      } catch (err) {
        setError("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = () => {
    // You can handle the save functionality here to update the user profile
    console.log("Profile updated!");
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      {/* Profile Form */}
      <View style={styles.profileForm}>
        {/* Age */}
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          value={userData.Age}
          onChangeText={(text) => setUserData({ ...userData, Age: text })}
          placeholder="Enter your age"
        />

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, Email: text })}
          placeholder="Enter your email"
        />

        {/* University */}
        <Text style={styles.label}>University:</Text>
        <TextInput
          style={styles.input}
          value={userData.university}
          onChangeText={(text) => setUserData({ ...userData, university: text })}
          placeholder="Enter your university"
        />

        {/* Skills You Have */}
        <Text style={styles.label}>Skills You Have:</Text>
        <TextInput
          style={styles.input}
          value={userData["Skills I Have"]}
          onChangeText={(text) => setUserData({ ...userData, "Skills I Have": text })}
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

        {/* Skills You Want to Learn */}
        <Text style={styles.label}>Skills You Want To Learn:</Text>
        <TextInput
          style={styles.input}
          value={userData["Skills I Want"]}
          onChangeText={(text) => setUserData({ ...userData, "Skills I Want": text })}
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

        {/* Username */}
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={userData.user_name}
          onChangeText={(text) => setUserData({ ...userData, Username: text })}
          placeholder="Enter your username"
        />

        {/* Password */}
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={userData.Password}
          onChangeText={(text) => setUserData({ ...userData, Password: text })}
          placeholder="Enter your password"
        />

        {/* Availability */}
        <Text style={styles.label}>Availability:</Text>
        <TextInput
          style={styles.input}
          value={userData.Availability}
          onChangeText={(text) => setUserData({ ...userData, Availability: text })}
          placeholder="e.g., Weekends"
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    paddingTop: 20,
    paddingHorizontal: 20,
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
});
