import { Image, ScrollView, Text, View } from "react-native";
import CalendarStyle from "../Styles/CalendarScreen.scss";
import { useQuery } from "@apollo/client";
import { GET_ACADEMICYEAR_PAGINATION } from "../graphql/Get_AcademicCalendarPagination";
import { useEffect } from "react";
import HomeStyle from "../Styles/HomeScreen.scss";
import { getLanguage } from "react-multi-lang";
import moment from "moment";

export default function CalendarScreen() {
  const { data, refetch } = useQuery(GET_ACADEMICYEAR_PAGINATION, {
    pollInterval: 2000,
    variables: {
      page: 1,
      limit: 100,
      lg: "KH",
      academicYearId: "64af61a9d55dd0f4efdb9962",
      keyword: "",
    },

    onCompleted: ({ getAcademicCalendarPagination }) => {
      // console.log(
      //   getAcademicCalendarPagination,
      //   "getAcademicCalendarPagination"
      // );
    },
    onError: async (error) => {
      console.log(error.message, "Error getAcademicCalendarPagination");
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View style={CalendarStyle.CalendarContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View style={HomeStyle.titleBarHome}>
          <Image
            source={require("../assets/Images/upcoming.png")}
            style={{ height: 20, width: 20 }}
          />
          <Text style={HomeStyle.fontTitleBarHome}>
            {getLanguage() === "en" ? "UPCOMING" : "ព្រឺត្តិការណ៏ថ្មីៗ"}
          </Text>
          <View style={HomeStyle.homeBar} />
        </View>
        {data?.getAcademicCalendarPagination?.data.map(
          (academic: any, index: number) => (
            <View style={CalendarStyle.upcomingcardCalendar} key={index}>
              <View
                style={
                  index % 3 === 0
                    ? HomeStyle.homeUpcomingEventStyleBox1
                    : index % 3 === 1
                    ? HomeStyle.homeUpcomingEventStyleBox2
                    : HomeStyle.homeUpcomingEventStyleBox3
                }
              >
                <View style={HomeStyle.homeUpcominginSideViewContainer}>
                  <View style={HomeStyle.homeUpcomingPillar} />
                  <View style={HomeStyle.homeUpcominginSideViewContainer2}>
                    <Text style={HomeStyle.homeUpcomingTitle}>
                      {academic?.title}
                    </Text>
                    <Text style={HomeStyle.homeUpcomingBody}>
                      {moment(academic?.from).format("YYYY-MM-DD")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
