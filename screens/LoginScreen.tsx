import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import LoginStyle from "../Styles/LoginScreen.scss";
import { useNavigate } from "react-router-native";
import auth from "../Auth/auth";
import { AuthContext } from "../Context/AuthContext";
import Checkbox from "expo-checkbox";
import useUser from "../Hook/useLoginUser";
import { StyleController } from "../styleProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const { dispatch, REDUCER_ACTIONS } = useUser();

  const [isChecked, setChecked] = useState(false);
  const [view, setView] = useState(true);
  const [email, setEmail] = useState("loklundy@gmail.com");
  const [password, setPassword] = useState("Goglobal@2023");
  const navigate = useNavigate();

  //============== CHECK NAVIGATE ===============
  const handleNavigation = async () => {
    await auth.login(email, password).then((result) => {
      // console.log("result", result?.token);
      //
      AsyncStorage.setItem("@userToken", result?.token);
      AsyncStorage.setItem("@userUid", result?.uid);
      if (result?.status === true) {
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

  return (
    <View style={LoginStyle.containerLogin}>
      <ImageBackground
        source={require("../assets/Images/dashboard-login.png")}
        style={LoginStyle.imagebackground}
        resizeMode="cover"
      >
        <Image
          source={require("../assets/Images/Logo.png")}
          resizeMode="contain"
          style={LoginStyle.logoLoginScreen}
        />
        <Text style={LoginStyle.titleLogin}>ចូលប្រើកម្មវិធី</Text>
        <View style={LoginStyle.textinputContainer}>
          <Text style={LoginStyle.inputTitle}>អ៉ីម៉ែល</Text>
          <View style={LoginStyle.textinput}>
            <Image
              source={require("../assets/Images/mail.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <TextInput
              value={email}
              placeholder="Email"
              onChangeText={(e) => setEmail(e)}
              keyboardType="default"
            />
          </View>
        </View>

        <View style={LoginStyle.textinputContainer}>
          <Text style={LoginStyle.inputTitle}>ពាក្យសម្ងាត់</Text>
          <View style={LoginStyle.textinput}>
            <Image
              source={require("../assets/Images/lock.png")}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <TextInput
              value={password}
              placeholder="Password"
              onChangeText={(e) => setPassword(e)}
              secureTextEntry={view}
              keyboardType="default"
              style={{ width: "80%" }}
            />
            {view === true ? (
              <TouchableOpacity onPress={() => setView(!view)}>
                <Image
                  source={require("../assets/Images/view.png")}
                  resizeMode="contain"
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setView(!view)}>
                <Image
                  source={require("../assets/Images/hide.png")}
                  resizeMode="cover"
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={LoginStyle.optionContainer}>
          <TouchableOpacity onPress={() => navigate("/forget")}>
            <Text style={LoginStyle.LoginForgetText}>ភ្លេចពាក្យសម្ងាត់?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleNavigation}
          style={LoginStyle.buttonContainer}
        >
          <Text style={LoginStyle.buttonText}>ចូលកម្មវិធី</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/Images/bottomImage.png")}
          resizeMode="contain"
          style={LoginStyle.footer}
        />
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
