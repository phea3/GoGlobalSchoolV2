import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AboutStyle from "../Styles/AboutScreen.scss";
import * as Animatable from "react-native-animatable";
import { useContext, useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthContext } from "../Context/AuthContext";
import { useTranslation } from "react-multi-lang";
import { moderateScale } from "../ Metrics";

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
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        {loading === false ? (
          <View
            style={{
              width: "100%",
              height: "35%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: moderateScale(20),
            }}
          >
            <Animatable.Image
              source={require("../assets/Images/goglobal-school.png")}
              resizeMode="contain"
              style={{
                width: moderateScale(200),
                height: moderateScale(400),
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
              marginBottom: moderateScale(20),
            }}
          >
            <View
              style={{
                width: moderateScale(200),
                height: moderateScale(400),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: moderateScale(200),
                  backgroundColor: "#f1f1f1",
                  borderRadius: moderateScale(10),
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
                    ? [
                        AboutStyle.AboutChatContainer1,
                        {
                          height: moderateScale(80),
                          paddingLeft: moderateScale(20),
                          marginBottom: moderateScale(10),
                        },
                      ]
                    : number % 3 === 1
                    ? [
                        AboutStyle.AboutChatContainer2,
                        {
                          height: moderateScale(80),
                          paddingLeft: moderateScale(20),
                          marginBottom: moderateScale(10),
                        },
                      ]
                    : [
                        AboutStyle.AboutChatContainer3,
                        {
                          height: moderateScale(80),
                          paddingLeft: moderateScale(20),
                        },
                      ]
                }
                key={number}
              >
                <View style={AboutStyle.AboutChartTextHolder}>
                  <Text
                    style={[
                      AboutStyle.AboutChartTitle,
                      { fontSize: moderateScale(16) },
                    ]}
                  >
                    {number % 3 === 0
                      ? t("About School")
                      : number % 3 === 1
                      ? t("Curriculum")
                      : t("School Fee")}
                  </Text>
                  <Text
                    style={[
                      AboutStyle.AboutChartBody,
                      { fontSize: moderateScale(14) },
                    ]}
                    numberOfLines={1}
                  >
                    {number % 3 === 0
                      ? t("Go Global School was established since 2015")
                      : number % 3 === 1
                      ? t("Curriculum 2023-2023")
                      : t("School fees list for all levels")}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  AboutStyle.AboutChatContainer4,
                  {
                    height: moderateScale(80),
                    paddingLeft: moderateScale(20),
                    marginBottom: moderateScale(10),
                    borderWidth: moderateScale(1),
                  },
                ]}
                key={number}
              >
                <View style={AboutStyle.AboutChartTextHolder}></View>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}
