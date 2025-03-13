
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Text,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { auth, database } from 'C:/Users/DELL/Documents/GitHub/fyp/MyNewProject/react-native-chat/config/firebase.js';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { colors } from '../config/constants';
import EmojiModal from 'react-native-emoji-modal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';

async function sendPushNotification(expoPushToken, message, senderName) {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: `default`,
      title: `New message from ${message.user.name || senderName}`,
      body: message.text || `Sent an image`,
      data: { chatId: message._id },
    }),
  });
}

function Chat({ route }) {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recipientToken, setRecipientToken] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isTradeTypeModalVisible, setIsTradeTypeModalVisible] = useState(false);
  const [userResponse, setUserResponse] = useState(null);
  const [tradeType, setTradeType] = useState(null);
  const [recipientName, setRecipientName] = useState(null); // New state for recipient's name
  const messagesRef = useRef(messages);
  const modalTransitionRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleBackPress = useCallback(() => {
    const userMessages = messagesRef.current.filter(
      (message) => message.user._id === auth?.currentUser?.email
    );

    console.log("All messages:", messagesRef.current);
    console.log("User messages:", userMessages);

    if (userMessages.length > 0) {
      const lastUserMessage = userMessages[0];
      const lastMessageDate = new Date(lastUserMessage.createdAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      console.log("Last User Message Date:", lastMessageDate);
      console.log("Three Days Ago:", threeDaysAgo);

      if (lastMessageDate < threeDaysAgo) {
        setIsConfirmationModalVisible(true);
      } else {
        navigation.goBack();
      }
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );
      return () => backHandler.remove();
    }
  }, [handleBackPress]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="#000000"
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
        });
      }
    }, [handleBackPress, navigation])
  );

  const handleUserResponse = useCallback((response) => {
    console.log('handleUserResponse called with:', response);

    if (response === 'Yes') {
      if (modalTransitionRef.current) {
        clearTimeout(modalTransitionRef.current);
      }

      setIsConfirmationModalVisible(false);

      modalTransitionRef.current = setTimeout(() => {
        console.log('Setting trade type modal visible');
        setIsTradeTypeModalVisible(true);
        modalTransitionRef.current = null;
      }, Platform.OS === 'ios' ? 500 : 300);
    } else {
      setIsConfirmationModalVisible(false);
      navigation.goBack();
    }

    setUserResponse(response);
  }, [navigation]);

  const handleTradeTypeResponse = useCallback(async (type) => {
    console.log('handleTradeTypeResponse called with:', type);
    setTradeType(type);

    setIsTradeTypeModalVisible(false);

    const currentUserEmail = auth?.currentUser?.email;
    const tradedWith = route.params.email || recipient_email;
    console.log('Traded With:', tradedWith);
    const logData = {
      currentUser: currentUserEmail,
      tradedWith: tradedWith,
      exchangeType: type,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://10.20.5.187:5000/logdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });

      const result = await response.json();
      console.log("Trade logged successfully:", result);

      if (!response.ok) {
        throw new Error("Failed to save log data");
      }

      setTimeout(() => {
        navigation.navigate("HistoryPage", { refresh: true });
      }, Platform.OS === 'ios' ? 500 : 300);
    } catch (error) {
      console.error("Error saving trade data:", error);
    }
  }, [navigation, route.params]);

  useEffect(() => {
    return () => {
      if (modalTransitionRef.current) {
        clearTimeout(modalTransitionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(database, 'chats', route.params.id), async (document) => {
      const recipient = document.data().users.find(user => user.email !== auth?.currentUser?.email);
      const recipient_email = recipient.email;
      const recipient_name = recipient.name; // Extract the recipient's name
      setRecipientName(recipient_name); // Set the recipient's name in state

      const userDocRef = doc(database, 'users', recipient_email);
      const userDocSnap = await getDoc(userDocRef);
      setRecipientToken(userDocSnap.data().token);
      setMessages(
        document.data().messages.map((message) => ({
          ...message,
          createdAt: message.createdAt.toDate(),
          image: message.image ?? '',
        }))
      );
    });

    return () => unsubscribe();
  }, [route.params.id]);

  const onSend = useCallback(
    async (m = []) => {
      const chatDocRef = doc(database, 'chats', route.params.id);
      const chatDocSnap = await getDoc(chatDocRef);

      const chatData = chatDocSnap.data();
      const data = chatData.messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toDate(),
        image: message.image ?? '',
      }));

      const messagesWillSend = [
        {
          ...m[0],
          sent: true,
          received: false,
          createdAt: new Date(),
        },
      ];

      let chatMessages = GiftedChat.append(data, messagesWillSend);

      await setDoc(
        doc(database, 'chats', route.params.id),
        {
          messages: chatMessages,
          lastUpdated: Date.now(),
        },
        { merge: true }
      );

      if (recipientToken) {
        try {
          await sendPushNotification(
            recipientToken,
            m[0],
            auth?.currentUser?.displayName || 'Someone'
          );
        } catch (error) {
          console.error('Error sending push notification:', error);
        }
      }
    },
    [route.params.id, recipientToken]
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImageAsync(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    setUploading(false);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
      console.log('Image URI:', uri);
    });
    const randomString = uuid.v4();
    const fileRef = ref(getStorage(), `uploads/${randomString}.jpg`);

    const uploadTask = uploadBytesResumable(fileRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload percent:', progress);
      },
      (error) => {
        console.error('Error uploading image:', error);
        setUploading(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        onSend([
          {
            _id: randomString,
            createdAt: new Date(),
            text: '',
            image: downloadUrl,
            user: {
              _id: auth?.currentUser?.email,
              name: auth?.currentUser?.displayName,
              avatar: 'https://i.pravatar.cc/300',
            },
          },
        ]);
      }
    );
  };

  const renderBubble = useMemo(
    () => (props) => (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#007B7F' },
          left: { backgroundColor: 'lightgrey' },
        }}
      />
    ),
    []
  );

  const renderSend = useMemo(
    () => (props) => (
      <>
        <TouchableOpacity style={styles.addImageIcon} onPress={pickImage}>
          <View>
            <Ionicons name="attach-outline" size={32} color="#007B7F" />
          </View>
        </TouchableOpacity>
        <Send {...props}>
          <View style={{ justifyContent: 'center', height: '100%', marginLeft: 8, marginRight: 4, marginTop: 12 }}>
            <Ionicons name="send" size={24} color="#007B7F" />
          </View>
        </Send>
      </>
    ),
    []
  );

  const renderInputToolbar = useMemo(
    () => (props) => (
      <InputToolbar {...props} containerStyle={styles.inputToolbar} renderActions={renderActions} />
    ),
    []
  );

  const renderActions = useMemo(
    () => () => (
      <TouchableOpacity style={styles.emojiIcon} onPress={handleEmojiPanel}>
        <View>
          <Ionicons name="happy-outline" size={32} color="#007B7F" />
        </View>
      </TouchableOpacity>
    ),
    [modal]
  );

  const handleEmojiPanel = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      Keyboard.dismiss();
      setModal(true);
    }
  }, [modal]);

  const renderLoading = useMemo(
    () => () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007B7F" />
      </View>
    ),
    []
  );

  const renderLoadingUpload = useMemo(
    () => () => (
      <View style={styles.loadingContainerUpload}>
        <ActivityIndicator size="large" color="#007B7F" />
      </View>
    ),
    []
  );

  useEffect(() => {
    console.log('isTradeTypeModalVisible:', isTradeTypeModalVisible);
  }, [isTradeTypeModalVisible]);

