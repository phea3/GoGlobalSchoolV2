import { Image, Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "../Styles/Header.scss";
import {
  getLanguage,
  setDefaultLanguage,
  setDefaultTranslations,
  setLanguage,
  setTranslations,
  useTranslation,
} from "react-multi-lang";
import en from "../translations/en.json";
import kh from "../translations/kh.json";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Back from "../Include/Back";
import { useLocation, useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";
import {
  fetchDataLocalStorage,
  initMobileUserLogin,
} from "../Function/FetchDataLocalStorage";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";

setTranslations({ en, kh });
setDefaultLanguage("kh");

export default function Header() {
  //
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);

  const location = useLocation();
  const t = useTranslation();

  const ChangeEng = () => {
    setLanguage("en");
  };

  const ChangeKh = () => {
    setLanguage("kh");
  };

  const navigate = useNavigate();

  useMemo(() => {
    fetchDataLocalStorage("@mobileUserLogin").then((value) => {
      let mobileUser: string = value;
      let mobileUserLoginData = JSON.parse(mobileUser);
      setMobileUserLogin({
        _id: mobileUserLoginData?._id,
        firstName: mobileUserLoginData?.firstName,
        lastName: mobileUserLoginData?.lastName,
        englishName: mobileUserLoginData?.englishName,
        profileImg: mobileUserLoginData?.profileImg,
      });
    });
  }, [location.pathname]);

  return (
    <View style={HeaderStyle.containerHeaderVertical}>
      <View style={HeaderStyle.containerHeader}>
        <View
          style={[
            HeaderStyle.titleContainer,
            { paddingHorizontal: moderateScale(15) },
          ]}
        >
          {location.pathname === "/leave" ? (
            <Back title={"LEAVE HISTORY"} />
          ) : location.pathname === "/classes" ? (
            <Back title={"CLASSES"} />
          ) : location.pathname === "/attendance" ? (
            <Back title={"ATTENDANCE"} />
          ) : location.pathname === "/schedule" ? (
            <Back title={"SCHEDULE"} />
          ) : location.pathname === "/announce" ? (
            <Back title={"ANNOUNCEMENT DETAIL"} />
          ) : location.pathname === "/calendar" ? (
            <Back title={"ACADEMIC CALENDAR"} />
          ) : location.pathname === "/payment" ? (
            <Back title={"PAYMENT HISTORY"} />
          ) : location.pathname === "/meal" ? (
            <Back title={"MEAL HISTORY"} />
          ) : location.pathname === "/profiledetail" ? (
            <Back title={"PROFILE DETAIL"} />
          ) : location.pathname === "/notification" ||
            location.pathname === "/notification/announces" ? (
            <Back title={"NOTIFICATION"} />
          ) : location.pathname === "/eys" ? (
            <Back title={"EYS REPORT"} />
          ) : location.pathname === "/contactus" ? (
            <Back title={"CONTACT US"} />
          ) : location.pathname === "/social" ? (
            <Back title={"SOCIAL MEDIA"} />
          ) : location.pathname === "/setting" ? (
            <Back title={"SETTING"} />
          ) : location.pathname === "/resetpassword" ? (
            <Back title={"RESET PASSWORD"} />
          ) : location.pathname === "/health" ? (
            <Back title={"HEALTH"} />
          ) : location.pathname === "/announcement" ? (
            <Back title={"ANNOUNCEMENT"} />
          ) : location.pathname === "/studentdetail" ? (
            <Back title={"STUDENT DETAIL"} />
          ) : location.pathname === "/profile" ? (
            <Animatable.View animation="fadeInRight">
              <TouchableOpacity
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Kantumruy-Bold",
                    fontSize: moderateScale(14),
                  }}
                >
                  {t("PROFILE")}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          ) : (
            <>
              <Animatable.View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                animation="fadeInLeft"
              >
                <Image
                  source={
                    mobileUserLogin?.profileImg
                      ? {
                          uri: `https://storage.go-globalschool.com/api${mobileUserLogin?.profileImg}`,
                        }
                      : require("../assets/Images/user.png")
                  }
                  style={[
                    HeaderStyle.logoHeader,
                    {
                      width: moderateScale(30),
                      height: moderateScale(30),
                    },
                  ]}
                />
              </Animatable.View>
              <Animatable.View
                style={{
                  marginLeft: moderateScale(10),
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                animation="fadeInRight"
              >
                <Text
                  style={[
                    HeaderStyle.headerTitle1,
                    {
                      fontSize: moderateScale(14),
                    },
                  ]}
                >
                  {t("Hi")}{" "}
                  {getLanguage() === "kh"
                    ? mobileUserLogin?.lastName +
                      " " +
                      mobileUserLogin?.firstName
                    : mobileUserLogin?.englishName}
                </Text>
                <Text
                  style={[
                    HeaderStyle.headerTitle2,
                    {
                      fontSize: moderateScale(12),
                    },
                  ]}
                >
                  {t("welcome back!")}
                </Text>
              </Animatable.View>
            </>
          )}
        </View>
        <View
          style={[
            HeaderStyle.titleContainer,
            { paddingHorizontal: moderateScale(15) },
          ]}
        >
          {location.pathname === "/notification" ||
          location.pathname === "/notification/announces" ? (
            <Menu>
              <MenuTrigger>
                <Animatable.Image
                  source={require("../assets/Images/notification-bell.png")}
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                    marginRight: moderateScale(10),
                  }}
                  animation="fadeInDown"
                />

                <Animatable.View
                  style={{
                    width: moderateScale(10),
                    height: moderateScale(10),
                    borderRadius: moderateScale(20),
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    right: moderateScale(12),
                  }}
                  animation="fadeInDown"
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
                  ></Text>
                </Animatable.View>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => {}}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: moderateScale(5),
                    }}
                  >
                    <Text
                      style={[
                        HeaderStyle.headerTitle3,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {t("Mark as Read")}
                    </Text>
                    <Image
                      source={require("../assets/Images/mail.png")}
                      style={{
                        width: moderateScale(25),
                        height: moderateScale(25),
                      }}
                    />
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigate("/notification", { state: mobileUserLogin?._id })
              }
            >
              <Animatable.Image
                source={require("../assets/Images/bell.png")}
                style={{
                  width: moderateScale(30),
                  height: moderateScale(30),
                  marginRight: moderateScale(10),
                }}
                animation="fadeInDown"
              />
            </TouchableOpacity>
          )}
          {location.pathname === "/notification" ||
          location.pathname === "/notification/announces" ? null : (
            <Menu>
              <MenuTrigger>
                {getLanguage() === "kh" ? (
                  <Animatable.Image
                    source={require("../assets/Images/Cambodia-Flag.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(25),
                    }}
                    animation="fadeInDown"
                  />
                ) : (
                  <Animatable.Image
                    source={require("../assets/Images/English-Flag.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(25),
                    }}
                    animation="fadeInDown"
                  />
                )}
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => ChangeEng()}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: moderateScale(5),
                    }}
                  >
                    <Text
                      style={[
                        HeaderStyle.headerTitle3,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {t("English")}
                    </Text>
                    <Image
                      source={require("../assets/Images/English-Flag.png")}
                      style={{
                        width: moderateScale(25),
                        height: moderateScale(25),
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
                      padding: moderateScale(5),
                      borderTopWidth: 1,
                      borderColor: "#dcdcdc",
                    }}
                  >
                    <Text
                      style={[
                        HeaderStyle.headerTitle3,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {t("Khmer")}
                    </Text>
                    <Image
                      source={require("../assets/Images/Cambodia-Flag.png")}
                      style={{
                        width: moderateScale(25),
                        height: moderateScale(25),
                      }}
                    />
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        </View>
      </View>
    </View>
  );
}
