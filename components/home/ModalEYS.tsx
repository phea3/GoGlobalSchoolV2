import { Modal, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";

export default function ModalEYS({ studentId, isVisible, handleClose }: any) {
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
        </View>
      </Modal>
    </>
  );
}
