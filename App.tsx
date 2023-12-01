import { NativeRouter as Routers } from "react-router-native";
import { StatusBar } from "react-native";
import Router from "./Router";
import { AuthProvider } from "./Context/AuthContext";
import StyleProvider from "./styleProvider";
import { MenuProvider } from "react-native-popup-menu";
import ApolloConfig from "./Config/ApolloConfig";
import React, { useEffect } from "react";
import { getFCMDeviceToken } from "./pushNotifications";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export default function App() {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };
  async function getTokenMessaging() {
    await requestUserPermission();
    messaging()
      .getToken()
      .then((token) => {
        console.log(token);
        Alert.alert("FCM Token:", token);
      });
  }
  useEffect(() => {
    getTokenMessaging();
  }, []);
  useEffect(() => {
    getFCMDeviceToken();
  }, []);
  return (
    <>
      <MenuProvider>
        <StyleProvider>
          <AuthProvider>
            <ApolloConfig>
              <Routers>
                <StatusBar barStyle="dark-content" />
                <Router />
              </Routers>
            </ApolloConfig>
          </AuthProvider>
        </StyleProvider>
      </MenuProvider>
    </>
  );
}
