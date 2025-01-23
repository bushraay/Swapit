import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, database } from "F:/FYP - SwapIt/fyp/MyNewProject/react-native-chat/config/firebase.js"; 
import { doc, setDoc } from 'firebase/firestore';

export default function CreateAccountPage({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [Username, setUsername] = useState("");
  const [Age, setAge] = useState("");
  const [University, setUniversity] = useState("");
  const [Gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFirebaseSignup = async () => {
    try {
      console.log('Attempting Firebase signup for:', email);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created:', userCredential.user.email);
      
      // Update Firebase profile with username
      await updateProfile(userCredential.user, { 
        displayName: Username 
      });
      console.log('Firebase profile updated');
  
      // Add user to Firestore database
      await setDoc(doc(database, 'users', userCredential.user.email), {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name: Username,
        about: 'Available'
      });
      console.log('Firestore document created');
  
      return true;
    } catch (error) {
      console.log('Detailed Firebase error:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
  
      if (error.code === 'auth/email-already-in-use') {
        // You could try to delete the existing Firebase user here if needed
        Alert.alert(
          "Account Exists",
          "This email is already registered. Please use a different email or try logging in.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") },
            { 
              text: "Go to Login", 
              onPress: () => navigation.navigate("LoginPage") 
            }
          ]
        );
      } else {
        Alert.alert("Error", error.message);
      }
      return false;
    }
  };
  const checkEmailExists = async (email) => {
    try {
      // Check MongoDB
      const mongoResponse = await axios.post('http://10.20.4.53:5000/check-email', { 
        email 
      });
      const mongoExists = mongoResponse.data.exists;
  
      // We can't directly check Firebase, but we can handle it in the signup process
      
      return {
        mongoExists,
        message: mongoExists ? "Email already exists in the database" : "Email is available"
      };
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  };
  
  async function handleSubmit() {
    if (isSubmitting) return;
  
    try {
      setIsSubmitting(true);
  
      if (!firstName || !lastName || !email || !password || !rePassword) {
        Alert.alert("Error", "Please fill out all required fields.");
        return;
      }
      if (password !== rePassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
  
      const userData = {
        f_name: firstName,
        l_name: lastName,
        email: email,
        age: Age,
        university: University,
        gender: Gender,
        user_name: Username,
        password: password,
      };
  
      const res = await axios.post("http://10.20.4.223:5000/CreateAccount", userData, {
        timeout: 20000,
      });
  
      if (res.status === 201 && res.data.message === "User created successfully") {
        const firebaseSuccess = await handleFirebaseSignup();
  
        if (firebaseSuccess) {
          await AsyncStorage.setItem("userEmail", userData.email);
          await AsyncStorage.setItem("userName", userData.user_name);
          await AsyncStorage.setItem("userAge", userData.age.toString());
  
          Alert.alert("Success", "Account created successfully!");
          navigation.navigate("infoaddPage");
        } else {
          Alert.alert("Warning", "Account created but messaging setup incomplete.");
          navigation.navigate("infoaddPage");
        }
      } else {
        Alert.alert(JSON.stringify(res.data));
        navigation.navigate("LoginPage");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while creating the account.");
    } finally {
      setIsSubmitting(false);
    }
  }
  
    // } else {
    //   Alert.alert("Fill mandatory details");
    // }

  // const handleCreateAccount = () => {
  //   console.log("hey");
    
  //   if (!firstName || !lastName || !phone || !email || !password) {
  //     console.log("hey2");
  //     Alert.alert("Error", "Please fill out all fields.");
  //     console.log("hey");
  //     return;
  //   }
  //   Alert.alert("Success", "Account created successfully!");
  //   console.log("success");
    
  //   navigation.navigate("infoaddPage");
  // };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")} // Replace with your logo's actual path
                style={styles.logo}
              />
            </View>

            {/* Title and Subtitle */}
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Create an account and enjoy a world of learning and connections.
            </Text>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Age"
                value={Age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="University"
                value={University}
                onChangeText={setUniversity}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={Gender}
                onChangeText={setGender}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={Username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Re-write Password"
                value={rePassword}
                onChangeText={setRePassword}
                secureTextEntry
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add Skill</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#FFF8E1",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 190, // Adjust to your logo size
    height: 190,
    resizeMode: "contain",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "left",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FFB343",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  loginLink: {
    color: "#6D4C41",
    fontWeight: "bold",
  },
})