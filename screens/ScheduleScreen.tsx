import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import ScheduleStyle from "../Styles/ScheduleScreen.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_ACADEMIC_YEAR } from "../graphql/GetActiveAcademicYear";
import { GET_CLASSESBYSTUDENTFORMOBILE } from "../graphql/GetClassesByStudentForMobile";
import SelectDropdown from "react-native-select-dropdown";
import { GET_SCHEDULEFORMOBILE } from "../graphql/GetScheduleForMobile";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import { getLanguage, useTranslation } from "react-multi-lang";
import "moment/locale/km";

export default function ScheduleScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const stuInfo = location.state;
  const t = useTranslation();
  const { widthScreen, heightScreen } = useContext(AuthContext);
  const [classId, setClassId] = useState("");
  const [day, setDay] = useState(
    moment(new Date()).locale("en").format("dddd")?.toLowerCase()
  );

  const { data: ActiveAcademicYearData, refetch: ActiveAcademicYearRefetch } =
    useQuery(GET_ACTIVE_ACADEMIC_YEAR, {
      pollInterval: 2000,
      onCompleted: ({}) => {},
      onError(error) {
        console.log(error?.message);
      },
    });

  const { data: classData, refetch: classRefetch } = useQuery(
    GET_CLASSESBYSTUDENTFORMOBILE,
    {
      variables: {
        studentId: stuInfo?.stuInfo?._id,
        academicYearId: ActiveAcademicYearData?.getActiveAcademicYear?._id,
      },
      pollInterval: 2000,
      onCompleted: ({}) => {},
      onError: (error) => {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    classRefetch();
  }, [
    ActiveAcademicYearData?.getActiveAcademicYear?._id,
    stuInfo?.stuInfo?._id,
  ]);

  useEffect(() => {
    if (classData?.getClassesByStudentForMobile.length > 0) {
      setClassId(classData?.getClassesByStudentForMobile[0]?.classesId);
    }
  }, [classData?.getClassesByStudentForMobile]);

  const { data: scheduleData, refetch: scheduleRefetch } = useQuery(
    GET_SCHEDULEFORMOBILE,
    {
      variables: {
        classeId: classId,
        day: day,
      },
      pollInterval: 2000,
      onCompleted: ({}) => {},
      onError(error) {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    scheduleRefetch();
  }, [classId, day]);

  const DaysOfWeekInEnglish = [
    { day: "MON", color: "#F0822B", enum: "monday" },
    { day: "TUE", color: "#B78BC0", enum: "tuesday" },
    { day: "WEB", color: "#C0C781", enum: "wednesday" },
    { day: "THU", color: "#65A883", enum: "thursday" },
    { day: "FRI", color: "#87ABD3", enum: "friday" },
    { day: "SAT", color: "#AA6482", enum: "saturday" },
    { day: "SUN", color: "#F83C3B", enum: "sunday" },
  ];

  const DaysOfWeekInKhmer = [
    { day: "ច័ន្ទ", color: "#F0822B", enum: "monday" },
    { day: "អង្គារ", color: "#B78BC0", enum: "tuesday" },
    { day: "ពុធ", color: "#C0C781", enum: "wednesday" },
    { day: "ព្រហ", color: "#65A883", enum: "thursday" },
    { day: "សុក្រ", color: "#87ABD3", enum: "friday" },
    { day: "សៅរ៍", color: "#AA6482", enum: "saturday" },
    { day: "អាទិត្យ", color: "#F83C3B", enum: "sunday" },
  ];

  return (
    <View style={ScheduleStyle.ScheduleContainer}>
      <SelectDropdown
        data={classData?.getClassesByStudentForMobile}
        defaultValue={classData?.getClassesByStudentForMobile[0]?.classesId}
        defaultButtonText={
          classData?.getClassesByStudentForMobile[0]?.classesName
        }
        buttonStyle={{
          width: "95%",
          height: 55,
          borderRadius: 5,
          marginVertical: 10,
          backgroundColor: "white",
        }}
        onSelect={(selectedItem, index) => {
          setClassId(selectedItem?.classesId);
        }}
        renderCustomizedButtonChild={(selectedItem, index) => {
          return (
            <View style={ScheduleStyle.ScheduleOnSelectStyle}>
              {selectedItem ? (
                <>
                  <Text style={ScheduleStyle.ScheduleOnSelectTextStyle}>
                    {selectedItem?.classesName}
                  </Text>
                  <Image
                    source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                    style={{ width: 18, height: 18 }}
                  />
                </>
              ) : (
                <>
                  <Text style={ScheduleStyle.ScheduleOnSelectTextStyle}>
                    {classData?.getClassesByStudentForMobile[0]?.classesName}
                  </Text>
                  <Image
                    source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                    style={{ width: 18, height: 18 }}
                  />
                </>
              )}
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
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Text>{item?.classesName}</Text>
              <View style={{ width: 18, height: 18 }} />
            </View>
          );
        }}
      />
      <View style={ScheduleStyle.ScheduleTopContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(getLanguage() === "en"
            ? DaysOfWeekInEnglish
            : DaysOfWeekInKhmer
          ).map((item, index) => (
            <TouchableOpacity
              onPress={() => setDay(item.enum)}
              style={[
                ScheduleStyle.ScheduleDayBox,
                day === item.enum && { backgroundColor: "#3c6efb" },
              ]}
              key={index}
            >
              <View
                style={[
                  ScheduleStyle.ScheduleBodyCardBarTop,
                  day === item.enum && { backgroundColor: "#ffffff" },
                ]}
              />
              <View
                style={[
                  {
                    // width: widthScreen * 0.0955,
                    // height: widthScreen * 0.0955,
                    // backgroundColor: day.color,
                  },
                  ScheduleStyle.ScheduleDayInsideBoxCircle,
                ]}
              >
                <Text
                  style={[
                    ScheduleStyle.ScheduleDayTextStyle,
                    day === item.enum && { color: "#fff" },
                  ]}
                >
                  {item.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ width: "90%", height: 60, justifyContent: "center" }}>
        <Text
          style={[
            ScheduleStyle.ScheduleBodyDescriptionTitle,
            { color: "black" },
          ]}
        >
          {t("Ongoing")}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: "95%" }}>
        {scheduleData?.getScheduleForMobile.map(
          (schedule: any, index: number) =>
            schedule?.breakTime === true ? (
              <Animatable.View
                key={index}
                style={ScheduleStyle.ScheduleBodyBreakContainer}
                animation={"fadeInDown"}
              >
                <View style={ScheduleStyle.ScheduleBodyHourBox}>
                  <Text style={ScheduleStyle.ScheduleBodyHourText}>
                    {moment(schedule?.startTime)
                      .locale(getLanguage())
                      .format("hh:mm")}
                  </Text>
                  <Text style={ScheduleStyle.ScheduleBodyHourText}>
                    {moment(schedule?.endTime)
                      .locale(getLanguage())
                      .format("hh:mm")}
                  </Text>
                </View>

                <View
                  style={{
                    width: "10%",
                    height: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      backgroundColor: "#3c6efb",
                    }}
                  />
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      backgroundColor: "red",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 100,
                        backgroundColor: "red",
                        borderWidth: 2,
                        borderColor: "white",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      backgroundColor: "#3c6efb",
                    }}
                  />
                </View>

                <View style={ScheduleStyle.ScheduleBodyBreakContainerBox}>
                  <Text
                    style={{
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    {t("Break Time")}
                  </Text>
                </View>
              </Animatable.View>
            ) : (
              <Animatable.View
                key={index}
                style={ScheduleStyle.ScheduleBodyContainer}
                animation={"fadeInDown"}
              >
                <View style={ScheduleStyle.ScheduleBodyHourBox}>
                  <Text style={ScheduleStyle.ScheduleBodyHourText}>
                    {moment(schedule?.startTime)
                      .locale(getLanguage())
                      .format("hh:mm")}
                  </Text>
                  <Text style={ScheduleStyle.ScheduleBodyHourText}>
                    {moment(schedule?.endTime)
                      .locale(getLanguage())
                      .format("hh:mm")}
                  </Text>
                </View>

                <View
                  style={{
                    width: "10%",
                    height: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      backgroundColor:
                        scheduleData?.getScheduleForMobile[0]._id ===
                        schedule?._id
                          ? "white"
                          : "#3c6efb",
                    }}
                  />
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      backgroundColor: "#3c6efb",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 100,
                        backgroundColor: "#3c6efb",
                        borderWidth: 2,
                        borderColor: "white",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      backgroundColor:
                        scheduleData?.getScheduleForMobile[
                          scheduleData?.getScheduleForMobile.length - 1
                        ]._id === schedule?._id
                          ? "white"
                          : "#3c6efb",
                    }}
                  />
                </View>

                <View
                  style={[
                    ScheduleStyle.ScheduleBodyContentContainerBox,
                    {
                      backgroundColor: "#6862C2",
                      // index % 3 === 0
                      //   ? "#EC2777"
                      //   : index % 3 === 1
                      //   ? "#6862C2"
                      //   : "#F0822B",
                    },
                  ]}
                >
                  <View style={ScheduleStyle.ScheduleBodyTeacherImageContainer}>
                    <Image
                      source={
                        schedule?.day?.teacherProfileImg === ""
                          ? require("../assets/Images/profile.png")
                          : { uri: schedule?.day?.teacherProfileImg }
                      }
                      style={ScheduleStyle.ScheduleTeacherImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={ScheduleStyle.ScheduleBodyDescription}>
                    <Text style={ScheduleStyle.ScheduleBodyDescriptionTitle}>
                      {schedule?.day?.subjectName}
                    </Text>
                    <Text style={ScheduleStyle.ScheduleBodyDescriptionText}>
                      {schedule?.day?.teacherName}
                    </Text>
                  </View>
                </View>
              </Animatable.View>
            )
        )}
        <View></View>
      </ScrollView>
    </View>
  );
}
