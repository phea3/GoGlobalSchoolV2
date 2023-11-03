import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import ForgetScreenStyle from "../Styles/LoginScreen.scss";
import { useNavigate } from "react-router-native";
import auth from "../Auth/auth";
const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const ResetPasswordHandle = async () => {
    if (password === repeatPassword) {
      await auth.forgortPassword(email, repeatPassword).then((result) => {
        if (result?.status === true) {
          console.log(result, "result");
          Alert.alert("Oop!", result?.message);
        } else {
          Alert.alert("Oop!", result?.message);
        }
      });
    } else {
      Alert.alert("Oop!", "Passwords are not match");
    }
  };
  return (
    <View style={ForgetScreenStyle.forgotContainer}>
      <Image
        source={require("../assets/Images/Logo.png")}
        resizeMode="center"
        style={ForgetScreenStyle.logo}
      />
      <Text style={ForgetScreenStyle.titleLogin}>ប្តូរពាក្យសម្ងាត់</Text>
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
      <View style={ForgetScreenStyle.buttonGroup}>
        <TouchableOpacity
          style={ForgetScreenStyle.buttonForgetContainer}
          onPress={() => navigate(-1)}
        >
          <Text style={ForgetScreenStyle.button}>ចាកចេញ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={ForgetScreenStyle.buttonForgetContainer}
          onPress={() => ResetPasswordHandle()}
        >
          <Text style={ForgetScreenStyle.button}>បញ្ចូល</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgetPasswordScreen;
