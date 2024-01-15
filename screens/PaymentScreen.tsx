import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import PaymentStyle from "../Styles/PaymentScreen.scss";
import AttendanceStyle from "../Styles/AttendanceScreen.scss";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PAYMENT_FOR_MOBILE } from "../graphql/Get_PaymetforMobile";
import { moderateScale } from "../ Metrics";

export default function PaymentScreen() {
  const [limit, setLimit] = useState(10);

  const { data, refetch } = useQuery(GET_PAYMENT_FOR_MOBILE, {
    pollInterval: 2000,
    variables: {
      limit: 10,
    },
    onCompleted: ({}) => {},
  });
  const numbers = Array.from({ length: 20 }, (_, index) => index);
  const types = ["School Fee", "Water Bill", "Dog Vacine", "Cat food"];
  return (
    <View style={PaymentStyle.PaymentContainer}>
      <View
        style={[
          PaymentStyle.PaymentTitleContainer,
          { height: moderateScale(40) },
        ]}
      >
        <Text
          style={[
            AttendanceStyle.AttendanceTitle1,
            { fontSize: moderateScale(16) },
          ]}
        >
          History of the School Payment
        </Text>
      </View>
      <View style={AttendanceStyle.AttendanceBodyContainer}>
        <View
          style={[
            AttendanceStyle.AttendanceTitle2Container,
            {
              padding: moderateScale(10),
              marginBottom: moderateScale(10),
              height: moderateScale(40),
            },
          ]}
        >
          <Text
            style={[
              PaymentStyle.PaymentTitle1,
              { fontSize: moderateScale(16) },
            ]}
          >
            TYPE
          </Text>
          <Text
            style={[
              PaymentStyle.PaymentTitle2,
              { fontSize: moderateScale(16) },
            ]}
          >
            DATE
          </Text>
          <Text
            style={[
              PaymentStyle.PaymentTitle3,
              { fontSize: moderateScale(16) },
            ]}
          >
            TOTAL
          </Text>
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
                ? [
                    AttendanceStyle.AttendanceTitle2Container2,
                    {
                      padding: moderateScale(10),
                      marginBottom: moderateScale(10),
                    },
                  ]
                : [
                    AttendanceStyle.AttendanceTitle2Container1,
                    {
                      padding: moderateScale(10),
                      marginBottom: moderateScale(10),
                    },
                  ]
            }
          >
            <Text
              style={[
                PaymentStyle.PaymentBody1,
                { fontSize: moderateScale(14) },
              ]}
            >
              {payment?.type.map((i: any, index: number) => {
                return (
                  <View key={index}>
                    {index === types.length - 1 ? (
                      <Text>{i}</Text>
                    ) : (
                      <Text>
                        {i}
                        {", "}
                      </Text>
                    )}
                  </View>
                );
              })}
            </Text>
            <Text
              style={[
                PaymentStyle.PaymentBody2,
                { fontSize: moderateScale(14) },
              ]}
            >
              {moment(payment?.date).format("YY/MMM/ddd")}
            </Text>
            <Text
              style={[
                PaymentStyle.PaymentTitle3,
                { fontSize: moderateScale(14) },
              ]}
            >
              ${payment?.total}
            </Text>
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
              height: moderateScale(40),
            }}
          >
            <Text
              style={{
                fontFamily: "Kantumruy-Bold",
                color: "#3c6efb",
                fontSize: moderateScale(14),
              }}
            >
              see more
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}
