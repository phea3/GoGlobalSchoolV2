import {
  Alert,
  Image,
  ScrollView,
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
import { getLanguage } from "react-multi-lang";

const Infomations = [
  {
    title: "Setting",
    icon: require("../assets/Images/settings.png"),
  },
  {
    title: "Contact Us",
    icon: require("../assets/Images/call-center-service.png"),
  },
  {
    title: "Share App",
    icon: require("../assets/Images/share.png"),
  },
  {
    title: "Feedback App",
    icon: require("../assets/Images/rate.png"),
  },
];

export default function ProfileScreen() {
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const navigate = useNavigate();

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

      <ScrollView style={ProfileStyle.ProfileMiddleContainer}>
        {Infomations.map((info, index) => (
          <TouchableOpacity
            style={ProfileStyle.ProfileMiddleCard}
            onPress={() => {}}
            key={index}
          >
            <View style={ProfileStyle.ProfileMiddleCardLeftContent}>
              <Image
                source={info?.icon}
                style={ProfileStyle.ProfileMiddleCardImage}
              />
              <Text>{info?.title}</Text>
            </View>
            <Image
              source={require("../assets/Images/next.png")}
              style={ProfileStyle.ProfileMiddleCardImage}
            />
          </TouchableOpacity>
        ))}
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
