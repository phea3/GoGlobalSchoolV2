import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import moment from "moment";
import EYSReportStyle from "../Styles/EYSReportScreen.scss";

const DateScreen = ({ date, onSelectDate, selected }: any) => {
  /**
   * use moment to compare the date to today
   * if today, show 'Today'
   * if not today, show day of the week e.g 'Mon', 'Tue', 'Wed'
   */
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "Today"
      : moment(date).format("ddd");
  // get the day number e.g 1, 2, 3, 4, 5, 6, 7
  const dayNumber = moment(date).format("D");

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format("YYYY-MM-DD");
  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[
        EYSReportStyle.DateScreenCard,
        selected === fullDate && { backgroundColor: "#3c6efb" },
      ]}
    >
      <View
        style={[
          EYSReportStyle.DateScreenCardBarTop,
          selected === fullDate && { backgroundColor: "#ffffff" },
        ]}
      />
      <View style={EYSReportStyle.DateScreenCardContentBody}>
        <Text style={[styles.big, selected === fullDate && { color: "#fff" }]}>
          {day}
        </Text>
        <Text
          style={[
            styles.medium,
            selected === fullDate && {
              color: "#fff",
              fontFamily: "Kantumruy-Bold",
              fontSize: 16,
            },
          ]}
        >
          {dayNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DateScreen;

const styles = StyleSheet.create({
  big: {
    fontFamily: "Kantumruy-Regular",
    color: "#9aa3a6",
    fontSize: 10,
  },
  medium: {
    fontFamily: "Kantumruy-Bold",
    fontSize: 16,
  },
});
