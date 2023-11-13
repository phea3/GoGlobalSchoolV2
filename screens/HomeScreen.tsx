import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import HomeStyle from "../Styles/HomeScreen.scss";
import { useNavigate } from "react-router-native";
import { getLanguage, useTranslation } from "react-multi-lang";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_STUDENT } from "../graphql/get_studentByParent";
import { AuthContext } from "../Context/AuthContext";
import { QUERY_ANNOUNCEMENT } from "../graphql/gql_announcement";
import * as Animatable from "react-native-animatable";
import ModalPickup from "../components/home/ModalPickup";
import ModalTakeLeave from "../components/home/ModalTakeLeave";
import { GET_UPCOMINGEVENT } from "../graphql/GetUpcomingEventMobile";
import ModalEYS from "../components/home/ModalEYS";
import ModalHealth from "../components/health/ModalHealth";

const features = [
  {
    title: "PICKUP",
    icon: require("../assets/Images/father.png"),
    action: "",
    modal: true,
  },
  {
    title: "TAKE LEAVE",
    icon: require("../assets/Images/pencil.png"),
    action: "permission",
    modal: true,
  },
  {
    title: "HEALTH EYS",
    icon: require("../assets/Images/healthcare.png"),
    action: "health",
    modal: true,
  },
];

const explore = [
  {
    title: "SCHEDULE",
    icon: require("../assets/Images/project.png"),
    naviage: "/schedule",
    modal: true,
  },
  {
    title: "EYS",
    icon: require("../assets/Images/baby.png"),
    naviage: "/eys",
    modal: true,
  },
  {
    title: "ATTENDANCE",
    icon: require("../assets/Images/check-mark.png"),
    naviage: "/attendance",
    modal: true,
  },
  {
    title: "LEAVE",
    icon: require("../assets/Images/file1.png"),
    naviage: "/viewleave",
    modal: true,
  },
  {
    title: "MEAL",
    icon: require("../assets/Images/meal.png"),
    naviage: "/meal",
    modal: true,
  },
  {
    title: "PAYMENT",
    icon: require("../assets/Images/dollar.png"),
    naviage: "/payment",
    modal: false,
  },
  {
    title: "CALENDAR",
    icon: require("../assets/Images/calendar1.png"),
    naviage: "/calendar",
    modal: false,
  },
];

const numbers = Array.from({ length: 3 }, (_, index) => index);

