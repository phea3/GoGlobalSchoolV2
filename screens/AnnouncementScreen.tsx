import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QUERY_ANNOUNCEMENT } from "../graphql/gql_announcement";
import HomeStyle from "../Styles/HomeScreen.scss";
import AnnouncementStyle from "../Styles/AnnouncementScreen.scss";
import * as Animatable from "react-native-animatable";
import { useNavigate } from "react-router-native";

export default function AnnouncementScreen() {
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const [isFetching, setFetching] = useState(false);

  //============= FUNCTION GET ANNOUMENT ================
  const [announces, setAnnounces] = useState([]);

  const { refetch: announceRefetch, loading } = useQuery(QUERY_ANNOUNCEMENT, {
    variables: {
      page: 1,
      limit: limit,
      from: "",
      to: "",
      keyword: "",
      publish: true,
    },
    onCompleted: ({ getAnnouncementsPagination }) => {
      setAnnounces(getAnnouncementsPagination?.data);
    },
  });

  useEffect(() => {
    announceRefetch();
  }, []);

  function Item({ item, index }: any) {
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("/announce", { state: item })}
            style={AnnouncementStyle.AnnouncementCardContainer}
            key={index}
          >
            <Animatable.Image
              source={{ uri: item.coverSrc }}
              style={{ width: "100%", height: "80%", borderRadius: 5 }}
              resizeMode="cover"
              animation="zoomIn"
            />
            <Text style={HomeStyle.announcementHomeTitle} numberOfLines={1}>
              {item?.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const loadMoreItems = () => {
    setTimeout(() => {
      setLimit(limit + 10);
    }, 2000);
  };

  return (
    <View style={AnnouncementStyle.AnnouncementContainer}>
      <View style={AnnouncementStyle.AnnouncementHolderContainer}>
        {announces.length === 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", height: "100%" }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={HomeStyle.announcementHomeContainer}>
              <Animatable.Image
                source={require("../assets/Images/No-Data-Found.jpeg")}
                style={{ width: "100%", height: "80%", borderRadius: 5 }}
                resizeMode="cover"
                animation="zoomIn"
              />
              <Text style={HomeStyle.announcementHomeTitleEmpty}>
                មិនមាន ទិន្នន័យ
              </Text>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            style={{
              flex: 1,
              paddingLeft: "5%",
            }}
            showsVerticalScrollIndicator={false}
            data={announces}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(announce: any) => announce?._id.toString()}
            onEndReached={loadMoreItems}
            ListFooterComponent={() =>
              loading && (
                <ActivityIndicator
                  size="large"
                  style={{ marginVertical: 20 }}
                />
              )
            }
          />
        )}
      </View>
    </View>
  );
}
