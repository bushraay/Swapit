import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Myprofile() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: "",
    university: "",
    availability: "",
    skills: [],
    learning: [],
    reviews: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const userEmail = await AsyncStorage.getItem("userEmail");
          if (!userEmail) {
              alert("User not logged in");
              navigation.navigate("LoginPage");
              return;
          }
  
          const response = await axios.get(`http://10.20.2.155:5000/GetUserData`, {
              params: { email: userEmail } // Proper way to pass query parameters
          });
          
          if (response.status === 200) {
              setUserData(response.data);
          } else {
              alert("Failed to fetch user data");
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Error fetching user data. Please try again later.");
      }
  };
  

    fetchUserData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <Ionicons name="person-circle" size={100} color="#777" />
            </View>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => navigation.navigate("Editprofile")}
            >
              <Ionicons name="pencil" size={18} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.profileName}>{userData.name || "N/A"}</Text>
            <Text style={styles.profileDetails}>{userData.university || "N/A"}</Text>
            <Text style={styles.profileAvailability}>
              Availability: {userData.availability || "Not Available"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Skills:</Text>
            {userData.skills.length > 0 ? (
              userData.skills.map((skill, index) => (
                <Text key={index} style={styles.sectionContent}>• {skill}</Text>
              ))
            ) : (
              <Text style={styles.sectionContent}>No skills added yet.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking to Learn:</Text>
            {userData.learning.length > 0 ? (
              userData.learning.map((learn, index) => (
                <Text key={index} style={styles.sectionContent}>• {learn}</Text>
              ))
            ) : (
              <Text style={styles.sectionContent}>No learning goals specified.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews:</Text>
            {userData.reviews.length > 0 ? (
              userData.reviews.map((review, index) => (
                <Text key={index} style={styles.sectionContent}>{review}</Text>
              ))
            ) : (
              <Text style={styles.sectionContent}>No reviews yet.</Text>
            )}
          </View>
        </ScrollView>
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
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileDetails: {
    fontSize: 16,
    marginVertical: 5,
  },
  profileAvailability: {
    fontSize: 14,
    color: "#777",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContent: {
    fontSize: 14,
  },
});
