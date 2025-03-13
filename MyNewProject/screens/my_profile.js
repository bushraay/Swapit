// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons"; // Import the icon set
// import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Myprofile() {
//   const navigation = useNavigation();

//   // States to store user profile data
//   const [reviews, setReviews] = useState([]);

//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         // Get the email from AsyncStorage
//         const email = await AsyncStorage.getItem('userEmail');

//         if (!email) {
//           setError("Email not found. Please log in.");
//           setLoading(false);
//           return;
//         }

//         // Fetch the user profile using the email
//         const response = await axios.get(`http://10.20.5.187:5000/getUserProfileByEmail?email=${email}`);
//         setUserData(response.data.data);  // Assuming the API returns the user data inside `data`
//       } catch (err) {
//         setError("Error fetching user profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);


  

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   if (error) {
//     return <Text>{error}</Text>;
//   }


//   const handleDeleteSkill = async () => {
//     try {
//         const userEmail = await AsyncStorage.getItem("userEmail");

//         if (!userEmail) {
//             Alert.alert("Error", "User data not found. Please log in again.");
//             return;
//         }

//         const response = await axios.post("http://10.20.5.187:5000/DeleteSkill", { email: userEmail });

//         if (response.status === 200) {
//             Alert.alert("Success", "Skill deleted successfully!");
//             navigation.navigate("SkillRecommendationPage");
//         } else {
//             Alert.alert("Error", "Failed to delete skill.");
//         }
//     } catch (error) {
//         console.error("Error deleting skill:", error);
//         Alert.alert("Error", "An unexpected error occurred.");
//     }
// };

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backArrow}>{"<"}</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Profile</Text>
//         </View>

//         {/* Scrollable Content */}
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Profile Card */}
//           <View style={styles.profileCard}>
//             <View style={styles.profileImageContainer}>
//               <Ionicons
//                 name="person-circle"
//                 size={100}
//                 color="#777"
//                 style={styles.profileIcon}
//               />
//             </View>
//             {/* Pencil Icon for Edit */}
//             <TouchableOpacity
//               style={styles.editIcon}
//               onPress={() => navigation.navigate("Editprofile")}
//             >
//               <Ionicons name="pencil" size={18} color="#FFF" />
//             </TouchableOpacity>
//             <Text style={styles.profileName}>{userData.Name}</Text>
//             <View style={styles.profileDetailsContainer}>
//               <Text style={styles.profileDetails}>{userData.university}</Text>
//               <Text style={styles.profileAvailability}>
//                 Availability: {userData.Availability}
//               </Text>
//             </View>

//             {/* Rating */}
//             <View style={styles.ratingContainer}>
//               {Array(5)
//                 .fill(0)
//                 .map((_, index) => (
//                   <Image
//                     key={index}
//                     style={styles.ratingIcon}
//                   />
//                 ))}
//             </View>
//           </View>

//           {/* Skills Section */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>My Skills:</Text>
//             <Text style={styles.sectionContent}>{userData["Skills I Have"]}</Text>
//           </View>

//           {/* Learning Section */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Looking to Learn:</Text>
//             <Text style={styles.sectionContent}>{userData["Skills I Want"]}</Text>
//           </View>

//           {/* Reviews Section */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Reviews:</Text>
//             <Text style={styles.sectionContent}>
//               Really enjoyed studying, in-depth teaching.
//             </Text>
//           </View>

