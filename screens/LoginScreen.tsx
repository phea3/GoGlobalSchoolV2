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
import { GET_MOBILEUSERLOGIN } from "../graphql/GetMobileUserLogin";

const LoginScreen = () => {
  const { dispatch, REDUCER_ACTIONS } = useUser();
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const [view, setView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //======== SET LOCAL STORAGE =========
  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);

  //============ GET MOBILE USER LOGIN =============
  const { refetch } = useQuery(GET_MOBILEUSERLOGIN, {
    onCompleted: ({ getMobileUserLogin }) => {
      onStateChange(getMobileUserLogin);
    },
  });

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
    await auth.login(email, password).then((result) => {
      // console.log("result", result?.token);
      if (result?.status === true) {
        //======= Set Local Storage ======
        AsyncStorage.setItem("@userToken", result?.token);
        AsyncStorage.setItem("@userUid", result?.uid);
        AsyncStorage.setItem("@gmail", email);
        AsyncStorage.setItem("@password", password);

        refetch();

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
        }, 600);
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
          <>
            <Image
              source={require("../assets/Images/Logo.png")}
              resizeMode="contain"
              style={
                dimension === "sm"
                  ? LoginStyle.logoLoginScreensm
                  : dimension === "lg"
                  ? LoginStyle.logoLoginScreenlg
                  : LoginStyle.logoLoginScreen
              }
            />
            <Text
              style={[
                LoginStyle.titleLogin,
                {
                  fontSize:
                    dimension === "sm" ? 15 : dimension === "lg" ? 35 : 25,
                },
              ]}
            >
              ចូលប្រើកម្មវិធី
            </Text>
          </>
        )}

        <View
          style={[
            dimension === "sm" ? LoginStyle.textinputContainersm :  LoginStyle.textinputContainer,
            {
              marginTop: dimension === "sm" ? 8 : dimension === "lg" ? 24 : 20,
            },
          ]}
        >
          <Text
            style={[
              LoginStyle.inputTitle,
              {
                fontSize:
                  dimension === "sm" ? 12 : dimension === "lg" ? 20 : 15,
              },
            ]}
          >
            អ៉ីម៉ែល
          </Text>
          <View
            style={[
              LoginStyle.textinput,
              {
                padding: dimension === "sm" ? 5 : dimension === "lg" ? 25 : 15,
              },
            ]}
          >
            <Image
              source={require("../assets/Images/mail.png")}
              resizeMode="contain"
              style={{
                width: dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                height: dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                marginRight:
                  dimension === "sm" ? 8 : dimension === "lg" ? 15 : 10,
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
                fontSize:
                  dimension === "sm" ? 12 : dimension === "lg" ? 20 : 15,
              }}
            />
          </View>
        </View>

        <View style={LoginStyle.textinputContainer}>
          <Text
            style={[
              LoginStyle.inputTitle,
              {
                fontSize:
                  dimension === "sm" ? 12 : dimension === "lg" ? 20 : 15,
              },
            ]}
          >
            ពាក្យសម្ងាត់
          </Text>
          <View
            style={[
              LoginStyle.textinput,
              {
                padding: dimension === "sm" ? 5 : dimension === "lg" ? 25 : 15,
              },
            ]}
          >
            <Image
              source={require("../assets/Images/lock.png")}
              resizeMode="contain"
              style={{
                width: dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                height: dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                marginRight:
                  dimension === "sm" ? 8 : dimension === "lg" ? 15 : 10,
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
                fontSize:
                  dimension === "sm" ? 12 : dimension === "lg" ? 20 : 15,
              }}
            />
            {view === true ? (
              <TouchableOpacity onPress={() => setView(!view)}>
                <Image
                  source={require("../assets/Images/view.png")}
                  resizeMode="contain"
                  style={{
                    width:
                      dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                    height:
                      dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setView(!view)}>
                <Image
                  source={require("../assets/Images/hide.png")}
                  resizeMode="cover"
                  style={{
                    width:
                      dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                    height:
                      dimension === "sm" ? 14 : dimension === "lg" ? 30 : 20,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={ dimension === "sm" ?  LoginStyle.optionContainersm : LoginStyle.optionContainer}>
          <TouchableOpacity onPress={() => navigate("/forget")}>
            <Text
              style={[
                LoginStyle.LoginForgetText,
                {
                  fontSize:
                    dimension === "sm" ? 10 : dimension === "lg" ? 20 : 14,
                },
              ]}
            >
              ភ្លេចពាក្យសម្ងាត់?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleNavigation}
          style={[
            LoginStyle.buttonContainer,
            {
              marginTop: dimension === "sm" ? 0 : 10,
            },
          ]}
        >
          <Text
            style={[
              LoginStyle.buttonText,
              {
                fontSize:
                  dimension === "sm" ? 14 : dimension === "lg" ? 25 : 20,
              },
            ]}
          >
            ចូលកម្មវិធី
          </Text>
        </TouchableOpacity>

        {isKeyboardVisible ? null : (
          <View
            style={
              dimension === "sm"
                ? LoginStyle.loginFooterImgContaintersm
                : dimension === "lg"
                ? LoginStyle.loginFooterImgContainterlg
                : LoginStyle.loginFooterImgContainter
            }
          >
            <Image
              source={require("../assets/Images/bottomImage.png")}
              resizeMode="contain"
              style={
                dimension === "sm"
                  ? LoginStyle.loginFooterImgsm
                  : dimension === "lg"
                  ? LoginStyle.loginFooterImglg
                  : LoginStyle.loginFooterImg
              }
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
