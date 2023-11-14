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
} from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation } from "react-router-native";
import AnnounceStyle from "../Styles/AnnouncementDetailScreen.scss";
import { useRef, useState } from "react";
import { ExpandingDot } from "react-native-animated-pagination-dots";

export default function AnnouncementDetail() {
  const location = useLocation();
  const { dimension, widthScreen, heightScreen } = useContext(AuthContext);
  const announce = location.state;
  const [modalVisible, setModalVisible] = useState(false);
  const [Images, setImages] = useState("");

  // console.log("announce?.referenceFiles", announce?.referenceFiles);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  function ImageData(item: any) {
    return (
      <View
        style={{
          width: widthScreen * 0.95,
          height: heightScreen * 0.3,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Image
          source={{ uri: item?.item }}
          resizeMode="contain"
          style={{
            width: "80%",
            height: "100%",
          }}
        />
      </View>
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={AnnounceStyle.AnnounceScrollViewStyle}
      >
        <FlatList
          data={announce?.referenceFiles}
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
            <ImageData item={item} key={index} />
          )}
        />
        <ExpandingDot
          data={announce?.referenceFiles}
          expandingDotWidth={30}
          scrollX={scrollX}
          inActiveDotOpacity={0.6}
          dotStyle={{
            width: 10,
            height: 10,
            backgroundColor: "#347af0",
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          containerStyle={{
            //   bottom: 200,
            display: "none",
          }}
        />
        <Text style={AnnounceStyle.AnnouceTitle}>{announce?.title}</Text>
        <Text style={AnnounceStyle.AnnouceBodyText}>
          {announce?.description}
        </Text>
      </ScrollView>
    </View>
  );
}
