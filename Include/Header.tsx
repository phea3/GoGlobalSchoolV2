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
import { useEffect, useState } from "react";

setTranslations({ en, kh });
setDefaultLanguage("kh");
setDefaultTranslations({ kh });

export default function Header() {
  //
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);

  const t = useTranslation();
  const ChangeEng = () => {
    setLanguage("en");
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataLocalStorage("@mobileUserLogin").then((value) => {
      const mobileUser: string = value;
      const mobileUserLoginData = JSON.parse(mobileUser);
      setMobileUserLogin({
        _id: mobileUserLoginData?._id,
        firstName: mobileUserLoginData?.firstName,
        lastName: mobileUserLoginData?.lastName,
        englishName: mobileUserLoginData?.englishName,
        profileImg: mobileUserLoginData?.profileImg,
      });
    });
  }, []);

  const location = useLocation();

  const ChangeKh = () => {
    setLanguage("kh");
  };

  return (
    <View style={HeaderStyle.containerHeaderVertical}>
      <View style={HeaderStyle.containerHeader}>
        <View style={HeaderStyle.titleContainer}>
          {location.pathname === "/leave" ? (
            <Back title={"LEAVE HISTORY"} />
          ) : location.pathname === "/classes" ? (
            <Back title={"CLASSES"} />
          ) : location.pathname === "/attendance" ? (
            <Back title={"ATTENDANCE"} />
          ) : location.pathname === "/schedule" ? (
            <Back title={"SCHEDULE"} />
          ) : location.pathname === "/announce" ? (
            <Back title={"ANNOUNCE"} />
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
          ) : location.pathname === "/profile" ? (
            <Animatable.View animation="fadeInRight">
              <TouchableOpacity
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  // paddingHorizontal: 10,
                  flexDirection: "row",
                }}
              >
                {/* <Image
                source={require("../assets/Images/left-arrow.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
              /> */}
                <Text style={{ fontFamily: "Kantumruy-Bold" }}>PROFILE</Text>
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
                  source={{
                    uri: `https://storage.go-globalschool.com/api${mobileUserLogin?.profileImg}`,
                  }}
                  style={HeaderStyle.logoHeader}
                />
              </Animatable.View>
              <Animatable.View
                style={{
                  marginLeft: 10,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                animation="fadeInRight"
              >
                <Text style={HeaderStyle.headerTitle1}>
                  {t("Hi")}{" "}
                  {getLanguage() === "kh"
                    ? mobileUserLogin?.lastName +
                      " " +
                      mobileUserLogin?.firstName
                    : mobileUserLogin?.englishName}
                </Text>
                <Text style={HeaderStyle.headerTitle2}>
                  {t("welcome back!")}
                </Text>
              </Animatable.View>
            </>
          )}
        </View>
        <View style={HeaderStyle.titleContainer}>
          {location.pathname === "/notification" ||
          location.pathname === "/notification/announces" ? (
            <TouchableOpacity onPress={() => navigate("/notification")}>
              <Image
                source={require("../assets/Images/notification-bell.png")}
                style={{ width: 35, height: 35, marginRight: 10 }}
              />

              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 20,
                  backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: 10,
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 10 }}
                ></Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigate("/notification")}>
              <Animatable.Image
                source={require("../assets/Images/bell.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
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
                    style={{ width: 30, height: 30 }}
                    animation="fadeInDown"
                  />
                ) : (
                  <Animatable.Image
                    source={require("../assets/Images/English-Flag.png")}
                    style={{ width: 30, height: 30 }}
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
                    }}
                  >
                    <Text>English</Text>
                    <Image
                      source={require("../assets/Images/English-Flag.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => ChangeKh()}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>ខ្មែរ</Text>
                    <Image
                      source={require("../assets/Images/Cambodia-Flag.png")}
                      style={{ width: 20, height: 20 }}
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
