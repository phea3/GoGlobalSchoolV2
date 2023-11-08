import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import ForgetScreenStyle from "../Styles/LoginScreen.scss";
import { useNavigate } from "react-router-native";
import auth from "../Auth/auth";
import axios from "axios";

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  // const ResetPasswordHandle = async () => {
  //   if (password === repeatPassword) {
  //     await auth.forgortPassword(email, repeatPassword).then((result) => {
  //       if (result?.status === true) {
  //         console.log(result, "result");
  //         Alert.alert("Oop!", result?.message);
  //       } else {
  //         Alert.alert("Oop!", result?.message);
  //       }
  //     });
  //   } else {
  //     Alert.alert("Oop!", "Passwords are not match");
  //   }
  // };

  const BOT_API_TOKEN = "6017570441:AAH97g8HOGxroGZA8K7828hNS5-pNQSkF84";
  const sendMessageToTelegram = async (message: string) => {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_API_TOKEN}/sendMessage`,
        {
          chat_id: "-1001814182076", // Replace 'CHAT_ID' with your actual chat ID
          text: message,
        }
      );
      console.log("Message sent:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSend = () => {
    sendMessageToTelegram("Hi wanna change password");
  };

  return (
    <ImageBackground
      source={require("../assets/Images/dashboard-login.png")}
      style={ForgetScreenStyle.forgotContainer}
    >
      <View style={ForgetScreenStyle.ForgetTopContainer}>
        <TouchableOpacity
          style={ForgetScreenStyle.LoginBackButton}
          onPress={() => navigate(-1)}
        >
          <Image
            source={require("../assets/Images/left-arrow3.png")}
            resizeMode="contain"
            style={ForgetScreenStyle.LoginBackButtonImage}
          />
        </TouchableOpacity>
      </View>
      <View style={ForgetScreenStyle.textinputContainer}>
        <Text style={ForgetScreenStyle.inputTitle}>អ៉ីម៉ែល</Text>
        <View style={ForgetScreenStyle.textinput}>
          <TextInput
            value={email}
            placeholder="Email"
            onChangeText={(e) => setEmail(e)}
            keyboardType="default"
          />
        </View>
      </View>

      <View style={ForgetScreenStyle.textinputContainer}>
        <Text style={ForgetScreenStyle.inputTitle}>ពាក្យសម្ងាត់</Text>
        <View style={ForgetScreenStyle.textinput}>
          <TextInput
            value={password}
            placeholder="Password"
            onChangeText={(e) => setPassword(e)}
            secureTextEntry={true}
            keyboardType="default"
          />
        </View>
      </View>

      <View style={ForgetScreenStyle.textinputContainer}>
        <Text style={ForgetScreenStyle.inputTitle}>បញ្ជាក់ពាក្យសម្ងាត់</Text>
        <View style={ForgetScreenStyle.textinput}>
          <TextInput
            value={repeatPassword}
            placeholder="Repeat password"
            onChangeText={(e) => setRepeatPassword(e)}
            secureTextEntry={true}
            keyboardType="default"
          />
        </View>
      </View>
      <Button title="test" onPress={handleSend} />
    </ImageBackground>
  );
};

export default ForgetPasswordScreen;
