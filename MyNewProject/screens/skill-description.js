import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from 'C:/Users/DELL/Documents/GitHub/fyp/MyNewProject/react-native-chat/config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SkillDescriptionPage({ route }) {
  const { skills } = route.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleInterested = async () => {
    try {
      setLoading(true);
      const ownerFullName = skills.Name; // Ensure this matches the skill data structure
      console.log('Owner Full Name:', ownerFullName);

      const mongoResponse = await fetch('http://10.20.2.156:5000/get-user-by-fullname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: ownerFullName }),
      });

      if (!mongoResponse.ok) {
        const errorData = await mongoResponse.json();
        console.error('Backend Error:', errorData);
        throw new Error(errorData.error || 'Owner not found in our system');
      }

      const mongoData = await mongoResponse.json();
      const ownerEmail = mongoData.email;

      const firebaseUserRef = doc(database, 'users', ownerEmail);
      const firebaseUserSnap = await getDoc(firebaseUserRef);

      if (!firebaseUserSnap.exists()) {
        throw new Error('Owner not registered in messaging system');
      }

      const currentUserEmail = auth.currentUser.email;
      const chatId = [currentUserEmail, ownerEmail].sort().join('_');

      const chatRef = doc(database, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          users: [
            {
              email: currentUserEmail,
              Name: auth.currentUser.displayName,
              deletedFromChat: false
            },
            {
              email: ownerEmail,
              Name: firebaseUserSnap.data().Name,
              deletedFromChat: false
            }
          ],
          messages: [],
          lastUpdated: new Date()
        });
      }

      navigation.navigate('MessagingPage', {
        screen: 'Chat',
        params: {
          id: chatId,
          chatName: firebaseUserSnap.data().Name
        }
      });

    } catch (error) {
      console.error('Full Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!skill) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No skill data available. Please go back and try again.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10, padding: 10, backgroundColor: '#007B7F', borderRadius: 5, }}>
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
              {loading ? (
                <ActivityIndicator size="large" color="#007B7F" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.interestedButton}
                    onPress={handleInterested}
                  >
                    <Text style={styles.buttonText}>Interested</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.notInterestedButton}
                    onPress={() => navigation.navigate('SkillRecommendationPage')}
                  >
                    <Text style={styles.buttonText}>Not Interested</Text>
                  </TouchableOpacity>
                </>
              )}
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
    backgroundColor: "#FFF8E1",
  },
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#335c67",
  },
  backArrow: {
    fontSize: 23,
    color: "#FFF",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
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