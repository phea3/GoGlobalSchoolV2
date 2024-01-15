import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import * as Animatable from "react-native-animatable";
import { Linking } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-multi-lang";
import { moderateScale } from "../../ Metrics";

export default function ModalContactUS({
  isVisible,
  isInvisible,
  handleClose,
}: any) {
  const recipientUserId = "1586031671709848";
  const predefinedMessage = "Hello, this is a predefined message.";
  const t = useTranslation();

  const openMessenger = async () => {
    const url = `fb-messenger://user-thread/${recipientUserId}?text=${encodeURIComponent(
      predefinedMessage
    )}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      // Open the messaging app
      Linking.openURL(url);
    } else {
      // Handle the case when the app is not installed
      // You can show an error message or provide an alternative way to contact the user
      Alert.alert(
        "Oop!",
        "Make sure you have the Facebook Messenger app installed on your device."
      );
    }
  };

  const openTelegram = async () => {
    const url = "https://t.me/GoGlobal_IT_And_Marketing";
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        "Oop!",
        "Make sure you have the Telegram app installed on your device."
      );
    }
  };

  const offset = useSharedValue(0.2);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(offset.value),
    };
  });

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={HomeStyle.ContactUsModalGroupButton}>
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
                handleClose();
                offset.value = withTiming(0);
                setTimeout(() => {
                  offset.value = withTiming(0.2);
                }, 500);
              }}
            />
          </Animated.View>
          <Animatable.View
            style={HomeStyle.ContactUsContentContainer}
            animation={isInvisible ? "fadeOutDownBig" : "fadeInUpBig"}
          >
            <View style={HomeStyle.ContactUsBodyContentContainer}>
              <TouchableOpacity
                style={HomeStyle.ContactUsContentButton}
                onPress={() => {
                  openTelegram();
                }}
              >
                <Image
                  source={require("../../assets/Images/telegram-colorful.png")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(60),
                    height: moderateScale(60),
                  }}
                />
                <Text
                  style={[
                    HomeStyle.ContactUsTitleContent,
                    { fontSize: moderateScale(14), padding: moderateScale(10) },
                  ]}
                >
                  Telegram
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={HomeStyle.ContactUsContentButton}
                onPress={() => {
                  openMessenger();
                }}
              >
                <Image
                  source={require("../../assets/Images/facebook-colorful.png")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(60),
                    height: moderateScale(60),
                  }}
                />
                <Text
                  style={[
                    HomeStyle.ContactUsTitleContent,
                    { fontSize: moderateScale(14), padding: moderateScale(10) },
                  ]}
                >
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={HomeStyle.ContactUsFooterModal}
              onPress={() => {
                handleClose();
                offset.value = withTiming(0);
                setTimeout(() => {
                  offset.value = withTiming(0.2);
                }, 500);
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: moderateScale(16) }}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
}
