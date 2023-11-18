import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import StudentDetailStyle from "../Styles/StudentDetailScreen.scss";
import { useLocation, useNavigate } from "react-router-native";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_ACADEMICYEARFORSELECT } from "../graphql/getAcademicYearsForSelect";
import { useEffect, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import { GET_CLASSESBYSTUDENTFORMOBILE } from "../graphql/GetClassesByStudentForMobile";
import HomeStyle from "../Styles/HomeScreen.scss";
import * as Animatable from "react-native-animatable";
import { getLanguage } from "react-multi-lang";
import ModalTakeLeave from "../components/home/ModalTakeLeave";
import ModalPickup from "../components/home/ModalPickup";
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
  {
    title: "ANNOUNCEMENT",
    icon: require("../assets/Images/email.png"),
    naviage: "/announcement",
    modal: false,
  },
];

export default function StudentDetailScreen() {
  const location = useLocation();
  const stuInfo = location.state.stuInfo;
  const uid = location.state.uid;
  const [academicId, setAcademicId] = useState("");
  const [duty, setDuty] = useState("");
  const navigate = useNavigate();
  const [StuInfo, setStuInfo] = useState({});

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
        return days_old + " days old"; // Extend the value behind with ' days old'
      } else {
        if (today.getDate() < birthDate.getDate()) {
          months_old--; // Subtract 1 from months_old if the current day is less than the birth day
        }
        return months_old + " months old"; // Extend the value behind with ' months old'
      }
    } else {
      var age_now = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
      }
      return age_now < 2 ? age_now + " year old" : age_now + " years old"; // Extend the value behind with ' years old'
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
        navigate("/attendance", { state: stuInfo?._id });
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
              source={{
                uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
              }}
              style={{ width: 120, height: 120, borderRadius: 20 }}
            />
          </View>

          <View style={StudentDetailStyle.StudentDetailTopHalfRightContainer}>
            <Text style={StudentDetailStyle.StudentDetailTitleText}>
              {stuInfo?.lastName + " " + stuInfo?.firstName}
            </Text>
            <Text style={StudentDetailStyle.StudentDetailTitleText}>
              {stuInfo?.englishName}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelTitleContainer}>
          <Image
            source={require("../assets/Images/about-us.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={StudentDetailStyle.StudentDetailTitleText}>
            Personal Info
          </Text>
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#3c6efb",
              marginLeft: 5,
            }}
          />
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
              Gender:{" "}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
              {stuInfo?.gender}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
              Date of birth:{" "}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
              {moment(stuInfo?.dob).format("Do, MMMM YYYY")}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>Age: </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
              {calculate_age(stuInfo?.dob)}
            </Text>
          </View>
        </View>
        <View style={StudentDetailStyle.StudentDetailMiddelContentContainer}>
          <View
            style={StudentDetailStyle.StudentDetailMiddelLeftContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
              Place of birth:{" "}
            </Text>
          </View>
          <View
            style={StudentDetailStyle.StudentDetailMiddelRightContentContainer}
          >
            <Text style={StudentDetailStyle.StudentDetailBodyText}>
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
        <View style={StudentDetailStyle.StudentDetailMiddelTitleContainer}>
          <Image
            source={require("../assets/Images/education.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text style={StudentDetailStyle.StudentDetailTitleText}>
            Education
          </Text>
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#3c6efb",
              marginLeft: 5,
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
          buttonStyle={
            StudentDetailStyle.StudentDetailSelectDropdownAcademicYearContainer
          }
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
                      { marginRight: 10 },
                    ]}
                  >
                    ឆ្នាំសិក្សា៖
                  </Text>
                  <Text style={StudentDetailStyle.StudentDetailBodyText}>
                    {selectedItem
                      ? selectedItem?.academicYearTitle
                      : AcademicYearData?.getAcademicYearsForSelect[
                          AcademicYearData?.getAcademicYearsForSelect.length - 1
                        ].academicYearTitle}
                  </Text>
                </View>

                <Image
                  source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            );
          }}
          dropdownStyle={
            StudentDetailStyle.StudentDetailDropdownStyleAcademicYearContainer
          }
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
                    { color: item?._id === academicId ? "#3C6EFB" : "black" },
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
              style={StudentDetailStyle.StudentDetailClassContainer}
              key={index}
            >
              <View
                style={StudentDetailStyle.StudentDetailClassBackgroundContainer}
              >
                <View
                  style={{
                    width: 4,
                    height: "50%",
                    backgroundColor: "#3c6efb",
                    borderTopEndRadius: 5,
                    borderBottomEndRadius: 5,
                  }}
                />
                <Animatable.Image
                  source={require("../assets/Images/teaching.png")}
                  style={{
                    height: 60,
                    width: 60,
                    marginLeft: 15,
                  }}
                  animation="bounce"
                />
              </View>
              <View style={StudentDetailStyle.StudentDetailClassBox}>
                <Text style={StudentDetailStyle.StudentDetailTitleText}>
                  {row?.classesName}
                </Text>

                <Text
                  style={[StudentDetailStyle.StudentDetailBodyClassText, {}]}
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
          style={{ width: "95%", marginBottom: 10 }}
        >
          {explore.map((row: any, index: number) => (
            <View style={HomeStyle.explorecontainer} key={index}>
              <TouchableOpacity
                style={HomeStyle.exploreBox}
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
                  style={{ height: 30, width: 30 }}
                  animation="bounce"
                />
                <Text style={HomeStyle.exploreTitle}>{row?.title}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
