import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import LinearChart from "../components/Analyze/LineChart";
const data3 = [
  {
    account_balance: 10000,
    account_desc: "Tài khoản 1",
  },
  {
    account_balance: 10000,
    account_desc: "Tài khoản 2",
  },
  {
    account_balance: 1000,
    account_desc: "Tài khoản 3",
  },
];
import moment from "moment";
import {
  FormatDate,
  FormatDateCalendar,
  currencyFormat,
} from "../utils/function";
import Icon, { Icons } from "../components/Style/Icons";
import Logo from "../components/Header/Logo";
import { getData, removeData, getTime } from "../utils/function";
import {
  getBalanceUserInDate,
  getDataAnalysisLinearChart,
  getDataAccumulatedLinearChart,
} from "../api/userApi";
import { stylesGlobal } from "../components/Style/styles";
import Calendar from "../components/Analyze/Calendar";
import TextView from "../components/TextView";
import TreeMap from "../components/Analyze/Treemap";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { handleError } from "../utils/handleError";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { setAlert } from "../redux/alert";
const Analyze = ({ navigation }: { navigation: any }) => {
  const listMonth = [
    {
      name: "Tháng 01",
      id: "1",
    },
    {
      name: "Tháng 02",
      id: "2",
    },
    {
      name: "Tháng 03",
      id: "3",
    },
    {
      name: "Tháng 04",
      id: "4",
    },
    {
      name: "Tháng 05",
      id: "5",
    },
    {
      name: "Tháng 06",
      id: "6",
    },
    {
      name: "Tháng 07",
      id: "7",
    },
    {
      name: "Tháng 08",
      id: "8",
    },
    {
      name: "Tháng 09",
      id: "9",
    },
    {
      name: "Tháng 10",
      id: "10",
    },
    {
      name: "Tháng 11",
      id: "11",
    },
    {
      name: "Tháng 12",
      id: "12",
    },
  ];
  const [refreshing, setRefreshing] = useState(false);
  const [selectMonth, setSelectMonth] = useState(
    "Tháng " + (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [selectYear, setSelectYear] = useState(
    new Date().getFullYear().toString()
  );
  const [clicked, setClicked] = useState(false);
  const reload = useSelector((state: any) => state.reload.reload);

  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(
    FormatDateCalendar(
      new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString() as any
    )
  );
  const [currentBalanceInDate, setCurrentBalanceInDate] = useState(undefined);
  const [leftMonthBalanceInDate, setLeftMonthBalanceInDate] =
    useState(undefined);
  const [sumBalanceInCurrentDate, setSumBalanceInCurrentDate] =
    useState(undefined);
  const [dateLeftMonth, setDateLeftMonth] = useState(undefined);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date(
      new Date(
        getTime(
          new Date(new Date().getTime() + 7 * 60 * 60 * 1000).getMonth() - 2
        )
      ).getTime() +
        7 * 60 * 60 * 1000
    )
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
  );
  const [openStartDate, setOpenStarDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [data1, setData1] = useState(undefined);
  const [data2, setData2] = useState(undefined);
  const [castIn, setCastIn] = useState(undefined);
  const [castOut, setCastOut] = useState(undefined);
  const [scaleValue1] = useState(new Animated.Value(1));
  const [scaleValue2] = useState(new Animated.Value(1));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSelectMonth(
      "Tháng " + (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    setSelectedDate(() =>
      FormatDateCalendar(
        new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString() as any
      )
    );
    setStartDate(
      () =>
        new Date(
          new Date(getTime(endDate.getMonth() - 2)).getTime() +
            7 * 60 * 60 * 1000
        )
    );
    setEndDate(() => new Date(new Date().getTime() + 7 * 60 * 60 * 1000));

    setCastIn(() => undefined);
    setCastOut(() => undefined);
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setClicked(false);
    dispatch(setReload());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setSumBalanceInCurrentDate(() => undefined);
    setCurrentBalanceInDate(() => undefined);
    setLeftMonthBalanceInDate(() => undefined);
    setDateLeftMonth(() => undefined);
    (async () => {
      if (!selectedDate) return;
      try {
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        let res = await getBalanceUserInDate(token, selectedDate);
        console.log(res);
        if (res.error === undefined) throw new Error("Lỗi server");
        if (res.error) throw new Error(res.message);
        let d = new Date(selectedDate);
        d.setDate(0);
        setDateLeftMonth(
          () =>
            d.toISOString().split("T")[0].split("-").reverse().join("/") as any
        );
        setSumBalanceInCurrentDate(() => res.data.sumBalanceInCurrentDate);
        setCurrentBalanceInDate(() => res.data.data);
        setLeftMonthBalanceInDate(
          () =>
            ((res.data.sumBalanceInCurrentDate as any) -
              res.data.startingBalance) as any
        );
      } catch (error: any) {
        handleError(error, setAlert, dispatch, navigation);
      }
    })();
  }, [selectedDate, reload]);

  useEffect(() => {
    setData1(() => undefined);
    setData2(() => undefined);
    (async () => {
      try {
        if (!startDate || !endDate) return;
        // let StartDate = startDate.toISOString().split("T")[0];
        // let EndDate = endDate.toISOString().split("T")[0];
        let StartDate = startDate.toISOString();
        let EndDate = endDate.toISOString();
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        let res = await getDataAnalysisLinearChart(token, StartDate, EndDate);
        if (res.error === undefined) throw new Error("Lỗi server");
        if (res.error) throw new Error(res.message);
        setData1(() => res.data);
        res = await getDataAccumulatedLinearChart(token, StartDate, EndDate);
        if (res.error === undefined) throw new Error("Lỗi server");
        if (res.error) throw new Error(res.message);
        // console.log(res.data.dataBalance);
        setData2(() => res.data.dataBalance);
        setCastIn(() => res.data.cast_in);
        setCastOut(() => res.data.cast_out);
      } catch (error: any) {
        handleError(error, setAlert, dispatch, navigation);
      }
    })();
  }, [startDate, endDate, reload]);

  const animationValue = new Animated.Value(0);
  const handleButtonPress = (index: number) => {
    setActiveButtonIndex(index);
    console.log(index);
    Animated.timing(animationValue, {
      toValue: index,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const handleOnDismiss = () => {
    setOpenStarDate(false);
  };
  // const currentDate = new Date();
  // const timezoneOffset = currentDate.getTimezoneOffset();
  // console.log("Timezone Offset (minutes):", timezoneOffset);
  // const timezoneOffsetHours = timezoneOffset / 60;
  // console.log("Timezone Offset (hours):", timezoneOffsetHours);
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
        style={{
          flex: 1,
          backgroundColor: "white",
          position: "relative",
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        alwaysBounceVertical={false}
      >
        <View style={{ paddingBottom: 10 }}>
          <Text
            style={[stylesGlobal.header2, { marginBottom: 5, fontSize: 22 }]}
          >
            Báo cáo
          </Text>
          <Text style={[stylesGlobal.header, { fontSize: 16 }]}>
            Bức tranh tài sản
          </Text>
        </View>
        <View>
          {Platform.OS === "ios" ? (
            <View style={styles.dropdownSelector}>
              <TextView
                label="Chọn tháng"
                value={selectMonth}
                width="100%"
                onPress={() => {
                  setClicked(!clicked);
                }}
              />

              <View
                style={{
                  position: "absolute",
                  right: 0,
                  paddingHorizontal: 20,
                  top: 25,
                }}
              >
                {clicked ? (
                  <View style={{ position: "absolute", zIndex: -5 }}>
                    <Icon
                      name="chevron-down"
                      size={30}
                      type={Icons.Entypo}
                      style={{
                        color: "#434343",
                      }}
                    />
                  </View>
                ) : (
                  <View style={{ position: "absolute", zIndex: -5 }}>
                    <Icon
                      name="chevron-right"
                      size={30}
                      type={Icons.Entypo}
                      style={{
                        color: "#434343",
                      }}
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <Pressable
              style={({ pressed }: { pressed: boolean }) =>
                pressed && { opacity: 0.7 }
              }
              onPress={() => {
                setClicked(!clicked);
              }}
            >
              <View style={styles.dropdownSelector}>
                <TextView label="Chọn tháng" value={selectMonth} width="100%" />
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    paddingHorizontal: 20,
                    top: 25,
                  }}
                >
                  {clicked ? (
                    <Icon
                      name="chevron-down"
                      size={30}
                      type={Icons.Entypo}
                      style={{ color: "#434343" }}
                    />
                  ) : (
                    <Icon
                      name="chevron-right"
                      size={30}
                      type={Icons.Entypo}
                      style={{ color: "#434343" }}
                    />
                  )}
                </View>
              </View>
            </Pressable>
          )}
        </View>
        <View
          style={{
            position: "absolute",
            width: "100%",
            zIndex: clicked ? 1 : -1,
            height: "100%",
            elevation: clicked ? 1 : -1,
            top: 0,
          }}
        >
          {clicked ? (
            <Pressable
              onPress={() => setClicked(() => false)}
              style={{ height: "100%", paddingTop: 230 }}
            >
              <View style={styles.dropdownArea}>
                <ScrollView
                  nestedScrollEnabled={true}
                  alwaysBounceVertical={false}
                >
                  {listMonth.map((item: any, index: any) => {
                    return (
                      <TouchableOpacity
                        style={[styles.account]}
                        key={item.id}
                        onPress={() => {
                          setSelectMonth(() => item.name);
                          setClicked(false);
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </Pressable>
          ) : null}
        </View>

        <Calendar
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          selectMonth={selectMonth}
          selectYear={selectYear}
        />

        <TextView
          label={
            "Tổng tài sản tính đến ngày " + moment(selectedDate).format("DD/MM")
          }
          value={
            sumBalanceInCurrentDate !== undefined
              ? currencyFormat(sumBalanceInCurrentDate) + " đ"
              : "Đang cập nhật..."
          }
          width="95%"
        />
        <View
          style={{
            alignSelf: "center",
            width: "80%",
            paddingVertical: 5,
            height: 30,
          }}
        >
          {!!leftMonthBalanceInDate && (
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={stylesGlobal.textBold}>
                {(leftMonthBalanceInDate >= 0 ? "+ " : "") +
                  currencyFormat(leftMonthBalanceInDate) +
                  " đ "}
              </Text>
              <Text style={stylesGlobal.textRegular}>
                {"so với tài sản ngày " + dateLeftMonth}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            borderRadius: 10,
            height: 300,
            overflow: "hidden",
          }}
        >
          {currentBalanceInDate !== undefined ? (
            <TreeMap
              data={{ children: currentBalanceInDate }}
              sum={sumBalanceInCurrentDate}
            />
          ) : (
            <ContentLoader speed={0.5}>
              <Rect x="0" y="0" width="100%" height="30%" rx="4" ry="4" />
              <Rect x="0" y="100" width="100%" height="30%" rx="4" ry="4" />
              <Rect x="0" y="200" width="100%" height="30%" rx="4" ry="4" />
            </ContentLoader>
          )}
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={[stylesGlobal.header, { fontSize: 16 }]}>Dòng tiền</Text>
          {Platform.OS == "ios" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Animated.View
                style={{
                  width: "45%",
                  transform: [{ scale: scaleValue1 }],
                }}
              >
                <TextView
                  label="Thời gian bắt đầu"
                  value={FormatDate(startDate.toISOString()) as any}
                  width="100%"
                  onPress={() => {
                    Animated.timing(scaleValue1, {
                      toValue: 0.9,
                      duration: 100,
                      useNativeDriver: true,
                    }).start(() => {
                      Animated.timing(scaleValue1, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                      }).start();
                    });
                    setOpenStarDate(true);
                  }}
                />
              </Animated.View>
              <Animated.View
                style={{ width: "45%", transform: [{ scale: scaleValue2 }] }}
              >
                <TextView
                  label="Thời gian kết thúc"
                  value={FormatDate(endDate.toISOString()) as any}
                  width="100%"
                  onPress={async () => {
                    Animated.timing(scaleValue2, {
                      toValue: 0.9,
                      duration: 100,
                      useNativeDriver: true,
                    }).start(() => {
                      Animated.timing(scaleValue2, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                      }).start();
                    });
                    setOpenEndDate(true);
                  }}
                />
              </Animated.View>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Animated.View
                style={{ width: "45%", transform: [{ scale: scaleValue1 }] }}
              >
                <Pressable
                  onPress={() => {
                    Animated.timing(scaleValue1, {
                      toValue: 0.9,
                      duration: 100,
                      useNativeDriver: true,
                    }).start(() => {
                      Animated.timing(scaleValue1, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                      }).start();
                    });
                    setOpenStarDate(true);
                  }}
                >
                  <TextView
                    label="Thời gian bắt đầu"
                    value={FormatDate(startDate.toISOString()) as any}
                    width="100%"
                  />
                </Pressable>
              </Animated.View>
              <Animated.View
                style={{ width: "45%", transform: [{ scale: scaleValue2 }] }}
              >
                <Pressable
                  onPress={async () => {
                    Animated.timing(scaleValue2, {
                      toValue: 0.9,
                      duration: 100,
                      useNativeDriver: true,
                    }).start(() => {
                      Animated.timing(scaleValue2, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                      }).start();
                    });
                    setOpenEndDate(true);
                  }}
                >
                  <TextView
                    label="Thời gian kết thúc"
                    value={FormatDate(endDate.toISOString()) as any}
                    width="100%"
                  />
                </Pressable>
              </Animated.View>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              borderRadius: 30,
              width: "95%",
              height: 45,
              backgroundColor: "#e5f5f2",
              alignSelf: "center",
              overflow: "hidden",
              top: 10,
            }}
          >
            {["Tài sản", "Tích lũy"].map((state: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  activeButtonIndex === index && styles.activeButton,
                ]}
                onPress={() => handleButtonPress(index)}
              >
                <Animated.Text
                  style={[
                    styles.text,
                    activeButtonIndex === index && styles.activeText,
                  ]}
                >
                  {state}
                </Animated.Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              marginTop: 10,
              width: "95%",
              alignSelf: "center",
              height: 340,
            }}
          >
            {!data1 && !data2 ? (
              <ContentLoader speed={0.5}>
                <Rect x="0" y="0" width="100%" height="95%" rx="6" ry="6" />
              </ContentLoader>
            ) : (
              <></>
            )}
            {!activeButtonIndex ? (
              <View style={{ flex: 1 }}>
                {data1 && (data1 as any).length ? (
                  <LinearChart
                    data={data1}
                    colorLine="#009A80"
                    styleDate="D/M"
                  />
                ) : (
                  <Text
                    style={{
                      fontFamily: "Exo2_400Regular",
                      color: "#434343",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    Không có giao dịch để vẽ biểu đồ!!!
                  </Text>
                )}
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {data2 && (data2 as any).length > 1 ? (
                  <LinearChart
                    data={data2}
                    colorLine="#F5B544"
                    styleDate="MM/YY"
                  />
                ) : (
                  <Text
                    style={{
                      fontFamily: "Exo2_400Regular",
                      color: "#434343",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    Vui lòng chọn khoảng thời gian 2 tháng trở lên!!!
                  </Text>
                )}
              </View>
            )}
          </View>
          <View
            style={{
              width: "95%",
              backgroundColor: "#ccebe6",
              alignSelf: "center",
              borderRadius: 6,
              height: 60,
              flexDirection: "column",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Exo2_400Regular",
                fontSize: 12,
                color: "#434343",
              }}
            >
              Từ {FormatDate(startDate.toISOString()) as any} đến{" "}
              {FormatDate(endDate.toISOString()) as any}, tài sản của bạn đã
              thay đổi:
            </Text>

            <Text
              style={{
                fontFamily: "Exo2_700Bold",
                fontSize: 14,
                color: "#434343",
              }}
            >
              {castIn != undefined && castOut != undefined
                ? (castIn > castOut ? "+" : "") +
                  currencyFormat(castIn - castOut) +
                  " đ"
                : "Đang cập nhật..."}

              <Text style={{ fontSize: 12 }}>
                {castIn && castOut && data2 && data2[0]
                  ? (data2[0] as any).balance
                    ? " (" +
                      ((castIn - castOut) / (data2[0] as any).balance).toFixed(
                        2
                      ) +
                      ")"
                    : " (+100%)"
                  : ""}
              </Text>
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }}></View>
        {openStartDate && Platform.OS === "android" && (
          <RNDateTimePicker
            value={startDate}
            mode="date"
            display={"default"}
            locale="vi-VN"
            onChange={(event, selectedDate: any) => {
              setOpenStarDate(() => false);
              setStartDate(() => selectedDate);
            }}
            timeZoneOffsetInMinutes={0}
            maximumDate={endDate}
            minimumDate={
              new Date(
                new Date().getFullYear() - 1,
                new Date().getMonth(),
                new Date().getDate() - 1
              )
            }
          />
        )}
        {openEndDate && Platform.OS === "android" && (
          <RNDateTimePicker
            value={endDate}
            mode="date"
            display={"default"}
            locale="vi-VN"
            onChange={(event, selectedDate) => {
              setOpenEndDate(() => false);
              setEndDate(() => selectedDate as any);
            }}
            timeZoneOffsetInMinutes={0}
            maximumDate={new Date(new Date().getTime() + 7 * 60 * 60 * 1000)}
            minimumDate={startDate}
          />
        )}
        {Platform.OS === "ios" && (
          <>
            <DateTimePickerModal
              isVisible={openStartDate}
              maximumDate={endDate}
              mode="date"
              locale="vi_VN"
              date={startDate}
              onConfirm={(date) => {
                setOpenStarDate(() => false);
                setStartDate(date);
              }}
              onCancel={() => setOpenStarDate(() => false)}
            />

            <DateTimePickerModal
              isVisible={openEndDate}
              maximumDate={new Date()}
              minimumDate={startDate}
              mode="date"
              onChange={(date) => setEndDate(date)}
              date={endDate}
              onConfirm={(date) => {
                setOpenEndDate(() => false);
                setEndDate(date);
              }}
              onCancel={() => setOpenEndDate(() => false)}
            />
          </>
        )}
      </ScrollView>
    </>
  );
  // }
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    overflow: "hidden",
    borderRadius: 30,
  },
  text: {
    color: "#009a80",
    fontFamily: "Exo2_700Bold",
    fontSize: 13,
  },
  activeText: {
    fontFamily: "Exo2_700Bold",
    color: "white",
  },
  activeButton: {
    backgroundColor: "#009a80",
    borderRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  dropdownSelector: {
    width: "95%",
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 25,
    position: "relative",
  },
  icon: {
    width: 24,
    height: 24,
    color: "#434343",
  },
  dropdownArea: {
    width: "95%",
    overflow: "hidden",
    height: 300,
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 5,
    alignSelf: "center",
  },
  searchInput: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#8e8e8e",
    alignSelf: "center",
    marginTop: 10,
    paddingLeft: 20,
  },
  account: {
    width: "100%",
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
  },
  calendar: {
    bottom: 50,
    borderWidth: 1,
    borderColor: "gray",
    height: 370,
    width: "95%",
    alignSelf: "center",
  },
  linechart: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "95%",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    width: "100%",
    height: "30%",
    position: "absolute",
    bottom: 0,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 50,
    paddingVertical: 10,
    backgroundColor: "white",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  txt: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  screen: {
    flex: 1,
  },
  btnText: {
    position: "absolute",
    top: 0,
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
  },
  btnCancel: {
    left: 0,
  },
  btnDone: {
    right: 0,
  },
  textDate: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default Analyze;
