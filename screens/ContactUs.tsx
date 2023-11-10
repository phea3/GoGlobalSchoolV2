import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
} from "react-native";
import React, { useState } from "react";
import ContactUsScreenStyle from "../Styles/ContactUsScreen.scss";
import { useLocation, useNavigate } from "react-router-native";
import auth from "../Auth/auth";
import axios from "axios";
import { Linking } from "react-native";
import ModalContactUS from "../components/contact/modalContactUs";

const ContactUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = "+855767772168";
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
  };

  return (
    <>
      <ModalContactUS isVisible={isVisible} handleClose={handleClose} />
      <ImageBackground
        source={require("../assets/Images/dashboard-login.png")}
        resizeMode="repeat"
        style={ContactUsScreenStyle.ContactUsContainer}
      >
        {location.pathname === "/forget" ? (
          <View style={ContactUsScreenStyle.ContactUsTopContainer}>
            <TouchableOpacity
              style={ContactUsScreenStyle.ContactUsBackButton}
              onPress={() => navigate(-1)}
            >
              <Image
                source={require("../assets/Images/left-arrow3.png")}
                resizeMode="contain"
                style={ContactUsScreenStyle.ContactUsBackButtonImage}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={ContactUsScreenStyle.ContactUsBodyContainer}></View>
        <View style={ContactUsScreenStyle.ContactUsFooterContainer}>
          <View
            style={ContactUsScreenStyle.ContactUsFooterGroupButtonContainer}
          >
            <TouchableOpacity
              style={ContactUsScreenStyle.ContactUsFooterGroupButtonTitleBox}
              onPress={() => {
                Linking.openURL(`tel:${phoneNumber}`);
              }}
            >
              <View style={ContactUsScreenStyle.ContactUsFooterGroupButtonBox}>
                <Image
                  source={require("../assets/Images/call-center-service.png")}
                  resizeMode="contain"
                  style={ContactUsScreenStyle.ContactUsFooterImageButtonBox}
                />
              </View>

              <Text
                style={ContactUsScreenStyle.ContactUsFooterImageTitleButtonBox}
              >
                ទូរស័ព្ទ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ContactUsScreenStyle.ContactUsFooterGroupButtonTitleBox}
              onPress={handleOpen}
            >
              <View style={ContactUsScreenStyle.ContactUsFooterGroupButtonBox}>
                <Image
                  source={require("../assets/Images/chat.png")}
                  resizeMode="contain"
                  style={ContactUsScreenStyle.ContactUsFooterImageButtonBox}
                />
              </View>

              <Text
                style={ContactUsScreenStyle.ContactUsFooterImageTitleButtonBox}
              >
                សារអេឡិចត្រូនិច
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default ContactUs;
