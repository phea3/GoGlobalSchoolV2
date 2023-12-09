import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import NotificationStyle from "../Styles/NotificationScreen.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GETNOTIFICATIONS } from "../graphql/GetNotifications";
import { useLocation, useNavigate } from "react-router-native";
import { getLanguage } from "react-multi-lang";

export default function NotificationScreen() {
  const navigate = useNavigate();

  const location = useLocation();
  const idUserLogin = location.state;
  const [timeDifference, setTimeDifference] = useState("");
  const [limit, setLimit] = useState(100);

  // console.log(location);

  const { data: NotiData, refetch: NotiRefetch } = useQuery(GETNOTIFICATIONS, {
    pollInterval: 2000,
    variables: {
      userId: idUserLogin,
      limit: limit,
      type: "",
    },
    onCompleted(data) {
      console.log(NotiData?.getNotifications);
    },
  });

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
        {NotiData?.getNotifications.map((noti: any, index: number) => (
          <View
            style={NotificationStyle.NotificationCardContainer}
            key={index}
          >
            <Image
              source={
                noti?.notifBy
                  ? noti?.notifBy?.image
                      ?.toLowerCase()
                      ?.includes("https://storage-server.go-globalschool.com/")
                    ? { uri: noti?.notifBy?.image }
                    : {
                        uri: `https://storage.go-globalschool.com/api${noti?.notifBy?.image}`,
                      }
                  : require("../assets/Images/user.png")
              }
              style={{
                width: 50,
                height: 50,
                borderRadius: 100,
              }}
            />
            <View style={NotificationStyle.NotificationCardText}>
              <View style={NotificationStyle.NotificationTitle}>
                <Text style={NotificationStyle.NotificationTitleStyle}>
                  {noti?.title}
                </Text>
              </View>
              <View style={NotificationStyle.NotificationCardText}>
                <Text style={NotificationStyle.NotificationBodyText}>
                  {noti?.body}
                </Text>
              </View>
              <View style={NotificationStyle.NotificationBodyText}>
                <Text style={NotificationStyle.NotificationBodyTextStyle}>
                  {moment(noti?.createdAt).fromNow()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
