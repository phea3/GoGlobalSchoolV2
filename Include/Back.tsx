import { Image, Text, TouchableOpacity, View } from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";

export default function Back({ title }: any) {
  const navigate = useNavigate();
  const location = useLocation();
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
          // paddingHorizontal: 10,
          flexDirection: "row",
        }}
      >
        <Image
          source={require("../assets/Images/back.png")}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text style={{ fontFamily: "Kantumruy-Bold" }}>{title}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}
