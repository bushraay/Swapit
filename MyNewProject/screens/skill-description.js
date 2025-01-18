import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function SkillDescriptionPage({ route }) {
  const { skill } = route.params || {}; // Safely destructure skill
  const navigation = useNavigation();

  if (!skill) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No skill data available. Please go back and try again.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: '#007B7F',
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#fff' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backArrow}>{"<"}</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Skill Description</Text>
            </View>

            {/* Skill Icon */}
          <View style={styles.imageContainer}>
            {skill.Image ? (
              <Image source={{ uri: skill.Image }} style={styles.skillIcon} />
            ) : (
              <Text>No image available</Text>
            )}
          </View>

            {/* Skill Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.heading}>Skill Name:</Text>
              <Text style={styles.description}>
                {skill['Skills I Want'] || 'N/A'}
              </Text>

              <Text style={styles.heading}>Skill Description:</Text>
              <Text style={styles.description}>
                {skill.description || 'No description available.'}
              </Text>

              <Text style={styles.heading}>Basic Requirements:</Text>
              {skill.requirements && skill.requirements.length > 0 ? (
                skill.requirements.map((requirement, index) => (
                  <Text style={styles.description} key={index}>
                    - {requirement}
                  </Text>
                ))
              ) : (
                <Text style={styles.description}>No requirements listed.</Text>
              )}

              <Text style={styles.heading}>Software Requirements:</Text>
              {skill.software && skill.software.length > 0 ? (
                skill.software.map((software, index) => (
                  <Text style={styles.description} key={index}>
                    - {software}
                  </Text>
                ))
              ) : (
                <Text style={styles.description}>
                  No software requirements listed.
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.interestedButton}
                onPress={() =>
                  navigation.navigate('MessagingPage', {
                    skill: skill.name,
                  })
                }
              >
                <Text style={styles.buttonText}>Interested</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notInterestedButton}
                onPress={() => navigation.navigate('SkillRecommendationPage')}
              >
                <Text style={styles.buttonText}>Not Interested</Text>
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
              onPress={() => navigation.navigate("Myprofile")}
            >
              <Image
                source={require("../assets/profile.png")}
                style={styles.footerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1", // Light yellow background
  },
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Ensure space for the footer
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#335c67", // Darker shade for the header
  },
  backArrow: {
    fontSize: 23,
    color: "#FFF",
    marginRight: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  skillIcon: {
    width: 230,
    height: 200,
  },
  descriptionContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#335c67",
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 15,
    backgroundColor: "#FFF8E1",
  },
  interestedButton: {
    backgroundColor: "#007B7F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  notInterestedButton: {
    backgroundColor: "#FFB343",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  footer: {
    height: 70,
    backgroundColor: "#335c67",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    top: 727,// make it dynamic
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
