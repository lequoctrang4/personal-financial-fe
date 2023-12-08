import React, { useState, useEffect, useCallback } from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
} from "react-native";
import { TextInput as RNTextInput } from "react-native";
import CustomCalendar from "../components/History/CustomCalendar";

import Logo from "../components/Header/Logo";
import Icon, { Icons } from "../components/Style/Icons";
import { getData, getDateofBeforeMonth } from "../utils/function";

import SearchFilter from "../components/History/SearchFilter";
import SearchAccount from "../components/History/SearchAccount";
import { getAllTransactions, getAccounts } from "../api/userApi";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Transaction from "../components/Transaction/Transaction";
import LogOutLoader from "../components/Loading/LogOutLoader";
import TextView from "../components/TextView";
import { stylesGlobal } from "../components/Style/styles";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
LocaleConfig.locales["Vie"] = {
  monthNames: [
    "Tháng 01",
    "Tháng 02",
    "Tháng 03",
    "Tháng 04",
    "Tháng 05",
    "Tháng 06",
    "Tháng 07",
    "Tháng 08",
    "Tháng 09",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ],
  dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
  dayNames: ["2", "3", "4", "5", "6", "7", "8"],
  today: "Oh Yeah",
};
import { handleError } from "../utils/handleError";
import LoadProgress from "../components/Loading/LoadProgress";
import { setAlert } from "../redux/alert";

