import { Image, ScrollView, Text, View } from "react-native";
import CalendarStyle from "../Styles/CalendarScreen.scss";
import { useQuery } from "@apollo/client";
import { GET_ACADEMICYEAR_PAGINATION } from "../graphql/Get_AcademicCalendarPagination";
import { useEffect, useState } from "react";
import HomeStyle from "../Styles/HomeScreen.scss";
import { getLanguage, useTranslation } from "react-multi-lang";
import moment from "moment";
import { moderateScale } from "../ Metrics";

export default function CalendarScreen() {
  const t = useTranslation();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  return (
    <View style={CalendarStyle.CalendarContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View style={[HomeStyle.titleBarHome, { height: moderateScale(50) }]}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/upcoming.png")}
                style={{ height: moderateScale(20), width: moderateScale(20) }}
              />
              <Text
                style={[
                  HomeStyle.fontTitleBarHome,
                  {
                    fontSize: moderateScale(14),
                    paddingHorizontal: moderateScale(10),
                  },
                ]}
              >
                {getLanguage() === "en"
                  ? "UPCOMING NEWS"
                  : "ព្រឺត្តិការណ៏ថ្មីៗ"}
              </Text>
              <View style={[HomeStyle.homeBar, { height: moderateScale(2) }]} />
            </>
          )}
        </View>
        {data === undefined ||
        data?.getAcademicCalendarPagination?.data.length === 0 ? (
          <View style={HomeStyle.upcomingcardhome}>
            <View
              style={[
                HomeStyle.homeUpcomingEventStyleBoxEmpty,
                { marginVertical: moderateScale(5) },
              ]}
            >
              <View style={HomeStyle.homeUpcominginSideViewContainer}>
                <View style={HomeStyle.homeUpcomingPillarEmpty} />
                <View style={HomeStyle.homeUpcominginSideViewContainer2}>
                  <Text
                    style={[
                      HomeStyle.homeUpcomingTitleEmpty,
                      {
                        fontSize: moderateScale(14),
                        height: moderateScale(50),
                      },
                    ]}
                  >
                    {" "}
                  </Text>
                  <Text style={HomeStyle.homeUpcomingBody}> </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          data?.getAcademicCalendarPagination?.data.map(
            (event: any, index: number) =>
              loading === true ? (
                <View style={HomeStyle.upcomingcardhome} key={index}>
                  <View
                    style={[
                      HomeStyle.homeUpcomingEventStyleBoxEmpty,
                      {
                        marginTop: moderateScale(5),
                        marginBottom: moderateScale(5),
                      },
                    ]}
                  >
                    <View
                      style={[
                        HomeStyle.homeUpcominginSideViewContainer,
                        {
                          padding: moderateScale(15),
                        },
                      ]}
                    >
                      <View
                        style={[
                          HomeStyle.homeUpcomingPillarEmpty,
                          { width: moderateScale(2) },
                        ]}
                      />
                      <View style={HomeStyle.homeUpcominginSideViewContainer2}>
                        <Text style={HomeStyle.homeUpcomingTitleEmpty}> </Text>
                        <Text style={HomeStyle.homeUpcomingBody}> </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={HomeStyle.upcomingcardhome} key={index}>
                  <View
                    style={[
                      index % 3 === 0
                        ? HomeStyle.homeUpcomingEventStyleBox1
                        : index % 3 === 1
                        ? HomeStyle.homeUpcomingEventStyleBox2
                        : HomeStyle.homeUpcomingEventStyleBox3,
                      {
                        marginTop: moderateScale(5),
                        marginBottom: moderateScale(5),
                      },
                    ]}
                  >
                    <View
                      style={[
                        HomeStyle.homeUpcominginSideViewContainer,
                        { padding: moderateScale(15) },
                      ]}
                    >
                      <View
                        style={[
                          HomeStyle.homeUpcomingPillar,
                          { width: moderateScale(2) },
                        ]}
                      />
                      <View
                        style={[
                          HomeStyle.homeUpcominginSideViewContainer2,
                          { left: moderateScale(10) },
                        ]}
                      >
                        <Text
                          style={[
                            HomeStyle.homeUpcomingTitle,
                            { fontSize: moderateScale(14) },
                          ]}
                        >
                          {event?.title}
                        </Text>
                        <Text
                          style={[
                            HomeStyle.homeUpcomingBody,
                            { fontSize: moderateScale(12) },
                          ]}
                        >
                          {moment(event?.from).format("DD-MM-YYYY")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
          )
        )}
      </ScrollView>
    </View>
  );
}
