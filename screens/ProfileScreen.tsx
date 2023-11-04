import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useLoginUser from "../Hook/useLoginUser";
import auth from "../Auth/auth";
import { useNavigate } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileStyle from "../Styles/ProfileScreen.scss";
import { useQuery } from "@apollo/client";
import { GET_USERPROFILE } from "../graphql/GetUserProfile";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

const Infomations = [
  {
    title: "Setting",
    icon: require("../assets/Images/settings.png"),
    action: "setting",
  },
  {
    title: "Contact Us",
    icon: require("../assets/Images/call-center-service.png"),
    action: "contact",
  },
  {
    title: "Share App",
    icon: require("../assets/Images/share.png"),
    action: "share",
  },
  {
    title: "Feedback App",
    icon: require("../assets/Images/rate.png"),
    action: "feedback",
  },
  {
    title: "App Version",
    icon: require("../assets/Images/app-store.png"),
    action: "version",
  },
  {
    title: "Facebook",
    icon: require("../assets/Images/facebook.png"),
    action: "facebook",
  },
  {
    title: "Youtube",
    icon: require("../assets/Images/youtube.png"),
    action: "youtube",
  },
  {
    title: "Instagram",
    icon: require("../assets/Images/instagram.png"),
    action: "instagram",
  },
  {
    title: "Telegram",
    icon: require("../assets/Images/telegram.png"),
    action: "telegram",
  },
];

export default function ProfileScreen() {
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const navigate = useNavigate();
  const version = Constants.expoConfig?.version;
  const phoneNumber = "0767772168";
  const { data, refetch } = useQuery(GET_USERPROFILE, {
    pollInterval: 2000,
    onCompleted: ({ getUserProfile }) => {},
    onError: () => {},
  });

  //============ FUNCTION LOGOUT ============
  const Logouthandle = async () => {
    await auth.logout().then(async (result) => {
      await AsyncStorage.removeItem("@userToken");
      await AsyncStorage.removeItem("@userUid");
      dispatch({
        type: REDUCER_ACTIONS.LOGOUT,
      });
      navigate("/");
    });
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Check out this awesome app!",
        url: "",
        title: "Go Global School",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  const openWebsite = async () => {
    const url = "https://www.facebook.com/goglobalschool15";
    const result = await WebBrowser.openBrowserAsync(url);

    // Handle the result if needed
    console.log(result);
  };

  return (
    <View style={ProfileStyle.ProfileContainer}>
      <View style={ProfileStyle.ProfileTopContainer}>
        <View
          style={{
            width: "90%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={ProfileStyle.ProfileImageViewHolder}>
            <Image
              source={{
                uri:
                  "https://storage.go-globalschool.com/api" +
                  data?.getUserProfile?.profileImg,
              }}
              style={ProfileStyle.ProfileImage}
            />
          </View>

          <View style={ProfileStyle.ProfileTopTitleContainer}>
            <Text style={ProfileStyle.ProfileTopTitleName}>
              {data?.getUserProfile?.englishName}
            </Text>
            <Text style={ProfileStyle.ProfileTopBodytext}>
              {data?.getUserProfile?.email}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: "10%" }}>
          <Image
            source={require("../assets/Images/next.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={ProfileStyle.ProfileMiddleContainer}
        showsVerticalScrollIndicator={false}
      >
        {Infomations.map((info, index) => (
          <TouchableOpacity
            style={ProfileStyle.ProfileMiddleCard}
            onPress={() => {
              if (info?.action === "version") {
                Linking.openURL(
                  "https://apps.apple.com/kh/app/go-global-school/id1641628042"
                );
              } else if (info?.action === "share") {
                onShare();
              } else if (info?.action === "contact") {
                Linking.openURL(`tel:${phoneNumber}`);
              } else if (info?.action === "facebook") {
                // Linking.openURL("fb://page/1586031671709848");
                openWebsite();
              } else if (info?.action === "youtube") {
                Linking.openURL("https://www.youtube.com/@goglobalschool8574");
              } else if (info?.action === "instagram") {
                Linking.openURL(
                  "https://www.instagram.com/go_global_school15/"
                );
              } else if (info?.action === "telegram") {
                Linking.openURL("https://t.me/@Go_Global_Information_Office");
              }
            }}
            key={index}
          >
            <View style={ProfileStyle.ProfileMiddleCardLeftContent}>
              <Image
                source={info?.icon}
                style={ProfileStyle.ProfileMiddleCardImage}
              />
              <Text>
                {info?.title}
                {info?.title === "App Version" ? " " + version : null}
              </Text>
            </View>
            <Image
              source={require("../assets/Images/next.png")}
              style={ProfileStyle.ProfileMiddleCardImage}
            />
          </TouchableOpacity>
        ))}
        <Text
          style={{
            color: "gray",
            width: "100%",
            height: 50,
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        ></Text>
      </ScrollView>
      <View style={ProfileStyle.ProfileBottomContainer}>
        <TouchableOpacity
          onPress={() => Logouthandle()}
          style={ProfileStyle.ProfileLogoutButtonBox}
        >
          <Text style={ProfileStyle.ProfileLogoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
