import {
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SocialMediaStyle from "../Styles/SocialMediaScreen.scss";
import * as WebBrowser from "expo-web-browser";

const openWebsite = async (url: string) => {
  const result = await WebBrowser.openBrowserAsync(url);

  // Handle the result if needed
  console.log(result);
};

const socials = [
  {
    title: "Facebook",
    icon: require("../assets/Images/facebook-colorful.png"),
    link: "https://www.facebook.com/goglobalschool15",
  },
  {
    title: "Instagram",
    icon: require("../assets/Images/instagram-colorful.png"),
    link: "https://www.instagram.com/go_global_school15/",
  },
  {
    title: "Tik Tok",
    icon: require("../assets/Images/tik-tok.png"),
    link: "https://www.tiktok.com/@goglobalschool",
  },
  {
    title: "Youtube",
    icon: require("../assets/Images/youtube-colorful.png"),
    link: "https://www.youtube.com/@goglobalschool8574",
  },
  {
    title: "Telegram",
    icon: require("../assets/Images/telegram-colorful.png"),
    link: "https://t.me/goglobalschool",
  },
];

export default function SocialMediaScreen() {
  return (
    <ImageBackground
      source={require("../assets/Images/dashboard-login.png")}
      resizeMode="repeat"
      style={SocialMediaStyle.SocialMediaContainer}
    >
      <View style={SocialMediaStyle.SocialMediaTopContainer}>
        <Text style={SocialMediaStyle.SocialMediaTopTitleContent}>
          Our Social Media
        </Text>
      </View>
      <View style={SocialMediaStyle.SocialMediaBodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={SocialMediaStyle.SocialMediaBodyContentContainer}>
            {socials?.map((social, index) => (
              <TouchableOpacity
                style={SocialMediaStyle.SocialMediaCardRowStyle}
                key={index}
                onPress={() => {
                  if (social.title == "Facebook" || social.title == "Tik Tok") {
                    openWebsite(social.link);
                  } else {
                    Linking.openURL(social.link);
                  }
                }}
              >
                <Image
                  source={social.icon}
                  resizeMode="contain"
                  style={SocialMediaStyle.SocialMediaIconStyle}
                />
                <Text style={SocialMediaStyle.SocialMediaTitleStyle}>
                  {social.title}
                </Text>
                <Image
                  source={require("../assets/Images/next.png")}
                  style={SocialMediaStyle.SocialMediaNextIconStyle}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={SocialMediaStyle.SocialMediaFooterContainer}></View>
    </ImageBackground>
  );
}