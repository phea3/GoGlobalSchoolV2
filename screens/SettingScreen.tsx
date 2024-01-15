import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SettingStyle from "../Styles/SettingScreen.scss";
import { getLanguage, useTranslation } from "react-multi-lang";
import { useState } from "react";
import ModalSetting from "../components/setting/ModalSetting";
import { useLocation, useNavigate } from "react-router-native";
import { moderateScale } from "../ Metrics";

export default function SettingScreen() {
  const t = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const gmail = location.state;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
  };

  return (
    <>
      <ModalSetting isVisible={isVisible} handleClose={handleClose} />
      <ImageBackground
        source={require("../assets/Images/dashboard-login.png")}
        resizeMode="repeat"
        style={SettingStyle.SettingContainer}
      >
        <View
          style={[
            SettingStyle.SettingBodyContainer,
            { borderWidth: moderateScale(0.5) },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", height: "80%" }}
          >
            <View
              style={[
                SettingStyle.SettingBodyContentContainer,
                { padding: moderateScale(10) },
              ]}
            >
              <TouchableOpacity
                style={[
                  SettingStyle.SettingBodyCardContentContainer,
                  {
                    borderWidth: moderateScale(0.5),
                    padding: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
                onPress={handleOpen}
              >
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontFamily: "Kantumruy-Regular",
                  }}
                >
                  {t("Change Language")}
                </Text>
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontFamily: "Kantumruy-Regular",
                  }}
                >
                  {getLanguage() === "kh" ? t("Khmer") : t("English")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  SettingStyle.SettingBodyCardContentContainer,
                  {
                    borderWidth: moderateScale(0.5),
                    padding: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
                onPress={() => {
                  navigate("/resetpassword", { state: gmail });
                }}
              >
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontFamily: "Kantumruy-Regular",
                  }}
                >
                  {t("Change Password")}
                </Text>
                <Image
                  source={require("../assets/Images/next.png")}
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                  }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
}
