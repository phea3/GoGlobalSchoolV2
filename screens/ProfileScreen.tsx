import {
  Alert,
  Image,
  Linking,
  Platform,
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
import * as Animatable from "react-native-animatable";
import * as StoreReview from "expo-store-review";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import ImageView from "react-native-image-viewing";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useTranslation } from "react-multi-lang";

const Infomations = [
  {
    title: "Contact Us",
    icon: require("../assets/Images/call-center-service.png"),
    action: "contact",
  },
  {
    title: "Social Media",
    icon: require("../assets/Images/social-media.png"),
    action: "social",
  },
  {
    title: "Setting",
    icon: require("../assets/Images/settings.png"),
    action: "setting",
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
    title: "Play Version",
    icon: require("../assets/Images/play-store.png"),
    action: "version-android",
  },
];

export default function ProfileScreen() {
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const navigate = useNavigate();
  const version = Constants.expoConfig?.version;
  const phoneNumber = "0767772168";
  const itunesItemId = "id1641628042";
  const myandroidappid = "com.goglobalschool.schoolmobile";
  const [visible, setIsVisible] = useState(false);
  const t = useTranslation();
  const { data, refetch } = useQuery(GET_USERPROFILE, {
    onCompleted: ({ getUserProfile }) => {
      // console.log("getUserProfile", getUserProfile);
    },
    onError: (error) => {
      console.log(error?.message);
    },
  });

  //============ FUNCTION LOGOUT ============
  const Logouthandle = async () => {
    await auth.logout().then(async (result) => {
      await AsyncStorage.removeItem("@userToken");
      await AsyncStorage.removeItem("@userUid");
      dispatch({
        type: REDUCER_ACTIONS.LOGOUT,
      });
      navigate("/login");
    });
  };

  const handleRateApp = async () => {
    const hasAction = await StoreReview.requestReview();

    if (hasAction === undefined && Platform.OS === "ios") {
      // Rating feature not available on the current platform
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
      ).catch((err) => {
        // Alert.alert('Please check for the App Store')
      });
    } else if (hasAction === undefined && Platform.OS === "android") {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=${myandroidappid}&showAllReviews=true`
      ).catch((err) => Alert.alert("Please check for the Google Play Store"));
    }
  };

  const openWebsite = async (url: string) => {
    const result = await WebBrowser.openBrowserAsync(url);
    // Handle the result if needed
    // console.log(result);
    if (result === undefined) {
      Alert.alert(
        "Oop!",
        "Make sure you have the app installed on your device."
      );
    }
  };

  // const onShare = async () => {
  //   try {
  //     const shareOptions = {
  //       message: "Check out this awesome app!",
  //       url:
  //         Platform.OS === "ios"
  //           ? "https://apps.apple.com/kh/app/go-global-school/id1641628042"
  //           : "https://play.google.com/store/apps/details?id=com.goglobalschool.schoolmobile&hl=en&gl=US",
  //       title: "Go Global School",
  //     };

  //     const result = await Share.share(shareOptions);

  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // Shared with activity type of result.activityType
  //       } else {
  //         // Shared
  //         console.log('Shared successfully');
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // Dismissed
  //     } else {
  //     }
  //   } catch (error: any) {
  //     console.error(error?.message);
  //   }
  // };
  const onShare = async () => {
    const urlToShare =
      "https://play.google.com/store/apps/details?id=com.goglobalschool.schoolmobile&hl=en&gl=US";
    try {
      if (Platform.OS === "ios") {
        const shareOptions = {
          message: "Check out this awesome app!",
          url: "https://apps.apple.com/kh/app/go-global-school/id1641628042",
          title: "Go Global School",
        };

        const result = await Share.share(shareOptions);

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
            console.log(`Shared with activity type: ${result.activityType}`);
          } else {
            // Shared
            console.log("Shared successfully");
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
          console.log("Sharing dismissed");
        }
      } else {
        try {
          const { uri } = await FileSystem.downloadAsync(
            urlToShare,
            FileSystem.documentDirectory + "sharedfile.jpg"
          );
          await Sharing.shareAsync(uri);
          console.log("Shared successfully");
        } catch (error: any) {
          console.error("Error sharing URL:", error.message);
        }
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  return (
    <View style={ProfileStyle.ProfileContainer}>
      <View
        style={
          dimension === "sm"
            ? ProfileStyle.ProfileTopContainersm
            : ProfileStyle.ProfileTopContainer
        }
      >
        <View
          style={{
            width: "90%",
            height: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            style={ProfileStyle.ProfileImageViewHolder}
            onPress={() => {
              setIsVisible(true);
            }}
          >
            <View style={ProfileStyle.ProfileStyleBackgroundProfile}>
              <ImageView
                images={[
                  data?.getUserProfile?.profileImg
                    ? data?.getUserProfile?.profileImg
                        ?.toLowerCase()
                        ?.includes(
                          "https://storage-server.go-globalschool.com/"
                        )
                      ? { uri: data?.getUserProfile?.profileImg }
                      : {
                          uri:
                            "https://storage.go-globalschool.com/api" +
                            data?.getUserProfile?.profileImg,
                        }
                    : require("../assets/Images/user.png"),
                ]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
              />
            </View>

            <Animatable.Image
              source={
                data?.getUserProfile?.profileImg
                  ? data?.getUserProfile?.profileImg
                      ?.toLowerCase()
                      ?.includes("https://storage-server.go-globalschool.com/")
                    ? { uri: data?.getUserProfile?.profileImg }
                    : {
                        uri:
                          "https://storage.go-globalschool.com/api" +
                          data?.getUserProfile?.profileImg,
                      }
                  : require("../assets/Images/user.png")
              }
              style={
                dimension === "sm"
                  ? ProfileStyle.ProfileImagesm
                  : ProfileStyle.ProfileImage
              }
              animation={"zoomIn"}
            />
            <Animatable.View
              style={
                dimension === "sm"
                  ? ProfileStyle.ProfileImageFramesm
                  : ProfileStyle.ProfileImageFrame
              }
              animation={"zoomIn"}
            />
          </TouchableOpacity>

          <Animatable.View
            style={ProfileStyle.ProfileTopTitleContainer}
            animation={"bounce"}
          >
            <Text style={ProfileStyle.ProfileTopTitleName}>
              {data?.getUserProfile?.lastName
                ? data?.getUserProfile?.lastName +
                  " " +
                  data?.getUserProfile?.firstName
                : "Full Name"}
            </Text>
            <Text style={ProfileStyle.ProfileTopBodytext}>
              {data?.getUserProfile?.email
                ? data?.getUserProfile?.email
                : "Example@domain.com"}
            </Text>
          </Animatable.View>
        </View>
        <TouchableOpacity
          style={{ width: "10%" }}
          onPress={() => navigate("/profiledetail", { state: data })}
        >
          <Animatable.Image
            source={require("../assets/Images/next.png")}
            style={{ width: 40, height: 40 }}
            animation={"fadeInRight"}
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
              } else if (info?.action === "version-android") {
                openWebsite(
                  "https://play.google.com/store/apps/details?id=com.goglobalschool.schoolmobile&hl=en&gl=US&pli=1"
                );
              } else if (info?.action === "share") {
                onShare();
              } else if (info?.action === "contact") {
                navigate("/contactus");
              } else if (info?.action === "social") {
                navigate("/social");
              } else if (info?.action === "setting") {
                navigate("/setting", { state: data?.getUserProfile?.email });
              } else if (info?.action === "feedback") {
                handleRateApp();
              }
            }}
            key={index}
          >
            <Animatable.View
              style={ProfileStyle.ProfileMiddleCardLeftContent}
              animation={"fadeInLeft"}
            >
              <Image
                source={info?.icon}
                style={ProfileStyle.ProfileMiddleCardImage}
              />
              <Text>
                {info?.title}
                {/* {info?.title === "App Version" || info?.title === "Play Version" ? " " + version : null} */}
              </Text>
            </Animatable.View>
            <Animatable.Image
              source={require("../assets/Images/next.png")}
              style={ProfileStyle.ProfileMiddleCardImage}
              animation={"fadeInRight"}
            />
          </TouchableOpacity>
        ))}
        <View
          style={{
            width: "100%",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#9aa3a6" }}>
            {t("Current version")} {version}
          </Text>
        </View>
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
