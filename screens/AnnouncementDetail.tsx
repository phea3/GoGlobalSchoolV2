import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation } from "react-router-native";
import AnnounceStyle from "../Styles/AnnouncementDetailScreen.scss";
import { useRef, useState } from "react";
import ImageView from "react-native-image-viewing";
import { useQuery } from "@apollo/client";
import { GETANNOUNCEMENTBYID } from "../graphql/GetAnnouncementById";
import { useTranslation } from "react-multi-lang";

export default function AnnouncementDetail() {
  const location = useLocation();
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);
  const announce = location.state;
  const t = useTranslation();
  // console.log(announce);

  const { data: announceData, refetch: announceRefetch } = useQuery(
    GETANNOUNCEMENTBYID,
    {
      variables: {
        id: announce?._id,
      },
      onCompleted(data) {
        // console.log(announceData);
      },
    }
  );

  useEffect(() => {
    announceRefetch();
  }, [announce]);

  const [Images, setImage] = useState("");

  const [visible, setIsVisible] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  function ImageData(item: any) {
    return (
      <TouchableOpacity
        onPress={() => {
          setTimeout(() => {
            setIsVisible(true);
          }, 100);
          setImage(item?.item.item);
        }}
        style={{
          width: widthScreen * 0.95,
          height: heightScreen * 0.3,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Image
          source={{ uri: item?.item.item }}
          resizeMode="contain"
          style={{
            width: "80%",
            height: "100%",
          }}
        />
        <ImageView
          images={[{ uri: Images }]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={
        dimension === "sm"
          ? AnnounceStyle.AnnounceContainer_sm
          : AnnounceStyle.AnnounceContainer
      }
    >
      {announceData ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={AnnounceStyle.AnnounceScrollViewStyle}
        >
          <FlatList
            data={announceData?.getAnnouncementById?.referenceFiles}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              }
            )}
            pagingEnabled
            horizontal
            decelerationRate={"normal"}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ImageData item={{ item: item, index: index }} key={index} />
            )}
          />
          <Text style={AnnounceStyle.AnnouceTitle}>
            {announceData?.getAnnouncementById?.title}
          </Text>
          <Text style={AnnounceStyle.AnnouceBodyText}>
            {announceData?.getAnnouncementById?.description}
          </Text>
        </ScrollView>
      ) : (
        <Text style={AnnounceStyle.AnnouceBodyText}>
          {t("Content has been removed!")}
        </Text>
      )}
    </View>
  );
}
