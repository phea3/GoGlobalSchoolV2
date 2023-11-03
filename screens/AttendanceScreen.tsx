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

export default function AttendanceScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const stuId = location.state;
  const numbers = Array.from({ length: 20 }, (_, index) => index);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [date, setDate] = useState("");
  const [date1, setDate1] = useState("");
  const [academicId, setAcademicId] = useState("64af61a9d55dd0f4efdb9962");
  const [academicYears, setAcademicYears] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [limit, setLimit] = useState(10);
  const countries = ["2021", "2022", "Summer 2023", "2024"];

  const toggleModal1 = () => {
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

  const { refetch } = useQuery(ATT_BY_STUDENT, {
    pollInterval: 2000,
    variables: {
      studentId: stuId,
      from: date,
      to: date1,
      limit: limit,
      academicYearId: academicId === "" ? "" : academicId,
    },
    onCompleted: ({ getAttendantsByStudent }) => {
      setAttendances(getAttendantsByStudent);
    },
  });

  useEffect(() => {
    refetch();
  }, [isModalVisible1, date, date1, limit, stuId]);

  const { refetch: academicRefetch } = useQuery(GET_ACADEMIC_YEAR, {
    pollInterval: 2000,
    onCompleted: ({ getAcademicYear }) => {
      setAcademicYears(getAcademicYear);
    },
  });

  useEffect(() => {
    academicRefetch();
  }, [isModalVisible1]);

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
          <TouchableOpacity
            style={HomeStyle.homeSelectLeaveOptionDismissArea}
            onPress={() => toggleModal1()}
          />
          <Animatable.View
            style={HomeStyle.homeSelectLeaveOptionModalArea}
            animation="fadeInUpBig"
          >
            <View
              // onPress={toggleModal1}
              style={{ width: "100%", alignItems: "flex-start", padding: 10 }}
            >
              <Text style={HomeStyle.homeModalTitle}>ជ្រើសរើស</Text>
            </View>
            <Text style={HomeStyle.homeModalTitle2}>Academic</Text>
            <View style={HomeStyle.homeSelectLeaveOptionTextInput}>
              <SelectDropdown
                data={academicYears}
                buttonStyle={{
                  width: "100%",
                  height: 35,
                  borderRadius: 10,
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
                        <Text>ឆ្នាំសិក្សា៖</Text>
                        <Text>{selectedItem?.academicYear}</Text>
                      </View>

                      <Image
                        source={require("../assets/Images/angle-down-gray.png")}
                        style={{ width: 20, height: 20 }}
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
                <Text style={AttendanceStyle.AttendanceModalTitle2}>From</Text>
                <TouchableOpacity
                  style={AttendanceStyle.AttendanceSelectLeaveOptionPickupDate}
                  onPress={showDatePicker}
                >
                  <Text>
                    {date
                      ? moment(date).format("YYYY-MM-DD")
                      : moment(new Date()).format("YYYY-MM-DD")}
                  </Text>
                  <Image
                    source={require("../assets/Images/calendar-clock.png")}
                    style={{ width: 15, height: 15 }}
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
                <Text style={AttendanceStyle.AttendanceModalTitle2}>To</Text>
                <TouchableOpacity
                  style={AttendanceStyle.AttendanceSelectLeaveOptionPickupDate}
                  onPress={showDatePicker1}
                >
                  <Text>
                    {date1
                      ? moment(date1).format("YYYY-MM-DD")
                      : moment(new Date()).format("YYYY-MM-DD")}
                  </Text>
                  <Image
                    source={require("../assets/Images/calendar-clock.png")}
                    style={{ width: 15, height: 15 }}
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
              style={HomeStyle.homeSelectLeaveOptionButtonRequest}
              onPress={() => {
                toggleModal1();
              }}
            >
              <Text style={HomeStyle.homeModalButtonTitle}>Finish</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
      <View style={AttendanceStyle.AttendanceTitleContainer}>
        <Text style={AttendanceStyle.AttendanceTitle1}>
          Brosphoem's Attendance
        </Text>
        <TouchableOpacity
          style={AttendanceStyle.AttendanceFilterButton}
          onPress={() => {
            toggleModal1();
          }}
        >
          <Animatable.Image
            source={require("../assets/Images/edit.png")}
            style={{ width: 25, height: 25, padding: 10 }}
            animation="bounce"
          />
        </TouchableOpacity>
      </View>
      <View style={AttendanceStyle.AttendanceBodyContainer}>
        <View style={AttendanceStyle.AttendanceTitle2Container}>
          <Text style={AttendanceStyle.AttendanceTitle2}>CLASSES</Text>
          <Text style={AttendanceStyle.AttendanceTitle2}>DATE</Text>
          <Text style={AttendanceStyle.AttendanceTitle2}>ATTENDANCE</Text>
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
                ? AttendanceStyle.AttendanceTitle2Container2
                : AttendanceStyle.AttendanceTitle2Container1
            }
            key={index}
          >
            <Text style={AttendanceStyle.AttendanceBody1}>
              {Attendance?.className}
            </Text>
            <Text style={AttendanceStyle.AttendanceBody2}>
              {moment(Attendance?.date).format("YYYY-MM-DD")}
            </Text>
            <Text style={AttendanceStyle.AttendanceTitle2}>
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
              height: 40,
            }}
          >
            <Text style={{ fontFamily: "Kantumruy-Bold", color: "#3c6efb" }}>
              see more
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
