import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
      sound: 'default',
      title: `New message from ${senderName}`,
      body: message.text || 'Sent an image',
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
  const [userResponse, setUserResponse] = useState(null);

  const handleBackPress = useCallback(() => {
    setIsConfirmationModalVisible(true); 
    return true; 
  }, []);

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

  const handleUserResponse = (response) => {
    setUserResponse(response);
    setIsConfirmationModalVisible(false);
    if (response === 'Yes') {
      navigation.goBack(); 
    }
    else {
      navigation.goBack();
  };
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(database, 'chats', route.params.id), async (document) => {
      const recipient_email = document.data().users.find(user => user.email !== auth?.currentUser?.email).email;
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

      const messagesWillSend = [{ ...m[0], sent: true, received: false }];
      let chatMessages = GiftedChat.append(data, messagesWillSend);

      setDoc(
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
    [route.params.id, messages]
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
    setUploading(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const randomString = uuid.v4();
    const fileRef = ref(getStorage(), randomString);

    const uploadTask = uploadBytesResumable(fileRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload percent:', progress);
      },
      (error) => {
        console.log(error);
        reject(error);
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

  return (
    <>
      {uploading && renderLoadingUpload()}
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={(messages) => onSend(messages)}
        imageStyle={{ height: 212, width: 212 }}
        messagesContainerStyle={{ backgroundColor: '#FFF8E1' }}
        textInputStyle={{ 
          backgroundColor: '#FFF8E1',
          borderRadius: 20,
          color: '#335C67'
        }}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: 'https://i.pravatar.cc/300',
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderUsernameOnMessage={true}
        renderAvatarOnTop={true}
        renderInputToolbar={renderInputToolbar}
        minInputToolbarHeight={56}
        scrollToBottom={true}
        onPressActionButton={handleEmojiPanel}
        scrollToBottomStyle={styles.scrollToBottomStyle}
        renderLoading={renderLoading}
      />

      {modal && (
        <EmojiModal
          onPressOutside={handleEmojiPanel}
          modalStyle={styles.emojiModal}
          containerStyle={styles.emojiContainerModal}
          backgroundStyle={styles.emojiBackgroundModal}
          columns={5}
          emojiSize={66}
          activeShortcutColor="#007B7F"
          onEmojiSelected={(emoji) => {
            onSend([
              {
                _id: uuid.v4(),
                createdAt: new Date(),
                text: emoji,
                user: {
                  _id: auth?.currentUser?.email,
                  name: auth?.currentUser?.displayName,
                  avatar: 'https://i.pravatar.cc/300',
                },
              },
            ]);
          }}
        />
      )}

      <Modal isVisible={isConfirmationModalVisible}>
        <View style={styles.confirmationModal}>
          <Text style={styles.confirmationModalText}>Did you exchange anything?</Text>
          <View style={styles.confirmationModalButtons}>
            <Button
              mode="contained"
              onPress={() => handleUserResponse('Yes')}
              style={[styles.confirmationModalButton, { backgroundColor: '#007B7F' }]}
              labelStyle={{ color: '#FFF8E1' }}
            >
              Yes
            </Button>
            <Button
              mode="contained"
              onPress={() => handleUserResponse('No')}
              style={[styles.confirmationModalButton, { backgroundColor: '#335C67' }]}
              labelStyle={{ color: '#FFF8E1' }}
            >
              No
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  inputToolbar: {
    bottom: 6,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
  },
  emojiIcon: {
    marginLeft: 4,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  emojiModal: {},
  emojiContainerModal: {
    height: 348,
    width: 396,
  },
  emojiBackgroundModal: {
    backgroundColor: '#FFF8E1',
  },
  scrollToBottomStyle: {
    borderColor: '#335C67',
    borderWidth: 1,
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  addImageIcon: {
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainerUpload: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  confirmationModal: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationModalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#335C67',
  },
  confirmationModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmationModalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default Chat;