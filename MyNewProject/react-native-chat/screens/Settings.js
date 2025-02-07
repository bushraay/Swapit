import React, { useCallback } from "react";
import { Text, View, StyleSheet, Alert, Linking, TouchableOpacity, Image } from "react-native";

import ContactRow from "../components/ContactRow";
import Cell from "../components/Cell";
import { colors } from "../config/constants";
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
    const navigation = useNavigation(); // Ensure navigation can be used here

    async function openGithub(url) {
        await Linking.openURL(url);
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Settings</Text>
            </View>

            {/* Main Settings Section */}
            <View style={styles.contentWrapper}>
                <ContactRow
                    name={auth?.currentUser?.displayName ?? 'No name'}
                    subtitle={auth?.currentUser?.email}
                    style={styles.contactRow}
                    onPress={() => {
                        navigation.navigate('Profile');
                    }}
                />

                <Cell
                    title='Account'
                    subtitle='Privacy, logout, delete account'
                    icon='key-outline'
                    onPress={() => {
                        navigation.navigate('Account');
                    }}
                    iconColor="black"
                    style={styles.cell} // Style inheriting the #FFF8E1 background
                />

                <Cell
                    title='Help'
                    subtitle='Contact us, app info'
                    icon='help-circle-outline'
                    iconColor="black"
                    onPress={() => {
                        navigation.navigate('Help');
                    }}
                    style={styles.cell} // Style inheriting the #FFF8E1 background
                />

                <Cell
                    title='Invite a friend'
                    icon='people-outline'
                    iconColor="black"
                    onPress={() => {
                        alert('Share touched');
                    }}
                    showForwardIcon={false}
                    style={styles.cell} // Style inheriting the #FFF8E1 background
                />

                <TouchableOpacity style={styles.githubLink} onPress={() => openGithub('https://github.com/Ctere1/react-native-chat')}>
                    <View>
                        <Text style={{ fontSize: 12, fontWeight: '400' }}>
                            <Ionicons name="logo-github" size={12} style={{ color: '#FFF' }} />
                            {' '}App's Github
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Footer Section */}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // Space out header, content, and footer
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#335c67", // Same color as the footer
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    headerText: {
        color: "#FFFFFF", // White text for contrast
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 20, // Add margin to separate the back arrow and text
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: '#FFF8E1', // Yellow background for the main content
        paddingVertical: 20,
    },
    contactRow: {
        backgroundColor: '#FFF8E1', // Matches the container background
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
    },
    cell: {
        backgroundColor: '#FFF8E1', // Matches the container background for all cells
        marginTop: 20,
    },
    githubLink: {
        marginTop: 20,
        alignSelf: "center",
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 100,
    },
    footer: {
        height: 70,
        backgroundColor: "#335c67", // Footer color
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

export default Settings;