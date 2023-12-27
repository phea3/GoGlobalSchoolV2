import { useQuery } from "@apollo/client";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_LEAVE_FOR_MOBILE } from "../graphql/Get_LeaveforMoble";
import { useLocation } from "react-router-native";
import { useEffect, useState } from "react";
import LeaveStyle from "../Styles/LeaveScreen.scss";
import { getLanguage, useTranslation } from "react-multi-lang";
import * as Animatable from "react-native-animatable";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from "react-native-select-dropdown";
import { GET_STUDENT } from "../graphql/get_studentByParent";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function LeaveScreen() {
  const location = useLocation();
  const stuInfo = location.state.stuInfo;
  const uid = location.state.uid;
  const t = useTranslation();
  const [limit, setLimit] = useState(10);
  const [isModalVisible, setModalVisible] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [datePickerVisible1, setDatePickerVisible1] = useState(false);
  const [datePickerVisible2, setDatePickerVisible2] = useState(false);
  const [stuImg, setStuImg] = useState("");
  const [stuName, setStuName] = useState("");
  const [stuId, setStuId] = useState("");
  const [disappear, setDisappear] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const showDatePicker1 = () => {
    setDatePickerVisible1(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisible2(true);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisible1(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisible2(false);
  };

  const handleConfirm1 = (From: Date) => {
    setFrom(moment(From).format("YYYY-MM-DD"));
    hideDatePicker1();
  };

  const handleConfirm2 = (To: Date) => {
    setTo(moment(To).format("YYYY-MM-DD"));
    hideDatePicker2();
  };

  const { data: stuData, refetch: stuRefetch } = useQuery(GET_STUDENT, {
    pollInterval: 2000,
    variables: {
      parentsId: uid,
    },
    onCompleted: ({ getStudentByParentsMobile }) => {
      //   console.log(getStudentByParentsMobile);
      const timer = setTimeout(() => {}, 500);
      return () => clearTimeout(timer);
    },
    onError: ({}) => {},
  });

  const { data, refetch } = useQuery(GET_LEAVE_FOR_MOBILE, {
    pollInterval: 2000,
    variables: {
      studentId: stuId != "" ? stuId : stuInfo?._id,
      from: from,
      to: to,
      limit: limit,
    },
    onCompleted: ({}) => {},
    onError: (error) => {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [stuInfo?._id, to, from, limit]);

  const offset = useSharedValue(0.2);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(offset.value),
    };
  });

  return (
    <View style={LeaveStyle.LeaveContainer}>
      <Modal
        visible={isModalVisible}
        animationType="none"
        onRequestClose={closeModal}
        transparent={true}
      >
        <View style={LeaveStyle.ModalLeaveContainer}>
          <Animated.View
            style={[
              animatedStyles,
              {
                width: "100%",
                height: "100%",
                backgroundColor: "#000",
                position: "absolute",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                setDisappear(true);
                offset.value = withTiming(0);
                setTimeout(() => {
                  setDisappear(false);
                  closeModal();
                  offset.value = withTiming(0.2);
                }, 500);
              }}
              style={LeaveStyle.LeaveModalCloneAreaStyle}
            />
          </Animated.View>
          <Animatable.View
            style={LeaveStyle.LeaveModalInsideContainer}
            animation={disappear ? "fadeOutDownBig" : "fadeInUpBig"}
          >
            <Text style={LeaveStyle.LeaveModalTitle}>{t("SELECT")}</Text>
            <View style={LeaveStyle.LeaveModalSelectDateContainer}>
              <TouchableOpacity
                style={LeaveStyle.LeaveModalSelectDateButton}
                onPress={showDatePicker1}
              >
                <Text style={LeaveStyle.LeaveModalDateText}>
                  {from ? from : moment(new Date()).format("YYYY-MM-DD")}
                </Text>
                <Image
                  source={require("../assets/Images/calendar-clock.png")}
                  style={{ width: 15, height: 15 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={LeaveStyle.LeaveModalSelectDateButton}
                onPress={showDatePicker2}
              >
                <Text style={LeaveStyle.LeaveModalDateText}>
                  {to ? to : moment(new Date()).format("YYYY-MM-DD")}
                </Text>
                <Image
                  source={require("../assets/Images/calendar-clock.png")}
                  style={{ width: 15, height: 15 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={LeaveStyle.LeaveModalButtonContainer}
              onPress={() => {
                setDisappear(true);
                offset.value = withTiming(0);
                setTimeout(() => {
                  setDisappear(false);
                  closeModal();
                  offset.value = withTiming(0.2);
                }, 500);
              }}
            >
              <Text style={LeaveStyle.LeaveModalButtonText}>
                {t("Request")}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
          <DateTimePickerModal
            isVisible={datePickerVisible1}
            mode="date"
            onConfirm={handleConfirm1}
            onCancel={hideDatePicker1}
          />
          <DateTimePickerModal
            isVisible={datePickerVisible2}
            mode="date"
            onConfirm={handleConfirm2}
            onCancel={hideDatePicker2}
          />
        </View>
      </Modal>
      <View style={LeaveStyle.LeaveContainerList}>
        <View style={LeaveStyle.LeaveTopContainer}>
          <SelectDropdown
            data={stuData?.getStudentByParentsMobile}
            buttonStyle={{ width: 250, height: 55, borderRadius: 10 }}
            onSelect={(selectedItem, index) => {
              //   console.log(selectedItem?._id, index);
              setStuId(selectedItem?._id);
              setStuImg(selectedItem?.profileImg);
              setStuName(
                getLanguage() === "en"
                  ? stuInfo?.englishName
                  : selectedItem?.lastName + " " + selectedItem?.firstName
              );
            }}
            renderCustomizedButtonChild={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Animatable.Image
                    source={
                      stuImg != "" &&
                      stuImg
                        .toLowerCase()
                        .includes("https://storage-server.go-globalschool.com/")
                        ? { uri: stuImg }
                        : stuInfo?.profileImg
                            .toLowerCase()
                            .includes(
                              "https://storage-server.go-globalschool.com/"
                            )
                        ? { uri: stuInfo?.profileImg }
                        : {
                            uri: `https://storage.go-globalschool.com/api${
                              stuImg != "" ? stuImg : stuInfo?.profileImg
                            }`,
                          }
                    }
                    style={LeaveStyle.LeaveImage}
                    resizeMode="cover"
                    animation="zoomIn"
                  />
                  <Text style={LeaveStyle.LeaveTitleText4} numberOfLines={1}>
                    {getLanguage() === "en"
                      ? stuInfo?.englishName
                      : stuName != ""
                      ? stuName
                      : stuInfo?.lastName + " " + stuInfo?.firstName}
                  </Text>
                  <View style={LeaveStyle.LeaveFilterButton}>
                    <Image
                      source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                      style={{ width: 18, height: 18 }}
                    />
                  </View>
                </View>
              );
            }}
            dropdownStyle={{
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
            renderCustomizedRowChild={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 10,
                  }}
                >
                  <Animatable.Image
                    source={
                      item?.profileImg
                        ? item?.profileImg
                            .toLowerCase()
                            .includes(
                              "https://storage-server.go-globalschool.com/"
                            )
                          ? { uri: item?.profileImg }
                          : {
                              uri: `https://storage.go-globalschool.com/api${item?.profileImg}`,
                            }
                        : require("../assets/Images/user.png")
                    }
                    style={LeaveStyle.LeaveImage}
                    resizeMode="cover"
                    animation="zoomIn"
                  />
                  <Text style={LeaveStyle.LeaveTitleText3} numberOfLines={1}>
                    {getLanguage() === "en"
                      ? item?.englishName
                      : item?.lastName + " " + item?.firstName}
                  </Text>
                  <View style={{ width: 18, height: 18 }} />
                </View>
              );
            }}
          />

          <TouchableOpacity
            style={LeaveStyle.LeaveFilterButton}
            onPress={() => {
              openModal();
            }}
          >
            <Animatable.Image
              source={require("../assets/Images/edit.png")}
              style={{ width: 25, height: 25, padding: 10 }}
              animation="bounce"
            />
          </TouchableOpacity>
        </View>
        <View style={LeaveStyle.LeaveTitleContainer}>
          <Text style={LeaveStyle.LeaveTitleText} numberOfLines={1}>
            {t("Type")}
          </Text>
          <Text style={LeaveStyle.LeaveTitleText1} numberOfLines={1}>
            {t("Date")}
          </Text>
          <Text style={LeaveStyle.LeaveTitleText3} numberOfLines={1}>
            {t("Reason")}
          </Text>
          <Text style={LeaveStyle.LeaveTitleText} numberOfLines={1}>
            {t("Status")}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", height: "85%" }}
        >
          {data?.getLeaveForMobile.map((leave: any, index: number) => (
            <View key={index} style={LeaveStyle.LeaveCardContainer}>
              <Text style={LeaveStyle.LeaveTitleText2}>
                {leave?.requestType === "afternoon"
                  ? "Afternoon"
                  : leave?.requestType === "morning"
                  ? "Morning"
                  : leave?.requestType === "full-day"
                  ? "Full day"
                  : ""}
              </Text>
              <Text style={LeaveStyle.LeaveBodyText2}>
                {leave?.from === leave?.to
                  ? moment(leave?.from).format("DD-MM-YY")
                  : moment(leave?.from).format("DD-MM-YY") +
                    " - " +
                    moment(leave?.to).format("DD-MM-YY")}
              </Text>
              <Text style={LeaveStyle.LeaveBodyText1}>{leave?.reason}</Text>
              <Text
                style={
                  leave?.status === "pending"
                    ? LeaveStyle.LeaveBodyTextyellow
                    : leave?.status === "approval"
                    ? LeaveStyle.LeaveBodyTextgreen
                    : leave?.status === "rejected"
                    ? LeaveStyle.LeaveBodyTextred
                    : LeaveStyle.LeaveBodyText
                }
              >
                {leave?.status}
              </Text>
            </View>
          ))}
          {data?.getLeaveForMobile.length >= limit ? (
            <TouchableOpacity
              onPress={() => {
                setLimit(10 + limit);
              }}
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
              }}
            >
              <Text style={{ fontFamily: "Kantumruy-Bold", color: "#3c6efb" }}>
                {t("see more")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}
