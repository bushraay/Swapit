import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SettingsPage() {
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isSecurityOpen, setSecurityOpen] = useState(false);
  const navigation = useNavigation();

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
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACCOUNT INFORMATION</Text>
              <TouchableOpacity
                style={styles.row}
                onPress={() => setNotificationsOpen(!isNotificationsOpen)}
              >
                <Text style={styles.rowText}>Notifications</Text>
                <Text style={styles.arrow}>
                  {isNotificationsOpen ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
              {isNotificationsOpen && (
                <View style={styles.dropdownContent}>
                  <Text style={styles.dropdownText}>
                    Manage your notification preferences here.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.row}
                onPress={() => setPrivacyOpen(!isPrivacyOpen)}
              >
                <Text style={styles.rowText}>Privacy and Data</Text>
                <Text style={styles.arrow}>{isPrivacyOpen ? "▲" : "▼"}</Text>
              </TouchableOpacity>
              {isPrivacyOpen && (
                <View style={styles.dropdownContent}>
                  <Text style={styles.dropdownText}>
                    Control your data privacy settings here.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.row}
                onPress={() => setSecurityOpen(!isSecurityOpen)}
              >
                <Text style={styles.rowText}>Security and Logins</Text>
                <Text style={styles.arrow}>
                  {isSecurityOpen ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
              {isSecurityOpen && (
                <View style={styles.dropdownContent}>
                  <Text style={styles.dropdownText}>
                    Manage security and login options here.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACTIONS</Text>
              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.navigate("AboutPage")}
              >
                <Text style={styles.rowText}>About</Text>
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton}
            onPress={() => navigation.navigate("LoginPage")}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("SkillDashboardPage")}
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
    backgroundColor: "#FFF8E1",
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007B7F",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 5,
    elevation: 2,
  },
  rowText: {
    fontSize: 16,
    color: "#333333",
  },
  arrow: {
    fontSize: 16,
    color: "#007B7F",
  },
  dropdownContent: {
    backgroundColor: "#E8F6F7",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: "#FFB343",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#333333",
    fontSize: 16,
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
