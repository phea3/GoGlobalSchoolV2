import { Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import { CHECK_IS_STUDENT_FOR_EYS } from "../../graphql/CheckEYS";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-native";

export default function ModalEYS({ studentId, isVisible, handleClose }: any) {
  let navigate = useNavigate();
  //============= CHECK EYE REPORT CLASS ================
  const { data, refetch } = useQuery(CHECK_IS_STUDENT_FOR_EYS, {
    variables: {
      stuId: studentId,
    },
    onCompleted: ({ checkIsStudentEYSReport }) => {
      if (checkIsStudentEYSReport === true) {
        setTimeout(() => {
          navigate("/eys", { state: studentId });
        }, 500);
      }
    },
    onError(error) {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [studentId]);

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
            <></>
          ) : (
            <>
              <TouchableOpacity
                style={HomeStyle.homeModalStyle1}
                onPress={handleClose}
              ></TouchableOpacity>
              <View style={HomeStyle.HomePickupStudentContent}>
                <View style={HomeStyle.HomePickupStudentTextContainer1}>
                  <Text style={HomeStyle.HomePickupStudentText}>
                    Your child's class not allow for EYS report.
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
