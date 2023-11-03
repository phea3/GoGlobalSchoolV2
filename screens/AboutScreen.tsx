import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AboutStyle from "../Styles/AboutScreen.scss";
import * as Animatable from "react-native-animatable";
import { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";

export default function AboutScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState(0);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const ref = useRef<WebView>(null);

  const numbers = Array.from({ length: 3 }, (_, index) => index);

  const openWebsite = async () => {
    const url =
      number === 1
        ? "https://school-website-frontend-gold.vercel.app/about"
        : number === 2
        ? "https://school-website-frontend-gold.vercel.app/programme"
        : "https://school-website-frontend-gold.vercel.app/school-fee";

    const result = await WebBrowser.openBrowserAsync(url);

    // Handle the result if needed
    console.log(result);
  };

  return (
    <View style={AboutStyle.AboutContainer}>
      <Modal
        visible={isModalVisible}
        animationType="none"
        onRequestClose={toggleModal}
        transparent={true}
      >
        <SafeAreaView style={{ backgroundColor: "#4B4B4B" }}>
          <View style={AboutStyle.AboutSheetContainer}>
            <View style={AboutStyle.AboutSheetButtonContainer}>
              <TouchableOpacity
                style={AboutStyle.AboutSheetButton}
                onPress={() => {
                  toggleModal();
                }}
              >
                <Text style={AboutStyle.AboutSheetButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={AboutStyle.AboutSheetButton}
                onPress={() => {
                  toggleModal();
                }}
              >
                <Text style={AboutStyle.AboutSheetButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={AboutStyle.AboutWebContainer}>
              <WebView
                ref={ref}
                source={{
                  uri:
                    number === 1
                      ? "https://school-website-frontend-gold.vercel.app/about"
                      : number === 2
                      ? "https://school-website-frontend-gold.vercel.app/programme"
                      : "https://school-website-frontend-gold.vercel.app/school-fee",
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <View
        style={{
          width: "100%",
          height: "35%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {/* <Animatable.Image
          source={require("../assets/Images/Dashboard.png")}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          animation="fadeInDown"
        /> */}

        <Animatable.Image
          source={require("../assets/Images/goglobal-school.png")}
          resizeMode="contain"
          style={{
            width: "70%",
            height: "70%",
          }}
          animation="fadeInRight"
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        {numbers.map((number) => (
          <TouchableOpacity
            onPress={() => {
              setNumber(number % 3 === 0 ? 1 : number % 3 === 1 ? 2 : 3);
              openWebsite();
            }}
            style={
              number % 3 === 0
                ? AboutStyle.AboutChatContainer1
                : number % 3 === 1
                ? AboutStyle.AboutChatContainer2
                : AboutStyle.AboutChatContainer3
            }
            key={number}
          >
            {/* <View style={AboutStyle.AboutChartImageholder}>
              <Animatable.Image
                source={
                  number % 3 === 0
                    ? require("../assets/Images/pngwing.com.png")
                    : number % 3 === 1
                    ? require("../assets/Images/pngfind.com-chart-png-729476.png")
                    : require("../assets/Images/1234.png")
                }
                resizeMode="contain"
                style={{ width: "35%", height: 80 }}
                animation="bounceIn"
              />
            </View> */}

            <View style={AboutStyle.AboutChartTextHolder}>
              <Text style={AboutStyle.AboutChartTitle}>
                {number % 3 === 0
                  ? "About School"
                  : number % 3 === 1
                  ? "Curriculum"
                  : "School Fee"}
              </Text>
              <Text style={AboutStyle.AboutChartBody}>
                {number % 3 === 0
                  ? "Go Global School was established since 2015"
                  : number % 3 === 1
                  ? "Curriculum 2023-2023"
                  : "School fees list for all levels"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
