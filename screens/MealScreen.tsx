import moment from "moment";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MealScreenStyle from "../Styles/MealScreen.scss";
import { useQuery } from "@apollo/client";
import { GET_TAKEMEALATTENDANCEMOBILEREPORT } from "../graphql/GetTakeMealAttendanceMobileReport";
import { useLocation } from "react-router-native";
import { ScrollView } from "react-native-gesture-handler";

const weekdays = [
  moment().startOf("isoWeek").add(0, "days"),
  moment().startOf("isoWeek").add(1, "days"),
  moment().startOf("isoWeek").add(2, "days"),
  moment().startOf("isoWeek").add(3, "days"),
  moment().startOf("isoWeek").add(4, "days"),
  moment().startOf("isoWeek").add(5, "days"),
  moment().startOf("isoWeek").add(6, "days"),
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsInKhmer = [
  "មករា",
  "កុម្ភៈ",
  "មិនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆកា",
  "ធ្នូ",
];

const monthsNumber = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export default function MealScreen() {
  const location = useLocation();
  const stuInfo = location.state.stuInfo;

  const [loadingCalendar, setloadingCalendar] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(String);
  let currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    new Date().getMonth()
  );

  // ======================== GET CURRENT ALL DAYS IN CURRENT MONTH =============
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  // ======================== GET WEEKDAY ================================
  const allDays: Date[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonthIndex, day);
    allDays.push(date);
  }

  // ======================== Minus and Add a month ================================
  const MinusCurrentMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(currentMonthIndex + 11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const AddCurrentMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  // ======================== SET CURRENTMONTH ================================
  useEffect(() => {
    setCurrentMonth(months[currentMonthIndex]);
  }, [currentMonthIndex]);

  // ======================== QUERY =======================

  const { data, refetch, error } = useQuery(
    GET_TAKEMEALATTENDANCEMOBILEREPORT,
    {
      variables: {
        studentId: stuInfo?._id,
        month: monthsNumber[currentMonthIndex],
        year: currentYear.toString(),
      },
      onCompleted: ({ getTakeMealAttendanceMobileReport }) => {
        // console.log(
        //   "getTakeMealAttendanceMobileReport",
        //   getTakeMealAttendanceMobileReport
        // );
      },
      onError(error) {
        // console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [currentMonthIndex, currentYear, stuInfo?._id]);

  // ======================== QUERY =======================
  const [sortMonthdays, setSortedMonthdays] = useState([
    { dayName: "", dayNumber: 0, status: "" },
  ]);

  const [getIndexWeekday, setGetIndexWeekday] = useState(0);

  useEffect(() => {
    async function fetchingDay() {
      let newMonthdays: { dayName: any; dayNumber: any; status: string }[] = [
        { dayName: "", dayNumber: 0, status: "" },
      ];
      //==== Loop Week ======
      weekdays.map((weekday: any, indexWeek: number) => {
        //===== Loop day of month ========
        allDays.map((day: any, indexDay: number) => {
          //============ True
          if (moment(weekday).format("dddd") === moment(day).format("dddd")) {
            data?.getTakeMealAttendanceMobileReport?.map(
              (item: any, index: number) => {
                if (
                  moment(item.day).format("D") === moment(day).format("D") &&
                  moment(item.day).format("MM") === moment(day).format("MM")
                ) {
                  if (moment(day).format("Do") === "1st" && indexDay === 0) {
                    setGetIndexWeekday(indexWeek + 1);
                  }

                  newMonthdays.push({
                    dayName: moment(weekday).format("dddd"),
                    dayNumber: parseInt(moment(day).format("D"), 10),
                    status: item.status === false ? "false" : "true",
                  });
                }
              }
            );
          }
        });
      });

      setSortedMonthdays(
        newMonthdays.sort((a, b) => a.dayNumber - b.dayNumber)
      );
    }
    fetchingDay();
    setTimeout(() => {
      setloadingCalendar(false);
    }, 500);
  }, [
    currentMonthIndex,
    currentYear,
    stuInfo?._id,
    data?.getTakeMealAttendanceMobileReport,
  ]);

  return (
    <View style={MealScreenStyle.MealScreenContainer}>
      <View style={MealScreenStyle.MealScreenTopImageContainer}>
        <Image
          source={require("../assets/Images/4246838-01.png")}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View style={MealScreenStyle.MealScreenTopButtonContainer}>
        <TouchableOpacity
          style={MealScreenStyle.MealScreenMonthButtonContainer}
          onPress={() => {
            setloadingCalendar(true);
            MinusCurrentMonth();
          }}
        >
          <Image
            source={require("../assets/Images/left.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <Text style={MealScreenStyle.MealScreenMonthTitle}>
          {currentMonth + ", " + currentYear}
        </Text>
        <TouchableOpacity
          style={MealScreenStyle.MealScreenMonthButtonContainer}
          onPress={() => {
            setloadingCalendar(true);
            AddCurrentMonth();
          }}
        >
          <Image
            source={require("../assets/Images/next.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>

      {loadingCalendar ? (
        <View
          style={{
            width: "100%",
            height: "60%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={MealScreenStyle.MealScreenCalendarContainer}>
          {weekdays ? (
            <View style={MealScreenStyle.MealScreenCalendarTaskContainer}>
              {weekdays.map((weekday: any, index: number) => (
                <View key={index} style={{ width: "10%" }}>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={MealScreenStyle.MealScreenMonthBodyText}>
                      {moment(weekday).format("dd")}
                    </Text>
                    {sortMonthdays?.map((day: any, i: number) =>
                      day.dayName === moment(weekday).format("dddd") ? (
                        <View
                          key={i}
                          style={[
                            MealScreenStyle.MealScreenCalendarRowContainer,
                            {
                              backgroundColor:
                                day.status === "true" ? "#F7F8FE" : "white",
                              borderBottomWidth: day.status === "true" ? 2 : 0,
                              borderColor: "#3c6efb",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              MealScreenStyle.MealScreenMonthBodyText,
                              {
                                color:
                                  day.status === "true" ? "#3c6efb" : "black",
                              },
                            ]}
                          >
                            {day.dayNumber}
                          </Text>
                        </View>
                      ) : index + 1 === day.dayNumber && i < getIndexWeekday ? (
                        <View
                          key={i}
                          style={MealScreenStyle.MealScreenCalendarRowContainer}
                        ></View>
                      ) : null
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}
      <View
        style={{
          width: "90%",
          height: "5%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Text style={MealScreenStyle.MealScreenMonthTitle}>សម្គាល់</Text>
      </View>
      <View
        style={{
          width: "90%",
          height: "10%",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View
          style={[
            MealScreenStyle.MealScreenCalendarExamRowContainer,
            {
              backgroundColor: "#F7F8FE",
              borderBottomWidth: 2,
              borderColor: "#3c6efb",
            },
          ]}
        >
          <Image
            source={require("../assets/Images/one.png")}
            style={{ width: 12, height: 12 }}
          />
        </View>
        <Text style={MealScreenStyle.MealScreenMonthBodyText}>បានញ៉ាំ</Text>
      </View>
    </View>
  );
}
