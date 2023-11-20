import { useRoutes } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import Layout from "./Layout/Layout";
import NotFoundScreen from "./screens/NotFoundScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ClassesScreen from "./screens/ClassesScreen";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import StudentsScreen from "./screens/StudentsScreen";
import AboutScreen from "./screens/AboutScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import AttendanceScreen from "./screens/AttendanceScreen";
import LoadingScreen from "./screens/LoadingScreen";
import useLoginUser from "./Hook/useLoginUser";
import CalendarScreen from "./screens/CalendarScreen";
import AnnouncementDetail from "./screens/AnnouncementDetail";
import PaymentScreen from "./screens/PaymentScreen";
import { Alert, Dimensions, Platform } from "react-native";
import LeaveScreen from "./screens/LeaveScreen";
import NotificationScreen from "./screens/NotificationScreen";
import LayoutNotification from "./Layout/LayoutNotification";
import NotificationAnnouncements from "./screens/NotificationAnnouncements";
import MealScreen from "./screens/MealScreen";
import ProfileDetail from "./screens/ProfileDetail";
import EYSReportScreen from "./screens/EYSReportScreen";
import ContactUs from "./screens/ContactUs";
import SocialMediaScreen from "./screens/SocialMedia";
import SettingScreen from "./screens/SettingScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import HealthScreen from "./screens/HealthScreen";
import AnnouncementScreen from "./screens/AnnouncementScreen";
import StudentDetailScreen from "./screens/StudentDetail";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Permissions from "expo-permissions";
import { Audio } from "expo-av";
import { useQuery } from "@apollo/client";
import { SENDMOBILETOKEN } from "./graphql/GetMobileUserLoginToken";

//============== Notification Handler ====================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Enable sound
    shouldSetBadge: false,
  }),
});

export default function Router() {
  //==================== Nitification Variable =====================
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | undefined>();
  const responseListener = useRef<Notifications.Subscription | undefined>();
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;

  //==================================================================
  //context
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const { token, defineDimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  // ============ SEND DEVICE TOKEN ==================

  const { refetch } = useQuery(SENDMOBILETOKEN, {
    variables: {
      token: expoPushToken,
    },
  });

  useEffect(() => {
    refetch();
    if (expoPushToken) {
      Alert.alert("Token", expoPushToken);
    }
  }, [expoPushToken]);

  // ========================== GET REAL TIME DEVICE TOKEN ========================================
  async function registerForPushNotificationsAsync() {
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
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token?.data;
  }

  async function playSound() {
    // console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/Images/maybe-one-day-584.mp3")
    );

    // console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      token === undefined ? setExpoPushToken("") : setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((noti) => {
        // console.log(noti);
        // console.log("", noti?.request?.content?.data);
        setNotification(noti ? true : false);
        if (noti) {
          playSound();
        }
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
  //==================================================================

  // console.log(token);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  useEffect(() => {
    async function localPushNoti() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "My Notification",
          body: "Hello, this is a notification!",
          sound: "./assets/Images/maybe-one-day-584.mp3",
          launchImageName: "./assets/Images/salad.png", // Specify the path to your custom sound file
        },
        trigger: null, // Send immediately
      });
    }
    localPushNoti();
  }, []);
  // sound

  //========= GET USER TOKEN AND UID ================
  useEffect(() => {
    async function getLocalStorage() {
      let userToken = await AsyncStorage.getItem("@userToken");
      let userUid = await AsyncStorage.getItem("@userUid");

      //
      if (userToken && userUid) {
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: userToken,
            uid: userUid,
          },
        });
      } else {
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: "",
            uid: "",
          },
        });
      }

      //
      defineDimension({
        dimension: "",
        widthscreen: width,
        heightscreen: height,
      });
      //
    }
    getLocalStorage();
  }, []);
  //========= END TOKEN AND UID ================

  const LoadScreen = useRoutes([
    { path: "/", element: <LoadingScreen /> },
    { path: "/*", element: <NotFoundScreen /> },
  ]);

  const Login = useRoutes([
    { path: "/", element: <LoginScreen /> },
    { path: "/login", element: <LoginScreen /> },
    { path: "/forget", element: <ContactUs /> },
    { path: "/*", element: <NotFoundScreen /> },
  ]);

  const Content = useRoutes([
    {
      path: "/",
      element: <Layout expoPushToken={expoPushToken} />,
      children: [
        { path: "/", element: <HomeScreen /> },
        { path: "/home", element: <HomeScreen /> },
        { path: "/dashboard", element: <DashboardScreen /> },
        { path: "/classes", element: <ClassesScreen /> },
        { path: "/schedule", element: <ScheduleScreen /> },
        { path: "/attendance", element: <AttendanceScreen /> },
        { path: "/students", element: <StudentsScreen /> },
        { path: "/announce", element: <AnnouncementDetail /> },
        { path: "/announcement", element: <AnnouncementScreen /> },
        { path: "/about", element: <AboutScreen /> },
        { path: "/profile", element: <ProfileScreen /> },
        { path: "/profiledetail", element: <ProfileDetail /> },
        { path: "/calendar", element: <CalendarScreen /> },
        { path: "/payment", element: <PaymentScreen /> },
        { path: "/meal", element: <MealScreen /> },
        { path: "/eys", element: <EYSReportScreen /> },
        { path: "/contactus", element: <ContactUs /> },
        { path: "/social", element: <SocialMediaScreen /> },
        { path: "/setting", element: <SettingScreen /> },
        { path: "/resetpassword", element: <ResetPasswordScreen /> },
        { path: "/health", element: <HealthScreen /> },
        { path: "/studentdetail", element: <StudentDetailScreen /> },
        {
          path: "/notification",
          element: <LayoutNotification />,
          children: [
            { path: "/notification", element: <NotificationScreen /> },
            {
              path: "/notification/announces",
              element: <NotificationAnnouncements />,
            },
          ],
        },
        { path: "/leave", element: <LeaveScreen /> },
        { path: "/*", element: <NotFoundScreen /> },
      ],
    },
  ]);

  if (load) {
    return LoadScreen;
  } else {
    if (token !== "" && token !== undefined) {
      return Content;
    } else {
      return Login;
    }
  }
}
