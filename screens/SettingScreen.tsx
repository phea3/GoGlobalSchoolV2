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
        <View style={SettingStyle.SettingBodyContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", height: "80%" }}
          >
            <View style={SettingStyle.SettingBodyContentContainer}>
              <TouchableOpacity
                style={SettingStyle.SettingBodyCardContentContainer}
                onPress={handleOpen}
              >
                <Text>{t("Change Language")}</Text>
                <Text>
                  {getLanguage() === "kh" ? t("Khmer") : t("English")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={SettingStyle.SettingBodyCardContentContainer}
                onPress={() => {
                  navigate("/resetpassword", { state: gmail });
                }}
              >
                <Text>{t("Change Password")}</Text>
                <Image
                  source={require("../assets/Images/next.png")}
                  style={SettingStyle.SettingNextIconStyle}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
}
