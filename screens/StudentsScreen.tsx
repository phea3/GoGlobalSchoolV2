import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "../Styles/HomeScreen.scss";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_STUDENT } from "../graphql/get_studentByParent";
import * as Animatable from "react-native-animatable";
import { getLanguage } from "react-multi-lang";

export default function StudentsScreen() {
  const navigate = useNavigate();
  const { uid } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const { data, refetch } = useQuery(GET_STUDENT, {
    pollInterval: 2000,
    variables: {
      parentsId: uid,
    },
    onCompleted: ({}) => {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
    },
    onError: (error) => {
      setLoading(true);
    },
  });

  useEffect(() => {
    refetch();
  }, [uid]);

  return (
    <View style={HomeStyle.homeContainer}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        <View style={HomeStyle.imageGroup}>
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: "center",
            }}
          >
            {data === undefined ||
            data?.getStudentByParentsMobile.length === 0 ? (
              <View style={HomeStyle.imageBox}>
                <View
                  style={{
                    borderColor: "#9aa3a6",
                    borderWidth: 1,
                    borderRadius: 60,
                    padding: 5,
                  }}
                >
                  <View
                    style={[
                      HomeStyle.imageHome,
                      {
                        backgroundColor: "#f1f1f1",
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    width: 120,
                    height: 30,
                    backgroundColor: "#f1f1f1",
                  }}
                />
              </View>
            ) : (
              data?.getStudentByParentsMobile?.map(
                (stuInfo: any, index: number) =>
                  loading === true ? (
                    <View style={HomeStyle.imageBox} key={index}>
                      <View
                        style={{
                          borderColor: "#9aa3a6",
                          borderWidth: 1,
                          borderRadius: 60,
                          padding: 5,
                        }}
                      >
                        <View
                          style={[
                            HomeStyle.imageHome,
                            {
                              backgroundColor: "#f1f1f1",
                            },
                          ]}
                        />
                      </View>
                      <View
                        style={{
                          width: 120,
                          height: 30,
                          backgroundColor: "#f1f1f1",
                        }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigate("/studentdetail", { state: { stuInfo, uid } })
                      }
                      key={stuInfo?._id}
                      style={HomeStyle.imageBox}
                    >
                      <View
                        style={{
                          borderColor: "#3C6EFB",
                          borderWidth: 1,
                          borderRadius: 60,
                          padding: 5,
                        }}
                      >
                        <Animatable.Image
                          source={
                            stuInfo?.profileImg
                              .toLowerCase()
                              .includes(
                                "https://storage-server.go-globalschool.com/"
                              )
                              ? { uri: stuInfo?.profileImg }
                              : {
                                  uri: `https://storage.go-globalschool.com/api${stuInfo?.profileImg}`,
                                }
                          }
                          style={HomeStyle.imageHome}
                          resizeMode="cover"
                          animation="zoomIn"
                        />
                      </View>
                      <Text
                        style={HomeStyle.studentProfileName}
                        numberOfLines={1}
                      >
                        {getLanguage() === "en"
                          ? stuInfo?.englishName
                          : stuInfo?.lastName + " " + stuInfo?.firstName}
                      </Text>
                    </TouchableOpacity>
                  )
              )
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
