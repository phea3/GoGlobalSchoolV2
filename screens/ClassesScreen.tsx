import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import SelectDropdown from "react-native-select-dropdown";

export default function ClassesScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const number = location.state;
  // console.log(location, "location");
  const [isModalVisible, setModalVisible] = useState(false);
  const [classData, setClassData] = useState(0);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const countries = ["2021", "2022", "Summer 2023", "2024"];
  const numbers = Array.from({ length: 1 }, (_, index) => index);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
        transparent={true}
      >
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <TouchableOpacity
            style={{ width: "100%", height: "50%" }}
            onPress={() => toggleModal()}
          />
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              width: "100%",
              height: "50%",
              borderTopEndRadius: 30,
              borderTopStartRadius: 30,
            }}
          >
            <TouchableOpacity
              onPress={toggleModal}
              style={{ width: "100%", alignItems: "flex-end", padding: 20 }}
            >
              <Text>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("/schedule")}
              style={{
                width: "90%",
              }}
            >
              <Text
                style={{
                  color: "blue",
                  fontFamily: "Kantumruy-Bold",
                  fontSize: 15,
                }}
              >
                កាលវិភាគ {classData}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("/attendance")}
              style={{
                width: "90%",
              }}
            >
              <Text
                style={{
                  color: "blue",
                  fontFamily: "Kantumruy-Bold",
                  fontSize: 15,
                }}
              >
                វត្តមាន {classData}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <TouchableOpacity
        onPress={() => navigate("/home")}
        style={{
          width: "100%",
          alignContent: "flex-start",
        }}
      >
        <Image
          source={require("../assets/Images/arrow.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity> */}

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        style={{
          width: "100%",
        }}
      >
        <SelectDropdown
          data={countries}
          buttonStyle={{ width: "95%", borderRadius: 10, marginTop: 10 }}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          renderCustomizedButtonChild={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text>ឆ្នាំសិក្សា៖</Text>
                  <Text>{selectedItem}</Text>
                </View>

                <Image
                  source={require("../assets/Images/angle-down-gray.png")}
                  style={{ width: 20, height: 20 }}
                />
              </View>
            );
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />

        {numbers.map((number) => (
          <TouchableOpacity
            onPress={() => {
              toggleModal(), setClassData(number);
            }}
            key={number}
            style={{
              flex: 1,
              backgroundColor: "#0000ff",
              marginTop: 10,
              width: "95%",
              borderRadius: 10,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ color: "white" }}>Class name</Text>
              <Text style={{ color: "white" }}>number</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
