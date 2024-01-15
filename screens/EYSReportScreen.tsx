import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import EYSReportStyle from "../Styles/EYSReportScreen.scss";
import { useEffect, useState } from "react";
import CalendarHorizontalScreen from "./CalendarHorizontalScreen";
import { useQuery } from "@apollo/client";
import { GET_EYE_REPORT } from "../graphql/GetEYSReportByStu";
import { useLocation } from "react-router-native";
import moment from "moment";
import Checkbox from "expo-checkbox";
import { getLanguage, useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

const TabView = [
  {
    tilte: "Food",
  },
  {
    tilte: "Activities",
  },
  {
    tilte: "Health",
  },
  {
    tilte: "Materials",
  },
];

export default function EYSReportScreen() {
  const today = moment(new Date()).format("YYYY-MM-DD");
  const [tabActive, setTabActive] = useState("Food");
  const [selectedDate, setSelectedDate] = useState(today);
  const location = useLocation();
  const uid = location.state;
  const t = useTranslation();

  const { data, refetch } = useQuery(GET_EYE_REPORT, {
    pollInterval: 2000,
    variables: {
      stuId: uid ? uid : "",
      date: selectedDate,
    },
    onCompleted: ({ getEYSReportByStu }) => {},
    onError(error) {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [uid, selectedDate]);

  return (
    <View style={EYSReportStyle.EYSContainer}>
      <View
        style={[
          EYSReportStyle.EYSTopContainer,
          {
            padding: moderateScale(10),
            borderRadius: moderateScale(40),
            borderWidth: moderateScale(0.5),
          },
        ]}
      >
        <CalendarHorizontalScreen
          onSelectDate={setSelectedDate}
          selected={selectedDate}
        />
      </View>
      <View style={EYSReportStyle.EYSTapViewContainer}>
        {TabView.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              EYSReportStyle.EYSTapViewEachTabContainer,
              {
                backgroundColor: tabActive === tab.tilte ? "#3c6efb" : "#fff",
                borderWidth: moderateScale(0.5),
                borderRadius: moderateScale(25),
              },
            ]}
            onPress={() => {
              setTabActive(tab.tilte);
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                EYSReportStyle.EYSTapViewEachTabTitleText,
                {
                  color: tabActive === tab.tilte ? "#ffffff" : "#000",
                  fontSize: moderateScale(14),
                },
              ]}
            >
              {t(tab.tilte)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={EYSReportStyle.EYSBodyContainer}>
        <ScrollView
          style={{ width: "100%", height: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {tabActive === "Food" ? (
            <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
              {data?.getEYSReportByStu?.food.map((row: any, index: number) => (
                <View
                  key={index}
                  style={EYSReportStyle.EYSInsideScrollviewFoodContainer}
                >
                  <View style={EYSReportStyle.EYSInsideScrollviewFoodPillar} />
                  <View
                    style={EYSReportStyle.EYSInsideCardFoodContentContainer}
                  >
                    <View
                      style={
                        EYSReportStyle.EYSInsideScrollviewFoodiconStyleContainer
                      }
                    >
                      <View
                        style={
                          EYSReportStyle.EYSInsideScrollviewFoodiconStyleCircleBackground
                        }
                      />
                      <Image
                        source={{ uri: row?.iconsrc }}
                        style={EYSReportStyle.EYSInsideScrollviewFoodiconStyle}
                      />
                    </View>

                    <View
                      style={
                        EYSReportStyle.EYSInsideScrollviewFoodContentContainer
                      }
                    >
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodtitleStyle}
                      >
                        {row?.title}
                      </Text>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodbodyStyle}
                      >
                        Description:{" "}
                        {row?.description === "" ? "-:-" : row?.description}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../assets/Images/cycle-counting.png")}
                          style={{ width: 20, height: 20, marginRight: 10 }}
                        />

                        <View
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodFootStyleContainer
                          }
                        >
                          <Text
                            style={[
                              EYSReportStyle.EYSInsideScrollviewFoodbodyStyle,
                              { color: "#ffffff" },
                            ]}
                          >
                            {row?.qty} ដង/times
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : tabActive === "Activities" ? (
            <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
              {data?.getEYSReportByStu?.activities.map(
                (row: any, index: number) => (
                  <View
                    key={index}
                    style={EYSReportStyle.EYSInsideScrollviewFoodContainer}
                  >
                    <View
                      style={EYSReportStyle.EYSInsideScrollviewFoodPillar}
                    />
                    <View
                      style={EYSReportStyle.EYSInsideCardFoodContentContainer}
                    >
                      <View
                        style={
                          EYSReportStyle.EYSInsideScrollviewFoodiconStyleContainer
                        }
                      >
                        <View
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodiconStyleCircleBackground
                          }
                        />
                        <Image
                          source={{ uri: row?.iconsrc }}
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodiconStyle
                          }
                        />
                      </View>

                      <View
                        style={
                          EYSReportStyle.EYSInsideScrollviewFoodContentContainer
                        }
                      >
                        <Text
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodtitleStyle
                          }
                        >
                          {row?.title}
                        </Text>
                        <Text
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodbodyStyle
                          }
                        >
                          Description:{" "}
                          {row?.description === "" ? "-:-" : row?.description}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../assets/Images/cycle-counting.png")}
                            style={{ width: 20, height: 20, marginRight: 10 }}
                          />

                          <View
                            style={
                              EYSReportStyle.EYSInsideScrollviewFoodFootStyleContainer
                            }
                          >
                            <Text
                              style={[
                                EYSReportStyle.EYSInsideScrollviewFoodbodyStyle,
                                { color: "#ffffff" },
                              ]}
                            >
                              {row?.qty} ដង/times
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              )}
            </View>
          ) : tabActive === "Health" ? (
            <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
              <View style={EYSReportStyle.EYSInsideScrollviewFoodContainer}>
                <View style={EYSReportStyle.EYSInsideScrollviewFoodPillar} />
                <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
                  <View style={EYSReportStyle.EYSHealthContainer}>
                    <View
                      style={
                        EYSReportStyle.EYSInsideScrollviewFoodiconStyleContainer
                      }
                    >
                      <Image
                        source={require("../assets/Images/Home.jpg")}
                        style={EYSReportStyle.EYSInsideScrollviewFoodiconStyle}
                      />
                    </View>
                    <View style={EYSReportStyle.EYSHealthRightContainer}>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodtitleStyle}
                      >
                        នៅផ្ទះ/At home
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodbodyStyle
                          }
                        >
                          ធម្មតា/Normal:{" "}
                        </Text>
                        <Checkbox
                          // disabled
                          value={data?.getEYSReportByStu?.parentsCheck?.title}
                        />
                      </View>

                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodbodyStyle}
                      >
                        ផ្សេងៗ/Other:{" "}
                        {data?.getEYSReportByStu?.parentsCheck?.description}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={EYSReportStyle.EYSInsideScrollviewFoodContainer}>
                <View style={EYSReportStyle.EYSInsideScrollviewFoodPillar} />
                <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
                  <View style={EYSReportStyle.EYSHealthContainer}>
                    <View
                      style={
                        EYSReportStyle.EYSInsideScrollviewFoodiconStyleContainer
                      }
                    >
                      <Image
                        source={require("../assets/Images/parents.png")}
                        style={EYSReportStyle.EYSInsideScrollviewFoodiconStyle}
                      />
                    </View>
                    <View style={EYSReportStyle.EYSHealthRightContainer}>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodtitleStyle}
                      >
                        មតិមាតាបិតា/Parents comment
                      </Text>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodbodyStyle}
                      >
                        {data?.getEYSReportByStu?.parentsComment}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={EYSReportStyle.EYSInsideScrollviewFoodContainer}>
                <View style={EYSReportStyle.EYSInsideScrollviewFoodPillar} />
                <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
                  <View style={EYSReportStyle.EYSHealthContainer}>
                    <View
                      style={
                        EYSReportStyle.EYSInsideScrollviewFoodiconStyleContainer
                      }
                    >
                      <Image
                        source={require("../assets/Images/school.png")}
                        style={EYSReportStyle.EYSInsideScrollviewFoodiconStyle}
                      />
                    </View>
                    <View style={EYSReportStyle.EYSHealthRightContainer}>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodtitleStyle}
                      >
                        នៅសាលា/At school
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodbodyStyle
                          }
                        >
                          ធម្មតា/Normal:{" "}
                        </Text>
                        <Checkbox
                          // disabled
                          value={data?.getEYSReportByStu?.atSchool?.title}
                        />
                      </View>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodbodyStyle}
                      >
                        ផ្សេងៗ/Other:{" "}
                        {data?.getEYSReportByStu?.atSchool?.description}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={EYSReportStyle.EYSInsideScrollviewFoodContainer}>
                <View style={EYSReportStyle.EYSInsideScrollviewFoodPillar} />
                <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
                  <View style={EYSReportStyle.EYSHealthContainer}>
                    <View
                      style={
                        EYSReportStyle.EYSInsideScrollviewFoodiconStyleContainer
                      }
                    >
                      <Image
                        source={require("../assets/Images/nurse.png")}
                        style={EYSReportStyle.EYSInsideScrollviewFoodiconStyle}
                      />
                    </View>
                    <View style={EYSReportStyle.EYSHealthRightContainer}>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodtitleStyle}
                      >
                        មតិពេទ្យ/Nurse comment
                      </Text>
                      <Text
                        style={EYSReportStyle.EYSInsideScrollviewFoodbodyStyle}
                      >
                        {data?.getEYSReportByStu?.nurseComment}{" "}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={EYSReportStyle.EYSInsideScrollviewFoodContainer}>
              <View style={EYSReportStyle.EYSInsideScrollviewFoodPillar} />
              <View style={EYSReportStyle.EYSInsideScrollviewContainer}>
                <View style={EYSReportStyle.EYSStuffsContainer}>
                  <Text
                    style={EYSReportStyle.EYSInsideScrollviewFoodtitleStyle}
                  >
                    សូមមាតាបិតាជួយដាក់បន្ថែម ឪ្យកូន៖
                  </Text>
                  {data?.getEYSReportByStu?.parentsRequest.map(
                    (item: string, index: number) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../assets/Images/black-circle.png")}
                          style={{ width: 10, height: 10, marginRight: 10 }}
                        />
                        <Text
                          style={
                            EYSReportStyle.EYSInsideScrollviewFoodbodyStyle
                          }
                        >
                          {item}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
