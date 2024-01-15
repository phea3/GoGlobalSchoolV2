import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ContactUsScreenStyle from "../Styles/ContactUsScreen.scss";
import { useLocation, useNavigate } from "react-router-native";
import en from "../translations/en.json";
import kh from "../translations/kh.json";

import auth from "../Auth/auth";
import axios from "axios";
import { Linking } from "react-native";
import ModalContactUS from "../components/contact/modalContactUs";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../Context/AuthContext";
import { getLanguage, setLanguage, useTranslation } from "react-multi-lang";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import LoginStyle from "../Styles/LoginScreen.scss";
import { moderateScale } from "../ Metrics";

const ContactUs = () => {
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = "+855767772168";
  const [isVisible, setIsVisible] = useState(false);
  const [isInvisible, setIsInvisible] = useState(false);
  const [Index, setIndex] = useState(0);

  const t = useTranslation();

  const ChangeKh = () => {
    setLanguage("kh");
  };

  const ChangeEng = () => {
    setLanguage("en");
  };

  const [conversations, setConversation] = useState([
    {
      index: 1,
      question: "How do I forget a password?",
      answer: "You have to contact us",
      show: false,
    },
    {
      index: 2,
      question: "How to create my account?",
      answer: "You have to contact us",
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
        <View
          style={[
            ContactUsScreenStyle.ContactUsTopContainer,
            { marginVertical: moderateScale(15) },
          ]}
        >
          <View
            style={[
              ContactUsScreenStyle.ContactUsBackTitleContain,
              { height: moderateScale(40) },
            ]}
          >
            <Text
              style={[
                ContactUsScreenStyle.ContactUsTopTitleContent,
                {
                  fontSize: moderateScale(20),
                  fontFamily: "Kantumruy-Regular",
                },
              ]}
            >
              {t("FAQ")}
            </Text>
          </View>
          <View style={ContactUsScreenStyle.ContactUsBackButtonsContain}>
            {location.pathname === "/forget" ? (
              <TouchableOpacity
                style={[
                  ContactUsScreenStyle.ContactUsBackButton,
                  {
                    width: moderateScale(40),
                    height: moderateScale(40),
                  },
                ]}
                onPress={() => navigate(-1)}
              >
                <Image
                  source={require("../assets/Images/left-arrow3.png")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                  }}
                />
              </TouchableOpacity>
            ) : null}
            {location.pathname === "/forget" ? (
              <Menu>
                <MenuTrigger>
                  <View
                    style={ContactUsScreenStyle.ContactUsBackChangeLangaugeLogo}
                  >
                    {getLanguage() === "kh" ? (
                      <Animatable.Image
                        source={require("../assets/Images/Cambodia-Flag.png")}
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                        }}
                        animation="fadeInDown"
                      />
                    ) : (
                      <Animatable.Image
                        source={require("../assets/Images/English-Flag.png")}
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                        }}
                        animation="fadeInDown"
                      />
                    )}
                  </View>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => ChangeEng()}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: moderateScale(10),
                      }}
                    >
                      <Text
                        style={[
                          LoginStyle.headerTitle3,
                          { fontSize: moderateScale(16) },
                        ]}
                      >
                        {t("English")}
                      </Text>
                      <Image
                        source={require("../assets/Images/English-Flag.png")}
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                        }}
                      />
                    </View>
                  </MenuOption>
                  <MenuOption onSelect={() => ChangeKh()}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: moderateScale(10),
                        borderTopWidth: 1,
                        borderColor: "#dcdcdc",
                      }}
                    >
                      <Text
                        style={[
                          LoginStyle.headerTitle3,
                          { fontSize: moderateScale(16) },
                        ]}
                      >
                        {t("Khmer")}
                      </Text>
                      <Image
                        source={require("../assets/Images/Cambodia-Flag.png")}
                        style={{
                          width: moderateScale(30),
                          height: moderateScale(30),
                        }}
                      />
                    </View>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            ) : null}
          </View>
        </View>

        <View
          style={[
            ContactUsScreenStyle.ContactUsBodyContainer,
            {
              borderWidth: moderateScale(0.5),
              marginBottom: moderateScale(10),
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, width: "100%" }}
          >
            {conversations.map((conversation, index) => (
              <View
                style={ContactUsScreenStyle.ContactUsRowQandAContainer}
                key={index}
              >
                <View
                  style={[
                    ContactUsScreenStyle.ContactUsBodyRowContainer,
                    {
                      padding: moderateScale(10),
                    },
                  ]}
                >
                  <Image
                    source={require("../assets/Images/user.png")}
                    resizeMode="cover"
                    style={{
                      width: moderateScale(40),
                      height: moderateScale(40),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <TouchableOpacity
                    style={[
                      ContactUsScreenStyle.ContactUsBodyTitleRowContainer,
                      {
                        padding: moderateScale(10),
                        borderWidth: moderateScale(0.5),
                      },
                    ]}
                    onPress={() => handleClick(index)}
                  >
                    <Text
                      style={{
                        width: "90%",
                        fontFamily: "Kantumruy-Regular",
                        fontSize: moderateScale(14),
                      }}
                    >
                      {t(conversation.question)}
                    </Text>
                    <Image
                      source={
                        conversation.index === Index
                          ? require("../assets/Images/up-arrow.png")
                          : require("../assets/Images/arrow-down-sign-to-navigate.png")
                      }
                      resizeMode="cover"
                      style={{
                        width: moderateScale(20),
                        height: moderateScale(20),
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {conversation.index === Index ? (
                  <Animatable.View
                    style={[
                      ContactUsScreenStyle.ContactUsBodyRowContainer,
                      {
                        padding: moderateScale(10),
                      },
                    ]}
                    animation={"flipInX"}
                  >
                    <View
                      style={[
                        ContactUsScreenStyle.ContactUsBodyTitleRowContainer,
                        {
                          padding: moderateScale(10),
                          borderWidth: moderateScale(0.5),
                        },
                      ]}
                    >
                      <Text
                        style={{
                          width: "90%",
                          fontFamily: "Kantumruy-Regular",
                          fontSize: moderateScale(14),
                        }}
                      >
                        {t("You have to contact us")}
                      </Text>
                    </View>
                    <Image
                      source={require("../assets/Images/user.png")}
                      resizeMode="cover"
                      style={{
                        width: moderateScale(40),
                        height: moderateScale(40),
                        marginLeft: moderateScale(10),
                      }}
                    />
                  </Animatable.View>
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>

        <View
          style={[
            ContactUsScreenStyle.ContactUsFooterContainer,
            {
              borderWidth: moderateScale(0.5),
              marginBottom: moderateScale(10),
            },
          ]}
        >
          <View
            style={[
              ContactUsScreenStyle.ContactUsFooterGroupButtonContainer,
              { padding: moderateScale(10) },
            ]}
          >
            <TouchableOpacity
              style={ContactUsScreenStyle.ContactUsFooterGroupButtonTitleBox}
              onPress={() => {
                Linking.openURL(`tel:${phoneNumber}`);
              }}
            >
              <View
                style={[
                  ContactUsScreenStyle.ContactUsFooterGroupButtonBox,
                  { padding: moderateScale(10) },
                ]}
              >
                <Image
                  source={require("../assets/Images/call-center-service.png")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                  }}
                />
              </View>

              <Text
                style={[
                  ContactUsScreenStyle.ContactUsFooterImageTitleButtonBox,
                  {
                    fontSize: moderateScale(14),
                  },
                ]}
              >
                {t("Phone")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ContactUsScreenStyle.ContactUsFooterGroupButtonTitleBox}
              onPress={handleOpen}
            >
              <View
                style={[
                  ContactUsScreenStyle.ContactUsFooterGroupButtonBox,
                  { padding: moderateScale(10) },
                ]}
              >
                <Image
                  source={require("../assets/Images/chat.png")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                  }}
                />
              </View>

              <Text
                style={[
                  ContactUsScreenStyle.ContactUsFooterImageTitleButtonBox,
                  {
                    fontSize: moderateScale(14),
                  },
                ]}
              >
                {t("Email")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default ContactUs;
