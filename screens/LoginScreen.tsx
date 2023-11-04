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
      if (result?.status === true) {
        navigate("/home");
        AsyncStorage.setItem("@userToken", result?.token);
        AsyncStorage.setItem("@userUid", result?.uid);
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: result?.token,
            uid: result?.uid,
          },
        });
      } else {
        Alert.alert("Message", result?.message);
      }
    });
  };

  return (
    <View style={LoginStyle.containerLogin}>
      <ImageBackground
        source={require("../assets/Images/background.png")}
        style={LoginStyle.imagebackground}
        resizeMode="contain"
      >
        <Image
          source={require("../assets/Images/Logo.png")}
          resizeMode="center"
          style={LoginStyle.logo}
        />
        <Text style={LoginStyle.titleLogin}>ចូលប្រើកម្មវិធី</Text>
        <View style={LoginStyle.textinputContainer}>
          <Text style={LoginStyle.inputTitle}>អ៉ីម៉ែល</Text>
          <View style={LoginStyle.textinput}>
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
                  resizeMode="cover"
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
        <TouchableOpacity
          onPress={handleNavigation}
          style={LoginStyle.buttonContainer}
        >
          <Text style={LoginStyle.button}>ចូលកម្មវិធី</Text>
        </TouchableOpacity>
        <View style={LoginStyle.optionContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              style={LoginStyle.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#0000FF" : "#0000FF"}
            />
            <Button
              title="ចងចាំពាក្យសម្ងាត់?"
              onPress={() => setChecked(!isChecked)}
            />
          </View>
          <Button
            title="ភ្លេចពាក្យសម្ងាត់?"
            onPress={() => navigate("/forget")}
          />
        </View>
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
