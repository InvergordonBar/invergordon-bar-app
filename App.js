import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState("Fetching token...");
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => {
                if (token) {
                    setExpoPushToken(token);
                } else {
                    setExpoPushToken("Failed to get push token");
                }
            })
            .catch(error => {
                console.error("Push Notification Error:", error);
                setExpoPushToken("Error fetching token");
            });

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>🚀 Invergordon Bar App is Running!</Text>
            <Text style={styles.token}>Push Token: {expoPushToken}</Text>
        </View>
    );
}

// Function to request permissions and fetch the Expo Push Token
async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        Alert.alert("Alert", "Must use a physical device for push notifications");
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        Alert.alert("Permission Denied", "Push notifications permission is required.");
        return null;
    }

    try {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo Push Token:", token);
        return token;
    } catch (error) {
        console.error("Failed to get push token:", error);
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#25245b",
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFD700",
    },
    token: {
        marginTop: 20,
        fontSize: 16,
        color: "#fff",
    },
});
