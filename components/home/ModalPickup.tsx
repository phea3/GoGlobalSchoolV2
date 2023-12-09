import { useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import { useMutation, useQuery } from "@apollo/client";
import { PICK_UPSTUDENT } from "../../graphql/PickupStudentForMobile";
import {
  CHECK_STUDENTINPICKUP,
  TRANKING_STUDENTINPICKUP,
} from "../../graphql/CheckStudentPickup";
import { getLanguage, useTranslation } from "react-multi-lang";

export default function ModalPickup({
  studentId,
  isVisible,
  handleClose,
}: any) {
  //
  const t = useTranslation();
  const [visiblePickingUp, setVisiblePickingUp] = useState(false);
  const handleOpenPickingUp = () => {
    setVisiblePickingUp(true);
  };
  const handleClosePickingUp = () => {
    setVisiblePickingUp(false);
  };

  //=============== FUNCTION CHECK PICK UP ==================
  const { data: trackingdata, refetch: checkpickrefetch } = useQuery(
    TRANKING_STUDENTINPICKUP,
    {
      pollInterval: 1000,
      variables: {
        studentId: studentId,
      },
      onCompleted: ({}) => {
      },
      onError: (error) => {},
    }
  );

  // ================= CHECK CLASS FOR PICKUP =================

  const { data: checkdata, refetch: checkrefetch } = useQuery(
    CHECK_STUDENTINPICKUP,
    {
      pollInterval: 2000,
      variables: {
        studentId: studentId,
      },
      onCompleted: ({}) => {},
      onError: (error) => {},
    }
  );
  useEffect(() => {
    checkrefetch();
  }, [studentId]);

  //============= FUNCTION PICK UP ==============
  const [pickingUpStudent, { data }] = useMutation(PICK_UPSTUDENT);

  const PickStudentHandler = () => {
    pickingUpStudent({
      variables: {
        studentId: studentId,
      },
      onCompleted: ({ pickingUpStudent }) => {
        checkpickrefetch();
        handleOpenPickingUp();
      },
      onError: (error) => {},
    });
  };

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={HomeStyle.HomePickupStudent}>
          <TouchableOpacity
            style={[
              HomeStyle.homeModalStyle1,
              { backgroundColor: "#000", opacity: 0.2, position: "absolute" },
            ]}
            onPress={handleClose}
          />
          <View style={HomeStyle.HomePickupStudentContent}>
            {checkdata?.checkIsStudentInPickUp === true ? (
              <>
                <View style={HomeStyle.HomePickupStudentTextContainer}>
                  <Text style={HomeStyle.HomePickupStudentText}>
                    {t("Are you sure to pick up")}
                  </Text>
                  <Text style={HomeStyle.HomePickupStudentText}>
                    {t("your child ?")}
                  </Text>
                </View>
                <View style={HomeStyle.HomePickupStudentButtonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleClose();
                    }}
                    style={HomeStyle.HomePickupStudentButton}
                  >
                    <Text>{t("No")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleClose();
                      PickStudentHandler();
                    }}
                    style={[
                      HomeStyle.HomePickupStudentButton,
                      { borderLeftWidth: 1, borderColor: "#dcdcdc" },
                    ]}
                  >
                    <Text>{t("Yes")}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={HomeStyle.HomePickupStudentTextContainer1}>
                <Text style={HomeStyle.HomePickupStudentText}>
                  {t("classnotallowpickup")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={visiblePickingUp}
        animationType="none"
        onRequestClose={handleClosePickingUp}
        transparent={true}
      >
        <View style={HomeStyle.HomePickupStudent}>
          <TouchableOpacity
            style={[
              HomeStyle.homeModalStyle1,
              ,
              { backgroundColor: "#000", opacity: 0.2, position: "absolute" },
            ]}
            onPress={() => handleClosePickingUp()}
          />
          <View style={HomeStyle.HomePickupTrackingContent}>
            {trackingdata?.trackingStudentInPickUp === "picking" ? (
              <>
                <Image
                  source={require("../../assets/Images/_.gif")}
                  style={{ width: 150, height: 150 }}
                />
                <Text style={HomeStyle.HomePickupStudentText}>
                  {t("Please wait")}
                </Text>
              </>
            ) : null}

            {trackingdata?.trackingStudentInPickUp === "picked" ? (
              <>
                <Image
                  source={require("../../assets/Images/check-outline.gif")}
                  style={{ width: 100, height: 100 }}
                />
                <Text style={HomeStyle.HomePickupStudentText}>
                  {t("Success")}
                </Text>
              </>
            ) : null}

            {trackingdata?.trackingStudentInPickUp === undefined ||
            (data?.pickingUpStudent?.status === false &&
              trackingdata?.trackingStudentInPickUp === "inClass") ? (
              <>
                <Image
                  source={require("../../assets/Images/cross-outline.gif")}
                  style={{ width: 100, height: 100 }}
                />
                <Text style={HomeStyle.HomePickupStudentText}>{t("Fail")}</Text>
              </>
            ) : null}

            {trackingdata?.trackingStudentInPickUp === "inClass" &&
            data?.pickingUpStudent?.status ? (
              <>
                <Image
                  source={require("../../assets/Images/_.gif")}
                  style={{ width: 100, height: 100 }}
                />
                <Text style={HomeStyle.HomePickupStudentText}>
                  {getLanguage() === "en"
                    ? `Your child is "${trackingdata?.trackingStudentInPickUp}" status.`
                    : 'កូនរបស់លោកអ្នកស្ថិតក្នុងស្ថានភាព "inClass"'}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}
