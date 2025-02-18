import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HistoryPage() {
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isSecurityOpen, setSecurityOpen] = useState(false);
  const [logData, setLogData] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve log data from route.params
  useEffect(() => {
    if (route.params?.logData) {
      setLogData(route.params.logData);
    }
  }, [route.params]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>History</Text>
          </View>

          {/* Display Log Data */}
          <ScrollView style={styles.scrollContent}>
            {logData && (
              <View style={styles.logContainer}>
                <Text style={styles.logText}>
                  <Text style={styles.logLabel}>Current User:</Text> {logData.currentUser}
                </Text>
                <Text style={styles.logText}>
                  <Text style={styles.logLabel}>Traded With:</Text> {logData.tradedWith}
                </Text>
                <Text style={styles.logText}>
                  <Text style={styles.logLabel}>Exchange Type:</Text> {logData.exchangeType}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  mainContent: {
    flex: 1,
    marginBottom: 70, // Leave space for footer
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  logContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logText: {
    fontSize: 16,
    color: "#335c67",
    marginBottom: 10,
  },
  logLabel: {
    fontWeight: "bold",
    color: "#335c67",
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
