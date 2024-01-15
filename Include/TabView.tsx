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
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

export default function TabView({ userId }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);
  const t = useTranslation();
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * (widthScreen / 2) }],
    };
  });

  useEffect(() => {
    if (location.pathname === "/notification") {
      offset.value = withTiming(0);
    } else if (location.pathname === "/notification/announces") {
      offset.value = withTiming(0.95);
    }
  }, [navigate]);

  return (
    <View style={TabViewStyle.TabViewContainer}>
      <View style={TabViewStyle.TabViewContainerFlex}>
        <Animated.View
          style={[TabViewStyle.TabViewContainerFlexAnimation, animatedStyles]}
        />
        <TouchableOpacity
          style={[
            location.pathname === "/notification"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton,
            { borderBottomWidth: moderateScale(0.5) },
          ]}
          onPress={() => {
            navigate("/notification", { state: userId });
            offset.value = withTiming(0);
          }}
        >
          <Text
            style={[
              location.pathname === "/notification"
                ? TabViewStyle.TabViewButtonTextActive
                : TabViewStyle.TabViewButtonText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Actions")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            location.pathname === "/notification/announces"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton,
            { borderBottomWidth: moderateScale(0.5) },
          ]}
          onPress={() => {
            navigate("/notification/announces", { state: userId });
            offset.value = withTiming(0.95);
          }}
        >
          <Text
            style={[
              location.pathname === "/notification/announces"
                ? TabViewStyle.TabViewButtonTextActive
                : TabViewStyle.TabViewButtonText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Annoucements")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
