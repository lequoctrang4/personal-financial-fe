import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { Icons } from "../../components/Style/Icons";
import { currencyFormat, getData, removeData } from "../../utils/function";
import React, { useState, useEffect } from "react";
import { searchTransaction } from "../../api/userApi";
import useDebounce from "./useDebounce";
import { setObjectValue, getMyObject, formatArray } from "../../utils/function";
import { useNavigation } from "@react-navigation/native";
import { handleError } from "../../../src/utils/handleError";
import { setAlert } from "../../redux/alert";
import LoadProgress from "../Loading/LoadProgress";
import { useDispatch } from "react-redux";
const SearchFilter = ({
  input,
  setInput,
}: {
  input: string;
  setInput: any;
}) => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [loadProgress, setLoadProgress] = useState(false);
  const dispatch = useDispatch();
  useDebounce(
    () => {
      if (input != "") {
        (async () => {
          try {
            let token = await getData("token");
            let i = await getMyObject("SearchHistory");
            if (!token) {
              throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
            }
            let res = await searchTransaction(
              token,
              undefined,
              undefined,
              undefined,
              input.trim()
            );
            if (res.error === undefined) throw new Error("Lỗi server!");
            if (res.error) throw new Error(res.message);
            setData(res.data);

            let tempData: any = { search: input.trim() };

            if (i === null) {
              setObjectValue("SearchHistory", [tempData]);
            } else {
              setObjectValue("SearchHistory", [...i, tempData]);
            }
            setLoadProgress(false);
          } catch (error: any) {
            handleError(error, setAlert, dispatch, navigation);
          }
        })();
      }
    },
    [input],
    1000
  );

  useEffect(() => {
    setLoadProgress(true);
    (async () => {
      try {
        if (input == "") {
          let i2 = await getMyObject("SearchHistory");
          // console.log("Dữ liệu i2 là: ", i2);
          if (i2) {
            let temp: any = (formatArray(i2) as any)._j;
            // console.log("temp dulieumoi là", temp);
            const obj: any = [];
            temp.forEach((element: string, index: number) => {
              obj[index] = { search: element };
            });
            // console.log("Dữ liệu obj là: ", obj);
            setDataSearch(obj);
            setObjectValue("SearchHistory", obj);
          }
          setTimeout(() => {
            setLoadProgress(false);
          }, 200);
        } else {
          setLoadProgress(true);
        }
      } catch (error) {
        setLoadProgress(false);
      }
    })();
    // console.log("Dữ liệu data search", dataSearch);
    // console.log(dataSearch.length);
  }, [input]);

  if (input == "") {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {dataSearch.length && !loadProgress ? (
          dataSearch.reverse().map((item: any, index: any) => (
            <View key={index}>
              <Pressable
                onPress={() => setInput(item.search)}
                android_ripple={{ color: "#ccc" }}
                style={({ pressed }: { pressed: boolean }) =>
                  pressed && { opacity: 1 }
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <Icons.MaterialCommunityIcons
                      name="history"
                      size={20}
                      color="black"
                      style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                    />
                  </View>
                  <View style={{ flex: 11 }}>
                    <Text>{item.search}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Pressable
                      android_ripple={{ color: "#ccc" }}
                      onPress={async () => {
                        console.log("Nhấn Long Press");
                        let i2 = await getMyObject("SearchHistory");
                        // console.log("Dữ liệu i2 là: ", i2);
                        const obj = i2.filter(
                          (dataI2: any) => dataI2?.search !== item.search
                        );
                        dispatch(
                          setAlert({
                            showCancel: true,
                            showConfirm: true,
                            cancelButtonColor: undefined,
                            confirmButtonColor: "#f24c4c",
                            confirmTextColor: "#fff",
                            cancelTextColor: "#434343",
                            onConfirmPressed: () => {
                              dispatch(setAlert({ show: false }));
                              setObjectValue("SearchHistory", obj);
                              setDataSearch(obj);
                            },
                            onCancelPressed: () => {
                              dispatch(setAlert({ show: false }));
                            },
                            cancelText: "Quay lại",
                            confirmText: "Xác nhận",
                            title: `${item.search} `,
                            message: `Xoá khỏi nhật ký tìm kiếm`,
                            show: true,
                          })
                        );
                      }}
                    >
                      <Icons.Ionicons
                        name="close"
                        size={18}
                        color="black"
                        style={{
                          paddingBottom: 10,
                          paddingLeft: 5,

                          // position: "absolute",
                        }}
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          ))
        ) : !loadProgress ? (
          <View style={{ width: "95%", alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Exo2_700Bold",
                textAlign: "center",
                color: "#434343",
                paddingVertical: 20,
                fontSize: 16,
              }}
            >
              Không có lịch sử tìm kiếm
            </Text>
          </View>
        ) : (
          <Text></Text>
        )}
        {loadProgress && <LoadProgress />}
      </View>
    );
  } else {
    return (
      <>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView alwaysBounceVertical={false}>
              {data?.length && !loadProgress ? (
                data.map((item: any) => {
                  return (
                    <View
                      style={{
                        marginVertical: 10,
                        borderBottomColor: "gray",
                        borderBottomWidth: 0.25,
                        padding: 15,
                      }}
                      key={item.id_trans}
                    >
                      <Pressable>
                        <View
                          style={{
                            alignItems: "flex-start",
                            flexDirection: "row",
                          }}
                        >
                          <Image
                            source={{
                              uri: item.logo,
                            }}
                            style={styles.icon}
                          />
                          <View
                            style={{
                              flexDirection: "column",
                              flex: 1,
                              paddingHorizontal: 10,
                            }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  overflow: "hidden",
                                  fontFamily: "Exo2_600SemiBold",
                                }}
                              >
                                Số tài khoản: {""}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,

                                  fontFamily: "Exo2_600SemiBold",
                                }}
                              >
                                {item.account_number}
                              </Text>
                            </View>

                            <Text
                              style={{
                                fontSize: 12,

                                width: "100%",
                                fontFamily: "Exo2_600SemiBold",
                              }}
                            >
                              Nội dung giao dịch: {item.transaction_mess}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "Exo2_600SemiBold",
                              }}
                            >
                              Biến động số dư:{" "}
                              {currencyFormat(item.transaction_amount)}{" "}
                              {item.account_currency}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: "Exo2_600SemiBold",
                              }}
                            >
                              Thời gian giao dịch: {item.transaction_date}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  );
                  // }
                })
              ) : !loadProgress ? (
                <View style={{ width: "95%", alignSelf: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Exo2_700Bold",
                      textAlign: "center",
                      color: "#434343",
                      paddingVertical: 20,
                      fontSize: 16,
                    }}
                  >
                    Không tìm thấy dữ liệu tương ứng
                  </Text>
                </View>
              ) : (
                <Text></Text>
              )}
            </ScrollView>
          </SafeAreaView>
          {loadProgress && <LoadProgress />}
        </View>
      </>
    );
  }
};

export default SearchFilter;

const styles = StyleSheet.create({
  icon: {
    width: 60,
    height: 60,
  },
  history: {
    width: "100%",
    padding: 5,
    backgroundColor: "rgb(210, 210, 210)",
    flexDirection: "row",
    borderBottomColor: "none",
  },
});
