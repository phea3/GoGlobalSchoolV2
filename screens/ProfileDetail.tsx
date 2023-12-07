import {
  Alert,
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
import { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@apollo/client";
import { UPDATE_IMAGE } from "../graphql/UpdateParentsInfoByMobile";
import axios from "axios";

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
          source={
            useData?.getUserProfile?.profileImg
              ? useData?.getUserProfile?.profileImg
                  .toLowerCase()
                  .includes("https://storage-server.go-globalschool.com/")
                ? { uri: useData?.getUserProfile?.profileImg }
                : {
                    uri:
                      "https://storage.go-globalschool.com/api" +
                      useData?.getUserProfile?.profileImg,
                  }
              : require("../assets/Images/user.png")
          }
          resizeMode="cover"
          style={ProfileDetailStyle.ProfileDetailImageStyle}
          animation={"zoomIn"}
        />
        {image && (
          <Image
            source={{ uri: image }}
            style={[
              ProfileDetailStyle.ProfileDetailImageStyle,
              { position: "absolute" },
            ]}
          />
        )}

        <View style={ProfileDetailStyle.ProfileDetailNameContainer}>
          <Text style={ProfileDetailStyle.ProfileDetailNameTitle}>
            {useData?.getUserProfile?.lastName +
              " " +
              useData?.getUserProfile?.firstName}
          </Text>
          <Text style={ProfileDetailStyle.ProfileDetailCutomerTypeText}>
            Parent Type :{" "}
            {useData?.getUserProfile?.customerType
              ? useData?.getUserProfile?.customerType
              : "Simple"}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={ProfileDetailStyle.ProfileDetailImageStylePreview}
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
                    .toLowerCase()
                    .includes("https://storage-server.go-globalschool.com/")
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
            style={ProfileDetailStyle.ProfileDetailIconOnImageProfileBorder}
            onPress={pickImage}
          >
            <Animatable.Image
              source={require("../assets/Images/photocamerainterfacesymbolforbutton.png")}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
              }}
              animation={"zoomIn"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
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
