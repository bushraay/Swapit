import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const GetStartedPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={require("../assets/logo.png")} // Replace with your SwapIt logo path
        style={styles.logo}
      />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>
        Swap skills or items effortlessly—your gateway to learning, sharing, and trading like never before!
        </Text>

        {/* Join Now Button */}
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => navigation.navigate("CreateAccountPage")} 
        >
          <Text style={styles.joinButtonText}>Join Now</Text>
        </TouchableOpacity>

        {/* Login Text */}
        <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}> 
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#335c67", // Background color matching the design
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 370, // Adjust the size of the logo as needed
    height: 370,
    // marginBottom: 10,
  },
  content: {
    alignItems: "left",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 62,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "left",
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: "#FFB343", // Button color
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  joinButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  loginText: {
    fontSize: 17,
    color: "#FFF",
    textAlign: "center",
  },
  loginLink: {
    color: "#FFB343",
    fontWeight: "bold",
  },
});

export default GetStartedPage;
