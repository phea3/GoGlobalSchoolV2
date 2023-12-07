import { Image, Text, TouchableOpacity, View } from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-multi-lang";

export default function Back({ title }: any) {
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  return (
    <Animatable.View animation="fadeInRight">
      <TouchableOpacity
        onPress={() => {
          if (
            location.pathname === "/notification" ||
            location.pathname === "/notification/announces"
          ) {
            navigate("/");
          } else {
            navigate(-1);
          }
        }}
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <Image
          source={require("../assets/Images/back.png")}
          style={{
            width: dimension === "sm" ? 12 : 20,
            height: dimension === "sm" ? 12 : 20,
            marginRight: 10,
          }}
        />
        <Text
          style={{
            fontFamily: "Kantumruy-Bold",
            fontSize: dimension === "sm" ? 12 : 14,
          }}
        >
          {t(title)}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
