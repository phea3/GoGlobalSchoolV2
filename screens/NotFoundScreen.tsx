import { View, Text, Image } from "react-native";
import React from "react";
import NotFoundStyle from "../Styles/NotFoundScreen.scss";
import { Link } from "react-router-native";
import { useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

const NotFoundScreen = () => {
  const t = useTranslation();
  return (
    <View style={NotFoundStyle.containerNotFound}>
      <Image
        source={require("../assets/Images/giphy.gif")}
        style={{ width: moderateScale(200), height: moderateScale(200) }}
      />
      <Link
        to="/"
        style={{
          backgroundColor: "#0000ff",
          borderRadius: moderateScale(10),
          paddingVertical: moderateScale(10),
          paddingHorizontal: moderateScale(20),
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: moderateScale(14),
            fontWeight: "bold",
          }}
        >
          {t("Go back")}
        </Text>
      </Link>
    </View>
  );
};

export default NotFoundScreen;
