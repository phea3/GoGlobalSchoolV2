import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import { CHECK_IS_STUDENT_FOR_EYS } from "../../graphql/CheckEYS";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-native";
import { getLanguage, useTranslation } from "react-multi-lang";
import { moderateScale } from "../../ Metrics";

export default function ModalEYS({
  studentId,
  isVisible,
  handleClose,
  eys,
  setEys,
}: any) {
  const t = useTranslation();
  let navigate = useNavigate();
  //============= CHECK EYE REPORT CLASS ================
  const { data, refetch } = useQuery(CHECK_IS_STUDENT_FOR_EYS, {
    variables: {
      stuId: studentId,
    },
    onCompleted: ({ checkIsStudentEYSReport }) => {
      if (checkIsStudentEYSReport === true && eys === "eys") {
        setTimeout(() => {
          setEys("");
          navigate("/eys", { state: studentId });
        }, 1000);
      }
    },
    onError(error) {},
  });

  useEffect(() => {
    setTimeout(() => {
      if (data?.checkIsStudentEYSReport === true && eys === "eys") {
        setEys("");
        navigate("/eys", { state: studentId });
      }
    }, 1000);
    refetch();
  }, [studentId, isVisible]);

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={HomeStyle.HomePickupStudent}>
          {data?.checkIsStudentEYSReport ? (
            <>
              <TouchableOpacity
                style={[
                  HomeStyle.homeModalStyle1,
                  {
                    backgroundColor: "#000",
                    opacity: 0.2,
                    position: "absolute",
                  },
                ]}
                onPress={handleClose}
              ></TouchableOpacity>
              <View style={HomeStyle.HomePickupStudentContent}>
                <View style={HomeStyle.HomePickupStudentTextContainer1}>
                  <Image
                    source={require("../../assets/Images/loader-1.gif")}
                    style={{
                      width: moderateScale(60),
                      height: moderateScale(60),
                    }}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  HomeStyle.homeModalStyle1,
                  {
                    backgroundColor: "#000",
                    opacity: 0.2,
                    position: "absolute",
                  },
                ]}
                onPress={handleClose}
              ></TouchableOpacity>
              <View style={HomeStyle.HomePickupStudentContent}>
                <View
                  style={[
                    HomeStyle.HomePickupStudentTextContainer1,
                    { padding: moderateScale(10) },
                  ]}
                >
                  <Text
                    style={[
                      HomeStyle.HomePickupStudentText,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {getLanguage() === "en"
                      ? "Your child's class not allow for EYS report."
                      : "ថ្នាក់របស់កូនអ្នកមិនអនុញ្ញាតឱ្យមានរបាយការណ៍ EYS ទេ"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}