history.js:
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { auth } from "C:/Users/DELL/Documents/GitHub/fyp/MyNewProject/react-native-chat/config/firebase.js";
import Icon from "react-native-vector-icons/FontAwesome"; // Import star icons for rating

export default function HistoryPage() {
  const [logData, setLogData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userEmail = auth?.currentUser?.email;
        if (!userEmail) {
          console.error("User email not found!");
          return;
        }

        console.log("Fetching history for:", userEmail);

        const response = await fetch(`http://10.20.5.187:5000/logdata?email=${encodeURIComponent(userEmail)}`);
        const result = await response.json();

        if (response.ok) {
          console.log("Fetched history:", result.data);
          setLogData(result.data);
        } else {
          console.error("Error fetching history:", result.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    const focusListener = navigation.addListener("focus", fetchHistory);
    fetchHistory();

    return () => navigation.removeListener("focus", fetchHistory);
  }, [navigation]);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewSubmit = () => {
    console.log("Trade ID:", selectedTrade);
    console.log("Rating:", rating, "Comment:", comment);
    setPopupVisible(false);
    setRating(0);
    setComment("");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>History</Text>
          </View>

          <ScrollView style={styles.scrollContent}>
            {logData.length > 0 ? (
              logData.map((entry, index) => (
                <View key={index} style={styles.logContainer}>
                  <Text style={styles.logText}>
                    <Text style={styles.logLabel}>Traded With:</Text> {entry.tradedWith}
                  </Text>
                  <Text style={styles.logText}>
                    <Text style={styles.logLabel}>Exchange Type:</Text> {entry.exchangeType}
                  </Text>
                  {/* Add Review Button */}
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => {
                      setPopupVisible(true);
                      setSelectedTrade(entry);
                    }}
                  >
                    <Text style={styles.reviewButtonText}>Add Review</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noHistoryText}>No exchanges recorded yet.</Text>
            )}
          </ScrollView>
        </View>

        {/* Review Popup Modal */}
        <Modal visible={popupVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.popupContainer}>
              <Text style={styles.popupTitle}>Review</Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                    <Icon name="star" size={30} color={star <= rating ? "#FFD700" : "#DDD"} />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.commentBox}
                placeholder="Share your experience about the user...."
                value={comment}
                onChangeText={(text) => setComment(text)}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("SkillRecommendationPage")}
          >
            <Image source={require("../assets/skills.png")} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("RecommendationPage")}
          >
            <Image source={require("../assets/items.png")} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("MessagingPage")}
          >
            <Image source={require("../assets/messages.png")} style={styles.footerIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("Myprofile")}
          >
            <Image source={require("../assets/profile.png")} style={styles.footerIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  mainContent: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#335c67" },
  backArrow: { fontSize: 20, color: "#FFF", marginRight: 10 },
  headerTitle: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
  scrollContent: { paddingTop: 20, paddingHorizontal: 20 },
  logContainer: { backgroundColor: "#FFF", borderRadius: 10, padding: 15, marginBottom: 15 },
  logText: { fontSize: 16, color: "#335c67", marginBottom: 5 },
  logLabel: { fontWeight: "bold", color: "#335c67" },
  reviewButton: { marginTop: 10, backgroundColor: "#335c67", padding: 10, borderRadius: 5, alignItems: "center" },
  reviewButtonText: { color: "#FFF", fontWeight: "bold" },
  noHistoryText: { textAlign: "center", fontSize: 16, color: "#777", marginTop: 50 },

  // Popup Modal Styles
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  popupContainer: { width: 300, backgroundColor: "#FFF", padding: 20, borderRadius: 10 },
  popupTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  starContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  commentBox: { borderWidth: 1, borderColor: "#DDD", borderRadius: 5, padding: 10, marginBottom: 10 },
  submitButton: { backgroundColor: "#335c67", padding: 10, borderRadius: 5, alignItems: "center" },
  submitText: { color: "#FFF", fontWeight: "bold" },
  closeButton: { marginTop: 10, alignItems: "center" },
  closeText: { color: "#335c67", fontWeight: "bold" },

  footer: { height: 70, backgroundColor: "#335c67", flexDirection: "row", justifyContent: "space-around", alignItems: "center", position: "absolute", bottom: 0, left: 0, right: 0 },
  footerButton: { alignItems: "center" },
  footerIcon: { width: 30, height: 30, tintColor: "#FFF" },
});
server.js:
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const items = require('./items');
const LogData = require('./LogData');
const router = express.Router();
// const Item = require('./item');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = 'mongodb+srv://ayesha:dRhXznyyTNous7EC@cluster0.af1kc.mongodb.net/SwapIt?retryWrites=true&w=majority';
mongoose.connect(mongoUri)
   .then(() => console.log('MongoDB connected...'))
   .catch(err => console.log(err));

