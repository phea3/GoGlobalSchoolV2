import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import * as Animatable from "react-native-animatable";
import { Linking } from "react-native";
import { getLanguage, setLanguage } from "react-multi-lang";
import { useRef, useState } from "react";

export default function ModalSetting({ isVisible, handleClose }: any) {
  const [disappear, setDisappear] = useState(false);
  const recipientUserId = "1586031671709848";
  const predefinedMessage = "Hello, this is a predefined message.";

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
          <TouchableOpacity
            style={HomeStyle.homeModalStyle1}
            onPress={() => {
              setDisappear(true);
              setTimeout(() => {
                handleClose();
                setDisappear(false);
              }, 500);
            }}
          />
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
                <Text style={HomeStyle.SettingTitleContent}>Khmer</Text>
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
                <Text style={HomeStyle.SettingTitleContent}>English</Text>
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
              <Text style={{ fontWeight: "500" }}>Cancel</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
}
