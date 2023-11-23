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

const HomeScreen = () => {
  const navigate = useNavigate();
  const { uid } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const videoId = "A7CBbLkWqo8"; // Replace with the actual video ID
  const videoId2 = "os_6ebAPz1w"; // Replace with the actual video ID
  const API_KEY = "AIzaSyAyT0Wj3WfxoouSYNVdS5bTs6jU0COSk-g"; // Replace with your YouTube Data API key
  const [duty, setDuty] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [StuInfo, setStuInfo] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [logoName ,setLogoName] = useState("")
  const [subscriberCount,setSubscriberCount] = useState(0)
  const [logoUrl, setLogoUrl] = useState('')

  const [likeCount2, setLikeCount2] = useState(0);
  const [commentCount2, setCommentCount2] = useState(0);
  const [viewCount2, setViewCount2] = useState(0);
  const [videoTitle2, setVideoTitle2] = useState("");
  const [logoName2 ,setLogoName2] = useState("")
  const [subscriberCount2,setSubscriberCount2] = useState(0)
  const [logoUrl2, setLogoUrl2] = useState('')
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
    // Code to run only once
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
    // console.log('This code runs only once');
  });

  //================ GET STUDENT ===============
  const { data, refetch } = useQuery(GET_STUDENT, {
    pollInterval: 2000,
    variables: {
      parentsId: uid,
    },
    onCompleted: ({ getStudentByParentsMobile }) => {},
    onError: (error) => {
      console.log(error?.message);
      // setLoading(true);
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
    // try {
    //   const channelResponse = await axios.get(
    //     `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
    //   );
  
    //   const playlistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    //   const videoResponse = await axios.get(
    //     `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
    //   );
  
    //   const videoIds = videoResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);
  
    //   // Use the video IDs in your React Native app
    //   console.log(videoIds);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
      )
      .then(async (response) => {
        const viewCount = response.data.items[0].statistics.viewCount;
        const likeCount = response.data.items[0].statistics.likeCount;
        const commentCount = response.data.items[0].statistics.commentCount;
        const setTitleVideo = response.data.items[0].snippet.title;
        const channelResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${response.data.items[0].snippet.channelId}&key=${API_KEY}`
          );
        const logoName = channelResponse.data.items[0].snippet.title;
        const logoUrl = channelResponse.data.items[0].snippet.thumbnails.default.url;
        const subscriberCount = channelResponse.data.items[0].statistics.subscriberCount;
        setLogoUrl(logoUrl)
        setLogoName(logoName);
        setSubscriberCount(subscriberCount);
        setViewCount(viewCount);
        setLikeCount(likeCount);
        setCommentCount(commentCount);
        setVideoTitle(setTitleVideo);
        // Use the like count in your React Native app
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  async function connectYoutube2() {
    // try {
    //   const channelResponse = await axios.get(
    //     `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
    //   );
  
    //   const playlistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    //   const videoResponse = await axios.get(
    //     `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
    //   );
  
    //   const videoIds = videoResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);
  
    //   // Use the video IDs in your React Native app
    //   console.log(videoIds);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId2}&key=${API_KEY}`
      )
      .then(async (response) => {
        const viewCount = response.data.items[0].statistics.viewCount;
        const likeCount = response.data.items[0].statistics.likeCount;
        const commentCount = response.data.items[0].statistics.commentCount;
        const setTitleVideo = response.data.items[0].snippet.title;
        const channelResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${response.data.items[0].snippet.channelId}&key=${API_KEY}`
          );
        const logoName = channelResponse.data.items[0].snippet.title;
        const logoUrl = channelResponse.data.items[0].snippet.thumbnails.default.url;
        const subscriberCount = channelResponse.data.items[0].statistics.subscriberCount;
        setLogoUrl2(logoUrl)
        setLogoName2(logoName);
        setSubscriberCount2(subscriberCount);
        setViewCount2(viewCount);
        setLikeCount2(likeCount);
        setCommentCount2(commentCount);
        setVideoTitle2(setTitleVideo);
        // Use the like count in your React Native app
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    connectYoutube();
    connectYoutube2();
  }, []);

  const openWebsite = async () => {
    const result = await WebBrowser.openBrowserAsync('https://www.youtube.com/watch?v=A7CBbLkWqo8');
    // Handle the result if needed
    // console.log(result);
    if (result === undefined) {
      Alert.alert("Oop!", "Make sure you have the app installed on your device.");
    }
  };

  const openWebsite2 = async () => {
    const result = await WebBrowser.openBrowserAsync('https://www.youtube.com/watch?v=os_6ebAPz1w');
    // Handle the result if needed
    // console.log(result);
    if (result === undefined) {
      Alert.alert("Oop!", "Make sure you have the app installed on your device.");
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
                width: dimension === "sm" ? 200 : 350,
                height: dimension === "sm" ? 250 : 300,
              },
            ]}
          >
            <Text style={HomeStyle.homeModalTitle}>{duty}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
              }}
            >
              {data?.getStudentByParentsMobile.length === 0 ||
              data === undefined ? (
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
                    <Text
                      style={HomeStyle.studentProfileName}
                      numberOfLines={1}
                    >
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
        <View style={HomeStyle.imageGroup}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: "95%" }}
          >
            {data === undefined ||
            data?.getStudentByParentsMobile.length === 0 ? (
              <View style={HomeStyle.imageBox}>
                <View
                  style={{
                    borderColor: "#9aa3a6",
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
              data?.getStudentByParentsMobile?.map(
                (stuInfo: any, index: number) =>
                  loading === true ? (
                    <View style={HomeStyle.imageBox} key={index}>
                      <View
                        style={{
                          borderColor: "#9aa3a6",
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
                      onPress={() =>
                        navigate("/studentdetail", { state: { stuInfo, uid } })
                      }
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
                      <Text
                        style={HomeStyle.studentProfileName}
                        numberOfLines={1}
                      >
                        {stuInfo?.lastName + " " + stuInfo?.firstName}
                      </Text>
                    </TouchableOpacity>
                  )
              )
            )}
          </ScrollView>
        </View>

        <View style={HomeStyle.titleBarHome}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/upcoming.png")}
                style={{ height: 20, width: 20 }}
              />
              <Text style={HomeStyle.fontTitleBarHome}>
                {getLanguage() === "en"
                  ? "UPCOMING NEWS"
                  : "ព្រឺត្តិការណ៏ថ្មីៗ"}
              </Text>
              <View style={HomeStyle.homeBar} />
            </>
          )}
        </View>

        {eventData === undefined ||
        eventData?.getUpcomingEventMobile.length === 0 ? (
          <View style={HomeStyle.upcomingcardhome}>
            <View style={HomeStyle.homeUpcomingEventStyleBoxEmpty}>
              <View style={HomeStyle.homeUpcominginSideViewContainer}>
                <View style={HomeStyle.homeUpcomingPillarEmpty} />
                <View style={HomeStyle.homeUpcominginSideViewContainer2}>
                  <Text style={HomeStyle.homeUpcomingTitleEmpty}> </Text>
                  <Text style={HomeStyle.homeUpcomingBody}> </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          eventData?.getUpcomingEventMobile.map((event: any, index: number) =>
            loading === true ? (
              <View style={HomeStyle.upcomingcardhome} key={index}>
                <View style={HomeStyle.homeUpcomingEventStyleBoxEmpty}>
                  <View style={HomeStyle.homeUpcominginSideViewContainer}>
                    <View style={HomeStyle.homeUpcomingPillarEmpty} />
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
            )
          )
        )}

        <View style={HomeStyle.titleBarHome}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/customer-service.png")}
                style={{ height: 20, width: 20 }}
              />
              <Text style={HomeStyle.fontTitleBarHome}>
                {getLanguage() === "en" ? "Feature" : "មុខងារ"}
              </Text>
              <View style={HomeStyle.homeBar} />
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
              <View style={HomeStyle.explorecontainer} key={index}>
                <View style={HomeStyle.exploreBoxSkeleton} />
              </View>
            ) : (
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
            )
          )}
        </ScrollView>

        <View style={HomeStyle.titleBarHome}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/rocket.png")}
                style={{ height: 20, width: 20 }}
              />
              <Text style={HomeStyle.fontTitleBarHome}>
                {getLanguage() === "en" ? "EXPLORE" : "ស្វែងរក"}
              </Text>
              <View style={HomeStyle.homeBar} />
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
              <View style={HomeStyle.explorecontainer} key={index}>
                <View style={HomeStyle.exploreBoxSkeleton} />
              </View>
            ) : (
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
            )
          )}
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
          {announces.length === 0 ? (
            <View style={HomeStyle.announcementHomeContainer}>
              <Animatable.Image
                source={require("../assets/Images/No-Data-Found.jpeg")}
                style={{ width: "100%", height: "80%", borderRadius: 5 }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <Text style={HomeStyle.announcementHomeTitleEmpty}> </Text>
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
                <Text style={HomeStyle.announcementHomeTitle} numberOfLines={1}>
                  {announce?.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={HomeStyle.titleBarHome}>
          {loading === true ? (
            <View style={HomeStyle.titleBarHomeLoading} />
          ) : (
            <>
              <Image
                source={require("../assets/Images/video.png")}
                style={{ height: 20, width: 20 }}
              />
              <Text style={HomeStyle.fontTitleBarHome}>
                {getLanguage() === "en" ? "VIDEOS" : "វីដេអូថ្មីៗ"}
              </Text>
              <View style={HomeStyle.homeBar} />
            </>
          )}
        </View>
        <View style={HomeStyle.announceHomeHolderContainer}>
          {loading === true ? (
            <View style={HomeStyle.announcementHomeContainer}>
              <Animatable.Image
                source={require("../assets/Images/No-Data-Found.jpeg")}
                style={{ width: "100%", height: "80%", borderRadius: 5 }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <Text style={HomeStyle.announcementHomeTitleEmpty}> </Text>
            </View>
          ) : (
            // announces.map((announce: any) => (
              <>
            <TouchableOpacity
              onPress={() => {openWebsite()}}
              style={HomeStyle.HomeVideoBigContainer}
            >
              <Animatable.Image
                source={require("../assets/Images/loading-gif.gif")}
                style={{ width: "100%", height: "100%", borderRadius: 5 }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <View style={HomeStyle.HomeVideoContentContainer}>
                <View style={HomeStyle.HomeVideoContentTitleContainer}>
                  <View>
                    <Text style={HomeStyle.HomeVideoTitleText} numberOfLines={1}>
                      { logoUrl ? 
                        <Image source={{uri: logoUrl}} style={{width: 20, height: 20, borderRadius: 100}}/>  : null
                      }
                  {logoName}
                    </Text>
                    <Text style={HomeStyle.HomeVideoBodyText} numberOfLines={1}>
                      {subscriberCount + " subscribers"}
                    </Text>
                  </View>
                  <View style={HomeStyle.HomeVideoBodyFakeButton}>
                  <Image source={require('../assets/Images/play-rotated.png')} resizeMode="contain" style={{width: '33%', height: 20}}/>
                  <Image source={require('../assets/Images/play-buttton.png')} resizeMode="contain" style={{width: '33%', height: 20, paddingHorizontal: 10}}/>
                  <Image source={require('../assets/Images/play.png')} resizeMode="contain" style={{width: '33%', height: 20}}/>
                </View>
                  <Text style={HomeStyle.HomeVideoTitleText} numberOfLines={1}>
                    {videoTitle}
                  </Text>
                </View>
                <View style={HomeStyle.HomeVideoReportFooterContainer}>
                  <View style={HomeStyle.HomeVideoReportContainer}>
                    <Image source={require('../assets/Images/white-eye.png')} style={{width: 20, height: 20}}/>
                     <Text style={HomeStyle.HomeVideoBodyText}>{viewCount.toString()}</Text> 
                  </View>
                  <View style={HomeStyle.HomeVideoReportContainer}>
                    <Image source={require('../assets/Images/like.png')} style={{width: 20, height: 20}}/>
                     <Text style={HomeStyle.HomeVideoBodyText}>{likeCount.toString()}</Text> 
                  </View>
                  <View style={HomeStyle.HomeVideoReportContainer}>
                    <Image source={require('../assets/Images/white-comment.png')} style={{width: 20, height: 20}}/>
                     <Text style={HomeStyle.HomeVideoBodyText}>{commentCount.toString()}</Text> 
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => {openWebsite2()}}
            style={HomeStyle.HomeVideoBigContainer}
          >
            <Animatable.Image
              source={require("../assets/Images/intro-video.gif")}
              style={{ width: "100%", height: "100%", borderRadius: 5 }}
              resizeMode="cover"
              animation="zoomIn"
            />
            <View style={HomeStyle.HomeVideoContentContainer}>
              <View style={HomeStyle.HomeVideoContentTitleContainer}>
                <View>
                  <Text style={HomeStyle.HomeVideoTitleText} numberOfLines={1}>
                    { logoUrl2 ? 
                      <Image source={{uri: logoUrl2}} style={{width: 20, height: 20, borderRadius: 100}}/>  : null
                    }
                {logoName2}
                  </Text>
                  <Text style={HomeStyle.HomeVideoBodyText} numberOfLines={1}>
                    {subscriberCount2 + " subscribers"}
                  </Text>
                </View>

                <View style={HomeStyle.HomeVideoBodyFakeButton}>
                  <Image source={require('../assets/Images/play-rotated.png')} resizeMode="contain" style={{width: '33%', height: 20}}/>
                  <Image source={require('../assets/Images/play-buttton.png')} resizeMode="contain" style={{width: '33%', height: 20, paddingHorizontal: 10}}/>
                  <Image source={require('../assets/Images/play.png')} resizeMode="contain" style={{width: '33%', height: 20}}/>
                </View>
               
                <Text style={HomeStyle.HomeVideoTitleText} numberOfLines={1}>
                  {videoTitle2}
                </Text>
              </View>
              <View style={HomeStyle.HomeVideoReportFooterContainer}>
                <View style={HomeStyle.HomeVideoReportContainer}>
                  <Image source={require('../assets/Images/white-eye.png')} style={{width: 20, height: 20}}/>
                   <Text style={HomeStyle.HomeVideoBodyText}>{viewCount2.toString()}</Text> 
                </View>
                <View style={HomeStyle.HomeVideoReportContainer}>
                  <Image source={require('../assets/Images/like.png')} style={{width: 20, height: 20}}/>
                   <Text style={HomeStyle.HomeVideoBodyText}>{likeCount2.toString()}</Text> 
                </View>
                <View style={HomeStyle.HomeVideoReportContainer}>
                  <Image source={require('../assets/Images/white-comment.png')} style={{width: 20, height: 20}}/>
                   <Text style={HomeStyle.HomeVideoBodyText}>{commentCount2.toString()}</Text> 
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
