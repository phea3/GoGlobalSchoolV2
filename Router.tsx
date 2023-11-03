import { Route, useRoutes } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import Layout from "./Layout/Layout";
import NotFoundScreen from "./screens/NotFoundScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ClassesScreen from "./screens/ClassesScreen";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
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
import { Dimensions } from "react-native";
import LeaveScreen from "./screens/LeaveScreen";
import NotificationScreen from "./screens/NotificationScreen";
import LayoutNotification from "./Layout/LayoutNotification";
import NotificationAnnouncements from "./screens/NotificationAnnouncements";
import MealScreen from "./screens/MealScreen";

export default function Router() {
  //context
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const [load, setLoad] = useState(true);
  const { token, defineDimension } = useContext(AuthContext);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  // console.log(token);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);

  //========= GET USER TOKEN AND UID ================
  const getLocalStorage = async () => {
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
    }

    //
    defineDimension({
      dimension: "",
      widthscreen: width,
      heightscreen: height,
    });
    //
  };

  useEffect(() => {
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
    { path: "/forget", element: <ForgetPasswordScreen /> },
    { path: "/*", element: <NotFoundScreen /> },
  ]);

  const Content = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomeScreen /> },
        { path: "/home", element: <HomeScreen /> },
        { path: "/dashboard", element: <DashboardScreen /> },
        { path: "/classes", element: <ClassesScreen /> },
        { path: "/schedule", element: <ScheduleScreen /> },
        { path: "/attendance", element: <AttendanceScreen /> },
        { path: "/students", element: <StudentsScreen /> },
        { path: "/announce", element: <AnnouncementDetail /> },
        { path: "/about", element: <AboutScreen /> },
        { path: "/profile", element: <ProfileScreen /> },
        { path: "/calendar", element: <CalendarScreen /> },
        { path: "/payment", element: <PaymentScreen /> },
        { path: "/meal", element: <MealScreen /> },
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
