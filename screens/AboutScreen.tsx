import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AboutStyle from "../Styles/AboutScreen.scss";
import * as Animatable from "react-native-animatable";
import { useContext, useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-multi-lang";

const useOnce = (callback: any) => {
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!hasRun) {
      callback();
      setHasRun(true);
    }
  }, [hasRun, callback]);
};

export default function AboutScreen() {
  const { widthScreen, heightScreen, dimension } = useContext(AuthContext);
  const [number, setNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const t = useTranslation();
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

  useOnce(() => {
    // Code to run only once
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
    // console.log('This code runs only once');
  });

  return (
    <View style={AboutStyle.AboutContainer}>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        {loading === false ? (
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
                width:
                  dimension === "sm" ? 150 : dimension === "lg" ? 300 : 200,
                height:
                  dimension === "sm" ? 250 : dimension === "lg" ? 600 : 400,
              }}
              animation="fadeInDown"
            />
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: "35%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width:
                  dimension === "sm" ? 150 : dimension === "lg" ? 300 : 200,
                height:
                  dimension === "sm" ? 250 : dimension === "lg" ? 600 : 400,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height:
                    dimension === "sm" ? 125 : dimension === "lg" ? 400 : 200,
                  backgroundColor: "#f1f1f1",
                  borderRadius: 10,
                }}
              />
            </View>
          </View>
        )}
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {numbers.map((number) =>
            loading === false ? (
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
                      ? t("About School")
                      : number % 3 === 1
                      ? t("Curriculum")
                      : t("School Fee")}
                  </Text>
                  <Text style={AboutStyle.AboutChartBody} numberOfLines={1}>
                    {number % 3 === 0
                      ? t("Go Global School was established since 2015")
                      : number % 3 === 1
                      ? t("Curriculum 2023-2023")
                      : t("School fees list for all levels")}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={AboutStyle.AboutChatContainer4} key={number}>
                <View style={AboutStyle.AboutChartTextHolder}></View>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}
