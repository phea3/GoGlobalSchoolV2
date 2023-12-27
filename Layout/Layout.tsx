import { View, SafeAreaView, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-native";
import Footer from "../Include/Footer";
import LayoutStyle from "../Styles/ScreenContainer.scss";
import Header from "../Include/Header";
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
import { SENDMOBILETOKEN } from "../graphql/GetMobileUserLoginToken";
import * as Notifications from "expo-notifications";
import { AppVersions } from "../Function/FetchDataLocalStorage";
import getAppVersion from "../getAppVersion";
import Constants from "expo-constants";

const Layout = ({ expoPushToken }: any) => {
  //
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isConnection = useSharedValue("no");
  const offheight = useSharedValue(0);
  const color = useSharedValue("red");
  const [connection, setConnection] = useState(false);

  //=========== SET USER MOBILE ===================
  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);

  //============ GET MOBILE USER LOGIN =============
  const { data, refetch, loading } = useQuery(SENDMOBILETOKEN, {
    variables: {
      token: expoPushToken !== undefined ? expoPushToken?.data : "",
    },
    pollInterval: 2000,
    onCompleted: ({ getMobileUserLogin }) => {
      //======== SET LOCAL STORAGE =========
      if (getMobileUserLogin) {
        onStateChange(getMobileUserLogin);
      }
      //========= Set Online Mode =========
      if (connection === true) {
        offheight.value = withTiming(10);
        color.value = withTiming("#4CBB17");
        isConnection.value = withTiming("yes");
        setTimeout(() => {
          offheight.value = withTiming(0);
        }, 1000);
      }
    },
    onError: (error) => {
      //========= Set Offline Mode =========
      if (connection === false) {
        offheight.value = withTiming(10);
        color.value = withTiming("red");
        isConnection.value = withTiming("no");
      }
      if (error?.message === "Not Authorized") {
        Alert.alert("Opp! Your session has been expired.", "", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem("@userToken");
              await AsyncStorage.setItem("@userUid", JSON.stringify(null));
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
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withSpring(offheight.value),
      backgroundColor: withSpring(color.value),
    };
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (connection !== state.isConnected) {
        setConnection(state.isConnected ? true : false);
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
      }
    });
    return () => {
      unsubscribe;
    };
  }, [connection, data?.getMobileUserLogin]);

  const [versions, setVersions] = useState<AppVersions | null>(null);
  const LocalVersion = Constants.expoConfig?.version;

  useEffect(() => {
    const fetchAppVersion = async () => {
      const appVersions = await getAppVersion();
      if (appVersions) {
        setVersions(appVersions);
      }
    };

    fetchAppVersion();
  }, []);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got new version! 📬",
        body: "Here is the notification about new release version.",
        data: { data: "goes here" },
        sound: "default", // You can replace 'default' with the name of a custom sound file
        badge: 1,
      },
      trigger: { seconds: 2 },
    });
  }

  useEffect(() => {
    setTimeout(() => {
      if (
        versions?.appStoreVersion &&
        LocalVersion &&
        LocalVersion < versions?.appStoreVersion
      ) {
        schedulePushNotification();
      } else if (
        versions?.appStoreVersion &&
        LocalVersion &&
        LocalVersion < versions?.playStoreVersion
      ) {
        schedulePushNotification();
      }
    }, 3000);
  }, [LocalVersion]);

  // useEffect(() => {
  //   console.log(versions);
  // }, [versions]);

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
            location.pathname === "/notification/announces" ||
            location.pathname === "/profiledetail"
              ? LayoutStyle.bodyContainerForNotificationPath
              : LayoutStyle.bodyContainer
          }
        >
          <Outlet />
        </View>
        {location.pathname === "/notification" ||
        location.pathname === "/notification/announces" ||
        location.pathname === "/profiledetail" ? null : (
          <Footer />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Layout;
