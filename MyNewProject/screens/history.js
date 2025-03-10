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
import { auth } from 'F:/FYP - SwapIt/fyp/MyNewProject/react-native-chat/config/firebase.js';
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

        const response = await fetch(`http://192.168.0.103:5000/logdata?email=${encodeURIComponent(userEmail)}`);
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

