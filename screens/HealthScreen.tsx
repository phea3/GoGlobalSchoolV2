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
import "moment/locale/km";

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
        style={HealthStyle.HealthMiddleContainer}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={HealthStyle.HealthDateContainer}>
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
            <Text style={HealthStyle.HealthDateTextLabel}>
              {t("Date & time")}
            </Text>
            <Text style={HealthStyle.HealthDateText}>
              {t("Today,")}{" "}
              {moment(new Date())
                .locale(getLanguage())
                .format("Do MMMM YYYY h:mm a")}
            </Text>
          </View>
        </View>
        <View style={HealthStyle.HealthAllCheckboxContainer}>
          <View
            style={{
              backgroundColor: "white",
              width: 40,
              height: 40,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Image
              source={require("../assets/Images/health-check.png")}
              style={{ width: 20, height: 20 }}
            />
          </View>

          <Text style={[HealthStyle.HealthTitleLabelStyle, { marginRight: 5 }]}>
            សុខភាព/Health៖
          </Text>
          <View style={{ flex: 1, backgroundColor: "#3C6EFB", height: 2 }} />
        </View>
        <View style={HealthStyle.HealthAllCheckboxContainer}>
          <View style={HealthStyle.HealthCheckboxContainer}>
            <Checkbox
              style={HealthStyle.HealthCheckbox}
              value={isChecked ? true : false}
              onValueChange={() => {
                setChecked(true);
              }}
            />
            <Text style={HealthStyle.HealthCheckboxTitle}>ធម្មតា/Normal</Text>
          </View>
          <View style={HealthStyle.HealthCheckboxContainer}>
            <Checkbox
              style={HealthStyle.HealthCheckbox}
              value={isChecked ? false : true}
              onValueChange={() => {
                setChecked(false);
              }}
            />
            <Text style={HealthStyle.HealthCheckboxTitle}>ឈឺ/Sick</Text>
          </View>
        </View>

        <View style={HealthStyle.HealthCommentContainer}>
          <Text style={HealthStyle.HealthCheckboxTitle}>
            បរិយាយ/Description ៖
          </Text>
          <TextInput
            style={HealthStyle.HealthCommentStyle}
            onChangeText={setDescription}
            value={description}
            placeholder={t("description")}
            keyboardType="default"
          />
        </View>
        <View style={HealthStyle.HealthAllCheckboxContainer}>
          <View
            style={{
              backgroundColor: "white",
              width: 40,
              height: 40,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Image
              source={require("../assets/Images/comment-colorful.png")}
              style={{ width: 20, height: 20 }}
            />
          </View>

          <Text style={[HealthStyle.HealthTitleLabelStyle, { marginRight: 5 }]}>
            មតិមាតាបិតា/Parent comment
          </Text>
          <View style={{ flex: 1, backgroundColor: "#3C6EFB", height: 2 }} />
        </View>
        <View style={HealthStyle.HealthCommentContainer}>
          <Text style={HealthStyle.HealthCheckboxTitle}>មតិ/Comment ៖</Text>
          <TextInput
            style={HealthStyle.HealthCommentStyle}
            onChangeText={setComment}
            value={comment}
            placeholder={t("comment")}
            keyboardType="default"
          />
        </View>

        <TouchableOpacity
          style={HealthStyle.HealthSubmitStyleButton}
          onPress={handleParentCheck}
        >
          <Text style={{ color: "#fff", fontFamily: "Kantumruy-Bold" }}>
            {t("Request")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
