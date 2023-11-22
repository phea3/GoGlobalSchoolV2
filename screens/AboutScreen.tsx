import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AboutStyle from "../Styles/AboutScreen.scss";
import * as Animatable from "react-native-animatable";
import { useContext, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthContext } from "../Context/AuthContext";

export default function AboutScreen() {
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const [number, setNumber] = useState(0);

  const numbers = Array.from({ length: 3 }, (_, index) => index);

  const openWebsite = async () => {
    const url =
      number === 1
        ? "https://school-website-frontend-gold.vercel.app/about"
        : number === 2
        ? "https://school-website-frontend-gold.vercel.app/school-fee"
        : "https://school-website-frontend-gold.vercel.app/programme";

    const result = await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={AboutStyle.AboutContainer}>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <View
          style={{
            width: "100%",
            height: "35%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Animatable.Image
            source={require("../assets/Images/goglobal-school.png")}
            resizeMode="contain"
            style={{
              width: dimension === "sm" ? 100 : dimension === "lg" ? 300 : 200,
              height: dimension === "sm" ? 200 : dimension === "lg" ? 600 : 400,
            }}
            animation="fadeInDown"
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
      </ScrollView>
    </View>
  );
}
