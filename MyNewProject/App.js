import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import SettingsPage from "./screens/settings";
import AboutPage from "./screens/about_swap"; 
import RecommendationPage from "./screens/Item_recommendation"; 
import ItemDescriptionPage from "./screens/item-description";
import SkillRecommendationPage from "./screens/skill_recommendation";
import TutorProfilePage from './screens/profile_descriptin';
import SkillDescriptionPage from './screens/skill-description';
import SkillMatchingPage from './screens/skill-matching';
import AddItemPage from './screens/add_item';
import HistoryPage from './screens/history';
import UserReviewPage from './screens/User_review';
import GetStartedPage from './screens/main_screen';
import LoginPage from './screens/login';
import CreateAccountPage from './screens/sign-up';
import InfoAddPage from './screens/sign-infoadd';
import Editprofile from './screens/edit_profile';
import Myprofile from './screens/my_profile';
import { MessagingApp } from './react-native-chat/App'; // Import the messaging app's RootNavigator
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthenticatedUserProvider } from './react-native-chat/contexts/AuthenticatedUserContext'; // Import AuthenticatedUserProvider
import { UnreadMessagesProvider } from './react-native-chat/contexts/UnreadMessagesContext'; // Import UnreadMessagesProvider
import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();
const API_URL = 'http://10.20.5.46:5000'; // Update this to your server URL

export default function App() {
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(data);
  }

  const testApiConnection = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/test`);
      setResponseMessage(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error('Error connecting to the API:', error);
      setResponseMessage('Error connecting to the API');
      setLoading(false);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await getData();
        await testApiConnection();
      } catch (error) {
        console.error('Error during app preparation:', error);
      } finally {
        setLoading(false);
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.error('Error hiding splash screen:', error);
        }
      }
    }
    prepare();  
  }, []);

  return (
    <NotificationProvider>
      <AuthenticatedUserProvider>
        <UnreadMessagesProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="GetStartedPage">
              {/* Main App Screens */}
              <Stack.Screen name="GetStartedPage" component={GetStartedPage} options={{ headerShown: false }} />
              <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
              <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} options={{ headerShown: false }} />
              <Stack.Screen name="infoaddPage" component={InfoAddPage} options={{ headerShown: false }} />
              <Stack.Screen name="Myprofile" component={Myprofile} options={{ headerShown: false }} />
              <Stack.Screen name="Editprofile" component={Editprofile} options={{ headerShown: false }} />
              <Stack.Screen name="RecommendationPage" component={RecommendationPage} options={{ headerShown: false }} />
              <Stack.Screen name="ItemDescriptionPage" component={ItemDescriptionPage} options={{ headerShown: false }} />
              <Stack.Screen name="SkillRecommendationPage" component={SkillRecommendationPage} options={{ headerShown: false }} />
              <Stack.Screen name="TutorProfilePage" component={TutorProfilePage} options={{ headerShown: false }} />
              <Stack.Screen name="SkillDescriptionPage" component={SkillDescriptionPage} options={{ headerShown: false }} />
              <Stack.Screen name="SkillMatchingPage" component={SkillMatchingPage} options={{ headerShown: false }} />
              <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false }} />
              <Stack.Screen name="AboutPage" component={AboutPage} options={{ headerShown: false }} />
              <Stack.Screen name="AddItemPage" component={AddItemPage} options={{ headerShown: false }} />
              <Stack.Screen name="HistoryPage" component={HistoryPage} options={{ headerShown: false }} />
              <Stack.Screen name="UserReviewPage" component={UserReviewPage} options={{ headerShown: false }} />

              {/* Messaging App Integration */}
              <Stack.Screen
                name="MessagingPage"
                component={MessagingApp} // Use the RootNavigator from the messaging app
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
            <Text>{responseMessage}</Text>
          </NavigationContainer>
        </UnreadMessagesProvider>
      </AuthenticatedUserProvider>
    </NotificationProvider>
  );
}