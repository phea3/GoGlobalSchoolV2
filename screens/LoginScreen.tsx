import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
import LoginStyle from "../Styles/LoginScreen.scss";
import { useNavigate } from "react-router-native";
import auth from "../Auth/auth";
import { AuthContext } from "../Context/AuthContext";
import Checkbox from "expo-checkbox";
import useUser from "../Hook/useLoginUser";
import { StyleController } from "../styleProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@apollo/client";
import serviceAccount from "../Auth/keyService.json";
import KeyboardDismissableArea from "../Function/KeyboardDismissableArea";
import { getLanguage, setLanguage, useTranslation } from "react-multi-lang";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import * as Animatable from "react-native-animatable";
import { SENDMOBILETOKEN } from "../graphql/GetMobileUserLoginToken";
import { moderateScale } from "../ Metrics";

const LoginScreen = ({ expoPushToken }: any) => {
  const { dispatch, REDUCER_ACTIONS } = useUser();
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const [view, setView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const t = useTranslation();
  //======== SET LOCAL STORAGE =========
  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);

  //============ GET MOBILE USER LOGIN =============
  const { refetch } = useQuery(SENDMOBILETOKEN, {
    variables: {
      token: expoPushToken?.data ? expoPushToken?.data : "",
    },
    onCompleted: ({ getMobileUserLogin }) => {
      onStateChange(getMobileUserLogin);
    },
  });

  const ChangeKh = () => {
    setLanguage("kh");
  };

  const ChangeEng = () => {
    setLanguage("en");
  };

  useEffect(() => {
    async function getAccount() {
      let userGmail = await AsyncStorage.getItem("@gmail");
      let userPassword = await AsyncStorage.getItem("@password");
      // console.log(userGmail + "\n" + userPassword);
      if (userGmail) {
        setEmail(userGmail);
      }
      if (userPassword) {
        setPassword(userPassword);
      }
    }
    getAccount();
  }, []);

  //============== CHECK NAVIGATE ===============
  const handleNavigation = async () => {
    await auth.createApp(
      serviceAccount.app_id,
      serviceAccount.key,
      serviceAccount.url
    );

    await auth.login(email, password).then((result) => {
      // console.log("result", result?.token);
      if (result?.status === true) {
        //======= Set Local Storage ======
        AsyncStorage.setItem("@userToken", result?.token);
        AsyncStorage.setItem("@userUid", result?.uid);
        AsyncStorage.setItem("@gmail", email);
        AsyncStorage.setItem("@password", password);

        setTimeout(() => {
          navigate("/home");
          dispatch({
            type: REDUCER_ACTIONS.LOGIN,
            payload: {
              email: "example@user.com",
              token: result?.token ? result?.token : "",
              uid: result?.uid ? result?.uid : "",
            },
          });
        }, 1000);
      } else {
        Alert.alert("Message", result?.message);
      }
    });
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={LoginStyle.containerLogin}>
      <ImageBackground
        source={require("../assets/Images/dashboard-login.png")}
        style={
          Platform.OS === "android"
            ? LoginStyle.imagebackgroundandroid
            : LoginStyle.imagebackgroundios
        }
        resizeMode="cover"
      >
        {isKeyboardVisible ? null : (
          <View
            style={{
              flex: 1,
              width: "100%",
              // height: "40%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/Images/Logo.png")}
              resizeMode="contain"
              style={[
                LoginStyle.logoLoginScreen,
                {
                  height: moderateScale(100),
                  width: moderateScale(100),
                },
              ]}
            />
            <Text
              style={[
                Platform.OS === "ios"
                  ? LoginStyle.titleLoginios
                  : LoginStyle.titleLogin,
                {
                  fontSize: moderateScale(20),
                },
              ]}
            >
              {t("LogIn")}
            </Text>
          </View>
        )}

        {isKeyboardVisible ? <KeyboardDismissableArea /> : null}

        <View
          style={{
            flex: 1,
            width: "100%",
            // height: "40%",
            marginTop: isKeyboardVisible ? 40 : 0,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View
            style={[
              isKeyboardVisible === true
                ? LoginStyle.textinputContainerkeyboard
                : LoginStyle.textinputContainer,
            ]}
          >
            <Text
              style={[
                LoginStyle.inputTitle,
                {
                  fontSize: moderateScale(15),
                },
              ]}
            >
              {t("email")}
            </Text>
            <View
              style={[
                LoginStyle.textinput,
                {
                  padding: moderateScale(15),
                  marginVertical: moderateScale(10),
                },
              ]}
            >
              <Image
                source={require("../assets/Images/mail.png")}
                resizeMode="contain"
                style={{
                  width: moderateScale(20),
                  height: moderateScale(20),
                  marginRight: moderateScale(10),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <TextInput
                value={email}
                placeholder="Email"
                onChangeText={(e) => setEmail(e)}
                keyboardType="default"
                style={{
                  flex: 1,
                  fontSize: moderateScale(14),
                }}
              />
            </View>
          </View>

          <View
            style={[
              isKeyboardVisible === true
                ? LoginStyle.textinputContainerkeyboard
                : LoginStyle.textinputContainer,
            ]}
          >
            <Text
              style={[
                LoginStyle.inputTitle,
                {
                  fontSize: moderateScale(15),
                },
              ]}
            >
              {t("password")}
            </Text>
            <View
              style={[
                LoginStyle.textinput,
                {
                  padding: moderateScale(15),
                  marginVertical: moderateScale(10),
                },
              ]}
            >
              <Image
                source={require("../assets/Images/lock.png")}
                resizeMode="contain"
                style={{
                  width: moderateScale(20),
                  height: moderateScale(20),
                  marginRight: moderateScale(10),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <TextInput
                value={password}
                placeholder="Password"
                onChangeText={(e) => setPassword(e)}
                secureTextEntry={view}
                keyboardType="default"
                style={{
                  flex: 1,
                  fontSize: moderateScale(14),
                }}
              />
              {view === true ? (
                <TouchableOpacity onPress={() => setView(!view)}>
                  <Image
                    source={require("../assets/Images/view.png")}
                    resizeMode="contain"
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setView(!view)}>
                  <Image
                    source={require("../assets/Images/hide.png")}
                    resizeMode="cover"
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={LoginStyle.optionContainer}>
            <TouchableOpacity onPress={() => navigate("/forget")}>
              <Text
                style={[
                  LoginStyle.LoginForgetText,
                  {
                    fontSize: moderateScale(14),
                    padding: 5,
                  },
                ]}
              >
                {t("Forget password?")}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleNavigation}
            style={[
              LoginStyle.buttonContainer,
              {
                marginTop: moderateScale(10),
                height: moderateScale(40),
              },
            ]}
          >
            <Text
              style={[
                Platform.OS === "ios"
                  ? LoginStyle.buttonTextios
                  : LoginStyle.buttonText,
                {
                  fontSize: moderateScale(18),
                },
              ]}
            >
              {t("Login")}
            </Text>
          </TouchableOpacity>
        </View>
        {isKeyboardVisible ? null : (
          <View
            style={[
              LoginStyle.loginFooterImgContainter,
              { height: moderateScale(100), width: moderateScale(100) },
            ]}
          >
            <Image
              source={require("../assets/Images/bottomImage.png")}
              resizeMode="contain"
              style={LoginStyle.loginFooterImg}
            />
          </View>
        )}
        <Menu
          style={{
            position: "absolute",
            top: moderateScale(50),
            right: moderateScale(30),
          }}
        >
          <MenuTrigger>
            {getLanguage() === "kh" ? (
              <Animatable.Image
                source={require("../assets/Images/Cambodia-Flag.png")}
                style={{
                  width: moderateScale(30),
                  height: moderateScale(30),
                }}
                animation="fadeInDown"
              />
            ) : (
              <Animatable.Image
                source={require("../assets/Images/English-Flag.png")}
                style={{
                  width: moderateScale(30),
                  height: moderateScale(30),
                }}
                animation="fadeInDown"
              />
            )}
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => ChangeEng()}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: moderateScale(10),
                }}
              >
                <Text
                  style={[
                    LoginStyle.headerTitle3,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  {t("English")}
                </Text>
                <Image
                  source={require("../assets/Images/English-Flag.png")}
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                />
              </View>
            </MenuOption>
            <MenuOption onSelect={() => ChangeKh()}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: moderateScale(10),
                  borderTopWidth: 1,
                  borderColor: "#dcdcdc",
                }}
              >
                <Text
                  style={[
                    LoginStyle.headerTitle3,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  {t("Khmer")}
                </Text>
                <Image
                  source={require("../assets/Images/Cambodia-Flag.png")}
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                />
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