require('./UserDetail');
require('./Skills');
require('./UserDetailed');

const User = mongoose.model("UserInfo");
const Skills = mongoose.model("Skills");
const MergedUser = mongoose.model( "MergedUser");

const JWT_SECRET = "hdidjnfbjsakjdhdiksmnhcujiksjieowpqlaskjdsolwopqpowidjxmmxm";

// Root route
app.get("/", (req, res) => {
   res.status(200).json({ message: "Root route is working!" });
});
app.post('/check-email', async (req, res) => {
   try {
     const { email } = req.body;
     const user = await User.findOne({ email });
     res.json({ exists: !!user });
   } catch (error) {
     console.error("Error checking email:", error);
     res.status(500).json({ error: "Internal server error" });
   }
 });


//  let nextUserId = 600;
// app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { user_id } = req.query;

//       if (!user_id) {
//          return res.status(400).json({ message: "first name is required" });
//       }

//       // Find the user in the database using email_y
//       const user = await UserDetailed.findOne({ user_id });

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json({
//          status: "Ok",
//          data: {
//             user_id: user.user_id,
//             f_name: user.f_name,
//             l_name: user.l_name,
//             email: user.email_y,  // Fixing email field
//             age: user.age,
//             university: user.university,
//             user_name: user.user_name || "Not Set", // Handle undefined
//             gender: user.gender || "Not Specified",
//             skills_i_have: user.skills_i_have || "Not Set",
//             skills_i_want: user.skills_i_want || "Not Set",
//             availability: user.availability || "Not Set",
//             image: user.image || "No Image"
//          }
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });

