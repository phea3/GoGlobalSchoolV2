import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-native";
import FooterStyle from "../Styles/Footer.scss";
import { fetchDataLocalStorage } from "../Function/FetchDataLocalStorage";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);
  const t = useTranslation();
  const [mobileUserLogin, setMobileUserLogin] = useState<{
    _id: string;
    firstName: string;
    lastName: string;
    englishName: string;
    profileImg: string;
  }>({
    _id: "",
    firstName: "",
    lastName: "",
    englishName: "",
    profileImg: "",
  });

  const Tabs = [
    {
      title: "HOME",
      icon: require("../assets/Images/apps.png"),
      active_icon: require("../assets/Images/apps-silver.png"),
      path: "/home",
      extra_path: "/",
      value: 0,
    },
    {
      title: "STUDENT",
      icon: require("../assets/Images/graduation-cap.png"),
      active_icon: require("../assets/Images/graduation-cap_silver.png"),
      path: "/students",
      extra_path: "/students",
      value: 0.96,
    },
    {
      title: "ABOUT",
      icon: require("../assets/Images/home2.png"),
      active_icon: require("../assets/Images/home1.png"),
      path: "/about",
      extra_path: "/about",
      value: 1.92,
    },
    {
      title: "PROFILE",
      icon: mobileUserLogin?.profileImg
        ? {
            uri: `https://storage.go-globalschool.com/api${mobileUserLogin?.profileImg}`,
          }
        : require("../assets/Images/user.png"),
      active_icon: mobileUserLogin?.profileImg
        ? {
            uri: `https://storage.go-globalschool.com/api${mobileUserLogin?.profileImg}`,
          }
        : require("../assets/Images/user.png"),
      path: "/profile",
      extra_path: "/profile",
      value: 2.88,
    },
  ];

  useEffect(() => {
    Tabs.map((tab) => {
      if (location.pathname === tab.path) offset.value = withTiming(tab.value);
    });
  }, [location.pathname]);

  useEffect(() => {
    fetchDataLocalStorage("@mobileUserLogin").then((value) => {
      const mobileUser: string = value;
      const mobileUserLoginData = JSON.parse(mobileUser);
      setMobileUserLogin({
        _id: mobileUserLoginData?._id,
        firstName: mobileUserLoginData?.firstName,
        lastName: mobileUserLoginData?.lastName,
        englishName: mobileUserLoginData?.englishName,
        profileImg: mobileUserLoginData?.profileImg,
      });
    });
  }, [location?.pathname]);

  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * (widthScreen / 4) }],
    };
  });

  return (
    <View
      style={[
        FooterStyle.containerFooter,
        {
          borderTopWidth: moderateScale(0.5),
        },
      ]}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "#3C6EFB",
            // borderBottomLeftRadius: 10,
            // borderBottomEndRadius: 10,
            width: "20%",
            height: "3%",
            position: "absolute",
          },
          animatedStyles,
        ]}
      />
      <Animated.View
        style={[
          {
            backgroundColor: "#B1C2F4",
            width: "20%",
            height: "100%",
            position: "absolute",
            opacity: 0.1,
          },
          animatedStyles,
        ]}
      />
      {Tabs.map((tab: any, index: number) => (
        <View key={index} style={FooterStyle.tabContainer}>
          <TouchableOpacity
            onPress={() => {
              navigate(tab.path);
              offset.value = withTiming(tab.value);
            }}
            style={FooterStyle.tabStyleBox}
          >
            {path === tab.path || path === tab.extra_path ? (
              <>
                <Image
                  source={tab.icon}
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                    borderRadius: tab.path === "/profile" ? 100 : 0,
                    borderWidth:
                      tab.path === "/profile" ? moderateScale(0.5) : 0,
                    borderColor: "#3C6EFB",
                  }}
                />
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: "#3C6EFB",
                    fontFamily: "Kantumruy-Bold",
                  }}
                >
                  {t(tab.title)}
                </Text>
              </>
            ) : (
              <>
                <Image
                  source={tab.active_icon}
                  style={{
                    width: moderateScale(28),
                    height: moderateScale(28),
                    borderRadius: tab.path === "/profile" ? 100 : 0,
                    borderWidth:
                      tab.path === "/profile" ? moderateScale(0.5) : 0,
                    borderColor: "#3C6EFB",
                  }}
                />
                <Text
                  style={{
                    fontSize: moderateScale(11),
                    fontFamily: "Kantumruy-Bold",
                  }}
                >
                  {t(tab.title)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default Footer;
