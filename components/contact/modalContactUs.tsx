import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import * as Animatable from "react-native-animatable";
import { FadeInUp } from "react-native-reanimated";
import { Linking } from "react-native";

export default function ModalContactUS({ isVisible, handleClose }: any) {
  const recipientUserId = "1586031671709848";
  const predefinedMessage = "Hello, this is a predefined message.";

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={HomeStyle.ContactUsModalGroupButton}>
          <TouchableOpacity
            style={HomeStyle.homeModalStyle1}
            onPress={handleClose}
          />
          <Animatable.View
            style={HomeStyle.ContactUsContentContainer}
            animation={"fadeInUpBig"}
          >
            <TouchableOpacity
              style={HomeStyle.ContactUsContentButton}
              onPress={() => {
                Linking.openURL("https://t.me/GoGlobal_IT_And_Marketing");
              }}
            >
              <Image
                source={require("../../assets/Images/telegram-colorful.png")}
                resizeMode="contain"
                style={{ width: 60, height: 60 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={HomeStyle.ContactUsContentButton}
              onPress={() => {
                Linking.openURL(
                  `fb-messenger://user-thread/${recipientUserId}?text=${encodeURIComponent(
                    predefinedMessage
                  )}`
                );
              }}
            >
              <Image
                source={require("../../assets/Images/facebook-colorful.png")}
                resizeMode="contain"
                style={{ width: 60, height: 60 }}
              />
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
}
