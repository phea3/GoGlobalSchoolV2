import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import moment from "moment";
import EYSReportStyle from "../Styles/EYSReportScreen.scss";
import { getLanguage, useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

const DateScreen = ({ date, onSelectDate, selected }: any) => {
  /**
   * use moment to compare the date to today
   * if today, show 'Today'
   * if not today, show day of the week e.g 'Mon', 'Tue', 'Wed'
   */
  const t = useTranslation();
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? t("Today")
      : moment(date).format("dddd");
  // get the day number e.g 1, 2, 3, 4, 5, 6, 7
  const dayNumber = moment(date).format("D");

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format("YYYY-MM-DD");

  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[
        EYSReportStyle.DateScreenCard,
        {
          backgroundColor: selected === fullDate ? "#3c6efb" : "#fff",
          height: moderateScale(80),
          width: moderateScale(60),
          marginRight: moderateScale(10),
          borderRadius: moderateScale(20),
          borderWidth: moderateScale(0.5),
        },
      ]}
    >
      <View
        style={[
          EYSReportStyle.DateScreenCardBarTop,
          {
            backgroundColor: selected === fullDate ? "#ffffff" : "forestgreen",
            height: moderateScale(4),
            borderBottomRightRadius: moderateScale(30),
            borderBottomLeftRadius: moderateScale(30),
          },
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
              fontSize: moderateScale(16),
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
    fontSize: moderateScale(10),
  },
  medium: {
    fontFamily: "Kantumruy-Bold",
    fontSize: moderateScale(16),
  },
});
