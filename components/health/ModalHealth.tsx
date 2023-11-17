import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import { CHECK_IS_STUDENT_FOR_EYS } from "../../graphql/CheckEYS";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-native";

export default function ModalHealth({
  studentId,
  isVisible,
  handleClose,
  health,
  setHealth,
}: any) {
  let navigate = useNavigate();

  //============= CHECK HEALTH REPORT CLASS ================
  const { data, refetch } = useQuery(CHECK_IS_STUDENT_FOR_EYS, {
    variables: {
      stuId: studentId,
    },
    onCompleted: ({ checkIsStudentEYSReport }) => {
      if (checkIsStudentEYSReport === true && health === "health") {
        setTimeout(() => {
          setHealth("");
          navigate("/health", { state: studentId });
        }, 500);
      }
    },
    onError(error) {},
  });

  useEffect(() => {
    setTimeout(() => {
      if (data?.checkIsStudentEYSReport === true && health === "health") {
        setHealth("");
        navigate("/health", { state: studentId });
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
                style={HomeStyle.homeModalStyle1}
                onPress={handleClose}
              ></TouchableOpacity>
              <View style={HomeStyle.HomePickupStudentContent}>
                <View style={HomeStyle.HomePickupStudentTextContainer1}>
                  <Image
                    source={require("../../assets/Images/loader-1.gif")}
                    style={{ width: 60, height: 60 }}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={HomeStyle.homeModalStyle1}
                onPress={handleClose}
              ></TouchableOpacity>
              <View style={HomeStyle.HomePickupStudentContent}>
                <View style={HomeStyle.HomePickupStudentTextContainer1}>
                  <Text style={HomeStyle.HomePickupStudentText}>
                    Your child's class not allow for Health Report.
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
