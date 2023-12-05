import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import NotificationStyle from "../Styles/NotificationScreen.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GETNOTIFICATIONS } from "../graphql/GetNotifications";
import { useNavigate } from "react-router-native";

export default function NotificationAnnouncements() {
  const navigate = useNavigate()
  const [timeDifference, setTimeDifference] = useState("");
  const [limit, setLimit] = useState(100)

  const { data: NotiData, refetch: NotiRefetch} = useQuery(GETNOTIFICATIONS, {
    pollInterval: 2000,
    variables: {
      userId: "",
      limit: limit,
      type: "Announcement"
    },
    onCompleted(data) {
      // console.log(NotiData)
    },
  })

  useEffect(() => {
    NotiRefetch()
  },[limit])

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
          <TouchableOpacity style={NotificationStyle.NotificationCardContainer} onPress={() =>{
            navigate("/announce", { state: {__typename: "Announcement",
             _id: "656ea39fad1b726e61d3310d", 
             coverSrc: "https://storage-server.go-globalschool.com/client/storage:visitorCms/folder:visitor_image/fileName:1e92bd5b-e1cf-492e-8a36-ef3d5e4c4f191222023jpeg.png/user:6496a86994a0be08ee6c9e15/key:Odsfm9Oz8DQmPsAlQg13Rh2OdwaCSyvoAcgBAiE6dQs",
              date: "2023-12-05T00:00:00.000Z", 
              description: "Lunch ", 
              publish: true, 
              publishBy: 
              {__typename: "PublishBy",
               profileImg: 
               "https://storage.go-globalschool.com/api/uploads/employee-Image/9f7efb01-c16b-411e-9d7e-e8769c4614991052023jpeg.png", 
               publishName: "Luon Sophea"}, 
               referenceFiles: 
               ["https://storage-server.go-globalschool.com/client/storage:visitorCms/folder:visitor_image/fileName:155451c6-27c6-403c-a96a-967dc9e563821222023png.png/user:6496a86994a0be08ee6c9e15/key:Odsfm9Oz8DQmPsAlQg13Rh2OdwaCSyvoAcgBAiE6dQs"],
              title: "School's announcement"} })
          }} key={index}>
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
                  {moment(noti?.createdAt).fromNow()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
