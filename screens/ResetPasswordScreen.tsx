import {
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SettingStyle from "../Styles/SettingScreen.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-native";
import { RESET_PASSWORD } from "../graphql/ResetPassword";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

// Declare password strength type
type PwdStrength = "Weak" | "Medium" | "Strong";

export default function ResetPasswordScreen() {
  const location = useLocation();
  const { uid } = useContext(AuthContext);
  const gmail = location.state;
  const [view, setView] = useState(true);
  const [repeatView, setRepeatView] = useState(true);
  const [loading, setLoading] = useState(false);

  //=================== FUNCTION RESET PASSWORD ===================
  const [resetPasswordParentsMobileApp] = useMutation(RESET_PASSWORD, {
    onCompleted: ({ resetPasswordParentsMobileApp }) => {
      // console.log(resetPasswordParentsMobileApp);
      setLoading(false);
      alert(resetPasswordParentsMobileApp?.message);
    },
    onError: (error) => {
      setLoading(false);
      alert(error.message);
    },
  });

  // The password
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [messagePwd, setMessagePwd] = useState("");
  const [pwdStrength, setPwdStrength] = useState<PwdStrength>("Weak");
  const [pwdRepeat, setPwdRepeat] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (password.length <= 6) {
      setIsButtonDisabled(true);
      setPwdStrength("Weak");
      setMessagePwd("password is longer than 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setIsButtonDisabled(true);
      setPwdStrength("Medium");
      setMessagePwd("password includes 1 capital letters");
      return;
    }

    if (!/\d/.test(password)) {
      setPwdStrength("Medium");
      setIsButtonDisabled(true);
      setMessagePwd("password Includes a Digit");
      return;
    }

    setPwdStrength("Strong");
    setIsButtonDisabled(false);
    setMessagePwd("Valid Password");
  }, [password]);

  useEffect(() => {
    if (password === repeatPassword) {
      setIsButtonDisabled(false);
      setPwdRepeat(true);
    } else {
      setIsButtonDisabled(true);
      setPwdRepeat(false);
    }
  }, [password, repeatPassword]);

  const handleResetPassword = () => {
    setLoading(true);
    resetPasswordParentsMobileApp({
      variables: {
        id: uid,
        newPassword: password,
      },
    });
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const t = useTranslation();

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
    <ImageBackground
      source={require("../assets/Images/dashboard-login.png")}
      resizeMode="repeat"
      style={SettingStyle.SettingContainer}
    >
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View
          style={
            isKeyboardVisible
              ? SettingStyle.SettingBodyContainerKeyboardShow
              : [
                  SettingStyle.SettingBodyContainer,
                  { borderWidth: moderateScale(0.5) },
                ]
          }
        >
          <View
            style={[
              SettingStyle.SettingBodyContentContainer,
              { padding: moderateScale(10) },
            ]}
          >
            {isKeyboardVisible ? null : (
              <View
                style={[
                  SettingStyle.ResetpasswordTopContainer,
                  {
                    borderWidth: moderateScale(0.5),
                    padding: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
              >
                <Text
                  style={[
                    SettingStyle.ResetPasswordLabelTextStyle,
                    {
                      fontSize: moderateScale(14),
                      paddingVertical: moderateScale(10),
                      fontFamily: "Kantumruy-Regular",
                    },
                  ]}
                >
                  {t("Gmail")}
                </Text>
                <Text
                  style={[
                    SettingStyle.ResetPasswordGmailTextStyle,
                    {
                      fontSize: moderateScale(12),
                      padding: moderateScale(10),
                      borderWidth: moderateScale(0.5),
                    },
                  ]}
                >
                  {gmail ? gmail : " "}
                </Text>
              </View>
            )}

            <View style={SettingStyle.ResetpasswordBodyContainer}>
              <Text
                style={[
                  SettingStyle.ResetPasswordLabelTextStyle,
                  {
                    fontSize: moderateScale(14),
                    paddingVertical: moderateScale(10),
                    fontFamily: "Kantumruy-Regular",
                  },
                ]}
              >
                {t("New Password")}
              </Text>
              <View
                style={[
                  SettingStyle.ResetPasswordInputTextStyle,
                  {
                    borderWidth: moderateScale(0.5),
                    padding: moderateScale(10),
                  },
                ]}
              >
                <TextInput
                  value={password}
                  placeholder={t("New Password")}
                  onChangeText={(e) => setPassword(e)}
                  secureTextEntry={view}
                  keyboardType="default"
                  style={{
                    flex: 1,
                    fontSize: moderateScale(12),
                    fontFamily: "Kantumruy-Regular",
                  }}
                />
                <Text
                  style={{
                    padding: moderateScale(2),
                    fontSize: moderateScale(12),
                    marginRight: moderateScale(5),
                    fontFamily: "Kantumruy-Regular",
                  }}
                >
                  {t(pwdStrength)}
                </Text>
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
              {password ? (
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    fontFamily: "Kantumruy-Regular",
                    color:
                      pwdStrength === "Weak"
                        ? "orange"
                        : pwdStrength === "Medium"
                        ? "orange"
                        : pwdStrength === "Strong"
                        ? "green"
                        : "",
                    padding: 4,
                  }}
                >
                  {messagePwd}
                </Text>
              ) : null}

              <Text
                style={[
                  SettingStyle.ResetPasswordLabelTextStyle,
                  {
                    fontSize: moderateScale(14),
                    paddingVertical: moderateScale(10),
                    fontFamily: "Kantumruy-Regular",
                  },
                ]}
              >
                {t("Repeat Password")}
              </Text>
              <View
                style={[
                  SettingStyle.ResetPasswordInputTextStyle,
                  {
                    borderWidth: moderateScale(0.5),
                    padding: moderateScale(10),
                  },
                ]}
              >
                <TextInput
                  value={repeatPassword}
                  placeholder={t("Repeat Password")}
                  onChangeText={(e) => setRepeatPassword(e)}
                  secureTextEntry={repeatView}
                  keyboardType="default"
                  style={{
                    flex: 1,
                    fontSize: moderateScale(12),
                    fontFamily: "Kantumruy-Regular",
                  }}
                />
                {repeatView === true ? (
                  <TouchableOpacity onPress={() => setRepeatView(!repeatView)}>
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
                  <TouchableOpacity onPress={() => setRepeatView(!repeatView)}>
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
              {password && repeatPassword ? (
                <Text
                  style={{
                    color: pwdRepeat ? "green" : "red",
                    padding: moderateScale(4),
                    fontFamily: "Kantumruy-Regular",
                  }}
                >
                  {pwdRepeat ? t("Valid Password") : t("Invalid Password")}
                </Text>
              ) : null}
              {/* <View style={{ flex: 1 }} /> */}
              <View style={SettingStyle.ResetPasswordButtonFooterContainer}>
                <TouchableOpacity
                  style={[
                    SettingStyle.ResetPasswordButtonFooter,
                    { marginTop: moderateScale(20), height: moderateScale(40) },
                  ]}
                  disabled={isButtonDisabled || loading ? true : false}
                  onPress={handleResetPassword}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: moderateScale(14),
                      fontFamily: "Kantumruy-Bold",
                    }}
                  >
                    {loading ? t("...Loading") : t("Reset")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
