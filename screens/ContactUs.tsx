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
import * as Animatable from "react-native-animatable";

const ContactUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = "+855767772168";
  const [isVisible, setIsVisible] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);
  const [Index, setIndex] = useState(0);
  const [conversations, setConversation] = useState([
    {
      index: 1,
      question: "How do I forget a password?",
      answer: "You have to contact us via telegram that we provide below.",
      show: false,
    },
  ]);

  const handleClose = () => {
    setIsInvisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsInvisible(false);
    }, 500);
  };

  const handleOpen = () => {
    setIsVisible(true);
  };

  const handleClick = (index: number) => {
    let new_array = conversations;
    // new_array[index].show = !new_array[index].show;
    setConversation(new_array);
    if (Index === 0) {
      setIndex(index + 1);
    } else if (index + 1 !== Index) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  return (
    <>
      <ModalContactUS
        isVisible={isVisible}
        isInvisible={isInvisible}
        handleClose={handleClose}
      />
      <ImageBackground
        source={require("../assets/Images/dashboard-login.png")}
        resizeMode="repeat"
        style={ContactUsScreenStyle.ContactUsContainer}
      >
        <View style={ContactUsScreenStyle.ContactUsTopContainer}>
          <Text style={ContactUsScreenStyle.ContactUsTopTitleContent}>FAQ</Text>

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
                      source={
                        conversation.index === Index
                          ? require("../assets/Images/up-arrow.png")
                          : require("../assets/Images/arrow-down-sign-to-navigate.png")
                      }
                      resizeMode="cover"
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>

                {conversation.index === Index ? (
                  <Animatable.View
                    style={ContactUsScreenStyle.ContactUsBodyRowContainer}
                    animation={"flipInX"}
                  >
                    <View
                      style={
                        ContactUsScreenStyle.ContactUsBodyTitleRowContainer
                      }
                    >
                      <Text>{conversation.answer}</Text>
                    </View>
                    <Image
                      source={require("../assets/Images/user.png")}
                      resizeMode="cover"
                      style={{
                        width: 40,
                        height: 40,
                        marginLeft: 10,
                      }}
                    />
                  </Animatable.View>
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
