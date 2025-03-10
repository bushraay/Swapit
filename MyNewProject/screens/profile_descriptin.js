// import React, { useState, useEffect } from "react";
// import { StyleSheet,
//     Text,
//     View,
//     TextInput,
//     TouchableOpacity,
//     Image,
//     ScrollView, } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import axios from "axios";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// export default function TutorProfilePage({ route, navigation }) {
//   const { tutor } = route.params || {};

//   if (!tutor) {
//       return (
//           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//               <Text>No tutor data available. Please go back and try again.</Text>
//               <TouchableOpacity
//                   onPress={() => navigation.goBack()}
//                   style={{
//                       marginTop: 10,
//                       padding: 10,
//                       backgroundColor: '#007B7F',
//                       borderRadius: 5,
//                   }}
//               >
//                   <Text style={{ color: '#fff' }}>Go Back</Text>
//               </TouchableOpacity>
//           </View>
//       );
//   }

//   return (
//       <SafeAreaProvider>
//           <SafeAreaView style={styles.container}>
//               <ScrollView>
//                   {/* Header */}
//                   <View style={styles.header}>
//                       <TouchableOpacity onPress={() => navigation.goBack()}>
//                           <Text style={styles.backArrow}>{"<"}</Text>
//                       </TouchableOpacity>
//                   </View>

//                   {/* Tutor Profile */}
//                   <View style={styles.profileContainer}>
//                       <Icon name="user-circle" size={100} color="#007B7F" />
//                       <Text style={styles.tutorName}>{tutor.Name || 'No Name'}</Text>
//                       <Text style={styles.tutorDetails}>{tutor.university || 'Unknown University'}</Text>
//                       <Text style={styles.tutorDetails}>
//                           Availability: {tutor.availability || 'Not Available'}
//                       </Text>
//                   </View>
//                   {/* Skills */}
// <View style={styles.section}>
//     <Text style={styles.sectionTitle}>My Skills:</Text>
//     <Text style={styles.skillItem}>
//         {tutor.Skills_i_have && tutor.Skills_i_have.trim() !== ""
//             ? tutor.Skills_i_have
//             : "No skills listed"}
//     </Text>
// </View>

// {/* Learning Goals */}
// <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Looking to Learn:</Text>
//     <Text style={styles.skillItem}>
//         {tutor.Skills_i_want && tutor.Skills_i_want.trim() !== ""
//             ? tutor.Skills_i_want
//             : "No learning goals listed"}
//     </Text>
// </View>

//                   {/* Reviews */}
//                   <View style={styles.section}>
//                       <Text style={styles.sectionTitle}>Reviews:</Text>
//                       <Text style={styles.reviewItem}>1. Good teacher. Very helpful.</Text>
//                       <Text style={styles.reviewItem}>2. Very punctual.</Text>
//                   </View>

//                   {/* Buttons */}
//                   <View style={styles.buttonContainer}>
//                       <TouchableOpacity
//                           style={styles.InterestedButton}
//                           onPress={() => navigation.navigate('SearchMessagingPage')}
//                       >
//                           <Text style={styles.buttonText}>Interested</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                           style={styles.notInterestedButton}
//                           onPress={() => navigation.navigate('SkillRecommendationPage')}
//                       >
//                           <Text style={styles.buttonText}>Not Interested</Text>
//                       </TouchableOpacity>
//                   </View>
//               </ScrollView>

//               {/* Footer */}
//               <View style={styles.footer}>
//                   <TouchableOpacity
//                       style={styles.footerButton}
//                       onPress={() => navigation.navigate('SkillRecommendationPage')}
//                   >
//                       <Image
//                           source={require('../assets/skills.png')}
//                           style={styles.footerIcon}
//                       />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                       style={styles.footerButton}
//                       onPress={() => navigation.navigate('RecommendationPage')}
//                   >
//                       <Image
//                           source={require('../assets/items.png')}
//                           style={styles.footerIcon}
//                       />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                       style={styles.footerButton}
//                       onPress={() => navigation.navigate('MessagingPage')}
//                   >
//                       <Image
//                           source={require('../assets/messages.png')}
//                           style={styles.footerIcon}
//                       />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                       style={styles.footerButton}
//                       onPress={() => navigation.navigate('Myprofile')}
//                   >
//                       <Image
//                           source={require('../assets/profile.png')}
//                           style={styles.footerIcon}
//                       />
//                   </TouchableOpacity>
//               </View>
//           </SafeAreaView>
//       </SafeAreaProvider>
//   );
// }

