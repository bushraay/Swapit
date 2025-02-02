import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "F:/FYP - SwapIt/fyp/MyNewProject/react-native-chat/config/firebase.js";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFirebaseLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase login successful");
      return true;
    } catch (error) {
      console.error("Firebase login failed:", error);
      return false;
    }
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Please fill in both email and password!");
      return;
    }

    try {
      // Attempt MongoDB login
      const userData = { email, password };
      const res = await axios.post(
        "http://192.168.0.103:5000/Login",
        userData,
        { timeout: 10000 }
      );

      if (res.data.status === "Ok") {
        // If MongoDB login is successful, proceed with Firebase login
        const firebaseSuccess = await handleFirebaseLogin();

        if (firebaseSuccess) {
          // Both logins successful
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("token", res.data.data);
          await AsyncStorage.setItem("userEmail", email); // Save the logged-in email

          Alert.alert("Logged In Successfully!");
          navigation.navigate("SkillRecommendationPage");
        } else {
          Alert.alert("Error", "Failed to sync with messaging service");
        }
      } else {
        Alert.alert(JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to SwapIt!</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Logo */}
        <Image
          source={require("../assets/logo.png")} // Replace with your logo's actual path
          style={styles.logo}
        />

        {/* Login Form */}
        <Text style={styles.loginTitle}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Not a member?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("CreateAccountPage")}
          >
            Sign up!
          </Text>
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 MyApp. All rights reserved.</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  header: {
    backgroundColor: "#335c67",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
    resizeMode: "contain",
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FFB343",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signupText: {
    marginTop: 20,
    color: "#335c67",
    fontWeight: "bold",
  },
  signupLink: {
    color: "#FFB343",
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
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
