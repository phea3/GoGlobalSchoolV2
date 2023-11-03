import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-native";
import Footer from "../Include/Footer";
import LayoutStyle from "../Styles/ScreenContainer.scss";
import Header from "../Include/Header";
import { GET_MOBILEUSERLOGIN } from "../graphql/GetMobileUserLogin";
import { useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLoginUser from "../Hook/useLoginUser";

const Layout = () => {
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const navigate = useNavigate();
  const location = useLocation();

  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);

  //============ GET MOBILE USER LOGIN =============
  const { refetch } = useQuery(GET_MOBILEUSERLOGIN, {
    pollInterval: 2000,
    onCompleted: ({ getMobileUserLogin }) => {
      //======== SET LOCAL STORAGE =========
      onStateChange(getMobileUserLogin);
    },
    onError: (error) => {
      if (error?.message === "Not Authorized") {
        Alert.alert("Opp! Your session has been expired.", "", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem("@userToken");
              await AsyncStorage.removeItem("@userUid");
              dispatch({
                type: REDUCER_ACTIONS.LOGOUT,
              });
              navigate("/");
            },
          },
        ]);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <SafeAreaView>
      <View style={LayoutStyle.container}>
        <Header />

        <View
          style={
            location.pathname === "/notification" ||
            location.pathname === "/notification/announces"
              ? LayoutStyle.bodyContainerForNotificationPath
              : LayoutStyle.bodyContainer
          }
        >
          <Outlet />
        </View>
        {location.pathname === "/notification" ||
        location.pathname === "/notification/announces" ? null : (
          <Footer />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Layout;
