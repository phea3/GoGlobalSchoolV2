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
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import ContactUsScreenStyle from "../Styles/ContactUsScreen.scss";
import { useLocation, useNavigate } from "react-router-native";
import auth from "../Auth/auth";
import axios from "axios";
import { Linking } from "react-native";
import ModalContactUS from "../components/contact/modalContactUs";

const conversations = [
  {
    index: 1,
    question: "Do you eat rice?",
    answer:
      "Yes, I do eat in the morning with the fish that I catch from the river at the siem reap city at 3:00 AM with my best friend who also eat rice with me.",
    show: false,
  },
  {
    index: 2,
    question: "Do you drink coffee?",
    answer: "No, I do not.",
    show: true,
  },
  {
    index: 3,
    question: "Do you work now?",
    answer: "Yes, I do work at the 1st floor office.",
    show: false,
  },
];

const ContactUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = "+855767772168";
  const [isVisible, setIsVisible] = useState(false);
  const [isAnswerVisible, setInAnswerVisible] = useState(false);
  const [Index, setIndex] = useState(0);
  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClick = (index: number) => {
    setInAnswerVisible(!isAnswerVisible);
    setIndex(index + 1);
  };

  return (
    <>
      <ModalContactUS isVisible={isVisible} handleClose={handleClose} />
      <ImageBackground
        source={require("../assets/Images/dashboard-login.png")}
        resizeMode="repeat"
        style={ContactUsScreenStyle.ContactUsContainer}
      >
        <View style={ContactUsScreenStyle.ContactUsTopContainer}>
          {location.pathname === "/forget" ? (
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
          ) : null}

          <Text style={ContactUsScreenStyle.ContactUsTopTitleContent}>FAQ</Text>
        </View>

        <View style={ContactUsScreenStyle.ContactUsBodyContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", height: "100%" }}
          >
            {conversations.map((conversation, index) => (
              <View
                style={ContactUsScreenStyle.ContactUsRowQandAContainer}
                key={index}
              >
                <View style={ContactUsScreenStyle.ContactUsBodyRowContainer}>
                  <Image
                    source={require("../assets/Images/user.png")}
                    resizeMode="cover"
                    style={{ width: 40, height: 40, marginRight: 10 }}
                  />
                  <TouchableOpacity
                    style={ContactUsScreenStyle.ContactUsBodyTitleRowContainer}
                    onPress={() => handleClick(index)}
                  >
                    <Text>{conversation.question}</Text>
                    <Image
                      source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                      resizeMode="cover"
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>

                {isAnswerVisible === true && conversation.index === Index ? (
                  <View style={ContactUsScreenStyle.ContactUsBodyRowContainer}>
                    <View
                      style={
                        ContactUsScreenStyle.ContactUsBodyTitleRowContainer
                      }
                    >
                      <Text>{conversation.answer}</Text>
                    </View>
                    <Image
                      source={require("../assets/Images/user_phoem.jpg")}
                      resizeMode="cover"
                      style={{
                        width: 40,
                        height: 40,
                        marginLeft: 10,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: "#dcdcdc",
                      }}
                    />
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
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
