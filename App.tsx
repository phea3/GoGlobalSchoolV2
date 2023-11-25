import { NativeRouter as Routers } from "react-router-native";
import { StatusBar } from "react-native";
import Router from "./Router";
import { AuthProvider } from "./Context/AuthContext";
import StyleProvider from "./styleProvider";
import { MenuProvider } from "react-native-popup-menu";
import ApolloConfig from "./Config/ApolloConfig";
import React, { useEffect } from "react";
import { getFCMDeviceToken } from "./pushNotifications";

export default function App() {
  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (typeof args[0] === "string" && args[0].startsWith("Possible")) {
      return;
    }
    originalWarn.apply(console, args);
  };

  //====
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
