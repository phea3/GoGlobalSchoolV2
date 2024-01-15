import {
  Image,
  Linking,
  Platform,
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
import { moderateScale } from "../ Metrics";

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
        style={{ width: "95%", height: "100%", paddingTop: moderateScale(10) }}
        contentContainerStyle={{ justifyContent: "center" }}
      >
        {versions?.appStoreVersion &&
          LocalVersion &&
          LocalVersion < versions?.appStoreVersion &&
          Platform.OS === "ios" && (
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
                  width: moderateScale(50),
                  height: moderateScale(50),
                  borderRadius: 200,
                }}
              />
              <View style={NotificationStyle.NotificationCardText}>
                <View style={{ paddingLeft: moderateScale(10) }}>
                  <Text
                    style={[
                      NotificationStyle.NotificationTitleStyle,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    iOS Update Required
                  </Text>
                </View>
                <View style={NotificationStyle.NotificationCardText}>
                  <Text
                    style={{
                      paddingLeft: moderateScale(10),
                      fontSize: moderateScale(12),
                    }}
                  >
                    New version{" "}
                    {versions?.appStoreVersion
                      ? versions?.appStoreVersion
                      : "*"}{" "}
                    is now available for iOS.
                  </Text>
                </View>
                <View
                  style={{
                    paddingLeft: moderateScale(10),
                  }}
                >
                  <Text
                    style={[
                      NotificationStyle.NotificationBodyTextStyle,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {moment(new Date()).fromNow()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

        {versions?.appStoreVersion &&
          LocalVersion &&
          LocalVersion < versions?.playStoreVersion &&
          Platform.OS === "android" && (
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
                  width: moderateScale(50),
                  height: moderateScale(50),
                  borderRadius: 200,
                }}
              />
              <View style={NotificationStyle.NotificationCardText}>
                <View style={{ paddingLeft: moderateScale(10) }}>
                  <Text
                    style={[
                      NotificationStyle.NotificationTitleStyle,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    Android Update Required
                  </Text>
                </View>
                <View style={NotificationStyle.NotificationCardText}>
                  <Text
                    style={{
                      paddingLeft: moderateScale(10),
                      fontSize: moderateScale(12),
                    }}
                  >
                    New version{" "}
                    {versions?.appStoreVersion
                      ? versions?.appStoreVersion
                      : "*"}{" "}
                    is now available for Android.
                  </Text>
                </View>
                <View
                  style={{
                    paddingLeft: moderateScale(10),
                  }}
                >
                  <Text
                    style={[
                      NotificationStyle.NotificationBodyTextStyle,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
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
                width: moderateScale(50),
                height: moderateScale(50),
                borderRadius: 200,
              }}
            />
            <View style={NotificationStyle.NotificationCardText}>
              <View style={{ paddingLeft: moderateScale(10) }}>
                <Text
                  style={[
                    NotificationStyle.NotificationTitleStyle,
                    { fontSize: moderateScale(12) },
                  ]}
                >
                  {noti?.title}
                </Text>
              </View>
              <View style={NotificationStyle.NotificationCardText}>
                <Text
                  style={{
                    paddingLeft: moderateScale(10),
                    fontSize: moderateScale(12),
                  }}
                >
                  {noti?.body}
                </Text>
              </View>
              <View
                style={{
                  paddingLeft: moderateScale(10),
                }}
              >
                <Text
                  style={[
                    NotificationStyle.NotificationBodyTextStyle,
                    { fontSize: moderateScale(12) },
                  ]}
                >
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
