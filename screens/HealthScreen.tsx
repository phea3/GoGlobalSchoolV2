import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HealthStyle from "../Styles/HealthScreen.scss";
import moment from "moment";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { PARENTS_CHECKSTUDENTSEYS } from "../graphql/ParentsCheckStudentsEYS";
import { useLocation } from "react-router-native";
import { getLanguage, useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

export default function HealthScreen() {
  const [isChecked, setChecked] = useState(true);
  const [comment, setComment] = useState("");
  const [description, setDescription] = useState("");
  const location = useLocation();
  const stuInfo = location.state;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [parentsCheckStudentsEYS] = useMutation(PARENTS_CHECKSTUDENTSEYS);

  const handleParentCheck = () => {
    const newValue = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      stuId: stuInfo,
      input: {
        parentsCheck: {
          title: isChecked,
          description: description,
        },
        parentsComment: comment,
      },
    };
    console.log(newValue);
    parentsCheckStudentsEYS({
      variables: newValue,
      onCompleted: ({ parentsCheckStudentsEYS }) => {
        Alert.alert(parentsCheckStudentsEYS?.message);
      },
      onError(error) {
        console.log(error?.message);
      },
    });
  };
  return (
    <View style={HealthStyle.HealthContainer}>
      {isKeyboardVisible ? null : (
        <View style={HealthStyle.HealthTopContainer}>
          <Image
            source={require("../assets/Images/cuteanimated.png")}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      )}
      <ScrollView
        style={[
          HealthStyle.HealthMiddleContainer,
          {
            borderTopRightRadius: moderateScale(40),
            borderTopLeftRadius: moderateScale(40),
          },
        ]}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            HealthStyle.HealthDateContainer,
            {
              paddingTop: moderateScale(20),
              paddingLeft: moderateScale(30),
              paddingRight: moderateScale(30),
              paddingBottom: moderateScale(10),
            },
          ]}
        >
          {/* <View
            style={{
              backgroundColor: "white",
              width: 40,
              height: 40,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/Images/timetable.png")}
              style={{ width: 20, height: 20 }}
            />
          </View> */}
          <View>
            <Text
              style={[
                HealthStyle.HealthDateTextLabel,
                {
                  paddingBottom: moderateScale(5),
                  fontSize: moderateScale(12),
                },
              ]}
            >
              {t("Date & time")}
            </Text>
            <Text
              style={[
                HealthStyle.HealthDateText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {t("Today,")} {moment(new Date()).format("Do MMMM YYYY h:mm a")}
            </Text>
          </View>
        </View>
        <View
          style={[
            HealthStyle.HealthAllCheckboxContainer,
            {
              paddingTop: moderateScale(10),
              paddingRight: moderateScale(10),
              paddingBottom: moderateScale(10),
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "white",
              width: moderateScale(40),
              height: moderateScale(40),
              borderRadius: moderateScale(50),
              justifyContent: "center",
              alignItems: "center",
              marginRight: moderateScale(5),
            }}
          >
            <Image
              source={require("../assets/Images/health-check.png")}
              style={{ width: moderateScale(20), height: moderateScale(20) }}
            />
          </View>

          <Text
            style={[
              HealthStyle.HealthTitleLabelStyle,
              { marginRight: moderateScale(5), fontSize: moderateScale(14) },
            ]}
          >
            សុខភាព/Health៖
          </Text>
          <View
            style={{
              flex: 1,
              backgroundColor: "#3C6EFB",
              height: moderateScale(2),
            }}
          />
        </View>
        <View
          style={[
            HealthStyle.HealthAllCheckboxContainer,
            {
              paddingTop: moderateScale(10),
              paddingRight: moderateScale(10),
              paddingBottom: moderateScale(10),
            },
          ]}
        >
          <View style={HealthStyle.HealthCheckboxContainer}>
            <Checkbox
              style={HealthStyle.HealthCheckbox}
              value={isChecked ? true : false}
              onValueChange={() => {
                setChecked(true);
              }}
            />
            <Text
              style={[
                HealthStyle.HealthCheckboxTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              ធម្មតា/Normal
            </Text>
          </View>
          <View style={HealthStyle.HealthCheckboxContainer}>
            <Checkbox
              style={HealthStyle.HealthCheckbox}
              value={isChecked ? false : true}
              onValueChange={() => {
                setChecked(false);
              }}
            />
            <Text
              style={[
                HealthStyle.HealthCheckboxTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              ឈឺ/Sick
            </Text>
          </View>
        </View>

        <View
          style={[
            HealthStyle.HealthCommentContainer,
            {
              paddingRight: moderateScale(10),
              paddingVertical: moderateScale(10),
            },
          ]}
        >
          <Text
            style={[
              HealthStyle.HealthCheckboxTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            បរិយាយ/Description ៖
          </Text>
          <TextInput
            style={[
              HealthStyle.HealthCommentStyle,
              {
                padding: moderateScale(10),
                marginTop: moderateScale(6),
                fontSize: moderateScale(14),
                borderWidth: moderateScale(1),
              },
            ]}
            onChangeText={setDescription}
            value={description}
            placeholder={t("description")}
            keyboardType="default"
          />
        </View>
        <View
          style={[
            HealthStyle.HealthAllCheckboxContainer,
            {
              paddingTop: moderateScale(10),
              paddingRight: moderateScale(10),
              paddingBottom: moderateScale(10),
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "white",
              width: moderateScale(40),
              height: moderateScale(40),
              borderRadius: moderateScale(50),
              justifyContent: "center",
              alignItems: "center",
              marginRight: moderateScale(5),
            }}
          >
            <Image
              source={require("../assets/Images/comment-colorful.png")}
              style={{ width: moderateScale(20), height: moderateScale(20) }}
            />
          </View>

          <Text
            style={[
              HealthStyle.HealthTitleLabelStyle,
              { marginRight: moderateScale(5), fontSize: moderateScale(14) },
            ]}
          >
            មតិមាតាបិតា/Parent comment
          </Text>
          <View
            style={{
              flex: 1,
              backgroundColor: "#3C6EFB",
              height: moderateScale(2),
            }}
          />
        </View>
        <View
          style={[
            HealthStyle.HealthCommentContainer,
            {
              paddingRight: moderateScale(10),
              paddingVertical: moderateScale(10),
            },
          ]}
        >
          <Text
            style={[
              HealthStyle.HealthCheckboxTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            មតិ/Comment ៖
          </Text>
          <TextInput
            style={[
              HealthStyle.HealthCommentStyle,
              {
                padding: moderateScale(10),
                marginTop: moderateScale(6),
                fontSize: moderateScale(14),
                borderWidth: moderateScale(1),
              },
            ]}
            onChangeText={setComment}
            value={comment}
            placeholder={t("comment")}
            keyboardType="default"
          />
        </View>

        <TouchableOpacity
          style={[
            HealthStyle.HealthSubmitStyleButton,
            { padding: moderateScale(10), marginVertical: moderateScale(10) },
          ]}
          onPress={handleParentCheck}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Kantumruy-Bold",
              fontSize: moderateScale(14),
            }}
          >
            {t("Request")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
