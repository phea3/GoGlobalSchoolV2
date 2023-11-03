import { View, Text } from "react-native";
import React from "react";
import NotFoundStyle from "../Styles/NotFoundScreen.scss";
import { Link } from "react-router-native";

const NotFoundScreen = () => {
  return (
    <View style={NotFoundStyle.containerNotFound}>
      <Text>NotFoundScreen</Text>
      <Link to="/">
        <Text>Go to LoginScreen</Text>
      </Link>
    </View>
  );
};

export default NotFoundScreen;
