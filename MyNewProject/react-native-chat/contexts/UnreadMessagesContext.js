import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setCount] = useState(0);

  // Unified method to update both context and storage
  const setUnreadCount = async (newMessages) => {
    try {
      const count = Object.values(newMessages).reduce((total, num) => total + num, 0);
      await AsyncStorage.setItem('newMessages', JSON.stringify(newMessages));
      setCount(count);
    } catch (error) {
      console.log('Error updating unread count', error);
    }
  };

  // Load initial count
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('newMessages');
        const messages = stored ? JSON.parse(stored) : {};
        setCount(Object.values(messages).reduce((total, num) => total + num, 0));
      } catch (error) {
        console.log('Error loading unread count', error);
      }
    };
    load();
  }, []);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => useContext(UnreadMessagesContext);