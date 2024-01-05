import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NotificationStyle from "../Styles/NotificationScreen.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GETNOTIFICATIONS } from "../graphql/GetNotifications";
import { useLocation, useNavigate } from "react-router-native";
import getAppVersion from "../getAppVersion";
import { AppVersions } from "../Function/FetchDataLocalStorage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { clearBadge } from "../usePushNotifications";

export default function NotificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const idUserLogin = location.state;
  const [timeDifference, setTimeDifference] = useState("");
  const [limit, setLimit] = useState(100);
  const LocalVersion = Constants.expoConfig?.version;
  const itunesItemId = "id1641628042";
  // console.log(LocalVersion);
  const [versions, setVersions] = useState<AppVersions | null>(null);

  useEffect(() => {
    const fetchAppVersion = async () => {
      const appVersions = await getAppVersion();
      if (appVersions) {
        setVersions(appVersions);
      }
    };

    fetchAppVersion();
  }, []);

  const { data: NotiData, refetch: NotiRefetch } = useQuery(GETNOTIFICATIONS, {
    pollInterval: 2000,
    variables: {
      userId: idUserLogin,
      limit: limit,
      type: "",
    },
  });

  // useEffect(() => {
  // console.log(versions);
  // }, [versions]);

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
        {versions?.appStoreVersion &&
          LocalVersion &&
          LocalVersion < versions?.appStoreVersion && (
            <TouchableOpacity
              style={NotificationStyle.NotificationUpdateCardContainer}
              onPress={() => {
                clearBadge();
                Linking.openURL(
                  `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}`
                ).catch((err) => {
                  // Alert.alert('Please check for the App Store')
                });
              }}
            >
              <Image
                source={require("../assets/Images/update-6894_256.gif")}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                }}
              />
              <View style={NotificationStyle.NotificationCardText}>
                <View style={NotificationStyle.NotificationTitle}>
                  <Text style={NotificationStyle.NotificationTitleStyle}>
                    iOS Update Required
                  </Text>
                </View>
                <View style={NotificationStyle.NotificationCardText}>
                  <Text style={NotificationStyle.NotificationBodyText}>
                    New version{" "}
                    {versions?.appStoreVersion
                      ? versions?.appStoreVersion
                      : "*"}{" "}
                    is now available for iOS.
                  </Text>
                </View>
                <View style={NotificationStyle.NotificationBodyText}>
                  <Text style={NotificationStyle.NotificationBodyTextStyle}>
                    {moment(new Date()).fromNow()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

        {versions?.appStoreVersion &&
          LocalVersion &&
          LocalVersion < versions?.playStoreVersion && (
            <TouchableOpacity
              style={NotificationStyle.NotificationUpdateCardContainer}
              onPress={() => {
                clearBadge();
                Linking.openURL(
                  `https://play.google.com/store/apps/details?id=com.goglobalschool.schoolmobile`
                ).catch((err) => {
                  // Alert.alert('Please check for the App Store')
                });
              }}
            >
              <Image
                source={require("../assets/Images/update-6894_256.gif")}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                }}
              />
              <View style={NotificationStyle.NotificationCardText}>
                <View style={NotificationStyle.NotificationTitle}>
                  <Text style={NotificationStyle.NotificationTitleStyle}>
                    Android Update Required
                  </Text>
                </View>
                <View style={NotificationStyle.NotificationCardText}>
                  <Text style={NotificationStyle.NotificationBodyText}>
                    New version{" "}
                    {versions?.playStoreVersion
                      ? versions?.playStoreVersion
                      : "*"}{" "}
                    is now available for Android.
                  </Text>
                </View>
                <View style={NotificationStyle.NotificationBodyText}>
                  <Text style={NotificationStyle.NotificationBodyTextStyle}>
                    {moment(new Date()).fromNow()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

        {NotiData?.getNotifications.map((noti: any, index: number) => (
          <TouchableOpacity
            onPress={() => {
              if (noti?.type === "Attendance") {
                // navigate("/attendance", { state:  });
              }
            }}
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
