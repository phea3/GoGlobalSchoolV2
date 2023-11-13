import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import TabViewStyle from "../Styles/TabView.scss";
import { useLocation, useNavigate } from "react-router-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function TabView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);

  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * (widthScreen / 2) }],
    };
  });

  return (
    <View style={TabViewStyle.TabViewContainer}>
      <View style={TabViewStyle.TabViewContainerFlex}>
        <Animated.View
          style={[TabViewStyle.TabViewContainerFlexAnimation, animatedStyles]}
        />
        <TouchableOpacity
          style={
            location.pathname === "/notification"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton
          }
          onPress={() => {
            navigate("/notification");
            offset.value = withTiming(0);
          }}
        >
          <Text
            style={
              location.pathname === "/notification"
                ? TabViewStyle.TabViewButtonTextActive
                : TabViewStyle.TabViewButtonText
            }
          >
            Actions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            location.pathname === "/notification/announces"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton
          }
          onPress={() => {
            navigate("/notification/announces");
            offset.value = withTiming(0.95);
          }}
        >
          <Text
            style={
              location.pathname === "/notification/announces"
                ? TabViewStyle.TabViewButtonTextActive
                : TabViewStyle.TabViewButtonText
            }
          >
            Annoucements
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
