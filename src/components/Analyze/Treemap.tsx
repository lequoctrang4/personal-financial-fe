import React from "react";
import { Dimensions, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { currencyFormat } from "../../utils/function";
import { useState } from "react";
import * as d3 from "d3";

const colors = [
  ["#cdeafa", "#0696E6"],
  ["#cdefce", "#04B00B"],
  ["#f8cccc", "#DA0000"],
  ["#ccebe6", "#009A80"],
];
const TreeMap = ({ data, sum }: { data: any; sum: any }) => {
  const windowWidth = Dimensions.get("window").width * 0.95;
  const windowHeight = 300;
  const [showPopUp, setShowPopUp] = useState(-1);
  function handleView(index: number) {
    if (index === showPopUp) {
      setShowPopUp(() => -1);
      return;
    }
    setShowPopUp(() => index);
  }
  function formartDesc(str: string) {
    if (str === "Spend Account") return "Tài khoản thanh toán";
    return "Tài khoản khác";
  }
  const root = d3
    .hierarchy(data)
    .sum((d: any) => (sum ? d.account_balance : d.account_balance + 1))
    .sort((a: any, b: any) => (b.value as any) - (a.value as any));
  const treemapRoot = d3.treemap().size([windowWidth, windowHeight]).padding(1)(
    root
  );
  return (
    <SafeAreaView style={{ position: "relative", paddingTop: -50 }}>
      <View
        style={{
          height: windowHeight,
          width: windowWidth,
          position: "relative",
        }}
      >
        {showPopUp !== -1 && (
          <View
            style={{
              backgroundColor: "#ffecd4",
              width: "50%",
              height: "30%",
              position: "relative",
              zIndex: 6,
              borderRadius: 5,
              elevation: 4,
              shadowColor: "black",
              alignSelf: "center",
              marginVertical: 100,
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors[showPopUp][1],
                fontSize: 16,
                fontFamily: "Exo2_400Regular",
              }}
              numberOfLines={1}
            >
              {formartDesc((data.children[showPopUp] as any).account_desc)}
            </Text>
            <Text
              style={{
                color: colors[showPopUp][1],
                fontSize: 18,
                fontFamily: "Exo2_700Bold",
              }}
              numberOfLines={1}
            >
              {currencyFormat(
                (data.children[showPopUp] as any).account_balance
              ) + " đ"}
            </Text>
          </View>
        )}
        {treemapRoot.leaves().map((leave: any, index: any) => {
          return (
            <TouchableOpacity
              onPress={() => handleView(index)}
              key={index}
              activeOpacity={0.7}
              style={{
                opacity: showPopUp !== -1 ? 0.5 : 1,
                position: "absolute",
                top: leave.y0,
                width: leave.x1 - leave.x0,
                height: leave.y1 - leave.y0,
                left: leave.x0,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                backgroundColor: colors[index][0],
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "white",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors[index][1],
                    fontSize: 12,
                    fontFamily: "Exo2_400Regular",
                  }}
                  numberOfLines={1}
                >
                  {formartDesc((leave.data as any).account_desc)}
                </Text>
                <Text
                  style={{
                    color: colors[index][1],
                    fontSize: 14,
                    fontFamily: "Exo2_700Bold",
                  }}
                  numberOfLines={1}
                >
                  {currencyFormat((leave.data as any).account_balance) + " đ"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default TreeMap;