const width = Dimensions.get("window").width;
LocaleConfig.defaultLocale = "Vie";
const History = ({ navigation }: { navigation: any }) => {
  const [stopFetchMore, setStopFetchMore] = useState(true); // biến Logic kiểm tra việc thực hiện tải thêm giao dịch
  const [refreshing, setRefreshing] = useState(false);
  const [loadProgress, setLoadProgress] = useState(false);
  const reload = useSelector((state: any) => state.reload.reload);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [dataAllTransaction, setDataAllTransaction] = useState<any[]>([]); // Dữ liệu tiền vào và tiền ra
  const [dataInTransaction, setDataInTransaction] = useState<any[]>([]); // Dữ liệu tiền vào
  const [dataOutTransaction, setDataOutTransaction] = useState<any[]>([]); // Dữ liệu tiền ra
  const [selectAccount, setSelectAccount] = useState("Tất cả tài khoản");
  const [account, setAccount] = useState(dataAllTransaction);
  const [clicked, setClicked] = useState(false);

  const [isVisible, setIsVisible] = useState(false); // Biến logic hiển thị Modal của việc tìm kiếm giao dịch
  const [dataSearchAccount, setDataSearchAccount] = useState([]); // Dữ liệu các thẻ ngân hàng
  const [num, setNum] = useState(0); // Số giao dịch load thêm của cả tiền vào và tiền ra
  const [numIn, setNumIn] = useState(0); // Số giao dịch load thêm của tiền vào
  const [numOut, setNumOut] = useState(0); // Số giao dịch load thêm của tiền ra
  const [loadMore, setLoadMore] = useState(false); // Load 6 giao dịch lần đầu tiền, biến này thàn true mới thực hiện load thêm
  const [fiName, setFiName] = useState(""); // Tên ngân hàng
  const [selectButton, setSelectButton] = useState(0); // Trạng thái của các nút nhấn

  const [fromDate, setFromDate] = useState(
    getDateofBeforeMonth(new Date().getMonth() - 5)
  );
  // Ngày bắt đầu lấy giao dịch
  const [toDate, setToDate] = useState(
    getDateofBeforeMonth(new Date().getMonth() + 1)
  );
  // Ngày kết thúc lấy giao dịch
  const [asyncToken, setAsyncToken] = useState("");

  const onRefresh = useCallback(() => {
    setNum(0);
    setNumIn(0);
    setNumOut(0);
    setRefreshing(true);
    setDataSearchAccount([]);
    setSelectAccount("Tất cả tài khoản");
    setAccount(dataAllTransaction);
    setClicked(false);
    setInput("");
    dispatch(setReload());
    setLoadMore(false);
    setFromDate(getDateofBeforeMonth(new Date().getMonth() - 5));
    setToDate(getDateofBeforeMonth(new Date().getMonth() + 1));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  //Hàm thực hiện lấy thêm giao dịch khi người dùng lướt
  const handleLoadMore = () => {
    setLoadMore(true);
    try {
      if (!stopFetchMore) {
        switch (selectButton) {
          case 0:
            (async () => {
              let token = await getData("token");
              if (!token) {
                throw new Error(
                  "Bạn không có phân quyền truy cập vào dữ liệu!"
                );
              }
              let res = await getAllTransactions(
                token,
                fromDate,
                toDate,
                undefined,
                undefined,
                10,
                undefined,
                6 + num,
                selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
              );
              if (res.error === undefined) throw new Error("Lỗi Server");
              if (res.error) throw new Error(res.message);
              if (res.data?.length >= 1) {
                setDataAllTransaction([...dataAllTransaction, ...res.data]);
                setNum(num + 10);
              } else {
                setLoadMore(false);
              }
            })();
            break;
          case 1:
            (async () => {
              let token = await getData("token");

              if (!token) {
                throw new Error(
                  "Bạn không có phân quyền truy cập vào dữ liệu!"
                );
              }
              let res = await getAllTransactions(
                token,
                fromDate,
                toDate,
                1,
                undefined,
                10,
                undefined,
                6 + numIn,
                selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
              );
              if (res.error === undefined) throw new Error("Lỗi Server");
              if (res.error) throw new Error(res.message);
              if (res.data?.length >= 1) {
                setNumIn(numIn + 10);
                setDataInTransaction([...dataInTransaction, ...res.data]);
              } else {
                setLoadMore(false);
              }
            })();
            break;
          case 2:
            (async () => {
              let token = await getData("token");
              if (!token) {
                throw new Error(
                  "Bạn không có phân quyền truy cập vào dữ liệu!"
                );
              }
              let res = await getAllTransactions(
                token,
                fromDate,
                toDate,
                undefined,
                1,
                10,
                undefined,
                6 + numOut,
                selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
              );
              if (res.error === undefined) throw new Error("Lỗi Server");
              if (res.error) throw new Error(res.message);
              if (res.data?.length >= 1) {
                setNumOut(numOut + 10);
                setDataOutTransaction([...dataOutTransaction, ...res.data]);
              } else {
                setLoadMore(false);
              }
            })();
            break;
          default:
            break;
        }
      }
    } catch (error) {
      handleError(error, setAlert, dispatch, navigation);
    }
    setLoadMore(false);
  };

  //Chuyển tín hiệu của Modal thành true, bật Modal
  const handleisVisible = () => {
    setIsVisible(!isVisible);
    setInput("");
    setClicked(false);
  };
  // Cập nhật input về rỗng
  const handleClearInput = () => {
    // console.log("Input là", input);
    setInput("");
  };

  //Thực hiện lấy dữ liệu giới hạn 6 dòng ở lần đầu tiên tải hoặc reload
  useEffect(() => {
    if (!loadMore) {
      setLoadProgress(true);
      (async () => {
        try {
          let token = await getData("token");
          if (!token) {
            throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
          }
          let res = await getAccounts(token);
          if (res.error === undefined) throw new Error("Lỗi Server");
          if (res.error) throw new Error(res.message);
          setDataSearchAccount(res.data);

          res = await getAllTransactions(
            token,
            fromDate,
            toDate,
            undefined,
            undefined,
            6
          );
          if (res.error === undefined) throw new Error("Lỗi Server");
          if (res.error) throw new Error(res.message);
          setDataAllTransaction(res.data);

          res = await getAllTransactions(
            token,
            fromDate,
            toDate,
            1,
            undefined,
            6
          );
          if (res.error === undefined) throw new Error("Lỗi Server");
          if (res.error) throw new Error(res.message);
          setDataInTransaction(res.data);
          res = await getAllTransactions(
            token,
            fromDate,
            toDate,
            undefined,
            1,
            6
          );
          if (res.error === undefined) throw new Error("Lỗi Server");
          if (res.error) throw new Error(res.message);
          setDataOutTransaction(res.data);
          setTimeout(() => {
            setLoadProgress(false);
          }, 500);
        } catch (error: any) {
          setTimeout(() => {
            setLoadProgress(false);
            handleError(error, setAlert, dispatch, navigation);
          }, 500);
        }
      })();
    }
  }, [reload]);

  //Hàm cập nhật dữ liệu khi có sự thay đổi về việc chọn tài khoản, ngày bắt đầu hoặc ngày kết thúc
  useEffect(() => {
    (async () => {
      try {
        let token = await getData("token");
        if (!token) {
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        }
        setAsyncToken(token);
        let res = await getAccounts(token);
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);
        console.log("Qua ải 1");
        setDataSearchAccount(res.data);
        res = await getAllTransactions(
          token,
          fromDate,
          toDate,
          undefined,
          undefined,
          6,
          undefined,
          undefined,
          selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
        );

        // console.log(res);
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);

        setDataAllTransaction(res.data);
        setStopFetchMore(false);

        res = await getAllTransactions(
          token,
          fromDate,
          toDate,
          1,
          undefined,
          6,
          undefined,
          undefined,
          selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
        );
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);
        setDataInTransaction(res.data);
        setStopFetchMore(false);

        res = await getAllTransactions(
          token,
          fromDate,
          toDate,
          undefined,
          1,
          6,
          undefined,
          undefined,
          selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
        );
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);
        setDataOutTransaction(res.data);
        setStopFetchMore(false);
      } catch (error: any) {
        setStopFetchMore(false);
        handleError(error, setAlert, dispatch, navigation);
      }
    })();
  }, [fromDate, toDate, selectAccount]);

  if (loadProgress) {
    return <LoadProgress divide={1} />;
  } else {
    return (
      <>
        <View style={{ height: 80, width: "100%", backgroundColor: "white" }}>
          <Logo />
        </View>
        <ScrollView
          style={{
            backgroundColor: "white",
            zIndex: 0,

            position: "relative",
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} />
          }
          onScrollBeginDrag={() => {
            handleLoadMore();
          }}
          onScrollEndDrag={() => {
            handleLoadMore();
          }}
          persistentScrollbar
          alwaysBounceVertical={false}
          snapToEnd={true}
        >
          <View style={{ position: "relative" }}>
            <Text style={[stylesGlobal.header2, { paddingLeft: 7 }]}>
              {" "}
              Lịch sử giao dịch
            </Text>
            <KeyboardAvoidingView
              style={{ zIndex: 0 }}
              behavior={Platform.OS === "android" ? "position" : "height"}
            >
              <View
                style={{
                  left: 10,
                  padding: 10,
                  flexDirection: "row",
                  width: "95%",
                  backgroundColor: "#d9dbda",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Icons.Feather
                  name="search"
                  size={20}
                  color="black"
                  style={{ marginLeft: 1, marginRight: 4 }}
                />
                <View style={{ width: "100%" }}>
                  <RNTextInput
                    style={{
                      fontSize: 15,
                    }}
                    placeholder="Tìm kiếm"
                    value={input}
                    onChangeText={(text) => {
                      setInput(text);
                    }}
                    onPressIn={() => {
                      setIsVisible(true);
                    }}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
          <View
            style={{
              position: "absolute",
              zIndex: 3,
              top: 180,
              alignSelf: "center",
              width: "100%",
            }}
          >
            {isVisible && (
              <Modal
                animationType="fade"
                transparent={false}
                visible={isVisible}
                statusBarTranslucent={true}
              >
                <KeyboardAvoidingView
                  style={{
                    zIndex: 0,
                    backgroundColor: "#8e8e8e",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      paddingBottom: 10,
                      paddingHorizontal: 15,
                      paddingVertical: 30,

                      flexDirection: "row",
                      width: "100%",
                      backgroundColor: "white",
                      // borderRadius: 10,
                      alignItems: "center",
                      borderBottomColor: "#c0c0c0",
                      borderBottomWidth: 1.5,
                    }}
                  >
                    <Pressable
                      android_ripple={{ color: "gray" }}
                      style={({ pressed }: { pressed: boolean }) =>
                        pressed && { opacity: 0.5 }
                      }
                      onPress={handleisVisible}
                    >
                      <View
                        style={{
                          paddingRight: 10,
                          alignItems: "center",
                          width: 40,
                          flex: 1,
                        }}
                      >
                        <Icons.Ionicons
                          name="arrow-back"
                          size={25}
                          color="black"
                        />
                      </View>
                    </Pressable>

                    <View
                      style={{
                        flexDirection: "row",
                        width: !input ? "84%" : "90%",
                        backgroundColor: "white",
                        alignItems: "center",
                        height: 30,
                        borderColor: "#c0c0c0",
                        borderRadius: 20,
                        borderWidth: 0.5,
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          flex: 13,
                        }}
                      >
                        <RNTextInput
                          style={{
                            fontSize: 15,
                            paddingLeft: 10,
                          }}
                          placeholder="Tìm kiếm"
                          value={input}
                          onChangeText={(text) => setInput(text)}
                          inputMode="search"
                          underlineColorAndroid="transparent"
                          autoCorrect={false}
                          enablesReturnKeyAutomatically
                          dataDetectorTypes="phoneNumber"
                          returnKeyType="search"
                          onSubmitEditing={() =>
                            console.log("Đang tìm kiếm:", input)
                          }
                          keyboardType="web-search"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          height: 25,
                          alignItems: "center",
                        }}
                      >
                        <Pressable
                          android_ripple={{ color: "#ccc" }}
                          onPress={() => {
                            console.log("Nhấn nút x");
                            handleClearInput();
                          }}
                        >
                          {input != "" ? (
                            <Icons.Ionicons
                              name="close"
                              size={24}
                              color="black"
                            />
                          ) : (
                            <Text> </Text>
                          )}
                        </Pressable>
                      </View>
                    </View>
                    <View
                      style={{
                        alignSelf: "center",
                        // backgroundColor: "red",
                        paddingLeft: 5,
                        height: 30,
                        width: 25,
                      }}
                    ></View>
                  </View>
                </KeyboardAvoidingView>
                <SearchFilter input={input} setInput={setInput} />
              </Modal>
            )}
          </View>

          {Platform.OS === "ios" ? (
            <View
              style={{
                width: "95%",
                flex: 11,
                height: 50,
                alignSelf: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <TextView
                label={"Lọc theo tài khoản"}
                value={
                  selectAccount === "Tất cả tài khoản"
                    ? `${selectAccount}`
                    : `${selectAccount} - ${fiName}`
                }
                width={"100%"}
                onPress={() => setClicked(!clicked)}
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
                  <View style={{ position: "absolute", zIndex: -10 }}>
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
                  <View style={{ position: "absolute", zIndex: -10 }}>
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
              // style={styles.dropdownSelector}
              onPress={() => {
                setClicked(!clicked);
              }}
              // android_ripple={{ color: "#ccc" }}
              style={({ pressed }: { pressed: boolean }) =>
                pressed && {
                  opacity: 0.75,
                }
              }
            >
              <View
                style={{
                  width: "95%",
                  flex: 11,
                  flexDirection: "row",
                  height: 50,
                  alignSelf: "center",
                  position: "relative",
                }}
              >
                <View style={{ flex: 10, position: "absolute", width: "100%" }}>
                  <TextView
                    label={"Lọc theo tài khoản"}
                    value={
                      selectAccount === "Tất cả tài khoản"
                        ? `${selectAccount}`
                        : `${selectAccount} - ${fiName}`
                    }
                    width={"100%"}
                  />
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    alignSelf: "flex-end",
                    left: width * 0.85,
                    top: 25,
                    flex: 1,
                    // backgroundColor: "red",
                    position: "absolute",
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

          <View style={{ alignItems: "center", zIndex: 2 }}>
            <View
              style={{
                position: "absolute",
                zIndex: 1,
                width: "95%",
                alignItems: "center",
              }}
            >
              {clicked && (
                <View style={styles.dropdownArea}>
                  {/* <TextInput
                ref={searchRef}
                placeholder="Tìm kiếm"
                style={styles.searchInput}
                onChangeText={(input) => {
                  onSearch(input);
                }}
              /> */}

                  <SearchAccount
                    data={dataSearchAccount}
                    setSelectAccount={setSelectAccount}
                    setClicked={setClicked}
                    setNum={setNum}
                    setNumIn={setNumIn}
                    setNumOut={setNumOut}
                    setFiName={setFiName}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                // position: "absolute",
                position: "relative",
                alignItems: "center",
                top: 30,
              }}
            >
              <CustomCalendar
                setFromDate={setFromDate}
                setToDate={setToDate}
                reload={reload}
                setNum={setNum}
                setNumIn={setNumIn}
                setNumOut={setNumOut}
                selectAccount={selectAccount}
                navigation={navigation}
              />
            </View>
          </View>
          {/* <View>
        <DotCalendar />
      </View> */}
          <View
            style={{ position: "relative", flexDirection: "column", top: 20 }}
          >
            <Transaction
              navigation={navigation}
              dataAllTransaction={dataAllTransaction}
              dataInTransaction={dataInTransaction}
              dataOutTransaction={dataOutTransaction}
              selectButton={selectButton}
              setSelectButton={setSelectButton}
            />
          </View>

          <View style={{ height: 120 }}></View>
        </ScrollView>
      </>
    );
  }
  // }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  dropdownSelector: {
    width: "95%",
    height: 50,
    alignSelf: "center",
    top: 10,
    zIndex: 0,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    right: 32,
    top: 7,
  },
  dropdownArea: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    top: 20,

    // position: "relative",
    backgroundColor: "#fff",
    elevation: 5,
    // alignSelf: "center",
  },
  dropSelect: {
    width: "100%",
    alignItems: "flex-start",
    fontFamily: "Exo2_600SemiBold",
    backgroundColor: "#fff",

    borderWidth: 0.5,
    borderRadius: 2,
  },
  searchInput: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#8e8e8e",
    alignSelf: "center",
    marginTop: 6,
    paddingLeft: 20,
  },
  account: {
    width: "90%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#8e8e8e",
    alignSelf: "center",
    justifyContent: "center",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    // width: "100%",
    alignSelf: "center",
    width: 370,
    borderRadius: 10,
  },
  centeredView: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#fff",
    position: "relative",
  },
  modalView: {
    // margin: 20,
    // backgroundColor: "#c0c0c0",
    // alignItems: "center",
    // justifyContent: "center",
    // borderRadius: 20,
    // padding: 120,
    // width: "97%",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
});

export default History;
