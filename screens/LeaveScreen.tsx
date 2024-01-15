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
import { moderateScale } from "../ Metrics";

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
            style={[
              LeaveStyle.LeaveModalInsideContainer,
              {
                borderTopRightRadius: moderateScale(30),
                borderTopLeftRadius: moderateScale(30),
                padding: moderateScale(10),
              },
            ]}
            animation={disappear ? "fadeOutDownBig" : "fadeInUpBig"}
          >
            <Text
              style={[
                LeaveStyle.LeaveModalTitle,
                { fontSize: moderateScale(16) },
              ]}
            >
              {t("SELECT")}
            </Text>
            <View
              style={[
                LeaveStyle.LeaveModalSelectDateContainer,
                { marginVertical: moderateScale(10) },
              ]}
            >
              <TouchableOpacity
                style={[
                  LeaveStyle.LeaveModalSelectDateButton,
                  {
                    padding: moderateScale(10),
                    borderWidth: moderateScale(1),
                  },
                ]}
                onPress={showDatePicker1}
              >
                <Text
                  style={[
                    LeaveStyle.LeaveModalDateText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {from ? from : moment(new Date()).format("YYYY-MM-DD")}
                </Text>
                <Image
                  source={require("../assets/Images/calendar-clock.png")}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(15),
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  LeaveStyle.LeaveModalSelectDateButton,
                  {
                    padding: moderateScale(10),
                    borderWidth: moderateScale(1),
                  },
                ]}
                onPress={showDatePicker2}
              >
                <Text
                  style={[
                    LeaveStyle.LeaveModalDateText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  {to ? to : moment(new Date()).format("YYYY-MM-DD")}
                </Text>
                <Image
                  source={require("../assets/Images/calendar-clock.png")}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(15),
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                LeaveStyle.LeaveModalButtonContainer,
                { padding: moderateScale(10), marginTop: moderateScale(10) },
              ]}
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
              <Text
                style={[
                  LeaveStyle.LeaveModalButtonText,
                  { fontSize: moderateScale(14) },
                ]}
              >
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
        <View
          style={[
            LeaveStyle.LeaveTopContainer,
            { marginBottom: moderateScale(10) },
          ]}
        >
          <SelectDropdown
            data={stuData?.getStudentByParentsMobile}
            buttonStyle={{
              width: moderateScale(220),
              height: moderateScale(55),
              borderRadius: moderateScale(10),
            }}
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
                    style={[
                      LeaveStyle.LeaveImage,
                      {
                        width: moderateScale(40),
                        height: moderateScale(40),
                        borderWidth: moderateScale(1),
                        marginRight: moderateScale(10),
                      },
                    ]}
                    resizeMode="cover"
                    animation="zoomIn"
                  />
                  <Text
                    style={[
                      LeaveStyle.LeaveTitleText4,
                      { fontSize: moderateScale(16) },
                    ]}
                    numberOfLines={1}
                  >
                    {getLanguage() === "en"
                      ? stuInfo?.englishName
                      : stuName != ""
                      ? stuName
                      : stuInfo?.lastName + " " + stuInfo?.firstName}
                  </Text>
                  <View
                    style={[
                      LeaveStyle.LeaveFilterButton,
                      { width: moderateScale(40), height: moderateScale(40) },
                    ]}
                  >
                    <Image
                      source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                      style={{
                        width: moderateScale(18),
                        height: moderateScale(18),
                      }}
                    />
                  </View>
                </View>
              );
            }}
            dropdownStyle={{
              borderRadius: moderateScale(10),
              paddingHorizontal: moderateScale(10),
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
                    borderRadius: moderateScale(10),
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
                    style={[
                      LeaveStyle.LeaveImage,
                      {
                        width: moderateScale(40),
                        height: moderateScale(40),
                        borderWidth: moderateScale(1),
                        marginRight: moderateScale(10),
                      },
                    ]}
                    resizeMode="cover"
                    animation="zoomIn"
                  />
                  <Text
                    style={[
                      LeaveStyle.LeaveTitleText3,
                      { fontSize: moderateScale(16) },
                    ]}
                    numberOfLines={1}
                  >
                    {getLanguage() === "en"
                      ? item?.englishName
                      : item?.lastName + " " + item?.firstName}
                  </Text>
                  <View
                    style={{
                      width: moderateScale(18),
                      height: moderateScale(18),
                    }}
                  />
                </View>
              );
            }}
          />

          <TouchableOpacity
            style={[
              LeaveStyle.LeaveFilterButton,
              { width: moderateScale(40), height: moderateScale(40) },
            ]}
            onPress={() => {
              openModal();
            }}
          >
            <Animatable.Image
              source={require("../assets/Images/edit.png")}
              style={{
                width: moderateScale(25),
                height: moderateScale(25),
                padding: moderateScale(10),
              }}
              animation="bounce"
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            LeaveStyle.LeaveTitleContainer,
            {
              padding: moderateScale(5),
              marginBottom: moderateScale(10),
              height: moderateScale(40),
            },
          ]}
        >
          <Text
            style={[LeaveStyle.LeaveTitleText, { fontSize: moderateScale(16) }]}
            numberOfLines={1}
          >
            {t("Type")}
          </Text>
          <Text
            style={[
              LeaveStyle.LeaveTitleText1,
              { fontSize: moderateScale(16) },
            ]}
            numberOfLines={1}
          >
            {t("Date")}
          </Text>
          <Text
            style={[
              LeaveStyle.LeaveTitleText3,
              { fontSize: moderateScale(16) },
            ]}
            numberOfLines={1}
          >
            {t("Reason")}
          </Text>
          <Text
            style={[LeaveStyle.LeaveTitleText, { fontSize: moderateScale(16) }]}
            numberOfLines={1}
          >
            {t("Status")}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", height: "85%" }}
        >
          {data?.getLeaveForMobile.map((leave: any, index: number) => (
            <View
              key={index}
              style={[
                LeaveStyle.LeaveCardContainer,
                {
                  marginBottom: moderateScale(10),
                  padding: moderateScale(5),
                },
              ]}
            >
              <Text
                style={[
                  LeaveStyle.LeaveTitleText2,
                  {
                    fontSize: moderateScale(14),
                  },
                ]}
              >
                {leave?.requestType === "afternoon"
                  ? "Afternoon"
                  : leave?.requestType === "morning"
                  ? "Morning"
                  : leave?.requestType === "full-day"
                  ? "Full day"
                  : ""}
              </Text>
              <Text
                style={[
                  LeaveStyle.LeaveBodyText2,
                  {
                    fontSize: moderateScale(14),
                  },
                ]}
              >
                {leave?.from === leave?.to
                  ? moment(leave?.from).format("DD-MM-YY")
                  : moment(leave?.from).format("DD-MM-YY") +
                    " - " +
                    moment(leave?.to).format("DD-MM-YY")}
              </Text>
              <Text
                style={[
                  LeaveStyle.LeaveBodyText1,
                  {
                    fontSize: moderateScale(14),
                  },
                ]}
              >
                {leave?.reason}
              </Text>
              <Text
                style={
                  leave?.status === "pending"
                    ? [
                        LeaveStyle.LeaveBodyTextyellow,
                        { fontSize: moderateScale(14) },
                      ]
                    : leave?.status === "approval"
                    ? [
                        LeaveStyle.LeaveBodyTextgreen,
                        { fontSize: moderateScale(14) },
                      ]
                    : leave?.status === "rejected"
                    ? [
                        LeaveStyle.LeaveBodyTextred,
                        { fontSize: moderateScale(14) },
                      ]
                    : [
                        LeaveStyle.LeaveBodyText,
                        { fontSize: moderateScale(14) },
                      ]
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
                height: moderateScale(40),
              }}
            >
              <Text
                style={{
                  fontFamily: "Kantumruy-Bold",
                  color: "#3c6efb",
                  fontSize: moderateScale(14),
                }}
              >
                {t("see more")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}
