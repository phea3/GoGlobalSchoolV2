import { useLocation, useNavigate, useRoutes } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import Layout from "./Layout/Layout";
import NotFoundScreen from "./screens/NotFoundScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ClassesScreen from "./screens/ClassesScreen";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { usePushNotifications } from "./usePushNotifications";

import { useQuery } from "@apollo/client";
import { SENDMOBILETOKEN } from "./graphql/GetMobileUserLoginToken";

export default function Router() {
  const navigate = useNavigate();
  const location = useLocation();
  //==================== Nitification Variable =====================
  const { expoPushToken, notification, notificationResponse } =
    usePushNotifications();
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
      token: expoPushToken?.data ? expoPushToken?.data : "",
    },
  });

  useEffect(() => {
    if (expoPushToken?.data) {
      // console.log(expoPushToken)
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
        console.log(notificationResponse?.notification?.request?.content);
        setTimeout(() => {
          navigate("/notification/announces");
        }, 500);
      } else if (
        notificationResponse?.notification?.request?.content?.data?.type ===
          "Leave Approve" ||
        notificationResponse?.notification?.request?.content?.data?.type ===
          "Pickup Confirmation"
      ) {
        console.log(notificationResponse?.notification?.request?.content);
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
  // console.log(token);

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
