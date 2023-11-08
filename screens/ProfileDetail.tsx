import { Button, Image, ScrollView, Text, View } from "react-native";
import { useLocation } from "react-router-native";
import ProfileDetailStyle from "../Styles/ProfileDetail.scss";
import { useState } from "react";
// import * as ImagePicker from "expo-image-picker";

export default function ProfileDetail() {
  const location = useLocation();
  const useData = location.state;
  const [image, setImage] = useState(null);

  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     //   setImage(result.assets[0].uri);
  //   }
  // };

  return (
    <View style={ProfileDetailStyle.ProfileDetailContainer}>
      <View style={ProfileDetailStyle.ProfileDetailTopContainer}>
        <Image
          source={{
            uri:
              "https://storage.go-globalschool.com/api" +
              useData?.getUserProfile?.profileImg,
          }}
          resizeMode="cover"
          style={ProfileDetailStyle.ProfileDetailImageStyle}
        />
        <Text>{useData?.getUserProfile?.englishName}</Text>
        <Text>Customer Type</Text>
        <Text>{useData?.getUserProfile?.customerType}</Text>
        {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View>
      <View style={ProfileDetailStyle.ProfileDetailMiddleContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={ProfileDetailStyle.ProfileDetailMiddleScrollviewContainer}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={ProfileDetailStyle.ProfileDetailMiddleTitle}>
            <Text style={ProfileDetailStyle.ProfileDetailMiddleTitleText}>
              Customer Info
            </Text>
          </View>
          <View style={ProfileDetailStyle.ProfileDetailMiddleBody}>
            <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
              Phone number
            </Text>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.tel}
              </Text>
            </View>

            <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
              Email
            </Text>

            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.email}
              </Text>
            </View>

            <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
              Province
            </Text>
            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentProvince}
              </Text>
            </View>
            <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
              District
            </Text>
            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentDistrict}
              </Text>
            </View>
            <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
              Commune
            </Text>
            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentCommune}
              </Text>
            </View>
            <Text style={ProfileDetailStyle.ProfileDetailMiddleBodyText}>
              Village
            </Text>
            <View
              style={ProfileDetailStyle.ProfileDetailMiddleBody2TextContainer}
            >
              <Text style={ProfileDetailStyle.ProfileDetailMiddleBody2Text}>
                {useData?.getUserProfile?.permanentVillage}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