// API to get user by email
app.get('/getUserProfileByEmail', async (req, res) => {
   try {
      const { email } = req.query;

      if (!email) {
         return res.status(400).json({ message: "Email is required" });
      }

      const user = await MergedUser.findOne({ email });

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
         status: "Ok",
         data: user
      });

   } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
   }
});


// bipartite

// Function to perform bipartite matching
const bipartiteMatch = (users) => {
   let matches = [];
 
   users.forEach((user1) => {
     const [skillsHave, skillsWant] = user1.skills;
 
     users.forEach((user2) => {
       if (user1.user_id !== user2.user_id) {
         const [skillsHave2, skillsWant2] = user2.skills;
         
         // If user1 wants skill that user2 has, it's a match
         if (skillsWant.some(skill => skillsHave2.includes(skill)) && skillsWant2.some(skill => skillsHave.includes(skill))) {
           matches.push({ user1: user1.user_id, user2: user2.user_id });
         }
       }
     });
   });
 
   return matches;
 };
 
 // Endpoint to fetch user preferences and apply bipartite matching
 app.get("/userPreferences", async (req, res) => {
   try {
     const users = await MergedUser.find();
     const userPreferences = users.map((user) => {
       const skillsHave = user.skills_i_have ? user.skills_i_have.split(',') : [];
       const skillsWant = user.skills_i_want ? user.skills_i_want.split(',') : [];
       
       return {
         user_id: user.user_id,
         skills: [skillsHave, skillsWant]
       };
     });
 
     const matches = bipartiteMatch(userPreferences);
     res.json({ userPreferences, matches });
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 });
 

// //user id se
// app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { user_id } = req.query;

//       if (!user_id ) {
//          return res.status(400).json({ message: "User ID is required" });
//       }

//       const user = await MergedUser.findOne({user_id});
      
//       // Search by user_id if provided, otherwise search by email
      

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

//       res.status(200).json({
//          status: "Ok",
//          data: user
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });



//  app.get('/getUserProfile', async (req, res) => {
//    try {
//       const { email } = req.query;

//       if (!email) {
//          return res.status(400).json({ message: "Email is required" });
//       }

//       // Find the user in the database
//       const user = await UserDetailed.findOne({ email });

//       if (!user) {
//          return res.status(404).json({ message: "User not found" });
//       }

      
//       res.status(200).json({
//          status: "Ok",
//          data: {
//             f_name: user.f_name,
//             l_name: user.l_name,
//             email: user.email,
//             age: user.age,
//             university: user.university,
//             user_name: user.user_name,
//             skills_i_have: skills ? skills.skills_i_have : [],
//             skills_i_want: skills ? skills.skills_i_want : [],
//             availability: skills ? skills.availability : "Not Set",
//          }
//       });

//    } catch (error) {
//       console.error("Error fetching user profile:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });


// Create account
app.post('/CreateAccount', async (req, res) => {
   try {

      //, gender, user_id,  skills_i_want, skills_i_have,availability
      const { f_name, l_name, email, age, university, user_name, password } = req.body;

      // Validate required fields
      if (!f_name || !l_name || !email || !age || !university || !user_name || !password ) {
         return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const oldUser = await User.findOne({ email });
      if (oldUser) {
         return res.status(400).json({ message: "User already exists" });
      }

      // Encrypt the password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
         f_name,
         l_name,
         email,
         age,
         university,
         password: encryptedPassword,
      //  // From Skills collection
      //    user_name,
      //    user_id,
      //    gender,
      //    skills_i_want,
      //    skills_i_have,
      //    availability
            });

      res.status(201).json({ message: "User created successfully", data: newUser });
   } catch (error) {
      console.error("Error creating user:", error.message, error.stack);
      res.status(500).json({ message: "Internal server error" });
   }
});

