import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigate } from "react-router-native";

export default function ScheduleScreen() {
  const navigate = useNavigate();

  return (
    <View>
      {/* <TouchableOpacity
        onPress={() => navigate("/classes")}
        style={{
          width: "100%",
          alignContent: "flex-start",
        }}
      >
        <Image
          source={require("../assets/Images/arrow.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity> */}
      <Text>Schedule</Text>
    </View>
  );
}
