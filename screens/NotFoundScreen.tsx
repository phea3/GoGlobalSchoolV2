import { View, Text, Image } from "react-native";
import React from "react";
import NotFoundStyle from "../Styles/NotFoundScreen.scss";
import { Link } from "react-router-native";

const NotFoundScreen = () => {
  return (
    <View style={NotFoundStyle.containerNotFound}>
      <Image
        source={require("../assets/Images/giphy.gif")}
        style={{ width: 200, height: 200 }}
      />
      <Link
        to="/"
        style={{
          backgroundColor: "#0000ff",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            color: "white",

            fontWeight: "bold",
          }}
        >
          Go back
        </Text>
      </Link>
    </View>
  );
};

export default NotFoundScreen;