// Add skills
app.post("/AddSkills", async (req, res) => {
   try {
       const { email, skills_i_have, skills_i_want, availability } = req.body;

       console.log("Request Body:", req.body); // Log received data

       // Validate input
       if (!email || !skills_i_have || !skills_i_want || !Array.isArray(skills_i_have) || !Array.isArray(skills_i_want)) {
           console.error("Invalid input:", req.body);
           return res.status(400).json({ message: "Invalid input format." });
       }

       // Check if user exists
       const user = await User.findOne({ email });
       if (!user) {
           console.error("User not found for email:", email);
           return res.status(404).json({ message: "User not found." });
       }

       // Create new skill entry
       const newSkill = await Skills.create({
           user_id: user._id,
           skills_i_have,
           skills_i_want,
           availability: availability || "",
           email: user.email,
       });

       console.log("New skill added:", newSkill);
       res.status(201).json({ message: "Skills added successfully", data: newSkill });
   } catch (error) {
       console.error("Error in /AddSkills endpoint:", error);
       res.status(500).json({ message: "Internal server error" });
   }
});



// Login
// app.post('/Login', async (req, res) => {
//    try {
//       const { email, password } = req.body;

//       const oldUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }); 

//       if (!oldUser) {
//          return res.status(404).json({ message: "User doesn't exist" });
//       }

//       const isPasswordValid = await bcrypt.compare(password, oldUser.password);
//       if (!isPasswordValid) {
//          return res.status(401).json({ message: "Invalid password" });
//       }

//       const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" });
//       res.status(200).json({ status: 'Ok', data: token });
//    } catch (error) {
//       console.error("Error during login:", error);
//       res.status(500).json({ message: "Internal server error" });
//    }
// });

app.post('/get-user-by-fullname', async (req, res) => {
   console.log('Request Body:', req.body); // Log the request body
   try {
     const { fullName } = req.body;
 
     if (!fullName) {
       return res.status(400).json({ error: "Full name is required" });
     }
 
     // Find user by matching concatenated name
     const users = await User.aggregate([
       {
         $addFields: {
           fullName: { $concat: ["$f_name", " ", "$l_name"] }
         }
       },
       {
         $match: {
           fullName: fullName
         }
       }
     ]);
 
     if (users.length === 0) {
       return res.status(404).json({ error: "User  not found" });
     }
 
     res.json({ email: users[0].email });
   } catch (error) {
     console.error("Error fetching user by full name:", error);
     res.status(500).json({ error: "Internal server error" });
   }
 });

app.post('/Login', async (req, res) => {
   try {
     const { email, password } = req.body;
 
     const oldUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
 
     if (!oldUser) {
       return res.status(404).json({ message: "User doesn't exist" });
     }
 
     const isPasswordValid = await bcrypt.compare(password, oldUser.password);
     if (!isPasswordValid) {
       return res.status(401).json({ message: "Invalid password" });
     }
 
     const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: "1h" });
     res.status(200).json({
       status: 'Ok',
       data: {
         token: token, // Include token here
         user_id: oldUser._id, // Include other data if needed
       },
     });
   } catch (error) {
     console.error("Error during login:", error);
     res.status(500).json({ message: "Internal server error" });
   }
 });
 

// // Fetch user data
// app.post('/userdata', async (req, res) => {
//    const { token } = req.body;
//    try {
//       const user = jwt.verify(token, JWT_SECRET);
//       const useremail = user.email;

//       User.findOne({ email: useremail }).then((data) => {
//          return res.send({ status: "Ok", data: data });
//       });
//    } catch (error) {
//       return res.send({ error: "error" });
//    }
// });

//get user profile data


