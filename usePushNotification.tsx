import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Audio } from "expo-av";

//============== Notification Handler ====================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Enable sound
    shouldSetBadge: true,
  }),
});

const projectId = Constants.expoConfig?.extra?.eas?.projectId;

// ========================== GET REAL TIME DEVICE TOKEN ========================================
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
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

    try {
      if (Platform.OS === "ios") {
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: projectId,
          })
        ).data;
      }
    } catch (error) {
      Alert.alert("Error retrieving device token:");
    }
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }
  return token;
}

async function playSound() {
  const { sound } = await Audio.Sound.createAsync(
    require("./assets/Images/maybe-one-day-584.mp3")
  );
  await sound.playAsync();
}

// useEffect(() => {
//   registerForPushNotificationsAsync().then(async (token) =>
//     token === undefined ? setExpoPushToken("") : setExpoPushToken(token)
//   );
//   notificationListener.current = Notifications.addNotificationReceivedListener(
//     (noti) => {
//       setNotification(noti ? true : false);
//       if (noti) {
//         // playSound();
//       }
//     }
//   );
//   responseListener.current =
//     Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log(response);
//     });
//   return () => {
//     if (notificationListener.current) {
//       Notifications.removeNotificationSubscription(
//         notificationListener.current
//       );
//     }
//     if (responseListener.current) {
//       Notifications.removeNotificationSubscription(responseListener.current);
//     }
//   };
// }, []);
//==================================================================