//           {/* Buttons */}
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => navigation.navigate("InfoAddPage")}
//             >
//               <Text style={styles.buttonText}>Update Skill</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.actionButton}
//                 onPress={handleDeleteSkill}
//               >
//                 <Text style={styles.buttonText}>Delete Skill</Text>
//               </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => navigation.navigate("AddItemPage")}
//             >
//               <Text style={styles.buttonText}>Add Item</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={styles.footerButton}
//             onPress={() => navigation.navigate("SkillRecommendationPage")}
//           >
//             <Image
//               source={require("../assets/skills.png")}
//               style={styles.footerIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.footerButton}
//             onPress={() => navigation.navigate("RecommendationPage")}
//           >
//             <Image
//               source={require("../assets/items.png")}
//               style={styles.footerIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.footerButton}
//             onPress={() => navigation.navigate("MessagingPage")}
//           >
//             <Image
//               source={require("../assets/messages.png")}
//               style={styles.footerIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.footerButton}
//             onPress={() => navigation.navigate("Editprofile")}
//           >
//             <Image
//               source={require("../assets/profile.png")}
//               style={styles.footerIcon}
//             />
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#FFF8E1" },
//   header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#335c67" },
//   backArrow: { fontSize: 20, color: "#FFF", marginRight: 10 },
//   headerTitle: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
//   scrollContent: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 200 },
//   profileCard: { alignItems: "center", backgroundColor: "#FFF", padding: 20, borderRadius: 10, marginBottom: 20 },
//   profileImageContainer: { marginBottom: 10 },
//   profileIcon: { width: 100, height: 100, borderRadius: 50 },
//   editIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#335c67", padding: 6, borderRadius: 12 },
//   profileName: { fontSize: 20, fontWeight: "bold", marginBottom: 5, color: "#333" },
//   profileDetailsContainer: { alignItems: "center", marginBottom: 15 },
//   profileDetails: { fontSize: 14, color: "#777" },
//   profileAvailability: { fontSize: 14, color: "#777" },
//   ratingContainer: { flexDirection: "row", marginBottom: 10 },
//   ratingIcon: { width: 20, height: 20, marginHorizontal: 2 },
//   section: { backgroundColor: "#FFF8E1", borderRadius: 10, padding: 15, marginBottom: 15 },
//   sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
//   sectionContent: { fontSize: 14, color: "#555" },
//   buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
//   actionButton: { flex: 1, backgroundColor: "#FFB343", paddingVertical: 10, borderRadius: 5, marginHorizontal: 5, alignItems: "center" },
//   buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
//   footer: { height: 70, backgroundColor: "#335c67", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0 },
//   footerButton: { alignItems: "center" },
//   footerIcon: { width: 30, height: 30, tintColor: "#FFF" },
// });
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Myprofile() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [reviews, setReviews] = useState([]); // ✅ Added state for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");

        if (!email) {
          setError("Email not found. Please log in.");
          setLoading(false);
          return;
        }

        // ✅ Fetch user profile
        const response = await axios.get(
          `http://10.20.5.187:5000/getUserProfileByEmail?email=${email}`
        );
        setUserData(response.data.data);

        // ✅ Fetch reviews
        const reviewResponse = await axios.get(
          `http://10.20.5.187:5000/getUserReviews?email=${email}`
        );
        if (reviewResponse.data.reviews) {
          setReviews(reviewResponse.data.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setError("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleDeleteSkill = async () => {
    try {
      const userEmail = await AsyncStorage.getItem("userEmail");

      if (!userEmail) {
        Alert.alert("Error", "User data not found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "http://10.20.5.187:5000/DeleteSkill",
        { email: userEmail }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Skill deleted successfully!");
        navigation.navigate("SkillRecommendationPage");
      } else {
        Alert.alert("Error", "Failed to delete skill.");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

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
              <Ionicons
                name="person-circle"
                size={100}
                color="#777"
                style={styles.profileIcon}
              />
            </View>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => navigation.navigate("Editprofile")}
            >
              <Ionicons name="pencil" size={18} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.profileName}>{userData?.Name}</Text>
            <View style={styles.profileDetailsContainer}>
              <Text style={styles.profileDetails}>{userData?.university}</Text>
              <Text style={styles.profileAvailability}>
                Availability: {userData?.Availability}
              </Text>
            </View>
          </View>

          {/* Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Skills:</Text>
            <Text style={styles.sectionContent}>{userData?.["Skills I Have"]}</Text>
          </View>

          {/* Learning Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking to Learn:</Text>
            <Text style={styles.sectionContent}>{userData?.["Skills I Want"]}</Text>
          </View>

          {/* ✅ Reviews Section - Now Fetching from Backend */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews:</Text>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <Text style={styles.reviewerEmail}>{review.reviewerEmail}</Text>
                  <Text style={styles.rating}>Rating: {review.rating} ⭐</Text>
                  <Text style={styles.comment}>{review.comment}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(review.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews available.</Text>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("InfoAddPage")}
            >
              <Text style={styles.buttonText}>Update Skill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteSkill}>
              <Text style={styles.buttonText}>Delete Skill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("AddItemPage")}
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#335c67" },
  backArrow: { fontSize: 20, color: "#FFF", marginRight: 10 },
  headerTitle: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
  scrollContent: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 200 },
  profileCard: { alignItems: "center", backgroundColor: "#FFF", padding: 20, borderRadius: 10, marginBottom: 20 },
  section: { backgroundColor: "#FFF8E1", borderRadius: 10, padding: 15, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  sectionContent: { fontSize: 14, color: "#555" },
  reviewCard: { backgroundColor: "#FFF", padding: 10, marginVertical: 5, borderRadius: 8, elevation: 2 },
  reviewerEmail: { fontWeight: "bold", fontSize: 16 },
  rating: { color: "#FFB343", fontWeight: "bold" },
  comment: { fontSize: 16, marginVertical: 5 },
  timestamp: { fontSize: 12, color: "#888" },
  noReviews: { textAlign: "center", fontSize: 16, color: "#555" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: { flex: 1, backgroundColor: "#FFB343", paddingVertical: 10, borderRadius: 5, marginHorizontal: 5, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

