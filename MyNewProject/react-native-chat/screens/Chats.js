import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import ContactRow from '../components/ContactRow';
import Separator from "../components/Separator";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, database } from '../config/firebase';
import { collection, doc, where, query, onSnapshot, orderBy, setDoc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../config/constants";

const Chats = ({ setUnreadCount, route }) => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const previousScreen = route?.params?.previousScreen || 'SkillRecommendationPage';
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newMessages, setNewMessages] = useState({});

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#335c67", // Match footer color
      },
      headerTintColor: "#FFF", // Set text/icons color to white
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Ionicons name="settings" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // Load unread messages from AsyncStorage when screen is focused
      const loadNewMessages = async () => {
        try {
          const storedMessages = await AsyncStorage.getItem('newMessages');
          const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
          setNewMessages(parsedMessages);
          setUnreadCount(Object.values(parsedMessages).reduce((total, num) => total + num, 0));
        } catch (error) {;
        }
      };

      // Set up Firestore listener for chat updates
      const collectionRef = collection(database, 'chats');
      const q = query(
        collectionRef,
        where('users', "array-contains", { email: auth?.currentUser?.email, name: auth?.currentUser?.displayName, deletedFromChat: false }),
        orderBy("lastUpdated", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChats(snapshot.docs);
        setLoading(false);

        snapshot.docChanges().forEach(change => {
          if (change.type === "modified") {
            const chatId = change.doc.id;
            const messages = change.doc.data().messages;
            const firstMessage = messages[0];

            // Increase unread count if the first message is from someone else
            if (firstMessage.user._id !== auth?.currentUser?.email) {
              setNewMessages(prev => {
                const updatedMessages = { ...prev, [chatId]: (prev[chatId] || 0) + 1 };
                AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
                setUnreadCount(Object.values(updatedMessages).reduce((total, num) => total + num, 0));
                return updatedMessages;
              });
            }
          }
        });
      });

      // Load unread messages and start listener when screen is focused
      loadNewMessages();

      // Clean up listener on focus change
      return () => unsubscribe();
    }, [])
  );

  const handleChatName = (chat) => {
    const users = chat.data().users;
    const currentUser = auth?.currentUser;

    if (chat.data().groupName) {
      return chat.data().groupName;
    }

    if (currentUser?.displayName) {
      return users[0].name === currentUser.displayName ? users[1].name : users[0].name;
    }

    if (currentUser?.email) {
      return users[0].email === currentUser.email ? users[1].email : users[0].email;
    }

    return '~ No Name or Email ~';
  };

  const handleOnPress = async (chat) => {
    const chatId = chat.id;
    if (selectedItems.length) {
      return selectItems(chat);
    }
    // Reset unread count for the selected chat
    setNewMessages(prev => {
      const updatedMessages = { ...prev, [chatId]: 0 };
      AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
      setUnreadCount(Object.values(updatedMessages).reduce((total, num) => total + num, 0));
      return updatedMessages;
    });
    navigation.navigate('Chat', { id: chat.id, chatName: handleChatName(chat) });
  };

  const handleLongPress = (chat) => {
    selectItems(chat);
  };

  const selectItems = (chat) => {
    if (selectedItems.includes(chat.id)) {
      setSelectedItems(selectedItems.filter(item => item !== chat.id));
    } else {
      setSelectedItems([...selectedItems, chat.id]);
    }
  };

  const getSelected = (chat) => {
    return selectedItems.includes(chat.id);
  };

  const deSelectItems = () => {
    setSelectedItems([]);
  };

  const handleFabPress = () => {
    navigation.navigate('Users');
  };

  const handleDeleteChat = () => {
    Alert.alert(
      selectedItems.length > 1 ? "Delete selected chats?" : "Delete this chat?",
      "Messages will be removed from this device.",
      [
        {
          text: "Delete chat",
          onPress: () => {
            selectedItems.forEach(chatId => {
              const chat = chats.find(chat => chat.id === chatId);
              const updatedUsers = chat.data().users.map(user =>
                user.email === auth?.currentUser?.email
                  ? { ...user, deletedFromChat: true }
                  : user
              );

              setDoc(doc(database, 'chats', chatId), { users: updatedUsers }, { merge: true });

              const deletedUsers = updatedUsers.filter(user => user.deletedFromChat).length;
              if (deletedUsers === updatedUsers.length) {
                deleteDoc(doc(database, 'chats', chatId));
              }
            });
            deSelectItems();
          },
        },
        { text: "Cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleSubtitle = (chat) => {
    const message = chat.data().messages[0];
    if (!message) return "No messages yet";

    const isCurrentUser = auth?.currentUser?.email === message.user._id;
    const userName = isCurrentUser ? 'You' : message.user.name.split(' ')[0];
    const messageText = message.image ? 'sent an image' : message.text.length > 20 ? `${message.text.substring(0, 20)}...` : message.text;

    return `${userName}: ${messageText}`;
  };

  const handleSubtitle2 = (chat) => {
    const options = { year: '2-digit', month: 'numeric', day: 'numeric' };
    return new Date(chat.data().lastUpdated).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size='large' style={styles.loadingContainer} />
        ) : (
          <>
            {chats.length === 0 ? (
              <View style={styles.blankContainer}>
                <Text style={styles.textContainer}>No conversations yet</Text>
              </View>
            ) : (
              chats.map(chat => (
                <React.Fragment key={chat.id}>
                  <ContactRow
                    style={getSelected(chat) ? styles.selectedContactRow : ""}
                    name={handleChatName(chat)}
                    subtitle={handleSubtitle(chat)}
                    subtitle2={handleSubtitle2(chat)}
                    onPress={() => handleOnPress(chat)}
                    onLongPress={() => handleLongPress(chat)}
                    selected={getSelected(chat)}
                    showForwardIcon={false}
                    newMessageCount={newMessages[chat.id] || 0}
                  />
                </React.Fragment>
              ))
            )}
            <Separator />
            <View style={styles.blankContainer}>
              <Text style={{ fontSize: 12, margin: 15 }}>
                <Ionicons name="lock-open" size={12} style={{ color: '#565656' }} /> Your personal messages are not <Text style={{ color: colors.teal }}>end-to-end-encrypted</Text>
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("SkillRecommendationPage")}
        >
          <Image
            source={require("F:/FYP - SwapIt/fyp/MyNewProject/assets/skills.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("RecommendationPage")}
        >
          <Image
            source={require("F:/FYP - SwapIt/fyp/MyNewProject/assets/items.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("MessagingPage", { previousScreen: 'SkillRecommendationPage' })}
        >
          <Image
            source={require("F:/FYP - SwapIt/fyp/MyNewProject/assets/messages.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Myprofile")}
        >
          <Image
            source={require("F:/FYP - SwapIt/fyp/MyNewProject/assets/profile.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  searchContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  contentContainer: {
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tutorCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tutorSkills: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  tutorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tutorLearn: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
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
  blankContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    fontSize: 16,
  },
  selectedContactRow: {
    backgroundColor: "#E0E0E0",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Chats;