import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-native";
import FooterStyle from "../Styles/Footer.scss";
import { fetchDataLocalStorage } from "../Function/FetchDataLocalStorage";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [mobileUserLogin, setMobileUserLogin] = useState<{
    _id: string;
    firstName: string;
    lastName: string;
    englishName: string;
    profileImg: string;
  }>({
    _id: "",
    firstName: "",
    lastName: "",
    englishName: "",
    profileImg: "",
  });

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

  return (
    <View style={FooterStyle.containerFooter}>
      <TouchableOpacity
        onPress={() => navigate("/home")}
        style={FooterStyle.tabContainer}
      >
        {path === "/home" || path === "/" ? (
          <>
            <Image
              source={require("../assets/Images/apps.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontSize: 15, marginTop: 2 }}>ទំព័រដើម</Text>
          </>
        ) : (
          <>
            <Image
              source={require("../assets/Images/apps-silver.png")}
              style={{ width: 25, height: 25 }}
            />
            <Text style={{ fontSize: 12, marginTop: 3 }}>ទំព័រដើម</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate("/students")}
        style={FooterStyle.tabContainer}
      >
        {path === "/students" ? (
          <>
            <Image
              source={require("../assets/Images/graduation-cap.png")}
              style={{ width: 35, height: 30 }}
            />
            <Text style={{ fontSize: 15, marginTop: 2 }}>សិស្ស</Text>
          </>
        ) : (
          <>
            <Image
              source={require("../assets/Images/graduation-cap_silver.png")}
              style={{ width: 30, height: 25 }}
            />
            <Text style={{ fontSize: 12, marginTop: 3 }}>សិស្ស</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate("/about")}
        style={FooterStyle.tabContainer}
      >
        {path === "/about" ? (
          <>
            <Image
              source={require("../assets/Images/home2.png")}
              style={{ width: 25, height: 25 }}
            />
            <Text style={{ fontSize: 15, marginTop: 2 }}>អំពី</Text>
          </>
        ) : (
          <>
            <Image
              source={require("../assets/Images/home1.png")}
              style={{ width: 20, height: 20 }}
            />
            <Text style={{ fontSize: 12, marginTop: 6 }}>អំពី</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigate("/profile")}
        style={FooterStyle.tabContainer}
      >
        <Image
          source={{
            uri: `https://storage.go-globalschool.com/api${mobileUserLogin?.profileImg}`,
          }}
          style={{
            width: path === "/profile" ? 28 : 25,
            height: path === "/profile" ? 28 : 25,
            borderRadius: 50,
            borderWidth: 0.2,
          }}
        />

        <Text style={{ fontSize: path === "/profile" ? 15 : 12, marginTop: 3 }}>
          គណនី
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
