import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import HomeStyle from "../../Styles/HomeScreen.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { LEAVE_REQUEST } from "../../graphql/LeaveRequest";
import * as Animatable from "react-native-animatable";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import KeyboardDismissableArea from "../../Function/KeyboardDismissableArea";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getLanguage, useTranslation } from "react-multi-lang";
import { moderateScale } from "../../ Metrics";

export default function ModalTakeLeave({
  studentId,
  isVisible,
  handleClose,
  autoNavLeaveScreen,
}: any) {
  //
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [fullday, setFullday] = useState(false);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [date, setDate] = useState(new Date());
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [reason, setReason] = useState("");
  const [disappear, setDisappear] = useState(false);

  const t = useTranslation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date);
    hideDatePicker();
  };

  const handleConfirm1 = (From: Date) => {
    setFrom(From);
    hideDatePicker1();
  };

  const handleConfirm2 = (To: Date) => {
    setTo(To);
    hideDatePicker2();
  };

  //============ FUNCTION TAKE LEAVE =====================
  const [leaveRequest] = useMutation(LEAVE_REQUEST);

  const leavehandle = () => {
    const newValue = {
      from:
        morning || afternoon
          ? moment(date).format("YYYY-MM-DD")
          : moment(from).format("YYYY-MM-DD"),
      reason: reason,
      requestType: morning
        ? "morning"
        : afternoon
        ? "afternoon"
        : fullday
        ? "full-day"
        : "",
      studentId: studentId,
      to:
        morning || afternoon
          ? moment(date).format("YYYY-MM-DD")
          : moment(to).format("YYYY-MM-DD"),
    };

    // console.log("newValue::::", newValue);
    leaveRequest({
      variables: {
        input: newValue,
      },
      onCompleted: ({ leaveRequest }) => {
        // console.log(leaveRequest, "leaveRequest");
        handleClose();
        autoNavLeaveScreen();
      },
      onError: (error) => {
        console.log(error.message, "leaveRequest");
      },
    });
  };

  const offset = useSharedValue(0.2);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(offset.value),
    };
  });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={HomeStyle.homeSelectLeaveOptionContainer}>
          <Animated.View
            style={[
              animatedStyles,
              {
                width: "100%",
                height: "100%",
                backgroundColor: "#000",
                position: "absolute",
              },
            ]}
          >
            <TouchableOpacity
              style={HomeStyle.homeSelectLeaveOptionDismissArea}
              onPress={() => {
                setDisappear(true);
                offset.value = withTiming(0);
                setTimeout(() => {
                  setDisappear(false);
                  handleClose();
                  offset.value = withTiming(0.2);
                }, 500);
              }}
            />
          </Animated.View>
          <Animatable.View
            style={
              isKeyboardVisible
                ? [
                    HomeStyle.homeSelectLeaveOptionModalArea1,
                    {
                      paddingBottom: moderateScale(50),
                      borderTopRightRadius: moderateScale(5),
                      borderTopLeftRadius: moderateScale(5),
                    },
                  ]
                : HomeStyle.homeSelectLeaveOptionModalArea
            }
            animation={disappear ? "fadeOutDownBig" : "fadeInUpBig"}
          >
            <View
              style={{
                width: "100%",
                alignItems: "flex-start",
                padding: moderateScale(10),
              }}
            >
              <Text
                style={[
                  HomeStyle.homeModalTitle,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {t("Leave Request")}
              </Text>
            </View>
            {isKeyboardVisible ? <KeyboardDismissableArea /> : null}

            <View
              style={[
                HomeStyle.homeRequestLeaveOptionsContainer,
                { paddingBottom: moderateScale(10) },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setMorning(true);
                  setAfternoon(false);
                  setFullday(false);
                }}
                style={HomeStyle.homeRequestLeaveOptionsButton}
              >
                {morning === true ? (
                  <Image
                    source={require("../../assets/Images/black-circle.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(12),
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("../../assets/Images/record.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(15),
                    }}
                    resizeMode="contain"
                  />
                )}

                <Text
                  style={{
                    fontFamily: "Kantumruy-Bold",
                    fontSize: moderateScale(15),
                  }}
                >
                  {t("Morning")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMorning(false);
                  setAfternoon(true);
                  setFullday(false);
                }}
                style={HomeStyle.homeRequestLeaveOptionsButton}
              >
                {afternoon === true ? (
                  <Image
                    source={require("../../assets/Images/black-circle.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(12),
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("../../assets/Images/record.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(15),
                    }}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={{
                    fontFamily: "Kantumruy-Bold",
                    fontSize: moderateScale(15),
                  }}
                >
                  {t("Afternoon")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMorning(false);
                  setAfternoon(false);
                  setFullday(true);
                }}
                style={HomeStyle.homeRequestLeaveOptionsButton}
              >
                {fullday === true ? (
                  <Image
                    source={require("../../assets/Images/black-circle.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(12),
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("../../assets/Images/record.png")}
                    style={{
                      width: moderateScale(25),
                      height: moderateScale(15),
                    }}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={{
                    fontFamily: "Kantumruy-Bold",
                    fontSize: moderateScale(15),
                  }}
                >
                  {t("Full day")}
                </Text>
              </TouchableOpacity>
            </View>
            {fullday === true ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "90%",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "48%" }}>
                  <Text
                    style={[
                      HomeStyle.homeModalTitle3,
                      {
                        paddingVertical: moderateScale(10),
                        fontSize: moderateScale(14),
                      },
                    ]}
                  >
                    {t("From")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      HomeStyle.homeSelectLeaveOptionPickupDate2,
                      {
                        paddingHorizontal: moderateScale(10),
                        borderWidth: moderateScale(1),
                        height: moderateScale(50),
                      },
                    ]}
                    onPress={showDatePicker1}
                  >
                    <Text
                      style={[
                        HomeStyle.homeModalTitle4,
                        {
                          paddingVertical: moderateScale(10),
                          fontSize: moderateScale(14),
                        },
                      ]}
                    >
                      {moment(from).format("DD/M/YYYY")}
                    </Text>
                    <Image
                      source={require("../../assets/Images/calendar-clock.png")}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(15),
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ width: "48%", justifyContent: "flex-start" }}>
                  <Text
                    style={[
                      HomeStyle.homeModalTitle3,
                      {
                        paddingVertical: moderateScale(10),
                        fontSize: moderateScale(14),
                      },
                    ]}
                  >
                    {t("To")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      HomeStyle.homeSelectLeaveOptionPickupDate2,
                      {
                        paddingHorizontal: moderateScale(10),
                        borderWidth: moderateScale(1),
                        height: moderateScale(50),
                      },
                    ]}
                    onPress={showDatePicker2}
                  >
                    <Text
                      style={[
                        HomeStyle.homeModalTitle4,
                        {
                          paddingVertical: moderateScale(10),
                          fontSize: moderateScale(14),
                        },
                      ]}
                    >
                      {moment(to).format("DD/M/YYYY")}
                    </Text>
                    <Image
                      source={require("../../assets/Images/calendar-clock.png")}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(15),
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text
                  style={[
                    HomeStyle.homeModalTitle2,
                    { padding: moderateScale(10), fontSize: moderateScale(14) },
                  ]}
                >
                  {t("Date")}
                </Text>
                <TouchableOpacity
                  style={[
                    HomeStyle.homeSelectLeaveOptionPickupDate,
                    {
                      paddingHorizontal: moderateScale(10),
                      borderWidth: moderateScale(1),
                      height: moderateScale(50),
                    },
                  ]}
                  onPress={showDatePicker}
                >
                  <Text
                    style={[
                      HomeStyle.homeModalTitle4,
                      {
                        paddingVertical: moderateScale(10),
                        fontSize: moderateScale(14),
                      },
                    ]}
                  >
                    {moment(date).format("DD/M/YYYY")}
                  </Text>
                  <Image
                    source={require("../../assets/Images/calendar-clock.png")}
                    style={{
                      width: moderateScale(15),
                      height: moderateScale(15),
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </>
            )}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible1}
              mode="date"
              onConfirm={handleConfirm1}
              onCancel={hideDatePicker1}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible2}
              mode="date"
              onConfirm={handleConfirm2}
              onCancel={hideDatePicker2}
            />
            <Text
              style={[
                HomeStyle.homeModalTitle2,
                { padding: moderateScale(10), fontSize: moderateScale(14) },
              ]}
            >
              {t("Reason")}
            </Text>
            <View
              style={[
                HomeStyle.homeSelectLeaveOptionTextInput,
                {
                  paddingHorizontal: moderateScale(10),
                  borderWidth: moderateScale(1),
                  height: moderateScale(50),
                },
              ]}
            >
              <TextInput
                placeholder="Reason"
                value={reason}
                onChangeText={(e) => setReason(e)}
                keyboardType="default"
                multiline
                style={[
                  HomeStyle.homeModalTitle4,
                  {
                    paddingHorizontal: moderateScale(10),
                    fontSize: moderateScale(14),
                  },
                ]}
              />
            </View>

            {reason == "" ? (
              <Text
                style={{
                  color: "red",
                  textAlign: "left",
                  width: "95%",
                  padding: moderateScale(10),
                  fontSize: moderateScale(14),
                }}
              >
                {t("Require!")}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                HomeStyle.homeSelectLeaveOptionButtonRequest,
                {
                  marginVertical: moderateScale(20),
                  height: moderateScale(40),
                },
              ]}
              onPress={() => {
                if (
                  (reason != "" && morning) ||
                  (reason != "" && afternoon) ||
                  (reason != "" && fullday)
                ) {
                  leavehandle();
                }
              }}
            >
              <Text
                style={[
                  HomeStyle.homeModalButtonTitle,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {t("Request")}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
}
