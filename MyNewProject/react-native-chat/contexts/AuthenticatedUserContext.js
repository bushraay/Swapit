import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNotification } from "../../contexts/NotificationContext";
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const {expoPushToken, notification, error} = useNotification();


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth,  async (authenticatedUser) => {
      setUser(authenticatedUser || null);
      if (authenticatedUser) {
        try {
          // Update the user's profile with the Expo push token
         // Reference the user's document in Firestore
         const userDocRef = doc(database, "users", authenticatedUser.email);

         // Update the Firestore document with the expoPushToken
         await updateDoc(userDocRef, { token: expoPushToken });

         console.log("Token updated in Firestore successfully.");

        } catch (error) {
          console.error("Error updating user profile:", error);
        }
       }
    });
    return unsubscribeAuth;
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
