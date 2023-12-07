import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import NotificationStyle from "../Styles/NotificationScreen.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GETNOTIFICATIONS } from "../graphql/GetNotifications";
import { useNavigate } from "react-router-native";
import { getLanguage } from "react-multi-lang";

export default function NotificationAnnouncements() {
  const navigate = useNavigate();
  const [timeDifference, setTimeDifference] = useState("");
  const [limit, setLimit] = useState(100);

  const { data: NotiData, refetch: NotiRefetch } = useQuery(GETNOTIFICATIONS, {
    pollInterval: 2000,
    variables: {
      userId: "",
      limit: limit,
      type: "Announcement",
    },
    onCompleted(data) {
      // console.log(NotiData);
    },
  });

  useEffect(() => {
    NotiRefetch();
  }, [limit]);

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
          <TouchableOpacity
            style={NotificationStyle.NotificationCardContainer}
            onPress={() => {
              navigate("/announce", { state: { _id: noti?.navigetId } });
            }}
            key={index}
          >
            <View
              style={NotificationStyle.AnnouncementNotificationCardImgContainer}
            >
              <Image
                source={require("../assets/Images/Logo.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                }}
              />
            </View>
            <View style={NotificationStyle.NotificationCardText}>
              <View style={NotificationStyle.NotificationTitle}>
                <Text style={NotificationStyle.NotificationTitleStyle}>
                  {noti?.title}
                </Text>
              </View>
              <View style={NotificationStyle.NotificationBodyText}>
                <Text style={NotificationStyle.NotificationBodyTextStyle}>
                  {moment(noti?.createdAt).locale(getLanguage()).fromNow()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