import React, { useState } from "react";
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    ScrollView, 
    ActivityIndicator, 
    Alert 
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { auth, database } from 'C:/Users/Hp/Documents/GitHub/fyp/MyNewProject/react-native-chat/config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function TutorProfilePage({ route, navigation }) {
    const { tutor } = route.params || {};
    const [loading, setLoading] = useState(false);

    if (!tutor) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No tutor data available. Please go back and try again.</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        marginTop: 10,
                        padding: 10,
                        backgroundColor: "#007B7F",
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ color: "#fff" }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleInterested = async () => {
        try {
            setLoading(true);

            const tutorFullName = tutor.f_name + " " + tutor.l_name;
            console.log("Tutor's Full Name:", tutorFullName);

            // ✅ 1. Fetch the tutor's email from MongoDB
            const mongoResponse = await axios.post("http://10.20.5.247:5000/get-user-by-fullname", {
                fullName: tutorFullName
            });

            if (mongoResponse.status !== 200) {
                throw new Error("Tutor not found in system.");
            }

            const tutorEmail = mongoResponse.data.email;
            console.log("Tutor's Email:", tutorEmail);

            // ✅ 2. Get the logged-in user's email from Firebase Auth
            if (!auth.currentUser) {
                throw new Error("User is not logged in.");
            }

            const currentUserEmail = auth.currentUser.email;
            const currentUserName = auth.currentUser.displayName || "User";

            // ✅ 3. Check if the tutor exists in Firebase Firestore
            const tutorRef = doc(database, "users", tutorEmail);
            const tutorSnap = await getDoc(tutorRef);

            if (!tutorSnap.exists()) {
                throw new Error("Tutor is not registered in the messaging system.");
            }

            const tutorName = tutorSnap.data().name || tutorFullName;

            // ✅ 4. Generate a unique chat ID (Sorted Alphabetically)
            const chatId = [currentUserEmail, tutorEmail].sort().join("_");

            // ✅ 5. Check if a chat already exists
            const chatRef = doc(database, "chats", chatId);
            const chatSnap = await getDoc(chatRef);

            if (!chatSnap.exists()) {
                // ✅ 6. Create a new chat if it doesn't exist
                await setDoc(chatRef, {
                    users: [
                        { email: currentUserEmail, name: currentUserName, deletedFromChat: false },
                        { email: tutorEmail, name: tutorName, deletedFromChat: false }
                    ],
                    messages: [],
                    lastUpdated: new Date()
                });
                console.log("New chat created with:", tutorName);
            }

            // ✅ 7. Navigate to the chat screen
            navigation.navigate("MessagingPage", {
                screen: "Chat",
                params: {
                    id: chatId,
                    chatName: tutorName,
                }
            });

        } catch (error) {
            console.error("Error starting chat:", error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backArrow}>{"<"}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tutor Profile */}
                    <View style={styles.profileContainer}>
                        <Icon name="user-circle" size={100} color="#007B7F" />
                        <Text style={styles.tutorName}>{tutor.f_name + " " + tutor.l_name || "No Name"}</Text>
                        <Text style={styles.tutorDetails}>{tutor.university || "Unknown University"}</Text>
                        <Text style={styles.tutorDetails}>
                            Availability: {tutor.availability || "Not Available"}
                        </Text>
                    </View>

                    {/* Skills */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Skills:</Text>
                        <Text style={styles.skillItem}>
                            {tutor.skills_i_have ? tutor.skills_i_have.split(",").join(", ") : "No skills listed"}
                        </Text>
                    </View>

                    {/* Learning Goals */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Looking to Learn:</Text>
                        <Text style={styles.skillItem}>
                            {tutor.skills_i_want ? tutor.skills_i_want.split(",").join(", ") : "No learning goals listed"}
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#007B7F" />
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.InterestedButton, loading && styles.disabledButton]}
                                    onPress={!loading ? handleInterested : null}
                                >
                                    <Text style={styles.buttonText}>Interested</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.notInterestedButton}
                                    onPress={() => navigation.navigate("SkillRecommendationPage")}
                                >
                                    <Text style={styles.buttonText}>Not Interested</Text>
                                </TouchableOpacity>
                            </>
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
    backgroundColor: "#FFF8E1", // Light yellow background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#335c67", // Gold color
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 21,
    marginTop: 2,
    padding: 7,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    paddingHorizontal: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  tutorName: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 5,
  },
  tutorDetails: {
    fontSize: 16,
    color: "#555",
  },
  rating: {
    marginVertical: 10,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  skillItem: {
    fontSize: 16,
    marginBottom: 3,
  },
  reviewItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  InterestedButton: {
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