// Fetch recommended tutors
app.get("/recommendedTutors", async (req, res) => {
  try {
    const SkillsToLearn = req.query.SkillsToLearn ? req.query.SkillsToLearn.split(",") : [];
    const SkillsIHave = req.query.SkillsIHave ? req.query.SkillsIHave.split(",") : [];

    let tutors;

    if (SkillsToLearn.length === 0 && SkillsIHave.length === 0) {
      tutors = await Skills.find(); // Return all tutors if no filters
    } else {
      tutors = await Skills.find({
        $or: [
          { "Skills_i_have.Skill": { $in: SkillsToLearn } },
          { "Skills_i_want.Skill": { $in: SkillsIHave } }
        ]
      });

      tutors = tutors.map((tutor) => {
        // Join skills into a single string
        tutor.Skills_i_have = tutor.Skills_i_have
          .map(skillObj => skillObj.Skill)
          .join(", ");
        tutor.Skills_i_want = tutor.Skills_i_want
          .map(skillObj => skillObj.Skill)
          .join(", ");
        return tutor;
      });

      console.log("Fetched Tutors from DB:", tutors);
    }

    // Sort tutors based on matching score
    const sortedTutors = tutors.sort((a, b) => {
      const aScore =
        (SkillsToLearn.some(skill => a.Skills_i_have.includes(skill)) ? 2 : 0) +
        (SkillsIHave.some(skill => a.Skills_i_want.includes(skill)) ? 1 : 0);
      const bScore =
        (SkillsToLearn.some(skill => b.Skills_i_have.includes(skill)) ? 2 : 0) +
        (SkillsIHave.some(skill => b.Skills_i_want.includes(skill)) ? 1 : 0);
      return bScore - aScore;
    });

    const limitedTutors = sortedTutors.slice(0, 10); // Limit results

    res.status(200).json({ status: "Ok", data: limitedTutors });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Fetch recommended skills
app.get('/recommendedSkills', async (req, res) => {
  try {
    const { search } = req.query;

    // Build a dynamic search filter
    const filter = {};
    if (search) {
      filter["Skills I Want"] = { $regex: search, $options: "i" }; // Case-insensitive regex search
    }

    const skills = await Skills.find(filter, { 
      "Skills I Want": 1, 
      "Category (Skills I Want)": 1,
      "image": 1, 
      _id: 0 
    }).limit(10);

    res.status(200).json({ status: 'Ok', data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Fetch tutor profile
router.get('/tutorProfile/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const skillsData = await Skills.findOne({ tutorId: id });
      const userInfo = await User.findOne({ tutorId: id });

      if (!skillsData || !userInfo) {
         return res.status(404).json({ message: 'Tutor not found' });
      }

      res.json({
         name: userInfo.name,
         university: userInfo.university,
         availability: skillsData.availability,
         skills: skillsData.skills,
         learn: skillsData.learn,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

// Fetch recommended items
app.get('/recommendedItems', async (req, res) => {
   try {
      const RItems = await items.find({}, {
         Name: 1,
         ItemName: 1,
         Category: 1,
         Condition: 1,
         Description: 1,
         Image: 1
      });

      res.status(200).json({ status: 'Ok', data: RItems });
   } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
});

// Update your server endpoint to handle search
app.get('/searchItems', async (req, res) => {
   try {
     const { query } = req.query;
     if (!query) {
       return res.status(400).json({ message: 'Search query is required' });
     }
 
     const searchTerms = query.toLowerCase().split(' ');
     
     const Items = await items.find({
       $or: [
         { ItemName: { $regex: searchTerms.join('|'), $options: 'i' } },
         { PersonName: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Category: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Condition: { $regex: searchTerms.join('|'), $options: 'i' } },
         { Description: { $regex: searchTerms.join('|'), $options: 'i' } }
       ]
     });
 
     res.status(200).json({ status: 'Ok', data: Items });
   } catch (error) {
     console.error('Error searching items:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 });


// Save exchange history
app.get('/logdata', async (req, res) => {
  try {
    console.log("Incoming request for history:", req.query);

    const { email } = req.query;

    if (!email) {
      console.error(" Error: Email is required!");
      return res.status(400).json({ message: "Email is required" });
    }

    console.log('Fetching history for user: ${email})');

    const history = await LogData.find({ currentUser: email }).sort({ createdAt: -1 });

    console.log(" Retrieved history:", history);

    res.status(200).json({ status: "Ok", data: history });

  } catch (error) {
    console.error(" Error fetching history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/logdata', async (req, res) => {
  try {
    console.log("📌 Incoming request to save trade:", req.body);

    const { currentUser, tradedWith, exchangeType } = req.body;

    if (!currentUser || !tradedWith || !exchangeType) {
      console.error("❌ Missing required fields!");
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLogData = new LogData({
      currentUser,
      tradedWith,
      exchangeType,
    });

    await newLogData.save();
    console.log("✅ Trade successfully saved:", newLogData);

    res.status(201).json({ message: "Trade saved", data: newLogData });
  } catch (error) {
    console.error("❌ Error saving trade data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API to fetch user email by ID
app.get("/user/:id", async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("email"); // Only fetch email

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ email: user.email });
  } catch (error) {
      console.error("❌ Error fetching user email:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// API to fetch exchange history for a user


// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

// API test endpoint
app.get('/api/test', (req, res) => {
   res.json({ message: 'API is connected!' });
});