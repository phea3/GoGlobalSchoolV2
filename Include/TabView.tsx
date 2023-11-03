import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import TabViewStyle from "../Styles/TabView.scss";
import { useLocation, useNavigate } from "react-router-native";

export default function TabView() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <View style={TabViewStyle.TabViewContainer}>
      <View style={TabViewStyle.TabViewContainerFlex}>
        <TouchableOpacity
          style={
            location.pathname === "/notification"
              ? TabViewStyle.TabViewButtonActive
              : TabViewStyle.TabViewButton
          }
          onPress={() => navigate("/notification")}
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
          onPress={() => navigate("/notification/announces")}
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
