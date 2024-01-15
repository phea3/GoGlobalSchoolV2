import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import StudentDetailStyle from "../Styles/StudentDetailScreen.scss";
import { useLocation, useNavigate } from "react-router-native";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_ACADEMICYEARFORSELECT } from "../graphql/getAcademicYearsForSelect";
import { useContext, useEffect, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { GET_CLASSESBYSTUDENTFORMOBILE } from "../graphql/GetClassesByStudentForMobile";
import HomeStyle from "../Styles/HomeScreen.scss";
import * as Animatable from "react-native-animatable";
import { getLanguage, useTranslation } from "react-multi-lang";
import ModalTakeLeave from "../components/home/ModalTakeLeave";
import ModalPickup from "../components/home/ModalPickup";
import ModalEYS from "../components/home/ModalEYS";
import ModalHealth from "../components/health/ModalHealth";
import { AuthContext } from "../Context/AuthContext";
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

export default function StudentDetailScreen() {
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const location = useLocation();
  const stuInfo = location.state.stuInfo;
  const uid = location.state.uid;
  const [academicId, setAcademicId] = useState("");
  const [duty, setDuty] = useState("");
  const navigate = useNavigate();
  const [StuInfo, setStuInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  //============== Modal Pick ==============
  const [visibleTakeLeave, setVisibleTakeLeave] = useState(false);
  const toggleModalOpenLeave = () => {
    setVisibleTakeLeave(true);
  };
  const toggleModalCloseLeave = () => {
    setVisibleTakeLeave(false);
  };

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

  const openEYSModal = async () => {
    setEys("eys");
    setEYSModalVisible(true);
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

  const calculate_age = (dob1: any) => {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument

    if (today.getFullYear() === birthDate.getFullYear()) {
      var months_old = today.getMonth() - birthDate.getMonth();

      if (months_old === 0) {
        var days_old = today.getDate() - birthDate.getDate();
        return days_old + t(" days old"); // Extend the value behind with ' days old'
      } else {
        if (today.getDate() < birthDate.getDate()) {
          months_old--; // Subtract 1 from months_old if the current day is less than the birth day
        }
        return months_old + t(" months old"); // Extend the value behind with ' months old'
      }
    } else {
      var age_now = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
      }
      return age_now < 2 ? age_now + t(" year old") : age_now + t(" years old"); // Extend the value behind with ' years old'
    }
  };

  const { data: AcademicYearData, refetch: AcademicYearForSelectRefetch } =
    useQuery(GET_ACADEMICYEARFORSELECT, {
      onCompleted: ({ getAcademicYearsForSelect }) => {},
      onError(error) {},
    });

  useEffect(() => {
    AcademicYearForSelectRefetch();
  }, []);

  const [classdata, setClassdata] = useState([]);
  const t = useTranslation();
  const { refetch: classRefetch } = useQuery(GET_CLASSESBYSTUDENTFORMOBILE, {
    variables: {
      studentId: stuInfo?._id,
      academicYearId: academicId,
    },
    onCompleted: ({ getClassesByStudentForMobile }) => {
      if (getClassesByStudentForMobile) {
        setClassdata(getClassesByStudentForMobile);
        // console.log("getClassesByStudentForMobile", getClassesByStudentForMobile)
      }
    },
    onError: (error) => {},
  });

  useEffect(() => {
    classRefetch();
  }, [academicId, stuInfo?._id]);

  useEffect(() => {
    setAcademicId(
      AcademicYearData?.getAcademicYearsForSelect[
        AcademicYearData?.getAcademicYearsForSelect.length - 1
      ]._id
    );
  }, [AcademicYearData]);

  //============= FUNCTION CHECK CONDITIONS ================
  const ConditionsOfStudentFeatures = (duty: string) => {
    switch (duty) {
      case "TAKE LEAVE":
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
        openEYSModal();
        break;
      case "HEALTH EYS":
        openHealthModal();
        break;
      default:
        break;
    }
  };

  return (
    <View style={StudentDetailStyle.StudentDetailContainer}>
      {/* =========== MODAL LEAVE REQUEST ============= */}
      <ModalTakeLeave
        studentId={stuInfo?._id}
        isVisible={visibleTakeLeave}
        handleClose={toggleModalCloseLeave}
        autoNavLeaveScreen={autoNavigateLeaveScreen}
      />
      {/*  ============ PICK UP MODAL ===============*/}
      <ModalPickup
        studentId={stuInfo?._id}
        isVisible={visiblePickup}
        handleClose={toggleModalClosePickup}
      />
      {/* ======== EYS MODAL =========*/}
      <ModalEYS
        studentId={stuInfo?._id}
        isVisible={isEYSModalVisible}
        handleClose={closeEYSModal}
        eys={eys}
        setEys={setEys}
      />
      {/* ======== HEALTH MODAL =========*/}
      <ModalHealth
        studentId={stuInfo?._id}
        isVisible={isHealthVisible}
        handleClose={closeHealthModal}
        health={health}
        setHealth={setHealth}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "95%", height: "100%" }}
      >
        <View style={StudentDetailStyle.StudentDetailTopContainer}>
          <View style={StudentDetailStyle.StudentDetailTopHalfLeftContainer}>
            <Image
              source={
                stuInfo?.profileImg
                  ? stuInfo?.profileImg
                      ?.toLowerCase()
                      ?.includes("https://storage-server.go-globalschool.com/")
                    ? { uri: stuInfo?.profileImg }
                    : {
                        uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
                      }
                  : require("../assets/Images/user.png")
              }
              style={{
                width: moderateScale(120),
                height: moderateScale(120),
                borderRadius: moderateScale(20),
              }}
            />
          </View>

          <View
            style={[
              StudentDetailStyle.StudentDetailTopHalfRightContainer,
              { paddingLeft: moderateScale(20) },
            ]}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {stuInfo?.lastName + " " + stuInfo?.firstName}
            </Text>
            <Text
              style={[
                StudentDetailStyle.StudentDetailTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {stuInfo?.englishName}
            </Text>
          </View>
        </View>
        <View
          style={[
            StudentDetailStyle.StudentDetailMiddelTitleContainer,
            { marginTop: moderateScale(20), marginBottom: moderateScale(10) },
          ]}
        >
          <Image
            source={require("../assets/Images/about-us.png")}
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              marginRight: moderateScale(5),
            }}
          />
          <Text
            style={[
              StudentDetailStyle.StudentDetailTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Personal Info")}
          </Text>
          <View
            style={{
              flex: 1,
              height: moderateScale(2),
              backgroundColor: "#3c6efb",
              marginLeft: moderateScale(5),
            }}
          />
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {t("Gender:")}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {stuInfo?.gender}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {t("Date of birth:")}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {moment(stuInfo?.dob).format("Do, MMMM YYYY")}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {t("Age:")}{" "}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {calculate_age(stuInfo?.dob)}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {t("Place of birth:")}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text
              style={[
                StudentDetailStyle.StudentDetailBodyText,
                { fontSize: moderateScale(14) },
              ]}
            >
              {"ភូមិ" +
                stuInfo?.village +
                ", ឃុំ" +
                stuInfo?.commune +
                ", ស្រុក" +
                stuInfo?.district +
                ", ខេត្ត" +
                stuInfo?.province}
            </Text>
          </View>
        </View>
        <View
          style={[
            StudentDetailStyle.StudentDetailMiddelTitleContainer,
            { marginTop: moderateScale(20), marginBottom: moderateScale(10) },
          ]}
        >
          <Image
            source={require("../assets/Images/education.png")}
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              marginRight: moderateScale(5),
            }}
          />
          <Text
            style={[
              StudentDetailStyle.StudentDetailTitleText,
              { fontSize: moderateScale(14) },
            ]}
          >
            {t("Education")}
          </Text>
          <View
            style={{
              flex: 1,
              height: moderateScale(2),
              backgroundColor: "#3c6efb",
              marginLeft: moderateScale(5),
            }}
          />
        </View>
        <SelectDropdown
          data={AcademicYearData?.getAcademicYearsForSelect}
          defaultValue={
            AcademicYearData?.getAcademicYearsForSelect[
              AcademicYearData?.getAcademicYearsForSelect.length - 1
            ].academicYearTitle
          }
          buttonStyle={[
            StudentDetailStyle.StudentDetailSelectDropdownAcademicYearContainer,
            {
              borderWidth: moderateScale(0.5),
              paddingHorizontal: moderateScale(10),
              height: moderateScale(50),
            },
          ]}
          onSelect={(selectedItem, index) => {
            setAcademicId(selectedItem?._id);
          }}
          renderCustomizedButtonChild={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return (
              <View
                key={index}
                style={
                  StudentDetailStyle.StudentDetailSelectAcademicYearContainer
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      StudentDetailStyle.StudentDetailTitleText,
                      {
                        marginRight: moderateScale(10),
                        fontSize: moderateScale(14),
                      },
                    ]}
                  >
                    {t("Academic៖")}
                  </Text>
                  <Text
                    style={[
                      StudentDetailStyle.StudentDetailBodyText,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {selectedItem
                      ? selectedItem?.academicYearTitle
                      : AcademicYearData?.getAcademicYearsForSelect[
                          AcademicYearData?.getAcademicYearsForSelect.length - 1
                        ].academicYearTitle}
                  </Text>
                </View>

                <Image
                  source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                  }}
                />
              </View>
            );
          }}
          dropdownStyle={[
            StudentDetailStyle.StudentDetailDropdownStyleAcademicYearContainer,
            { borderRadius: moderateScale(20) },
          ]}
          renderCustomizedRowChild={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            // console.log(item);
            return (
              <View
                key={index}
                style={StudentDetailStyle.StudentDetailDropdownStyle}
              >
                <Text
                  style={[
                    StudentDetailStyle.StudentDetailBodyText,
                    {
                      color: item?._id === academicId ? "#3C6EFB" : "black",
                      fontSize: moderateScale(14),
                    },
                  ]}
                >
                  {item?.academicYearTitle}
                </Text>
              </View>
            );
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%", marginTop: 20 }}
        >
          {classdata?.map((row: any, index: number) => (
            <View
              style={[
                StudentDetailStyle.StudentDetailClassContainer,
                {
                  height: moderateScale(100),
                  paddingBottom: moderateScale(10),
                },
              ]}
              key={index}
            >
              <View
                style={[
                  StudentDetailStyle.StudentDetailClassBackgroundContainer,
                  {
                    borderWidth: moderateScale(1),
                    borderRadius: moderateScale(30),
                  },
                ]}
              >
                <View
                  style={{
                    width: moderateScale(4),
                    height: "50%",
                    backgroundColor: "#3c6efb",
                    borderTopEndRadius: moderateScale(5),
                    borderBottomEndRadius: moderateScale(5),
                  }}
                />
                <Animatable.Image
                  source={require("../assets/Images/teaching.png")}
                  style={{
                    height: moderateScale(60),
                    width: moderateScale(60),
                    marginLeft: moderateScale(15),
                  }}
                  animation="bounce"
                />
              </View>
              <View style={StudentDetailStyle.StudentDetailClassBox}>
                <Text
                  style={[
                    StudentDetailStyle.StudentDetailTitleText,
                    { fontSize: moderateScale(12) },
                  ]}
                >
                  {row?.classesName}
                </Text>

                <Text
                  style={[
                    StudentDetailStyle.StudentDetailBodyClassText,
                    { fontSize: moderateScale(12) },
                  ]}
                  numberOfLines={1}
                >
                  {row?.programmeName}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* <View style={HomeStyle.titleBarHome}>
          <Image
            source={require("../assets/Images/customer-service.png")}
            style={{ height: 20, width: 20 }}
          />
          <Text style={HomeStyle.fontTitleBarHome}>
            {getLanguage() === "en" ? "Feature" : "មុខងារ"}
          </Text>
          <View style={HomeStyle.homeBar} />
        </View> */}

        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: "95%" }}
        >
          {features.map((row: any, index: number) => (
            <View style={HomeStyle.explorecontainer} key={index}>
              <TouchableOpacity
                style={HomeStyle.exploreBox}
                onPress={() => {
                  ConditionsOfStudentFeatures(row?.title);
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
        </ScrollView> */}

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
          style={{ width: "95%", marginBottom: 10 }}
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
                      ConditionsOfStudentFeatures(row?.title);
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
      </ScrollView>
    </View>
  );
}
