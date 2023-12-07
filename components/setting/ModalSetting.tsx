import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import * as Animatable from "react-native-animatable";
import { Linking } from "react-native";
import { getLanguage, setLanguage, useTranslation } from "react-multi-lang";
import { useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function ModalSetting({ isVisible, handleClose }: any) {
  const [disappear, setDisappear] = useState(false);
  const recipientUserId = "1586031671709848";
  const predefinedMessage = "Hello, this is a predefined message.";
  const t = useTranslation();
  const offset = useSharedValue(0.2);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(offset.value),
    };
  });

  const ChangeKh = () => {
    setLanguage("kh");
  };

  const ChangeEng = () => {
    setLanguage("en");
  };

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={HomeStyle.ModalSettingContainer}>
          <Animated.View
            style={[
              animatedStyles,
              {
                width: "100%",
                height: "100%",
                backgroundColor: "#000",
                position: "absolute",
              },
            ]}
          >
            <TouchableOpacity
              style={[
                HomeStyle.homeModalStyle1,
                { backgroundColor: "#000", opacity: 0.2, position: "absolute" },
              ]}
              onPress={() => {
                setDisappear(true);
                offset.value = withTiming(0);
                setTimeout(() => {
                  handleClose();
                  setDisappear(false);
                  offset.value = withTiming(0.2);
                }, 1000);
              }}
            />
          </Animated.View>

          <Animatable.View
            style={HomeStyle.SettingContentContainer}
            animation={disappear ? "fadeOutDownBig" : "fadeInUpBig"}
          >
            <View style={HomeStyle.SettingBodyContentContainer}>
              <TouchableOpacity
                style={HomeStyle.SettingContentButton}
                onPress={() => {
                  setDisappear(true);
                  setTimeout(() => {
                    handleClose();
                    setDisappear(false);
                  }, 500);
                  ChangeKh();
                }}
              >
                <Animatable.Image
                  source={require("../../assets/Images/Cambodia-Flag.png")}
                  style={{ width: 30, height: 30 }}
                  animation="fadeInDown"
                />
                <Text style={HomeStyle.SettingTitleContent}>{t("Khmer")}</Text>
                {getLanguage() === "kh" ? (
                  <Image
                    source={require("../../assets/Images/check-mark-active.png")}
                    style={{ width: 30, height: 30 }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={HomeStyle.SettingContentButton}
                onPress={() => {
                  setDisappear(true);
                  setTimeout(() => {
                    handleClose();
                    setDisappear(false);
                  }, 500);
                  ChangeEng();
                }}
              >
                <Animatable.Image
                  source={require("../../assets/Images/English-Flag.png")}
                  style={{ width: 30, height: 30 }}
                  animation="fadeInDown"
                />
                <Text style={HomeStyle.SettingTitleContent}>
                  {t("English")}
                </Text>
                {getLanguage() === "en" ? (
                  <Image
                    source={require("../../assets/Images/check-mark-active.png")}
                    style={{ width: 30, height: 30 }}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={HomeStyle.ContactUsFooterModal}
              onPress={() => {
                setDisappear(true);
                setTimeout(() => {
                  handleClose();
                  setDisappear(false);
                }, 500);
              }}
            >
              <Text style={{ fontWeight: "500" }}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
}
