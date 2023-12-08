import { View, Text, StyleSheet, Image, Pressable, Modal } from "react-native";
import UpIcon from "./UpIcon";
import DownIcon from "./DownIcon";
import ElipIcon from "./ElipIcon";
import { FormatDate, FormatThu, currencyFormat } from "../../utils/function";
import { useState } from "react";
import LoadPending from "../Loading/LoadPending";
export default function ItemTransaction({ data }: { data?: any | undefined }) {
  const arr = data;
  const [showPopUp, setShowPopUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loadPending, setLoadPending] = useState(false);
  const [indexDisplay, setIndexDisplay] = useState(0);
  return (
    <View style={styles.container}>
      {data?.length && !loadPending ? (
        data.map((data: any, index: any) => (
          <View key={index}>
            {index == 0 ? (
              <View style={styles.title}>
                <Text
                  style={{
                    fontFamily: "Exo2_400Regular",
                    fontSize: 13,
                    opacity: 0.5,
                  }}
                >
                  {FormatThu(data.transaction_date.toString())} -{" "}
                  {FormatDate(data.transaction_date.toString())}
                </Text>
              </View>
            ) : index != 0 &&
              FormatDate(arr[index - 1].transaction_date.toString()) !==
                FormatDate(data.transaction_date.toString()) ? (
              <View style={styles.title}>
                <Text
                  style={{
                    fontFamily: "Exo2_400Regular",
                    fontSize: 13,
                    opacity: 0.5,
                  }}
                >
                  {FormatThu(data.transaction_date.toString())} -{" "}
                  {FormatDate(data.transaction_date.toString())}
                </Text>
              </View>
            ) : (
              <View>{/* <Text>Không có giao dịch nào xảy ra</Text> */}</View>
            )}

            <Pressable
              android_ripple={{ color: "#ccc" }}
              style={({ pressed }: { pressed: boolean }) =>
                pressed && { opacity: 0.5 }
              }
              onPress={() => {
                setIndexDisplay(index);
                setShowPopUp(true);
                if (indexDisplay == index && showPopUp) {
                  setShowPopUp(false);
                }
              }}
            >
              <View style={styles.transaction}>
                <View style={styles.left}>
                  {data.transaction_amount >= 0 ? <UpIcon /> : <DownIcon />}
                </View>
                <View style={styles.center}>
                  <Text
                    style={{
                      fontFamily: "Exo2_700Bold",
                      fontSize: 14,
                      color: "#434343",
                    }}
                  >
                    {data.transaction_amount >= 0 ? "+" : ""}
                    {currencyFormat(data.transaction_amount)} đ
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ flex: 4 }}>
                      <Text
                        style={{
                          fontFamily: "Exo2_400Regular",
                          fontSize: 12,
                          opacity: 0.5,
                        }}
                        numberOfLines={
                          indexDisplay == index && showPopUp ? 10 : 1
                        }
                        ellipsizeMode="tail"
                      >
                        {data.transaction_mess}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text
                        style={{
                          fontFamily: "Exo2_400Regular",
                          fontSize: 13,
                          opacity: 0.5,
                        }}
                      >
                        {" - " + data.transaction_date.toString().slice(11, 16)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "column" }}>
                  <View style={styles.right}>
                    <ElipIcon />

                    <Text
                      style={{
                        fontFamily: "Exo2_400Regular",
                        fontSize: 13,
                        opacity: 0.5,
                      }}
                    >
                      {data.fi_name}
                    </Text>
                    <View style={{ left: 3 }}></View>
                    {/* <View style={{ alignItems: "flex-end" }}>
                  <Image
                    source={{
                      uri: data.logo,
                    }}
                    style={styles.icon}
                  />
                </View> */}
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        ))
      ) : !loadPending ? (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Exo2_700Bold",
              fontSize: 16,
              alignSelf: "center",
              textAlign: "center",
              color: "#434343",
              paddingVertical: 20,
            }}
          >
            Không có giao dịch xảy ra trong thời điểm này
          </Text>
        </View>
      ) : (
        <Text></Text>
      )}
      {/* {!loadPending && <LoadPending />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "95%",
    alignSelf: "center",
    gap: 10,
  },
  title: {
    marginTop: 10,
    flex: 1,
  },
  transaction: {
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: "row",
    paddingVertical: 10,
  },
  left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 6,
    flexDirection: "column",
    paddingLeft: 5,
  },
  right: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