const HomeScreen = () => {
  const navigate = useNavigate();
  const { uid } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);

  const [duty, setDuty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [StuInfo, setStuInfo] = useState({});
  const t = useTranslation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModal1 = () => {
    setModalVisible1(!isModalVisible1);
  };

  //============== Modal Pick ==============
  const [visibleTakeLeave, setVisibleTakeLeave] = useState(false);
  const toggleModalOpenLeave = () => {
    setVisibleTakeLeave(true);
  };
  const toggleModalCloseLeave = () => {
    setVisibleTakeLeave(false);
  };

  //================== Modal EYS ================
  const [eys, setEys] = useState("");
  const [isEYSModalVisible, setEYSModalVisible] = useState(false);

  //================== Modal Health ======================
  const [health, setHealth] = useState("");
  const [isHealthVisible, setHealthModalVisible] = useState(false);

  const openHealthModal = () => {
    setHealthModalVisible(true);
    setHealth("health");
  };

  const closeHealthModal = () => {
    setHealthModalVisible(false);
    setHealth("");
  };

  const openEYSModal = () => {
    setEYSModalVisible(true);
    setEys("eys");
  };
  const closeEYSModal = () => {
    setEYSModalVisible(false);
    setEys("");
  };

  const autoNavigateLeaveScreen = () => {
    navigate("/leave", {
      state: { stuInfo: StuInfo, uid: uid },
    });
  };
  //============== Modal Pickup ============
  const [visiblePickup, setVisiblePickup] = useState(false);
  const toggleModalOpenPickup = () => {
    setVisiblePickup(true);
  };
  const toggleModalClosePickup = () => {
    setVisiblePickup(false);
  };

  //================ GET STUDENT ===============
  const { data, refetch } = useQuery(GET_STUDENT, {
    pollInterval: 2000,
    variables: {
      parentsId: uid,
    },
    onCompleted: ({}) => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    },
    onError: ({}) => {
      setLoading(true);
    },
  });

  //================ GET UPCOMINGEVENT ===============
  const { data: eventData, refetch: eventRefetch } = useQuery(
    GET_UPCOMINGEVENT,
    {
      pollInterval: 2000,
      onCompleted: ({}) => {},
      onError: ({}) => {},
    }
  );
  //============= FUNCTION GET ANNOUMENT ================
  const [announces, setAnnounces] = useState([]);

  const { refetch: announceRefetch } = useQuery(QUERY_ANNOUNCEMENT, {
    pollInterval: 2000,
    variables: {
      page: 1,
      limit: 3,
      from: "",
      to: "",
      keyword: "",
      publish: true,
    },
    onCompleted: ({ getAnnouncementsPagination }) => {
      setAnnounces(getAnnouncementsPagination?.data);
    },
  });

  useEffect(() => {
    announceRefetch();
  }, []);

  useEffect(() => {
    refetch();
  }, [uid]);

  //============= FUNCTION CHECK CONDITIONS ================
  const ConditionsOfStudentFeatures = (stuInfo: any) => {
    switch (duty) {
      case "TAKE LEAVE":
        toggleModal();
        toggleModalOpenLeave();
        setStuInfo(stuInfo);
        break;
      case "ATTENDANCE":
        navigate("/attendance", { state: stuInfo?._id });
        break;
      case "PAYMENT":
        navigate("/payment", { state: stuInfo?._id });
        break;
      case "PICKUP":
        toggleModal();
        toggleModalOpenPickup();
        break;
      case "LEAVE":
        navigate("/leave", {
          state: { stuInfo: stuInfo, uid: uid },
        });
        break;
      case "MEAL":
        navigate("/meal", {
          state: { stuInfo: stuInfo, uid: uid },
        });
        break;
      case "SCHEDULE":
        navigate("/schedule", {
          state: { stuInfo: stuInfo, uid: uid },
        });

        break;
      case "EYS":
        toggleModal();
        openEYSModal();
        break;
      case "HEALTH EYS":
        toggleModal();
        openHealthModal();
        break;
      default:
        break;
    }
  };

  return (
    <View style={HomeStyle.homeContainer}>
      <Modal
        visible={isModalVisible}
        animationType="none"
        onRequestClose={toggleModal}
        transparent={true}
      >
        <View style={HomeStyle.homeModalStyle}>
          <TouchableOpacity
            style={HomeStyle.homeModalStyle1}
            onPress={() => toggleModal()}
          />
          <View style={HomeStyle.modalinsideStyle}>
            <Text style={HomeStyle.homeModalTitle}>{duty}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {data?.getStudentByParentsMobile.length === 0 ? (
                <View style={HomeStyle.imageBox}>
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#f1f1f1",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Kantumruy-Bold",
                        fontSize: 15,
                        color: "#9AA3A6",
                      }}
                    >
                      មិនមាន{"\n"}ទិន្នន័យ
                    </Text>
                  </View>
                </View>
              ) : (
                data?.getStudentByParentsMobile?.map((stuInfo: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      setStudentId(stuInfo?._id);
                      ConditionsOfStudentFeatures(stuInfo);
                    }}
                    key={stuInfo?._id}
                    style={HomeStyle.imageBox}
                  >
                    <View style={HomeStyle.homeImageBorderWidthStyle}>
                      <Animatable.Image
                        source={{
                          uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
                        }}
                        style={HomeStyle.imageHome}
                        resizeMode="cover"
                        animation="zoomIn"
                      />
                    </View>
                    <Text style={HomeStyle.studentProfileName}>
                      {stuInfo?.lastName + " " + stuInfo?.firstName}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =========== MODAL LEAVE REQUEST ============= */}
      <ModalTakeLeave
        studentId={studentId}
        isVisible={visibleTakeLeave}
        handleClose={toggleModalCloseLeave}
        autoNavLeaveScreen={autoNavigateLeaveScreen}
      />

      {/*  ============ PICK UP MODAL ===============*/}
      <ModalPickup
        studentId={studentId}
        isVisible={visiblePickup}
        handleClose={toggleModalClosePickup}
      />
      {/* ======== EYS MODAL =========*/}
      <ModalEYS
        studentId={studentId}
        isVisible={isEYSModalVisible}
        handleClose={closeEYSModal}
        eys={eys}
        setEys={setEys}
      />

      {/* ======== EYS MODAL =========*/}
      <ModalHealth
        studentId={studentId}
        isVisible={isHealthVisible}
        handleClose={closeHealthModal}
        health={health}
        setHealth={setHealth}
      />

      {/* ================ MAIN VIEW ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View style={HomeStyle.imageGroup}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: "95%" }}
          >
            {data?.getStudentByParentsMobile.length === 0 ? (
              <View style={HomeStyle.imageBox}>
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f1f1f1",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Kantumruy-Bold",
                      fontSize: 15,
                      color: "#9AA3A6",
                    }}
                  >
                    មិនមាន{"\n"}ទិន្នន័យ
                  </Text>
                </View>
              </View>
            ) : (
              data?.getStudentByParentsMobile?.map(
                (stuInfo: any, index: number) =>
                  loading === true ? (
                    <View style={HomeStyle.imageBox} key={index}>
                      <View
                        style={{
                          borderColor: "#3C6EFB",
                          borderWidth: 1,
                          borderRadius: 60,
                          padding: 5,
                        }}
                      >
                        <View
                          style={[
                            HomeStyle.imageHome,
                            {
                              backgroundColor: "#f1f1f1",
                            },
                          ]}
                        />
                      </View>
                      <View
                        style={{
                          width: 120,
                          height: 30,
                          backgroundColor: "#f1f1f1",
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      // onPress={() => navigate("/classes", { state: stuInfo?._id })}
                      key={stuInfo?._id}
                      style={HomeStyle.imageBox}
                    >
                      <View
                        style={{
                          borderColor: "#3C6EFB",
                          borderWidth: 1,
                          borderRadius: 60,
                          padding: 5,
                        }}
                      >
                        <Animatable.Image
                          source={{
                            uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
                          }}
                          style={HomeStyle.imageHome}
                          resizeMode="cover"
                          animation="zoomIn"
                        />
                      </View>
                      <Text style={HomeStyle.studentProfileName}>
                        {stuInfo?.lastName + " " + stuInfo?.firstName}
                      </Text>
                    </TouchableOpacity>
                  )
              )
            )}
          </ScrollView>
        </View>

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
        {eventData?.getUpcomingEventMobile.length === 0 ? (
          <View style={HomeStyle.upcomingcardhome}>
            <View style={HomeStyle.homeUpcomingEventStyleBoxEmpty}>
              <View style={HomeStyle.homeUpcominginSideViewContainer}>
                <View style={HomeStyle.homeUpcomingPillarEmpty} />
                <View style={HomeStyle.homeUpcominginSideViewContainer2}>
                  <Text style={HomeStyle.homeUpcomingTitleEmpty}>
                    មិនមាន ទិន្នន័យ
                  </Text>
                  <Text style={HomeStyle.homeUpcomingBody}>
                    {/* {moment(new Date()).format("DD-MM-YYYY")} */}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          eventData?.getUpcomingEventMobile.map((event: any, index: number) => (
            <View style={HomeStyle.upcomingcardhome} key={index}>
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
                      {event?.title}
                    </Text>
                    <Text style={HomeStyle.homeUpcomingBody}>
                      {moment(event?.from).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={HomeStyle.titleBarHome}>
          <Image
            source={require("../assets/Images/customer-service.png")}
            style={{ height: 20, width: 20 }}
          />
          <Text style={HomeStyle.fontTitleBarHome}>
            {getLanguage() === "en" ? "Feature" : "មុខងារ"}
          </Text>
          <View style={HomeStyle.homeBar} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: "95%" }}
        >
          {features.map((row: any, index: number) => (
            <View style={HomeStyle.explorecontainer} key={index}>
              <TouchableOpacity
                style={HomeStyle.exploreBox}
                onPress={() => {
                  setDuty(row?.title);
                  toggleModal();
                }}
              >
                <Animatable.Image
                  source={row.icon}
                  style={{ height: 30, width: 30 }}
                  animation="bounce"
                />
                <Text style={HomeStyle.exploreTitle}>{row?.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={HomeStyle.titleBarHome}>
          <Image
            source={require("../assets/Images/rocket.png")}
            style={{ height: 20, width: 20 }}
          />
          <Text style={HomeStyle.fontTitleBarHome}>
            {getLanguage() === "en" ? "EXPLORE" : "ស្វែងរក"}
          </Text>
          <View style={HomeStyle.homeBar} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: "95%" }}
        >
          {explore.map((row: any, index: number) => (
            <View style={HomeStyle.explorecontainer} key={index}>
              <TouchableOpacity
                style={HomeStyle.exploreBox}
                onPress={() => {
                  if (row?.modal) {
                    setDuty(row?.title);
                    toggleModal();
                  } else {
                    navigate(row?.naviage);
                  }
                }}
              >
                <Animatable.Image
                  source={row?.icon}
                  style={{ height: 30, width: 30 }}
                  animation="bounce"
                />
                <Text style={HomeStyle.exploreTitle}>{row?.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={HomeStyle.titleBarHome}>
          <Image
            source={require("../assets/Images/megaphone.png")}
            style={{ height: 20, width: 20 }}
          />
          <Text style={HomeStyle.fontTitleBarHome}>
            {getLanguage() === "en" ? "NEWS" : "ដំណឹងថ្មីៗ"}
          </Text>
          <View style={HomeStyle.homeBar} />
        </View>

        <View style={HomeStyle.announceHomeHolderContainer}>
          {announces.length !== 0 ? (
            <View style={HomeStyle.announcementHomeContainer}>
              <Animatable.Image
                source={require("../assets/Images/No-Data-Found.jpeg")}
                style={{ width: "100%", height: "80%", borderRadius: 5 }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <Text style={HomeStyle.announcementHomeTitleEmpty}>
                មិនមាន ទិន្នន័យ
              </Text>
            </View>
          ) : (
            announces.map((announce: any) => (
              <TouchableOpacity
                onPress={() => navigate("/announce", { state: announce })}
                style={HomeStyle.announcementHomeContainer}
                key={announce?._id}
              >
                <Animatable.Image
                  source={{ uri: announce?.coverSrc }}
                  style={{ width: "100%", height: "80%", borderRadius: 5 }}
                  resizeMode="cover"
                  animation="zoomIn"
                />
                <Text style={HomeStyle.announcementHomeTitle}>
                  {announce?.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
