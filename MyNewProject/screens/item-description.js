import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function ItemDescriptionPage({ route }) {
  const navigation = useNavigation();
  const { item } = route.params; // Retrieve the item data

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Item Description</Text>
            
          </View>


        {/* Content inside a ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image source={{ uri: item.Image }} style={styles.itemImage} />
          <Text style={styles.itemTitle}>{item.ItemName}</Text>
          <Text style={styles.itemCategory}>Owner Name: {item.PersonName}</Text>
          <Text style={styles.itemCategory}>Category: {item.Category}</Text>
          <Text style={styles.itemDescription}>{item.Description}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
          <TouchableOpacity
                style={styles.notInterestedButton}
                onPress={() => navigation.navigate("MessagingPage", { previousScreen: "ItemDescriptionPage" })}
>
                <Text style={styles.buttonText}>Interested</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.notInterestedButton}
                onPress={() => navigation.navigate("RecommendationPage")}
              >
                <Text style={styles.buttonText}>Not Interested</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>

        {/* Sticky Footer */}
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
            onPress={() => navigation.navigate("MessagingPage",{previousScreen:'itemDescriptionPage'})}
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
