import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

export const getFCMDeviceToken = async () => {
  // if (Device.isDevice) {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    // Send the token to your server for further use
    console.log("FCM Token:", token);
    Alert.alert("FCM Token:", token);
  } catch (error: any) {
    console.log("Error getting FCM token:", error);
    Alert.alert("Error getting FCM token:", error.message);
  }
  // } else {
  //   Alert.alert("Must use physical device for Push Notifications");
  // }
};
