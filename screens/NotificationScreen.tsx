import { Image, ScrollView, Text, View } from "react-native";
import NotificationStyle from "../Styles/NotificationScreen.scss";
import moment from "moment";
import { useEffect, useState } from "react";

export default function NotificationScreen() {
  const [timeDifference, setTimeDifference] = useState("");

  useEffect(() => {
    // Replace 'yourDate' with the actual date you want to compare
    const yourDate = "2023-12-04T09:30:00.000Z"; // Example date in ISO format

    // Calculate the time difference
    const difference = moment(yourDate).fromNow();

    // Set the time difference in the state
    setTimeDifference(difference);
  }, [timeDifference]);

  return (
    <View style={NotificationStyle.NotificationContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "95%", height: "100%", paddingTop: 10 }}
        contentContainerStyle={{ justifyContent: "center" }}
      >
        <View style={NotificationStyle.NotificationCardContainer}>
          <Image
            source={require("../assets/Images/user.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
            }}
          />
          <View style={NotificationStyle.NotificationCardText}>
            <View style={NotificationStyle.NotificationTitle}>
              <Text style={NotificationStyle.NotificationTitleStyle}>
                User's leave is approved
              </Text>
            </View>
            <View style={NotificationStyle.NotificationBodyText}>
              <Text style={NotificationStyle.NotificationBodyTextStyle}>
                {timeDifference}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
