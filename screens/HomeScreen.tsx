import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
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
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { moderateScale } from "../ Metrics";

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
  // {
  //   title: "PAYMENT",
  //   icon: require("../assets/Images/dollar.png"),
  //   naviage: "/payment",
  //   modal: false,
  // },
  {
    title: "CALENDAR",
    icon: require("../assets/Images/calendar1.png"),
    naviage: "/calendar",
    modal: false,
  },
  {
    title: "ANNOUNCEMENT",
    icon: require("../assets/Images/email.png"),
    naviage: "/announcement",
    modal: false,
  },
];

const useOnce = (callback: any) => {
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!hasRun) {
      callback();
      setHasRun(true);
    }
  }, [hasRun, callback]);
};

const HomeScreen = ({ locate }: any) => {
  const navigate = useNavigate();
  const { uid } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const videoId = "A7CBbLkWqo8";
  const videoId2 = "os_6ebAPz1w";
  const API_KEY = "AIzaSyAlvBFERx-gzDSdi8SmcZZ4SjZ88UO0MBQ";
  const [duty, setDuty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [StuInfo, setStuInfo] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [logoName, setLogoName] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState("");
  const [likeCount2, setLikeCount2] = useState(0);
  const [commentCount2, setCommentCount2] = useState(0);
  const [viewCount2, setViewCount2] = useState(0);
  const [videoTitle2, setVideoTitle2] = useState("");
  const [logoName2, setLogoName2] = useState("");
  const [subscriberCount2, setSubscriberCount2] = useState(0);
  const [logoUrl2, setLogoUrl2] = useState("");
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

  useOnce(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  });

  //================ GET STUDENT ===============
  const { data, refetch } = useQuery(GET_STUDENT, {
    pollInterval: 2000,
    variables: {
      parentsId: uid,
    },
    onCompleted: ({ getStudentByParentsMobile }) => {
      // console.log(getStudentByParentsMobile)
    },
    onError: (error) => {
      console.log(error?.message);
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
        navigate("/attendance", { state: stuInfo });
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

  async function connectYoutube() {
    try {
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
      );

      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelResponse.data.items[0].snippet.channelId}&key=${API_KEY}`
      );
      const viewCount = channelResponse.data.items[0].statistics.viewCount;
      const likeCount = channelResponse.data.items[0].statistics.likeCount;
      const commentCount =
        channelResponse.data.items[0].statistics.commentCount;
      const setTitleVideo = channelResponse.data.items[0].snippet.title;
      //
      const logoName = videoResponse.data.items[0].snippet.title;
      const logoUrl =
        videoResponse.data.items[0].snippet.thumbnails.default.url;
      const subscriberCount =
        videoResponse.data.items[0].statistics.subscriberCount;
      // Use the video IDs in your React Native app
      setLogoUrl(logoUrl);
      setLogoName(logoName);
      setSubscriberCount(subscriberCount);
      setViewCount(viewCount);
      setLikeCount(likeCount);
      setCommentCount(commentCount);
      setVideoTitle(setTitleVideo);
    } catch (error: any) {
      // console.error("Error:", error.response.data);
    }
  }
  async function connectYoutube2() {
    try {
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId2}&key=${API_KEY}`
      );

      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelResponse.data.items[0].snippet.channelId}&key=${API_KEY}`
      );
      const viewCount = channelResponse.data.items[0].statistics.viewCount;
      const likeCount = channelResponse.data.items[0].statistics.likeCount;
      const commentCount =
        channelResponse.data.items[0].statistics.commentCount;
      const setTitleVideo = channelResponse.data.items[0].snippet.title;
      //
      const logoName = videoResponse.data.items[0].snippet.title;
      const logoUrl =
        videoResponse.data.items[0].snippet.thumbnails.default.url;
      const subscriberCount =
        videoResponse.data.items[0].statistics.subscriberCount;
      // Use the video IDs in your React Native app
      setLogoUrl2(logoUrl);
      setLogoName2(logoName);
      setSubscriberCount2(subscriberCount);
      setViewCount2(viewCount);
      setLikeCount2(likeCount);
      setCommentCount2(commentCount);
      setVideoTitle2(setTitleVideo);
    } catch (error: any) {
      // console.error("Error:", error.response.data);
    }
  }
  useEffect(() => {
    connectYoutube();
    connectYoutube2();
  }, []);

  const openWebsite = async () => {
    const result = await WebBrowser.openBrowserAsync(
      "https://www.youtube.com/watch?v=A7CBbLkWqo8"
    );
    // Handle the result if needed
    // console.log(result);
    if (result === undefined) {
      Alert.alert(
        "Oop!",
        "Make sure you have the app installed on your device."
      );
    }
  };

  const openWebsite2 = async () => {
    const result = await WebBrowser.openBrowserAsync(
      "https://www.youtube.com/watch?v=os_6ebAPz1w"
    );
    // Handle the result if needed
    // console.log(result);
    if (result === undefined) {
      Alert.alert(
        "Oop!",
        "Make sure you have the app installed on your device."
      );
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
            style={[
              HomeStyle.homeModalStyle1,
              { backgroundColor: "#000", opacity: 0.2, position: "absolute" },
            ]}
            onPress={() => toggleModal()}
          />
          <View
            style={[
              HomeStyle.modalinsideStyle,
              {
                width: moderateScale(350),
                height: moderateScale(350),
                padding: moderateScale(10),
              },
            ]}
          >
            <Text
              style={[
                HomeStyle.homeModalTitle,
                { fontSize: moderateScale(16), padding: moderateScale(10) },
              ]}
            >
              {t(duty)}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
              }}
            >
              {data?.getStudentByParentsMobile.length === 0 ||
              data === undefined ? (
                <View
                  style={[
                    HomeStyle.imageBox,
                    {
                      width: moderateScale(130),
                      height: moderateScale(200),
                    },
                  ]}
                >
                  <View
                    style={{
                      borderColor: "#9aa3a6",
                      borderWidth: moderateScale(1),
                      borderRadius: moderateScale(200),
                      padding: moderateScale(5),
                    }}
                  >
                    <View
                      style={[
                        HomeStyle.imageHome,
                        {
                          backgroundColor: "#f1f1f1",
                          width: moderateScale(100),
                          height: moderateScale(100),
                        },
                      ]}
                    />
                  </View>
                  <View
                    style={{
                      width: moderateScale(100),
                      height: moderateScale(30),
                      backgroundColor: "#f1f1f1",
                    }}
                  />
                </View>
              ) : (
                data?.getStudentByParentsMobile?.map((stuInfo: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      setStudentId(stuInfo?._id);
                      ConditionsOfStudentFeatures(stuInfo);
                    }}
                    key={stuInfo?._id}
                    style={[
                      HomeStyle.imageBox,
                      {
                        width: moderateScale(130),
                        height: moderateScale(200),
                      },
                    ]}
                  >
                    <View
                      style={[
                        HomeStyle.homeImageBorderWidthStyle,
                        {
                          borderWidth: moderateScale(1),
                          padding: moderateScale(5),
                        },
                      ]}
                    >
                      <Animatable.Image
                        source={
                          stuInfo?.profileImg
                            ? stuInfo?.profileImg
                                .toLowerCase()
                                .includes(
                                  "https://storage-server.go-globalschool.com/client/storage:academic_management/"
                                )
                              ? { uri: stuInfo?.profileImg }
                              : {
                                  uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
                                }
                            : require("../assets/Images/user.png")
                        }
                        style={[
                          HomeStyle.imageHome,
                          {
                            width: moderateScale(100),
                            height: moderateScale(100),
                          },
                        ]}
                        resizeMode="cover"
                        animation="zoomIn"
                      />
                    </View>

                    <Text
                      style={[
                        HomeStyle.studentProfileName,
                        { fontSize: moderateScale(14) },
                      ]}
                      numberOfLines={1}
                    >
                      {getLanguage() === "en"
                        ? stuInfo?.englishName
                        : stuInfo?.lastName + " " + stuInfo?.firstName}
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
        locate={locate}
      />
      {/* ======== EYS MODAL =========*/}
      <ModalEYS
        studentId={studentId}
        isVisible={isEYSModalVisible}
        handleClose={closeEYSModal}
        eys={eys}
        setEys={setEys}
      />

      {/* ======== HEALTH MODAL =========*/}
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
        <View style={[HomeStyle.imageGroup, { height: moderateScale(200) }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: "95%" }}
          >
            {data === undefined ||
            data?.getStudentByParentsMobile.length === 0 ? (
              <View
                style={[
                  HomeStyle.imageBox,
                  {
                    width: moderateScale(130),
                    height: moderateScale(200),
                  },
                ]}
              >
                <View
                  style={{
                    borderColor: "#9aa3a6",
                    borderWidth: moderateScale(1),
                    borderRadius: 200,
                    padding: moderateScale(5),
                  }}
                >
                  <View
                    style={[
                      HomeStyle.imageHome,
                      {
                        backgroundColor: "#f1f1f1",
                        width: moderateScale(100),
                        height: moderateScale(100),
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    width: moderateScale(100),
                    height: moderateScale(30),
                    backgroundColor: "#f1f1f1",
                  }}
                />
              </View>
            ) : (
              data?.getStudentByParentsMobile?.map(
                (stuInfo: any, index: number) =>
                  loading === true ? (
                    <View
                      style={[
                        HomeStyle.imageBox,
                        {
                          width: moderateScale(130),
                          height: moderateScale(200),
                        },
                      ]}
                      key={index}
                    >
                      <View
                        style={{
                          borderColor: "#9aa3a6",
                          borderWidth: moderateScale(1),
                          borderRadius: 100,
                          padding: moderateScale(5),
                        }}
                      >
                        <View
                          style={[
                            HomeStyle.imageHome,
                            {
                              backgroundColor: "#f1f1f1",
                              width: moderateScale(100),
                              height: moderateScale(100),
                            },
                          ]}
                        />
                      </View>
                      <View
                        style={{
                          width: moderateScale(100),
                          height: moderateScale(30),
                          backgroundColor: "#f1f1f1",
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigate("/studentdetail", { state: { stuInfo, uid } })
                      }
                      key={stuInfo?._id}
                      style={[
                        HomeStyle.imageBox,
                        {
                          width: moderateScale(130),
                          height: moderateScale(200),
                        },
                      ]}
                    >
                      <View
                        style={{
                          borderColor: "#3C6EFB",
                          borderWidth: moderateScale(1),
                          borderRadius: 100,
                          padding: moderateScale(5),
                        }}
                      >
                        <Animatable.Image
                          source={
                            stuInfo?.profileImg
                              ? stuInfo?.profileImg
                                  .toLowerCase()
                                  .includes(
                                    "https://storage-server.go-globalschool.com/client/storage:academic_management/"
                                  )
                                ? { uri: stuInfo?.profileImg }
                                : {
                                    uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
                                  }
                              : require("../assets/Images/user.png")
                          }
                          style={[
                            HomeStyle.imageHome,
                            {
                              width: moderateScale(100),
                              height: moderateScale(100),
                            },
                          ]}
                          resizeMode="cover"
                          animation="zoomIn"
                        />
                      </View>

                      <Text
                        style={[
                          HomeStyle.studentProfileName,
                          { fontSize: moderateScale(14) },
                        ]}
                        numberOfLines={1}
                      >
                        {getLanguage() === "en"
                          ? stuInfo?.englishName
                          : stuInfo?.lastName + " " + stuInfo?.firstName}
                      </Text>
                    </TouchableOpacity>
                  )
              )
            )}
          </ScrollView>
        </View>

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

        {eventData === undefined ||
        eventData?.getUpcomingEventMobile.length === 0 ? (
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
          eventData?.getUpcomingEventMobile.map((event: any, index: number) =>
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

        <View style={[HomeStyle.titleBarHome, { height: moderateScale(50) }]}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/customer-service.png")}
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
                {getLanguage() === "en" ? "FEATURES" : "មុខងារ"}
              </Text>
              <View style={[HomeStyle.homeBar, { height: moderateScale(2) }]} />
            </>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: "95%" }}
        >
          {features.map((row: any, index: number) =>
            loading === true ? (
              <View
                style={[
                  HomeStyle.explorecontainer,
                  {
                    height: moderateScale(100),
                    marginRight: moderateScale(10),
                  },
                ]}
                key={index}
              >
                <View
                  style={[
                    HomeStyle.exploreBoxSkeleton,
                    {
                      width: moderateScale(130),
                      borderWidth: moderateScale(1),
                    },
                  ]}
                />
              </View>
            ) : (
              <View
                style={[
                  HomeStyle.explorecontainer,
                  {
                    height: moderateScale(100),
                    marginRight: moderateScale(10),
                  },
                ]}
                key={index}
              >
                <TouchableOpacity
                  style={[
                    HomeStyle.exploreBox,
                    {
                      width: moderateScale(130),
                      borderWidth: moderateScale(1),
                    },
                  ]}
                  onPress={() => {
                    setDuty(row?.title);
                    toggleModal();
                  }}
                >
                  <Animatable.Image
                    source={row.icon}
                    style={{
                      height: moderateScale(30),
                      width: moderateScale(30),
                    }}
                    animation="bounce"
                  />
                  <Text
                    style={[
                      HomeStyle.exploreTitle,
                      { fontSize: moderateScale(10) },
                    ]}
                  >
                    {t(row?.title)}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </ScrollView>

        <View style={[HomeStyle.titleBarHome, { height: moderateScale(50) }]}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/rocket.png")}
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
                {getLanguage() === "en" ? "EXPLORES" : "ស្វែងរក"}
              </Text>
              <View style={[HomeStyle.homeBar, { height: moderateScale(2) }]} />
            </>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: "95%" }}
        >
          {explore.map((row: any, index: number) =>
            loading === true ? (
              <View
                style={[
                  HomeStyle.explorecontainer,
                  {
                    height: moderateScale(100),
                    marginRight: moderateScale(10),
                  },
                ]}
                key={index}
              >
                <View
                  style={[
                    HomeStyle.exploreBoxSkeleton,
                    {
                      width: moderateScale(130),
                      borderWidth: moderateScale(1),
                    },
                  ]}
                />
              </View>
            ) : (
              <View
                style={[
                  HomeStyle.explorecontainer,
                  {
                    height: moderateScale(100),
                    marginRight: moderateScale(10),
                  },
                ]}
                key={index}
              >
                <TouchableOpacity
                  style={[
                    HomeStyle.exploreBox,
                    {
                      width: moderateScale(130),
                      borderWidth: moderateScale(1),
                    },
                  ]}
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
                    style={{
                      height: moderateScale(30),
                      width: moderateScale(30),
                    }}
                    animation="bounce"
                  />
                  <Text
                    style={[
                      HomeStyle.exploreTitle,
                      { fontSize: moderateScale(10) },
                    ]}
                  >
                    {t(row?.title)}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </ScrollView>

        <View style={[HomeStyle.titleBarHome, { height: moderateScale(50) }]}>
          <Image
            source={require("../assets/Images/megaphone.png")}
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
            {getLanguage() === "en" ? "NEWS" : "ដំណឹងថ្មីៗ"}
          </Text>
          <View style={[HomeStyle.homeBar, { height: moderateScale(2) }]} />
        </View>

        <View style={HomeStyle.announceHomeHolderContainer}>
          {announces.length === 0 ? (
            <View
              style={[
                HomeStyle.announcementHomeContainer,
                {
                  height: moderateScale(200),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(10),
                },
              ]}
            >
              <Animatable.Image
                source={require("../assets/Images/No-Data-Found.jpeg")}
                style={{
                  width: "100%",
                  height: "80%",
                  borderRadius: moderateScale(5),
                }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <Text
                style={[
                  HomeStyle.announcementHomeTitleEmpty,
                  { padding: moderateScale(5) },
                ]}
              >
                {" "}
              </Text>
            </View>
          ) : (
            announces.map((announce: any) => (
              <TouchableOpacity
                onPress={() => navigate("/announce", { state: announce })}
                style={[
                  HomeStyle.announcementHomeContainer,
                  {
                    height: moderateScale(200),
                    padding: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
                key={announce?._id}
              >
                <Animatable.Image
                  source={{ uri: announce?.coverSrc }}
                  style={{
                    width: "100%",
                    height: "80%",
                    borderRadius: moderateScale(5),
                  }}
                  resizeMode="cover"
                  animation="zoomIn"
                />
                <Text
                  style={[
                    HomeStyle.announcementHomeTitle,
                    {
                      fontSize: moderateScale(15),
                      paddingVertical: moderateScale(10),
                    },
                  ]}
                  numberOfLines={1}
                >
                  {announce?.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={[HomeStyle.titleBarHome, { height: moderateScale(50) }]}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/video.png")}
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
                {getLanguage() === "en" ? "VIDEOS" : "វីដេអូថ្មីៗ"}
              </Text>
              <View style={[HomeStyle.homeBar, { height: moderateScale(2) }]} />
            </>
          )}
        </View>
        <View style={HomeStyle.announceHomeHolderContainer}>
          {loading === true ? (
            <View
              style={[
                HomeStyle.announcementHomeContainer,
                {
                  height: moderateScale(200),
                  padding: moderateScale(10),
                  marginBottom: moderateScale(10),
                },
              ]}
            >
              <Animatable.Image
                source={require("../assets/Images/No-Data-Found.jpeg")}
                style={{
                  width: "100%",
                  height: "80%",
                  borderRadius: moderateScale(5),
                }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <Text
                style={[
                  HomeStyle.announcementHomeTitleEmpty,
                  { padding: moderateScale(5) },
                ]}
              >
                {" "}
              </Text>
            </View>
          ) : (
            // announces.map((announce: any) => (
            <>
              <TouchableOpacity
                onPress={() => {
                  openWebsite();
                }}
                style={[
                  HomeStyle.HomeVideoBigContainer,
                  {
                    height: moderateScale(250),
                    marginBottom: moderateScale(16),
                  },
                ]}
              >
                <Animatable.Image
                  source={require("../assets/Images/loading-gif.gif")}
                  style={{ width: "100%", height: "100%", borderRadius: 5 }}
                  resizeMode="cover"
                  animation="zoomIn"
                />
                <View
                  style={[
                    HomeStyle.HomeVideoContentContainer,
                    { padding: moderateScale(10) },
                  ]}
                >
                  <View style={HomeStyle.HomeVideoContentTitleContainer}>
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {logoUrl ? (
                          <Image
                            source={{ uri: logoUrl }}
                            style={{
                              width: moderateScale(20),
                              height: moderateScale(20),
                              borderRadius: moderateScale(100),
                            }}
                          />
                        ) : null}
                        <Text
                          style={[
                            HomeStyle.HomeVideoTitleText,
                            { fontSize: moderateScale(18) },
                          ]}
                          numberOfLines={1}
                        >
                          {logoName}
                        </Text>
                      </View>
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {subscriberCount + " subscribers"}
                      </Text>
                    </View>
                    <View
                      style={[
                        HomeStyle.HomeVideoBodyFakeButton,
                        { height: moderateScale(40) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/play-rotated.png")}
                        resizeMode="contain"
                        style={{ width: "33%", height: moderateScale(20) }}
                      />
                      <Image
                        source={require("../assets/Images/play-buttton.png")}
                        resizeMode="contain"
                        style={{
                          width: "33%",
                          height: moderateScale(20),
                          paddingHorizontal: moderateScale(10),
                        }}
                      />
                      <Image
                        source={require("../assets/Images/play.png")}
                        resizeMode="contain"
                        style={{ width: "33%", height: moderateScale(20) }}
                      />
                    </View>
                    <Text
                      style={[
                        HomeStyle.HomeVideoTitleText,
                        { fontSize: moderateScale(18) },
                      ]}
                      numberOfLines={1}
                    >
                      {videoTitle}
                    </Text>
                  </View>
                  <View style={HomeStyle.HomeVideoReportFooterContainer}>
                    <View
                      style={[
                        HomeStyle.HomeVideoReportContainer,
                        { padding: moderateScale(5) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/white-eye.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                      >
                        {viewCount.toString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        HomeStyle.HomeVideoReportContainer,
                        { padding: moderateScale(5) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/like.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                      >
                        {likeCount.toString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        HomeStyle.HomeVideoReportContainer,
                        { padding: moderateScale(5) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/white-comment.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                      >
                        {commentCount.toString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  openWebsite2();
                }}
                style={[
                  HomeStyle.HomeVideoBigContainer,
                  {
                    height: moderateScale(250),
                    marginBottom: moderateScale(16),
                  },
                ]}
              >
                <Animatable.Image
                  source={require("../assets/Images/intro-video.gif")}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: moderateScale(5),
                  }}
                  resizeMode="cover"
                  animation="zoomIn"
                />
                <View
                  style={[
                    HomeStyle.HomeVideoContentContainer,
                    { padding: moderateScale(10) },
                  ]}
                >
                  <View style={HomeStyle.HomeVideoContentTitleContainer}>
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {logoUrl2 ? (
                          <Image
                            source={{ uri: logoUrl2 }}
                            style={{
                              width: moderateScale(20),
                              height: moderateScale(20),
                              borderRadius: 200,
                            }}
                          />
                        ) : null}
                        <Text
                          style={[
                            HomeStyle.HomeVideoTitleText,
                            { fontSize: moderateScale(18) },
                          ]}
                          numberOfLines={1}
                        >
                          {logoName2}
                        </Text>
                      </View>
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {subscriberCount2 + " subscribers"}
                      </Text>
                    </View>

                    <View
                      style={[
                        HomeStyle.HomeVideoBodyFakeButton,
                        { height: moderateScale(40) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/play-rotated.png")}
                        resizeMode="contain"
                        style={{ width: "33%", height: moderateScale(20) }}
                      />
                      <Image
                        source={require("../assets/Images/play-buttton.png")}
                        resizeMode="contain"
                        style={{
                          width: "33%",
                          height: moderateScale(20),
                          paddingHorizontal: moderateScale(10),
                        }}
                      />
                      <Image
                        source={require("../assets/Images/play.png")}
                        resizeMode="contain"
                        style={{ width: "33%", height: moderateScale(20) }}
                      />
                    </View>

                    <Text
                      style={[
                        HomeStyle.HomeVideoTitleText,
                        { fontSize: moderateScale(18) },
                      ]}
                      numberOfLines={1}
                    >
                      {videoTitle2}
                    </Text>
                  </View>
                  <View style={HomeStyle.HomeVideoReportFooterContainer}>
                    <View
                      style={[
                        HomeStyle.HomeVideoReportContainer,
                        { padding: moderateScale(5) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/white-eye.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                      >
                        {viewCount2.toString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        HomeStyle.HomeVideoReportContainer,
                        { padding: moderateScale(5) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/like.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                      >
                        {likeCount2.toString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        HomeStyle.HomeVideoReportContainer,
                        { padding: moderateScale(5) },
                      ]}
                    >
                      <Image
                        source={require("../assets/Images/white-comment.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeVideoBodyText,
                          {
                            fontSize: moderateScale(12),
                            padding: moderateScale(5),
                          },
                        ]}
                      >
                        {commentCount2.toString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </>
            // )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
