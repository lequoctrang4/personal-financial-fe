import React, { useState, useEffect, useCallback } from "react";

import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import {
  useFonts,
  Exo2_400Regular,
  Exo2_700Bold,
} from "@expo-google-fonts/exo-2";
import * as SplashScreen from "expo-splash-screen";
import Logo from "../components/Header/Logo";
import {
  getData,
  currencyFormat,
  getBeforeMonth,
  getDateofBeforeMonth,
} from "../utils/function";
import {
  getBalanceUserInMonth,
  getAccounts,
  getAllTransactions,
} from "../api/userApi";
import Transaction from "../components/Transaction/Transaction";
import AccountCard from "../components/AccountCard/AccountCard";
import { LinearGradient } from "expo-linear-gradient";
import BalanceView from "../components/BalanceView";
import { stylesGlobal } from "../components/Style/styles";
import ButtonComponent from "../components/Button/ButtonComponent";
import { handleError } from "../utils/handleError";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import { setAlert } from "../redux/alert";
SplashScreen.preventAutoHideAsync();
const Dashboard = ({ navigation, route }: { navigation: any; route?: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  const reload = useSelector((state: any) => state.reload.reload);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    dispatch(setReload());
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const [currentBalance, setCurrentBalance] = useState(undefined);
  const [leftMonthBalance, setLeftMonthBalance] = useState();
  const [beforeBalance, setBeforeBalance] = useState(undefined);
  const [date, setDate] = useState(undefined);
  const [assetIn, setAssetIn] = useState(undefined); // Tiền vào tháng này
  const [assetOut, setAssetOut] = useState(undefined); // Tiền ra tháng này
  const [assetOutIn, setAssetOutIn] = useState(undefined); // Chênh lệch tiền vào và tiền ra tháng này

  const [assetInBefore, setAssetInBefore] = useState(undefined);
  const [assetOutBefore, setAssetOutBefore] = useState(undefined);
  const [assetOutInBefore, setAssetOutInBefore] = useState(undefined);
  const [dateBefore, setDateBefore] = useState(undefined);
  const [leftMonthBalanceBefore, setLeftMonthBalanceBefore] =
    useState(undefined);
  const [dataArray, setDataArray] = useState([]);
  const [dataAllTransaction, setDataAllTransaction] = useState([]); // Tổng dữ liệu tiền vào và tiền ra
  const [dataInTransaction, setDataInTransaction] = useState([]); // Dữ liệu tiền vào
  const [dataOutTransaction, setDataOutTransaction] = useState([]); // Dữ liệu tiền ra
  const [selectButton, setSelectButton] = useState(0);
  let BeforeMonth = getBeforeMonth(new Date().getMonth());
  let [fontsLoaded] = useFonts({
    Exo2_400Regular,
    Exo2_700Bold,
  });
  let currentDate = new Date();
  currentDate.setDate(0);
  currentDate.setMonth(currentDate.getMonth() + 1);

  //Thực hiện lấy dữ liệu của tiền vào và tiền ra
  useEffect(() => {
    setDataArray([]);
    setCurrentBalance(undefined);
    setLeftMonthBalance(undefined);
    setBeforeBalance(undefined);
    setDate(undefined);
    setDateBefore(undefined);
    setAssetIn(undefined);
    setAssetOutIn(undefined);
    setAssetOut(undefined);
    setAssetInBefore(undefined);
    setAssetOutBefore(undefined);
    setAssetOutInBefore(undefined);
    setLeftMonthBalanceBefore(undefined);
    setDataAllTransaction([]);
    setDataInTransaction([]);
    setDataOutTransaction([]);
    (async () => {
      let token = await getData("token");
      if (!token)
        throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
      try {
        let res = await getBalanceUserInMonth(token, month, year);
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);
        setCurrentBalance(
          () => (currencyFormat(res.data.currentBalance) + " đ") as any
        );
        setLeftMonthBalance(
          () => (currencyFormat(res.data.leftMonthBalance) + " đ") as any
        );
        setDate(() => res.data.date);
        setAssetIn(() => (currencyFormat(res.data.castIn) + " đ") as any);
        setAssetOut(() => (currencyFormat(res.data.castOut) + " đ") as any);
        setAssetOutIn(
          () =>
            (currencyFormat(res.data.castIn - res.data.castOut) + " đ") as any
        );
        res = await getAccounts(token);
        if (res.error === undefined) throw new Error("Lỗi server!");

        if (res.error) throw new Error(res.message);
        setDataArray(res.data);
        let Before6Month = getDateofBeforeMonth(new Date().getMonth() - 5);

        let CurrentMonth = getDateofBeforeMonth(new Date().getMonth() + 1);

        res = await getAllTransactions(
          token,
          Before6Month,
          CurrentMonth,
          undefined,
          undefined,
          6
        );
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);
        setDataAllTransaction(res.data);
        res = await getAllTransactions(
          token,
          Before6Month,
          CurrentMonth,
          1,
          undefined,
          6
        );
        if (res.error) throw new Error(res.message);
        if (res.error === undefined) throw new Error("Lỗi server!");
        setDataInTransaction(res.data);
        res = await getAllTransactions(
          token,
          Before6Month,
          CurrentMonth,
          undefined,
          1,
          6
        );
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);
        setDataOutTransaction(res.data);
        let before1Month = new Date().getMonth();
        res = await getBalanceUserInMonth(token, before1Month, year);
        if (res.error === undefined) throw new Error("Lỗi server");
        if (res.error) throw new Error(res.message);
        setDateBefore(() => res.data.date);
        setAssetInBefore(() => (currencyFormat(res.data.castIn) + " đ") as any);
        setAssetOutBefore(
          () => (currencyFormat(res.data.castOut) + " đ") as any
        );
        setAssetOutInBefore(
          () =>
            (currencyFormat(res.data.castIn - res.data.castOut) + " đ") as any
        );
        setLeftMonthBalanceBefore(
          () => (currencyFormat(res.data.leftMonthBalance) + " đ") as any
        );
        setBeforeBalance(
          () => (currencyFormat(res.data.currentBalance) + " đ") as any
        );
      } catch (error: any) {
        handleError(error, setAlert, dispatch, navigation);
      }
    })();
  }, [reload]);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <View
        style={{
          height: 80,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Logo />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        onLayout={onLayoutRootView}
        style={{
          backgroundColor: "white",
          zIndex: 2,
          elevation: 0,
          position: "relative",
        }}
        alwaysBounceVertical={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{ position: "relative", flexDirection: "column", gap: 40 }}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <LinearGradient
              colors={["#009A80", "#BACF89"]}
              style={{
                width: "95%",
                height: 120,
                borderRadius: 16,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 2 }}
            >
              <View
                style={{
                  position: "relative",
                  paddingHorizontal: 20,
                  justifyContent: "center",
                  paddingVertical: 20,
                  flex: 1,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Exo2_700Bold",
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    Tài sản
                  </Text>
                </View>
                <View style={{ flex: 1.4 }}>
                  <Text
                    style={{
                      fontFamily: "Exo2_700Bold",
                      color: "white",
                      fontSize: 23,
                    }}
                  >
                    {currentBalance ? currentBalance : "Đang cập nhật..."}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  {date && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Exo2_700Bold",
                          color: "white",
                          fontSize: 15,
                        }}
                      >
                        {}
                        {leftMonthBalance
                          ? leftMonthBalance[0] === "-"
                            ? leftMonthBalance
                            : "+ " + leftMonthBalance
                          : "Đang cập nhật..."}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Exo2_400Regular",
                          color: "white",
                          fontSize: 13,
                        }}
                      >
                        {" "}
                        so với ngày{" "}
                        {(date as any).replace(
                          /(\d{2})-(\d{2})-\d{4}/,
                          "$1/$2"
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
          </View>
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text style={[stylesGlobal.header, { paddingLeft: 5 }]}>
              Dòng tiền tháng này
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "95%",
                justifyContent: "space-around",
                gap: 10,
              }}
            >
              {/* <TextView label="Tiền vào" width="45%" value={assetIn} />
              <TextView label="Tiền ra" width="45%" value={assetOut} /> */}
              <View style={{ flex: 1 }}>
                <BalanceView
                  label="Tiền vào"
                  backGroundColor="#e5f5f2"
                  value={assetIn ? assetIn : "Đang cập nhật..."}
                  logo={"UpIcon"}
                  align="flex-start"
                />
              </View>
              <View style={{ flex: 1 }}>
                <BalanceView
                  label="Tiền ra"
                  backGroundColor="#fbebeb"
                  value={assetOut ? assetOut : "Đang cập nhật..."}
                  logo={"DownIcon"}
                  align="flex-start"
                />
              </View>
            </View>
            <View style={{ width: "95%" }}>
              <BalanceView
                label="Tích lũy"
                backGroundColor="#fcecd0"
                value={assetOutIn ? assetOutIn : "Đang cập nhật..."}
                align="center"
              />
            </View>
            {/* <TextView label="Chênh lệch" value={assetOutIn} width="95%" /> */}
          </View>
          <View>
            <Text style={stylesGlobal.header}>Tài khoản của bạn</Text>
            <AccountCard data={dataArray} />
            {!dataArray.length && (
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
                  {" "}
                  Bạn hiện chưa liên kết tài khoản nào
                </Text>
              </View>
            )}
            <ButtonComponent
              title="Thêm tài khoản"
              onPress={() => navigation.navigate("AddAccount")}
              overlayStyle={stylesGlobal.animatedButton}
              textStyle={stylesGlobal.buttonText}
              backgroundColor={stylesGlobal.animatedButton.backgroundColor}
            />
          </View>
          <View style={{ position: "relative", flexDirection: "column" }}>
            <Text style={stylesGlobal.header}>Lịch sử giao dịch</Text>
            <Transaction
              navigation={navigation}
              dataAllTransaction={dataAllTransaction}
              dataInTransaction={dataInTransaction}
              dataOutTransaction={dataOutTransaction}
              selectButton={selectButton}
              setSelectButton={setSelectButton}
            />
            <ButtonComponent
              title="Xem thêm giao dịch"
              onPress={() =>
                navigation.navigate("RouteCenter", { screen: "History" })
              }
              overlayStyle={stylesGlobal.animatedButton}
              textStyle={stylesGlobal.buttonText}
              backgroundColor={stylesGlobal.animatedButton.backgroundColor}
            />
          </View>
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text style={stylesGlobal.header}>Tháng {BeforeMonth}</Text>
            <LinearGradient
              colors={["#009A80", "#BACF89"]}
              style={{
                width: "95%",
                height: 70,
                borderRadius: 16,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 2 }}
            >
              <View
                style={{
                  position: "relative",
                  paddingHorizontal: 20,
                  justifyContent: "center",
                  flex: 1,
                  gap: -30,
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  {dateBefore && (
                    <Text
                      style={{
                        fontFamily: "Exo2_400Regular",
                        color: "white",
                        fontSize: 14,
                      }}
                    >
                      Tài sản ngày{" "}
                      {currentDate.getDate() + "/" + currentDate.getMonth()}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1.4, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontFamily: "Exo2_700Bold",
                      color: "white",
                      fontSize: 16,
                    }}
                  >
                    {beforeBalance ? beforeBalance : "Đang cập nhật..."}
                  </Text>
                </View>
              </View>
            </LinearGradient>
            <View
              style={{
                flexDirection: "row",
                width: "95%",
                justifyContent: "space-around",
                gap: 10,
              }}
            >
              <View style={{ flex: 1 }}>
                <BalanceView
                  label="Tiền vào"
                  backGroundColor="#e5f5f2"
                  value={assetInBefore ? assetInBefore : "Đang cập nhật..."}
                  logo={"UpIcon"}
                  align="flex-start"
                />
              </View>
              <View style={{ flex: 1 }}>
                <BalanceView
                  label="Tiền ra"
                  backGroundColor="#fbebeb"
                  value={assetOutBefore ? assetOutBefore : "Đang cập nhật..."}
                  logo={"DownIcon"}
                  align="flex-start"
                />
              </View>
            </View>
            <View style={{ width: "95%", position: "relative" }}>
              <BalanceView
                label="Tích lũy"
                backGroundColor="#fcecd0"
                value={assetOutInBefore ? assetOutInBefore : "Đang cập nhật..."}
                align="flex-start"
              />
              <View style={{ position: "absolute", right: 0 }}>
                <View
                  style={{
                    flexDirection: "column",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    alignItems: "flex-end",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "Exo2_700Bold",
                        fontSize: 13,
                        color: "#434343",
                      }}
                    >
                      {leftMonthBalanceBefore
                        ? leftMonthBalanceBefore[0] === "-"
                          ? leftMonthBalanceBefore
                          : "+ " + leftMonthBalanceBefore
                        : "Đang cập nhật"}
                    </Text>
                  </View>
                  <View>
                    {dateBefore && (
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Exo2_400Regular",
                          color: "#434343",
                        }}
                      >
                        so với tích lũy tháng{" "}
                        {(dateBefore as any).split("-").slice(1).join("/")}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <ButtonComponent
            title="Xem thêm thống kê"
            onPress={() =>
              navigation.navigate("RouteCenter", { screen: "Analyze" })
            }
            overlayStyle={[stylesGlobal.animatedButton, { top: -20 }]}
            textStyle={stylesGlobal.buttonText}
            backgroundColor={stylesGlobal.animatedButton.backgroundColor}
          />
          <View style={{ height: 50 }}></View>
        </View>
      </ScrollView>
    </>
  );
};

export default Dashboard;
