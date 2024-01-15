import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import AttendanceStyle from "../Styles/AttendanceScreen.scss";
import * as Animatable from "react-native-animatable";
import { useEffect, useState } from "react";
import HomeStyle from "../Styles/HomeScreen.scss";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from "react-native-select-dropdown";
import { useQuery } from "@apollo/client";
import { ATT_BY_STUDENT } from "../graphql/get_AttByStudent";
import { GET_ACADEMIC_YEAR } from "../graphql/get_AcademicYear";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getLanguage, useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

export default function AttendanceScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const stuInfo = location.state;
  const stuId = location.state._id;
  const numbers = Array.from({ length: 20 }, (_, index) => index);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [date, setDate] = useState("");
  const [date1, setDate1] = useState("");
  const [academicId, setAcademicId] = useState("");
  const [academicYears, setAcademicYears] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [limit, setLimit] = useState(10);
  const [disappear, setDisappear] = useState(false);
  const t = useTranslation();
  const offset = useSharedValue(0.2);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(offset.value),
    };
  });
  // console.log(stuInfo);

  const toggleModal1 = () => {
    refetch();
    setModalVisible1(!isModalVisible1);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(moment(date).format("YYYY-MM-DD"));
    hideDatePicker();
  };

  const handleConfirm1 = (date1: Date) => {
    setDate1(moment(date1).format("YYYY-MM-DD"));
    hideDatePicker1();
  };

  const { data: academincYearData, refetch: academicRefetch } = useQuery(
    GET_ACADEMIC_YEAR,
    {
      onCompleted: ({ getAcademicYear }) => {
        setAcademicYears(getAcademicYear);
      },
    }
  );

  useEffect(() => {
    setAcademicId(
      academincYearData?.getAcademicYear[
        academincYearData?.getAcademicYear.length - 1
      ]._id
    );
  }, [academincYearData?.getAcademicYear]);

  useEffect(() => {
    academicRefetch();
  }, [isModalVisible1]);

  const { data, refetch } = useQuery(ATT_BY_STUDENT, {
    variables: {
      studentId: stuId,
      from: date,
      to: date1,
      limit: limit,
      academicYearId: academicId,
    },
    onCompleted: ({ getAttendantsByStudent }) => {
      setAttendances(getAttendantsByStudent);
    },
  });

  useEffect(() => {
    refetch();
  }, [isModalVisible1, date, date1, limit, stuId, academicId]);

  return (
    <View style={AttendanceStyle.AttendanceContainer}>
      {/* =========== MODAL LEAVE REQUEST ============= */}
      <Modal
        visible={isModalVisible1}
        animationType="none"
        onRequestClose={toggleModal1}
        transparent={true}
      >
        <View style={HomeStyle.homeSelectLeaveOptionContainer}>
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
              style={HomeStyle.homeSelectLeaveOptionDismissArea}
              onPress={() => {
                setDisappear(true);
                offset.value = withTiming(0);
                setTimeout(() => {
                  setDisappear(false);
                  toggleModal1();
                  offset.value = withTiming(0.2);
                }, 500);
              }}
            />
          </Animated.View>
          <Animatable.View
            style={[
              HomeStyle.homeSelectLeaveOptionModalArea,
              {
                paddingBottom: moderateScale(50),
                borderTopLeftRadius: moderateScale(5),
                borderTopRightRadius: moderateScale(5),
              },
            ]}
            animation={disappear ? "fadeOutDownBig" : "fadeInUpBig"}
          >
            <View
              // onPress={toggleModal1}
              style={{
                width: "100%",
                alignItems: "flex-start",
                padding: moderateScale(10),
              }}
            >
              <Text
                style={[
                  HomeStyle.homeModalTitle,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {t("Choose")}
              </Text>
            </View>
            <Text
              style={[
                HomeStyle.homeModalTitle2,
                {
                  fontSize: moderateScale(14),
                  marginVertical: moderateScale(10),
                },
              ]}
            >
              {t("Academic Years")}
            </Text>
            <View
              style={[
                HomeStyle.homeSelectLeaveOptionTextInput,
                { padding: moderateScale(10), borderWidth: moderateScale(1) },
              ]}
            >
              <SelectDropdown
                data={academicYears}
                buttonStyle={{
                  width: "100%",
                  height: moderateScale(35),
                  borderRadius: moderateScale(10),
                  backgroundColor: "white",
                }}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem?._id, index);
                  setAcademicId(selectedItem?._id);
                }}
                renderCustomizedButtonChild={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            AttendanceStyle.AttendanceModalBodyText,
                            { fontSize: moderateScale(14) },
                          ]}
                        >
                          {t("Academic Year")}៖
                        </Text>
                        <Text
                          style={[
                            AttendanceStyle.AttendanceModalBodyText,
                            { fontSize: moderateScale(14) },
                          ]}
                        >
                          {selectedItem?.academicYear
                            ? selectedItem?.academicYear
                            : academincYearData?.getAcademicYear[
                                academincYearData?.getAcademicYear.length - 1
                              ].academicYear}
                        </Text>
                      </View>

                      <Image
                        source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                    </View>
                  );
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item?.academicYear;
                }}
              />
            </View>
            <View style={AttendanceStyle.AttendanceSelectDateinModal}>
              <View style={AttendanceStyle.AttendanceSelectDateinModalFrom}>
                <Text
                  style={[
                    AttendanceStyle.AttendanceModalTitle2,
                    {
                      fontSize: moderateScale(14),
                      marginVertical: moderateScale(10),
                    },
                  ]}
                >
                  {t("From")}
                </Text>
                <TouchableOpacity
                  style={[
                    AttendanceStyle.AttendanceSelectLeaveOptionPickupDate,
                    {
                      padding: moderateScale(10),
                      borderWidth: moderateScale(1),
                    },
                  ]}
                  onPress={showDatePicker}
                >
                  <Text
                    style={[
                      AttendanceStyle.AttendanceModalBodyText,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {date
                      ? moment(date).format("YYYY-MM-DD")
                      : moment(new Date()).format("YYYY-MM-DD")}
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
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
              <View style={AttendanceStyle.AttendanceSelectDateinModalFrom}>
                <Text
                  style={[
                    AttendanceStyle.AttendanceModalTitle2,
                    {
                      fontSize: moderateScale(14),
                      marginVertical: moderateScale(10),
                    },
                  ]}
                >
                  {t("To")}
                </Text>
                <TouchableOpacity
                  style={[
                    AttendanceStyle.AttendanceSelectLeaveOptionPickupDate,
                    {
                      padding: moderateScale(10),
                      borderWidth: moderateScale(1),
                    },
                  ]}
                  onPress={showDatePicker1}
                >
                  <Text
                    style={[
                      AttendanceStyle.AttendanceModalBodyText,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {date1
                      ? moment(date1).format("YYYY-MM-DD")
                      : moment(new Date()).format("YYYY-MM-DD")}
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
                <DateTimePickerModal
                  isVisible={isDatePickerVisible1}
                  mode="date"
                  onConfirm={handleConfirm1}
                  onCancel={hideDatePicker1}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                HomeStyle.homeSelectLeaveOptionButtonRequest,
                { padding: moderateScale(10), marginTop: moderateScale(20) },
              ]}
              onPress={() => {
                toggleModal1();
              }}
            >
              <Text
                style={[
                  HomeStyle.homeModalButtonTitle,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {t("Request")}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      <View style={AttendanceStyle.AttendanceTitleContainer}>
        <Text
          style={[
            AttendanceStyle.AttendanceTitle1,
            { fontSize: moderateScale(14) },
          ]}
        >
          {getLanguage() === "en"
            ? stuInfo?.englishName + "'s Attendance"
            : "វត្តមាន " + stuInfo?.lastName + " " + stuInfo?.firstName}
        </Text>
        <TouchableOpacity
          style={[
            AttendanceStyle.AttendanceFilterButton,
            { width: moderateScale(40), height: moderateScale(40) },
          ]}
          onPress={() => {
            toggleModal1();
          }}
        >
          <Animatable.Image
            source={require("../assets/Images/edit.png")}
            style={{
              width: moderateScale(25),
              height: moderateScale(25),
            }}
            animation="bounce"
          />
        </TouchableOpacity>
      </View>
      <View style={AttendanceStyle.AttendanceBodyContainer}>
        <View
          style={[
            AttendanceStyle.AttendanceTitle2Container,
            { padding: moderateScale(10), marginVertical: moderateScale(10) },
          ]}
        >
          <Text
            style={[
              AttendanceStyle.AttendanceTitle2,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("CLASSES")}
          </Text>
          <Text
            style={[
              AttendanceStyle.AttendanceTitle2,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("DATE")}
          </Text>
          <Text
            style={[
              AttendanceStyle.AttendanceTitle2,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("ATTENDANCE")}
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: "100%", width: "95%" }}
      >
        {attendances?.map((Attendance: any, index: number) => (
          <View
            style={
              index % 2 === 1
                ? [
                    AttendanceStyle.AttendanceTitle2Container2,
                    {
                      padding: moderateScale(10),
                      marginBottom: moderateScale(10),
                    },
                  ]
                : [
                    AttendanceStyle.AttendanceTitle2Container1,
                    {
                      padding: moderateScale(10),
                      marginBottom: moderateScale(10),
                    },
                  ]
            }
            key={index}
          >
            <Text
              style={[
                AttendanceStyle.AttendanceBody1,
                { fontSize: moderateScale(12) },
              ]}
            >
              {Attendance?.className}
            </Text>
            <Text
              style={[
                AttendanceStyle.AttendanceBody2,
                { fontSize: moderateScale(12) },
              ]}
            >
              {moment(Attendance?.date).format("YYYY-MM-DD")}
            </Text>
            <Text
              style={[
                AttendanceStyle.AttendanceTitle2,
                { fontSize: moderateScale(12) },
              ]}
            >
              {Attendance?.attendace}
            </Text>
          </View>
        ))}

        {attendances.length >= limit ? (
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
  );
}
