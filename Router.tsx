import { useLocation, useNavigate, useRoutes } from "react-router-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthContext } from "./Context/AuthContext";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { usePushNotifications } from "./usePushNotifications";
import { useQuery } from "@apollo/client";
import { SENDMOBILETOKEN } from "./graphql/GetMobileUserLoginToken";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import Layout from "./Layout/Layout";
import NotFoundScreen from "./screens/NotFoundScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ClassesScreen from "./screens/ClassesScreen";
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
import * as Location from "expo-location";

export default function Router() {
  const navigate = useNavigate();
  const local = useLocation();
  //==================== Nitification Variable =====================
  const { expoPushToken, notificationResponse } = usePushNotifications();
  //==================================================================
  //context
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const { token, defineDimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  //======== SET LOCAL STORAGE =========
  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);

  // ============ SEND DEVICE TOKEN ==================
  const { refetch } = useQuery(SENDMOBILETOKEN, {
    variables: {
      token: expoPushToken?.data ? expoPushToken?.data : "",
    },
    onCompleted: ({ getMobileUserLogin }) => {
      if (getMobileUserLogin) {
        onStateChange(getMobileUserLogin);
      }
    },
  });

  const [locate, setLocation] = useState<Location.LocationObject | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");

        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Set the interval to 2000 milliseconds (2 seconds)
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, [local.pathname, load]);

  useEffect(() => {
    if (expoPushToken?.data) {
      refetch();
    }
  }, [expoPushToken?.data]);

  useEffect(() => {
    async function getIDUserLog() {
      let userUid = await AsyncStorage.getItem("@userUid");

      if (
        notificationResponse?.notification?.request?.content?.data?.type ===
        "Announcement"
      ) {
        setTimeout(() => {
          navigate("/notification/announces");
        }, 500);
      } else if (
        notificationResponse?.notification?.request?.content?.data?.type ===
          "Leave Approve" ||
        notificationResponse?.notification?.request?.content?.data?.type ===
          "Pickup Confirmation"
      ) {
        // console.log(notificationResponse?.notification?.request?.content);
        setTimeout(() => {
          navigate("/notification", { state: `${userUid}` });
        }, 500);
      } else if (
        notificationResponse?.notification?.request?.content?.data?.data ===
        "goes here"
      ) {
        setTimeout(() => {
          navigate("/notification", { state: `${userUid}` });
        }, 500);
      }
    }
    getIDUserLog();
  }, [notificationResponse]);
  //============  GET TOKEN DEVICE  ==================

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

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
    { path: "/", element: <LoginScreen expoPushToken={expoPushToken} /> },
    { path: "/login", element: <LoginScreen expoPushToken={expoPushToken} /> },
    { path: "/forget", element: <ContactUs /> },
    { path: "/*", element: <NotFoundScreen /> },
  ]);

  const Content = useRoutes([
    {
      path: "/",
      element: <Layout expoPushToken={expoPushToken} />,
      children: [
        { path: "/", element: <HomeScreen locate={locate} /> },
        { path: "/home", element: <HomeScreen locate={locate} /> },
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
