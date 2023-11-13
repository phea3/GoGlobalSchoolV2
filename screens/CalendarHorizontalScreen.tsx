import { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import moment from "moment";
import DateScreen from "./DateScreen";
import EYSReportStyle from "../Styles/EYSReportScreen.scss";

export default function CalendarHorizontalScreen({
  onSelectDate,
  selected,
}: any) {
  const [dates, setDates] = useState([""]);
  const [scrollPosition, setScrollPosition] = useState(0);
  // const [currentMonth, setCurrentMonth] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // get the dates from today to 10 days from now, format them as strings and store them in state
  const getDates = () => {
    const Dates: any[] = [];
    for (let i = 0; i < 7; i++) {
      const date = moment(currentWeek).add(i, "days");
      Dates.push(date);
    }
    setDates(Dates);
  };

  const addWeek = () => {
    const newDate = new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    setCurrentWeek(newDate);
  };

  const subtractWeek = () => {
    const newDate = new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    setCurrentWeek(newDate);
  };

  useEffect(() => {
    getDates();
  }, [currentWeek]);

  // const getCurrentMonth = () => {
  //   const month = moment(dates[0])
  //     .add(scrollPosition / 60, "days")
  //     .format("MMMM, Do YYYY");
  //   setCurrentMonth(month);
  // };

  const getFirstDayofWeek = () => {
    let dateFirst = new Date(currentWeek);
    let dayNum = dateFirst.getDay(); // 😊  get day of week
    let diffFirst = dateFirst.getDate() - dayNum + 1;
    let date = new Date(dateFirst.setDate(diffFirst));
    onSelectDate(moment(date).format("YYYY-MM-DD"));
  };

  useEffect(() => {
    getFirstDayofWeek();
  }, [currentWeek]);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "space-evenly",
      }}
    >
      <View style={EYSReportStyle.CalendarHorizontalScrollviewcentered}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Kantumruy-Bold",
          }}
        >
          {moment(selected).format("MMMM, Do YYYY")}
        </Text>
      </View>
      <View style={EYSReportStyle.CalendarHorizontalScrollviewDateweeklystyle}>
        <View style={EYSReportStyle.CalendarHorizontalIconArrowContainer}>
          <TouchableOpacity
            style={EYSReportStyle.CalendarHorizontalIconArrowStyle}
            onPress={subtractWeek}
          >
            <Image
              source={require("../assets/Images/left.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => setScrollPosition(e.nativeEvent.contentOffset.x)}
          style={{ flex: 1 }}
        >
          {dates.map((date, index) => (
            <DateScreen
              key={index}
              date={date}
              onSelectDate={onSelectDate}
              selected={selected}
            />
          ))}
        </ScrollView>
        <View style={EYSReportStyle.CalendarHorizontalIconArrowContainer}>
          <TouchableOpacity
            style={EYSReportStyle.CalendarHorizontalIconArrowStyle}
            onPress={addWeek}
          >
            <Image
              source={require("../assets/Images/next.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
