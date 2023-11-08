import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-native";
import Footer from "../Include/Footer";
import LayoutStyle from "../Styles/ScreenContainer.scss";
import Header from "../Include/Header";
import { GET_MOBILEUSERLOGIN } from "../graphql/GetMobileUserLogin";
import { useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLoginUser from "../Hook/useLoginUser";
import NetInfo from "@react-native-community/netinfo";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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

  //============== Detect Connection App ================
  const isConnection = useSharedValue("no");
  const offheight = useSharedValue(0);
  const color = useSharedValue("red");

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withSpring(offheight.value),
      backgroundColor: withSpring(color.value),
    };
  });

  const [connection, setConnection] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (connection !== state.isConnected) {
        setConnection(state.isConnected ? true : false);
      }
      if (state.isConnected === true && isConnection.value === "no") {
        offheight.value = withTiming(10);
        color.value = withTiming("#4CBB17");
        isConnection.value = withTiming("yes");
        setTimeout(() => {
          offheight.value = withTiming(0);
        }, 1000);
      } else if (
        (state.isConnected === false && isConnection.value === "yes") ||
        (state.isConnected === false && isConnection.value === "no") ||
        (state.isConnected === false && isConnection.value === "NaN")
      ) {
        offheight.value = withTiming(10);
        color.value = withTiming("red");
        isConnection.value = withTiming("no");
      } else if (state.isConnected === true && isConnection.value === "yes") {
        setTimeout(() => {
          isConnection.value = withTiming("no");
        }, 500);
      }
    });
    return () => {
      unsubscribe;
    };
  }, [connection]);

  return (
    <SafeAreaView>
      <View style={LayoutStyle.container}>
        <Header />

        <Animated.View
          style={[
            {
              width: "100%",
              height: 0,
            },
            animatedStyles,
          ]}
        />
        <View
          style={
            location.pathname === "/notification" ||
            location.pathname === "/notification/announces"
              ? LayoutStyle.bodyContainerForNotificationPath
              : LayoutStyle.bodyContainer
          }
        >
          <Text style={{ position: "absolute" }}>{isConnection.value}</Text>
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
