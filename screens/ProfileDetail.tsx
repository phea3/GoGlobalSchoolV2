import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation } from "react-router-native";
import ProfileDetailStyle from "../Styles/ProfileDetail.scss";
import { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@apollo/client";
import { UPDATE_IMAGE } from "../graphql/UpdateParentsInfoByMobile";
import axios from "axios";
import { moderateScale } from "../ Metrics";

export default function ProfileDetail() {
  const location = useLocation();
  const useData = location.state;
  const [visible, setIsVisible] = useState(false);

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Ask for permission to access media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const [UpdateMobileUserProfileImg, { loading }] = useMutation(UPDATE_IMAGE, {
    onError: (e) => {
      console.log("UpdateMobileUserProfileImg", e.message);
    },
  });
  // console.log(useData?.getUserProfile?._id);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // console.log(result.assets[0].uri);
      try {
        let formData = new FormData();
        formData.append("image", {
          uri: result.assets[0].uri,
          name: useData?.getUserProfile?._id + ".png",
          type: "image/png", // If you can get the image type from cropping, replace it here
        } as any);
        console.log(formData);

        let uploadImg = await axios({
          baseURL: "https://storage.go-globalschool.com/",
          headers: {
            "Content-Type": "multipart/form-data", // this is important
          },
          method: "post",
          url: "api/school/upload",
          data: formData,
        });

        if (uploadImg) {
          console.log(uploadImg?.data);
          await UpdateMobileUserProfileImg({
            variables: {
              id: useData?.getUserProfile?._id,
              profileImg: uploadImg?.data,
            },
            update(_, result) {
              console.log(result);
            },
          });
        }
        // console.log(uploadImg, "uploadImg")
      } catch (e) {
        console.log(e);
      }
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
          style={[
            ProfileDetailStyle.ProfileDetailImageBorderStyleHalfCircle,
            { width: moderateScale(135), height: moderateScale(135) },
          ]}
        />
        <View
          style={ProfileDetailStyle.ProfileDetailBackgroundProfileContainer}
        >
          <View
            style={ProfileDetailStyle.ProfileDetailBackgroundProfileHalfTop}
          />

          <View
            style={[
              ProfileDetailStyle.ProfileDetailBackgroundProfileHalfBottom,
              {
                borderLeftWidth: moderateScale(0.5),
                borderRightWidth: moderateScale(0.5),
                borderTopWidth: moderateScale(0.5),
              },
            ]}
          />
        </View>

        <View
          style={[
            ProfileDetailStyle.ProfileDetailImageBorderStyle,
            { width: moderateScale(134), height: moderateScale(134) },
          ]}
        />

        <Animatable.Image
          source={
            useData?.getUserProfile?.profileImg
              ? useData?.getUserProfile?.profileImg
                  ?.toLowerCase()
                  ?.includes("https://storage-server.go-globalschool.com/")
                ? { uri: useData?.getUserProfile?.profileImg }
                : {
                    uri:
                      "https://storage.go-globalschool.com/api" +
                      useData?.getUserProfile?.profileImg,
                  }
              : require("../assets/Images/user.png")
          }
          resizeMode="cover"
          style={[
            ProfileDetailStyle.ProfileDetailImageStyle,
            { width: moderateScale(120), height: moderateScale(120) },
          ]}
          animation={"zoomIn"}
        />
        {image && (
          <Image
            source={
              image ? { uri: image } : require("../assets/Images/user.png")
            }
            style={[
              ProfileDetailStyle.ProfileDetailImageStyle,
              {
                position: "absolute",
                width: moderateScale(120),
                height: moderateScale(120),
              },
            ]}
          />
        )}

        <View style={ProfileDetailStyle.ProfileDetailNameContainer}>
          <Text
            style={[
              ProfileDetailStyle.ProfileDetailNameTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            {useData?.getUserProfile?.lastName +
              " " +
              useData?.getUserProfile?.firstName}
          </Text>
          <Text style={ProfileDetailStyle.ProfileDetailCutomerTypeText}>
            {/* Parent Type :{" "}
            {useData?.getUserProfile?.customerType
              ? useData?.getUserProfile?.customerType
              : "Simple"} */}
            {/* {useData?.getUserProfile?.englishName} */}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            ProfileDetailStyle.ProfileDetailImageStylePreview,
            { width: moderateScale(120), height: moderateScale(120) },
          ]}
          onPress={() => {
            if (useData?.getUserProfile?.profileImg) {
              setIsVisible(true);
            }
          }}
        >
          <ImageView
            images={[
              useData?.getUserProfile?.profileImg
                ? useData?.getUserProfile?.profileImg
                    ?.toLowerCase()
                    ?.includes("https://storage-server.go-globalschool.com/")
                  ? { uri: useData?.getUserProfile?.profileImg }
                  : {
                      uri:
                        "https://storage.go-globalschool.com/api" +
                        useData?.getUserProfile?.profileImg,
                    }
                : require("../assets/Images/user.png"),
            ]}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
          <TouchableOpacity
            style={[
              ProfileDetailStyle.ProfileDetailIconOnImageProfileBorder,
              {
                padding: moderateScale(6),
                borderRadius: moderateScale(50),
                borderWidth: moderateScale(0.5),
              },
            ]}
            onPress={pickImage}
          >
            <Animatable.Image
              source={require("../assets/Images/photocamerainterfacesymbolforbutton.png")}
              resizeMode="contain"
              style={{
                width: moderateScale(18),
                height: moderateScale(18),
              }}
              animation={"zoomIn"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View
        style={[
          ProfileDetailStyle.ProfileDetailMiddleContainer,
          {
            borderLeftWidth: moderateScale(0.5),
            borderRightWidth: moderateScale(0.5),
            borderBottomWidth: moderateScale(0.5),
          },
        ]}
      >
        <View
          style={[
            ProfileDetailStyle.ProfileDetailMiddleTitle,
            { height: moderateScale(40) },
          ]}
        >
          <Text
            style={[
              ProfileDetailStyle.ProfileDetailMiddleTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
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
              style={[
                ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer,
                {
                  height: moderateScale(70),
                  borderWidth: moderateScale(0.5),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(15),
                },
              ]}
            >
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBodyText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Phone number
              </Text>
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBody2Text,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {useData?.getUserProfile?.tel}
              </Text>
            </View>

            <View
              style={[
                ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer,
                {
                  height: moderateScale(70),
                  borderWidth: moderateScale(0.5),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(15),
                },
              ]}
            >
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBodyText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Email
              </Text>
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBody2Text,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {useData?.getUserProfile?.email}
              </Text>
            </View>

            <View
              style={[
                ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer,
                {
                  height: moderateScale(70),
                  borderWidth: moderateScale(0.5),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(15),
                },
              ]}
            >
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBodyText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Province
              </Text>
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBody2Text,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {useData?.getUserProfile?.permanentProvince}
              </Text>
            </View>

            <View
              style={[
                ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer,
                {
                  height: moderateScale(70),
                  borderWidth: moderateScale(0.5),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(15),
                },
              ]}
            >
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBodyText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                District
              </Text>
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBody2Text,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {useData?.getUserProfile?.permanentDistrict}
              </Text>
            </View>

            <View
              style={[
                ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer,
                {
                  height: moderateScale(70),
                  borderWidth: moderateScale(0.5),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(15),
                },
              ]}
            >
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBodyText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Commune
              </Text>
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBody2Text,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {useData?.getUserProfile?.permanentCommune}
              </Text>
            </View>

            <View
              style={[
                ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer,
                {
                  height: moderateScale(70),
                  borderWidth: moderateScale(0.5),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(15),
                },
              ]}
            >
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBodyText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Village
              </Text>
              <Text
                style={[
                  ProfileDetailStyle.ProfileDetailMiddleBody2Text,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {useData?.getUserProfile?.permanentVillage}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
