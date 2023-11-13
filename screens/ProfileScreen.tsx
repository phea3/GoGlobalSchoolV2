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
];

export default function ProfileScreen() {
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const navigate = useNavigate();
  const version = Constants.expoConfig?.version;
  const phoneNumber = "0767772168";
  const itunesItemId = "id1641628042";
  const { data, refetch } = useQuery(GET_USERPROFILE, {
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

  const handleRateApp = async () => {
    const hasAction = await StoreReview.requestReview();

    if (hasAction === undefined) {
      // Rating feature not available on the current platform
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
      );
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Check out this awesome app!",
        url: "https://apps.apple.com/kh/app/go-global-school/id1641628042",
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
            <View style={ProfileStyle.ProfileStyleBackgroundProfile} />

            <Animatable.Image
              source={{
                uri:
                  "https://storage.go-globalschool.com/api" +
                  data?.getUserProfile?.profileImg,
              }}
              style={ProfileStyle.ProfileImage}
              animation={"zoomIn"}
            />
            {/* <Animatable.Image
              source={require("../assets/Images/frame.png")}
              style={ProfileStyle.ProfileImageFrame}
              animation={"zoomIn"}
            /> */}
          </View>

          <Animatable.View
            style={ProfileStyle.ProfileTopTitleContainer}
            animation={"bounce"}
          >
            <Text style={ProfileStyle.ProfileTopTitleName}>
              {data?.getUserProfile?.lastName +
                " " +
                data?.getUserProfile?.firstName}
            </Text>
            <Text style={ProfileStyle.ProfileTopBodytext}>
              {data?.getUserProfile?.email}
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
                {info?.title === "App Version" ? " " + version : null}
              </Text>
            </Animatable.View>
            <Animatable.Image
              source={require("../assets/Images/next.png")}
              style={ProfileStyle.ProfileMiddleCardImage}
              animation={"fadeInRight"}
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
