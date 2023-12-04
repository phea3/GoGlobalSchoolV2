import { NativeRouter as Routers } from "react-router-native";
import { StatusBar } from "react-native";
import Router from "./Router";
import { AuthProvider } from "./Context/AuthContext";
import StyleProvider from "./styleProvider";
import { MenuProvider } from "react-native-popup-menu";
import ApolloConfig from "./Config/ApolloConfig";
import React, { useEffect } from "react";

export default function App() {
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
