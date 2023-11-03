import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import PaymentStyle from "../Styles/PaymentScreen.scss";
import AttendanceStyle from "../Styles/AttendanceScreen.scss";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PAYMENT_FOR_MOBILE } from "../graphql/Get_PaymetforMobile";

export default function PaymentScreen() {
  const [limit, setLimit] = useState(10);

  const { data, refetch } = useQuery(GET_PAYMENT_FOR_MOBILE, {
    pollInterval: 2000,
    variables: {
      limit: 10,
    },
    onCompleted: ({ getPaymetforMobile }) => {
      console.log(getPaymetforMobile, "getPaymetforMobile");
    },
  });
  const numbers = Array.from({ length: 20 }, (_, index) => index);
  const types = ["School Fee", "Water Bill", "Dog Vacine", "Cat food"];
  return (
    <View style={PaymentStyle.PaymentContainer}>
      <View style={PaymentStyle.PaymentTitleContainer}>
        <Text style={AttendanceStyle.AttendanceTitle1}>
          History of the School Payment
        </Text>
      </View>
      <View style={AttendanceStyle.AttendanceBodyContainer}>
        <View style={AttendanceStyle.AttendanceTitle2Container}>
          <Text style={PaymentStyle.PaymentTitle1}>TYPE</Text>
          <Text style={PaymentStyle.PaymentTitle2}>DATE</Text>
          <Text style={PaymentStyle.PaymentTitle3}>TOTAL</Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: "100%", width: "95%" }}
      >
        {data?.getPaymetforMobile.map((payment: any, index: number) => (
          <View
            key={index}
            style={
              index % 2 === 1
                ? AttendanceStyle.AttendanceTitle2Container2
                : AttendanceStyle.AttendanceTitle2Container1
            }
          >
            <Text style={PaymentStyle.PaymentBody1}>
              {payment?.type.map((i: any, index: number) => {
                return (
                  <>
                    {index === types.length - 1 ? (
                      <Text>{i}</Text>
                    ) : (
                      <Text>
                        {i}
                        {", "}
                      </Text>
                    )}
                  </>
                );
              })}
            </Text>
            <Text style={PaymentStyle.PaymentBody2}>
              {moment(payment?.date).format("YY/MMM/ddd")}
            </Text>
            <Text style={PaymentStyle.PaymentTitle3}>${payment?.total}</Text>
          </View>
        ))}
        {data?.getPaymetforMobile.length >= limit ? (
          <TouchableOpacity
            onPress={() => {
              setLimit(10 + limit);
            }}
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
            }}
          >
            <Text style={{ fontFamily: "Kantumruy-Bold", color: "#3c6efb" }}>
              see more
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
