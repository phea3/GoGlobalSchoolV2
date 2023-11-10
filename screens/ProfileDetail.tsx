import {
  Button,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation } from "react-router-native";
import ProfileDetailStyle from "../Styles/ProfileDetail.scss";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";

export default function ProfileDetail() {
  const location = useLocation();
  const useData = location.state;

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/Images/dashboard-login.png")}
      resizeMode="repeat"
      style={ProfileDetailStyle.ProfileDetailContainer}
    >
      <View style={ProfileDetailStyle.ProfileDetailTopContainer}>
        <View
          style={ProfileDetailStyle.ProfileDetailImageBorderStyleHalfCircle}
        />
        <View
          style={ProfileDetailStyle.ProfileDetailBackgroundProfileContainer}
        >
          <View
            style={ProfileDetailStyle.ProfileDetailBackgroundProfileHalfTop}
          />

          <View
            style={ProfileDetailStyle.ProfileDetailBackgroundProfileHalfBottom}
          />
        </View>

        <View style={ProfileDetailStyle.ProfileDetailImageBorderStyle} />
        <Animatable.Image
          source={{
            uri:
              "https://storage.go-globalschool.com/api" +
              useData?.getUserProfile?.profileImg,
          }}
          resizeMode="cover"
          style={ProfileDetailStyle.ProfileDetailImageStyle}
          animation={"zoomIn"}
        />
        <View style={ProfileDetailStyle.ProfileDetailIconOnImageProfile}>
          <Animatable.View
            style={ProfileDetailStyle.ProfileDetailIconOnImageProfileBorder}
            animation={"zoomIn"}
          >
            <Image
              source={require("../assets/Images/photocamerainterfacesymbolforbutton.png")}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
              }}
            />
          </Animatable.View>
        </View>

        <View style={ProfileDetailStyle.ProfileDetailNameContainer}>
          <Text style={ProfileDetailStyle.ProfileDetailNameTitle}>
            {useData?.getUserProfile?.englishName
              ? useData?.getUserProfile?.englishName
              : useData?.getUserProfile?.firstname}
          </Text>
          <Text style={ProfileDetailStyle.ProfileDetailCutomerTypeText}>
            Parent Type :
            {useData?.getUserProfile?.customerType
              ? useData?.getUserProfile?.customerType
              : "--:--"}
          </Text>
          {/* <Button title="Pick an image from camera roll" onPress={pickImage} />  */}
          {/* {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )} */}
        </View>
      </View>

      <View style={ProfileDetailStyle.ProfileDetailMiddleContainer}>
        <View style={ProfileDetailStyle.ProfileDetailMiddleTitle}>
          <Text style={ProfileDetailStyle.ProfileDetailMiddleTitleText}>
            Parent Info
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={ProfileDetailStyle.ProfileDetailMiddleScrollviewContainer}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={ProfileDetailStyle.ProfileDetailMiddleBody}>
            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
                Phone number
              </Text>
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.tel}
              </Text>
            </View>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
                Email
              </Text>
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.email}
              </Text>
            </View>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
                Province
              </Text>
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentProvince}
              </Text>
            </View>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
                District
              </Text>
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentDistrict}
              </Text>
            </View>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
                Commune
              </Text>
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentCommune}
              </Text>
            </View>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
                Village
              </Text>
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentVillage}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
