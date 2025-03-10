// import React from "react";
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   ScrollView, 
//   Image, 
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator
// } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
// import { auth, database } from "F:/FYP - SwapIt/fyp/MyNewProject/react-native-chat/config/firebase.js";
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// //import items from "C:/Users/DELL/Documents/GitHub/fyp/Backend/items";

// export default function ItemDescriptionPage({ route }) {
//   const navigation = useNavigation();
//   const { item } = route.params;
//   const [loading, setLoading] = React.useState(false);

//   const handleInterested = async () => {
//     try {
//       setLoading(true);
      
//       // 1. Get owner's full name from item
//       const ownerFullName = Item.Name; // Ensure this is the correct field
  
//       // 2. Find owner in MongoDB
//       const mongoResponse = await fetch('192.168.0.102:5000/get-user-by-fullname', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ fullName: ownerFullName }), // Ensure this is correct
//       });
  
//       if (!mongoResponse.ok) {
//         throw new Error('Owner not found in our system');
//       }
  
//       const mongoData = await mongoResponse.json();
//       const ownerEmail = mongoData.email;
  
//       // 3. Check if owner exists in Firebase
//       const firebaseUserRef = doc(database, 'users', ownerEmail);
//       const firebaseUserSnap = await getDoc(firebaseUserRef);
      
//       if (!firebaseUserSnap.exists()) {
//         throw new Error('Owner not registered in messaging system');
//       }
  
//       // 4. Create chat ID (sorted emails)
//       const currentUserEmail = auth.currentUser .email;
//       const chatId = [currentUserEmail, ownerEmail].sort().join('_');
  
//       // 5. Check/Create chat document
//       const chatRef = doc(database, 'chats', chatId);
//       const chatSnap = await getDoc(chatRef);
  
//       if (!chatSnap.exists()) {
//         await setDoc(chatRef, {
//           users: [
//             {
//               email: currentUserEmail,
//               name: auth.currentUser .displayName,
//               deletedFromChat: false
//             },
//             {
//               email: ownerEmail,
//               name: firebaseUserSnap.data().name,
//               deletedFromChat: false
//             }
//           ],
//           messages: [],
//           lastUpdated: new Date()
//         });
//       }
  
//       // 6. Navigate to chat
//       navigation.navigate('Chat', {
//         id: chatId,
//         chatName: firebaseUserSnap.data().name
//       });
  
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backArrow}>{"<"}</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Item Description</Text>
//         </View>

//         {/* Content */}
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Image source={{ uri: item.Image }} style={styles.itemImage} />
//           <Text style={styles.itemTitle}>{item.ItemName}</Text>
//           <Text style={styles.itemCategory}>Owner Name: {item.Name}</Text>
//           <Text style={styles.itemCategory}>Category: {item.Category}</Text>
//           <Text style={styles.itemCategory}>Condition: {item.Condition}</Text>
//           <Text style={styles.itemDescription}>{item.Description}</Text>

//           {/* Buttons */}
//           <View style={styles.buttonContainer}>
//             {loading ? (
//               <ActivityIndicator size="large" color="#007B7F" />
//             ) : (
//               <>
//                 <TouchableOpacity
//                   style={styles.notInterestedButton}
//                   onPress={handleInterested}
//                 >
//                   <Text style={styles.buttonText}>Interested</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={styles.notInterestedButton}
//                   onPress={() => navigation.navigate("RecommendationPage")}
//                 >
//                   <Text style={styles.buttonText}>Not Interested</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </ScrollView>

//         {/* Sticky Footer */}
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
//             onPress={() => navigation.navigate("chatPage")}
//           >
//             <Image
//               source={require("../assets/messages.png")}
//               style={styles.footerIcon}
//             />
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.footerButton}
//             onPress={() => navigation.navigate("Myprofile")}
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
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF8E1",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-start",
//     padding: 15,
//     backgroundColor: "#335c67", 
//   },
//   backArrow: {
//     fontSize: 20,
//     color: "#FFF",
//     marginRight: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     color: "#FFF",
//     fontWeight: "bold",
//     marginLeft: 10, 
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     paddingVertical: 15,
//     backgroundColor: "#FFF8E1",
//     marginTop: 20,
//   },
//   interestedButton: {
//     backgroundColor: "#007B7F",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   notInterestedButton: {
//     backgroundColor: "#FFB343",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
//   title: {
//     color: "#FFFFFF",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 80, // Ensure space for the footer
//   },
//   itemImage: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   itemTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#007B7F",
//     marginBottom: 10,
//   },
//   itemCategory: {
//     fontSize: 18,
//     color: "#555555",
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   itemDescription: {
//     fontSize: 16,
//     color: "#333333",
//     lineHeight: 24,
//   },
//   footer: {
//     height: 70,
//     backgroundColor: "#335c67",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   footerButton: {
//     alignItems: "center",
//   },
//   footerIcon: {
//     width: 30,
//     height: 30,
//     tintColor: "#FFFFFF",
//   },
// });
import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from 'C:/Users/Hp/Documents/GitHub/fyp/MyNewProject/react-native-chat/config/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ItemDescriptionPage({ route }) {
  const navigation = useNavigation();
  const { item } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleInterested = async () => {
    try {
      setLoading(true);
      const ownerFullName = item.Name; 
      console.log('Owner Full Name:', ownerFullName);

      const mongoResponse = await fetch('http://10.20.5.247:5000/get-user-by-fullname', {
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

      const currentUserEmail = auth.currentUser .email;
      const chatId = [currentUserEmail, ownerEmail].sort().join('_');

      const chatRef = doc(database, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          users: [
            {
              email: currentUserEmail,
              name: auth.currentUser .displayName,
              deletedFromChat: false
            },
            {
              email: ownerEmail,
              name: firebaseUserSnap.data().name,
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
          chatName: firebaseUserSnap.data().name
        }
      });

    } catch (error) {
      console.error('Full Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Description</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image source={{ uri: item.Image }} style={styles.itemImage} />
          <Text style={styles.itemTitle}>{item.ItemName}</Text>
          <Text style={styles.itemCategory}>Owner Name: {item.Name}</Text>
          <Text style={styles.itemCategory}>Category: {item.Category}</Text>
          <Text style={styles.itemCategory}>Condition: {item.Condition}</Text>
          <Text style={styles.itemDescription}>{item.Description}</Text>

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007B7F" />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.notInterestedButton}
                  onPress={handleInterested}
                >
                  <Text style={styles.buttonText}>Interested</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.notInterestedButton}
                  onPress={() => navigation.navigate("RecommendationPage")}
                >
                  <Text style={styles.buttonText}>Not Interested</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>

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
            onPress={() => navigation.navigate("MessagingPage", { previousScreen: "ItemDescriptionPage" })}
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
    backgroundColor: "#FFF8E1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginLeft: 10, 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 15,
    backgroundColor: "#FFF8E1",
    marginTop: 20,
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
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // Ensure space for the footer
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007B7F",
    marginBottom: 10,
  },
  itemCategory: {
    fontSize: 18,
    color: "#555555",
    marginBottom: 10,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
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