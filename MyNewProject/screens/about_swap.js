import React from "react";
import {StyleSheet,Text,View,ScrollView,TouchableOpacity,Image} from "react-native";
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";





export default function AboutPage({ email = "SwapIt@gmail.com" }) {
  const navigation = useNavigation();
  const constantFromEmail = "aag11003@gmail.com"; // Constant "From" email

  const handleEmailPress = async () => {
    const subject = "Inquiry to SwapIt";
    const body = "Hello, I have a question about SwapIt.\n\n\n\nRegards";
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      body
    )}&reply-to=${encodeURIComponent(constantFromEmail)}`;

    try {
      const supported = await Linking.canOpenURL(mailto);
      if (supported) {
        await Linking.openURL(mailto);
      } else {
        console.error("Email client is not supported on this device.");
      }
    } catch (error) {
      console.error("Failed to open email client. Error:", error);
    }
  };
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About</Text>
        </View>
        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.description}>
            SwapIt is an innovative mobile platform tailored for university
            students, aiming to address financial and accessibility challenges
            in skill acquisition and resource sharing.
          </Text>
        </View>

        {/* Additional Sections */}
        <View style={styles.keyFeaturesSection}>
          <Text style={styles.subtitle}>Key Features</Text>
          <Text style={styles.feature}>➤ Skill Exchange</Text>
          <Text style={styles.feature}>➤ Item Bartering</Text>
          <Text style={styles.feature}>➤ Campus Based Community</Text>
          <Text style={styles.feature}>➤ Real-Time Chat</Text>
          <Text style={styles.feature}>➤ Personalized Recommendation</Text>
        </View>

        <View style={styles.purposeSection}>
          <Text style={styles.subtitle}>Purpose</Text>
          <Text style={styles.feature}>➤ Promote Resource Sharing</Text>
          <Text style={styles.feature}>➤ Create a Trusted Community</Text>
          <Text style={styles.feature}>➤ Reduce Financial Barriers</Text>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
          <Text style={styles.contactText}>Contact Us</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.contactDetails}>Karachi, Pakistan</Text>
        </TouchableOpacity>
      </View>


      {/* Sticky Footer with 5 Icons */}
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
            onPress={() => navigation.navigate("chatPage")}
          >
            <Image
              source={require("../assets/messages.png")}
              style={styles.footerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Myprofile")}
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
    backgroundColor: "#F5F5F5",
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
  navbar: {
    height: 60,
    backgroundColor: "#007B7F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 15,
  },
  logo: {
    width: 70,
    height: 70,
    position: "absolute",
    left: 18,
    top: 2,
  },
  navbarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 3, // Adjust based on your header position
    right: 227, // Adjust to match the spacing
    width: 35,
    height: 35,
    backgroundColor: "#FFF", // White background
    borderRadius: 20, // Circular button
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Shadow for Android
  },
  backIcon: {
    width: 15,
    height: 15,
    tintColor: "#007B7F", // Adjust to your app's theme color
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingVertical: 8,
    marginHorizontal: 66,
    marginTop: 2,
    backgroundColor: "#F7E8AF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 3,
  },
  headingIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  aboutSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 36, // Adjusted to move the description box down
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  keyFeaturesSection: {
    marginBottom: 30,
    marginTop: 20, // Adjusted to move the description box down
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007B7F",
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 5,
  },
  purposeSection: {
    marginBottom: 40,
  },
  contactButton: {
    backgroundColor: "#335c67",
    padding: 18,
    borderRadius: 13,
    alignItems: "center",
  },
  email: {
    textDecorationLine: "underline",
    color: "#FFFFFF", // Email color
    fontSize: 16,
  },
  contactText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  contactDetails: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 5,
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
