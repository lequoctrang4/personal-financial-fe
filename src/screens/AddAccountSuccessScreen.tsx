import React, { useState, useEffect, useCallback } from "react";

import {
  Text,
  View,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";

import { getAccounts } from "../api/userApi";
import Logo from "../components/Header/Logo";
import Svg, { Circle } from "react-native-svg";
import { getData, currencyFormat } from "../utils/function";
import { stylesGlobal, stylesSuccessScreen } from "../components/Style/styles";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import { handleError } from "../utils/handleError";
import LoadProgress from "../components/Loading/LoadProgress";
import { setAlert } from "../redux/alert";
const Success = ({ navigation }: { navigation: any }) => {
  const [dataArray, setDataArray] = useState([]); // nơi lưu giá trị được lấy về sau khi liên kết tài khoản thành công
  const [fiServiceName, setFiServiceName] = useState(""); // tên ngân hàng vừa liên kết
  const [refreshing, setRefreshing] = useState(false);
  const [loadProgress, setLoadProgress] = useState(false);

  const dispatch = useDispatch();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  //Sau khi liên kết tài khoản thành công, thực hiện lấy thông tin về tài khoản liên kết của người dùng
  useEffect(() => {
    setLoadProgress(true);
    (async () => {
      dispatch(setReload());
      try {
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        let res = await getAccounts(token);
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);
        setDataArray(res.data);
        setFiServiceName((res.data[res.data.length - 1] as any).fi_name);
        setTimeout(() => {
          setLoadProgress(false);
        }, 800);
      } catch (error: any) {
        setTimeout(() => {
          setLoadProgress(false);
          handleError(error, setAlert, dispatch, navigation);
        }, 800);
      }
    })();
  }, []);
  if (loadProgress) {
    return <LoadProgress />;
  } else {
    return (
      <>
        <ScrollView
          style={stylesSuccessScreen.container}
          contentContainerStyle={{ flexGrow: 1 }}
          alwaysBounceVertical={false}
          bounces={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <Logo />
            <View>
              <Text style={stylesSuccessScreen.header}>
                Liên kết tài khoản thành công!
              </Text>

              <Text style={stylesSuccessScreen.header2}>
                1 tài khoản đã được liên kết thành công từ {fiServiceName}
              </Text>
            </View>
          </View>
          <View>
            <View style={{ gap: 20 }}>
              {dataArray.map((data: any) => (
                <View key={data.id}>
                  <View
                    style={{
                      position: "relative",
                      flexDirection: "column",
                      height: 200,
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: "#c0c0c0",
                      alignSelf: "center",
                      width: "95%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Exo2_400Regular",
                          fontWeight: "700",
                          flex: 1,
                          color: "#434343",
                          padding: 20,
                        }}
                      >
                        {currencyFormat(data.account_balance)}{" "}
                        {data.account_currency}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          padding: 20,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Svg width="8" height="8" viewBox="0 0 8 8">
                          <Circle cx="4" cy="4" r="4" fill="#04B00B" />
                        </Svg>
                        <Text
                          style={{
                            fontFamily: "Exo2_400Regular",
                            bottom: 5,
                            left: 5,
                            fontSize: 13,
                            color: "#434343",
                          }}
                        >
                          {data.fi_name}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 3 }}></View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "#434343",
                          fontSize: 13,
                          paddingHorizontal: 20,
                          fontWeight: "700",
                          fontFamily: "Exo2_400Regular",
                        }}
                      >
                        {data.account_number}
                      </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <View
                        style={{ flexDirection: "row", paddingHorizontal: 20 }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            color: "#434343",
                            fontFamily: "Exo2_400Regular",
                            fontSize: 14,
                          }}
                        >
                          {data.account_name}
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 14,
                            fontFamily: "Exo2_400Regular",
                            color: "#434343",
                            textAlign: "right",
                          }}
                        >
                          {data.account_desc === "Spend Account"
                            ? "Tài khoản thanh toán"
                            : ""}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("AddAccount")}
            >
              <Animated.View style={[stylesGlobal.animatedButton]}>
                <Text style={stylesGlobal.buttonText}>Thêm tài khoản</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <View>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("RouteCenter", {
                  screen: "Home",
                })
              }
            >
              <Animated.View
                style={[
                  stylesGlobal.animatedButton,
                  { backgroundColor: "#d4d4d4", borderWidth: 0 },
                ]}
              >
                <Text style={stylesGlobal.buttonText}>Tiếp tục</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 100 }}></View>
        </ScrollView>
      </>
    );
  }
  // }
};

export default Success;
