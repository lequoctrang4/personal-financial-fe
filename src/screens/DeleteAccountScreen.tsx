import React, { useState, useEffect, useCallback } from "react";

import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getAccounts, deleteAccounts } from "../api/userApi";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Header/Logo";
import { stylesGlobal, stylesSuccessScreen } from "../components/Style/styles";
import { currencyFormat, getData, removeData } from "../utils/function";
import { handleError } from "../utils/handleError";
import ButtonComponent from "../components/Button/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import { showMessage } from "react-native-flash-message";
import LoadProgress from "../components/Loading/LoadProgress";
import { setAlert } from "../redux/alert";
const AccountBank = ({ navigation }: { navigation: any }) => {
  const [dataArray, setDataArray] = useState([]); // Dữ liệu các thẻ ngân hàng
  const [refreshing, setRefreshing] = useState(false);
  const [idAccount, setIdAccount] = useState(-1); // ID Account của thẻ tương ứng
  const [idFinancial, setIdFinancial] = useState(-1); // ID Financial của thẻ tương ứng
  const [selectedId, setSelectedId] = useState(-1); // Kiểm tra người dùng có chọn thẻ chưa

  const [loadProgress, setLoadProgress] = useState(false); // Biến thể hiện tiến trình kiểm tra
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  //Biến click thể hiện việc người dùng nhấn vào nút hủy liên kết

  const reload = useSelector((state: any) => state.reload.reload);
  const dispatch = useDispatch();
  navigation.setOptions({
    headerTitleStyle: {
      fontFamily: "Exo2_700Bold",
      color: "#434343",
      fontSize: 18,
    },
  });
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // setLengthData(0);
    setDataArray([]);
    dispatch(setReload());
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  //Cập nhật dữ liệu các thẻ khi nhấn hủy liên kết hoặc thực hiện reload trang
  useEffect(() => {
    (async () => {
      if (selectedId == -1) setLoadProgress(true);
      try {
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        let res = await getAccounts(token);
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);
        if (!res.data.length) throw new Error("Bạn chưa liên kết tài khoản");

        setTimeout(() => {
          setDataArray(res.data);
          setLoadProgress(false);
        }, 350);
      } catch (error: any) {
        setTimeout(() => {
          setLoadProgress(false);
          handleError(error, setAlert, dispatch, navigation);
        }, 350);
      }
      console.log(selectedId);
    })();
  }, [reload, selectedId]);

  // Khi nhấn nút hủy liên kết, hiển thị Alert thông báo hủy liên kết
  const handleUnlinkBank = (id_financial: any, id_account: any) => {
    dispatch(
      setAlert({
        onConfirmPressed: () => {
          setSelectedId(() => id_account);
          setIdAccount(id_account);
          setIdFinancial(id_financial);
          setLoadingConfirm(true);
          dispatch(setAlert({ show: false }));
        },
        onCancelPressed: () => {
          dispatch(setAlert({ show: false }));
        },
        show: true,
        showCancel: true,
        showConfirm: true,
        title: "Bạn chắc chắn chứ?",
        cancelText: "Quay lại",
        confirmText: "Hủy liên kết",
        message:
          "Mọi dữ liệu giao dịch liên quan đến tài khoản hủy liên kết sẽ bị xóa và" +
          " không thể khôi phục!",
      })
    );
  };

  //Sau khi nhấn xác nhận hủy liên kết tài khoản, idAccount và idFinancial thay đổi
  //Thực hiện gọi API và hủy liên kết tài khoản
  useEffect(() => {
    if (idAccount === -1 || idFinancial === -1) return;
    (async () => {
      try {
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        let res = await deleteAccounts(token, idFinancial, idAccount);
        if (res.error === undefined) throw new Error("Lỗi server");
        if (res.error) throw new Error(res.message);
        if (res.error == 0) {
          setTimeout(() => {
            setLoadingConfirm(false);
            showMessage({
              message: "Xóa tài khoản thành công",
              backgroundColor: "#009A80",
            });
          }, 350);
        } else if (res.error == 1) {
          setTimeout(() => {
            setLoadingConfirm(false);
            showMessage({
              message: "Xóa tài khoản thất bại",
              backgroundColor: "#F24C4C",
            });
          }, 350);
        }
        dispatch(setReload());
      } catch (error: any) {
        setLoadingConfirm(false);
        setLoadProgress(false);
        handleError(error, setAlert, dispatch, navigation);
      }
    })();
  }, [idAccount, idFinancial]);

  if (loadProgress) {
    return <LoadProgress />;
  } else {
    return (
      <>
        <ScrollView
          style={stylesSuccessScreen.container}
          bounces={false}
          alwaysBounceVertical={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            {dataArray.length ? (
              <Text style={stylesSuccessScreen.header}>
                Bạn đang liên kết {dataArray.length} tài khoản
              </Text>
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
                  {" "}
                  Bạn hiện chưa liên kết tài khoản nào
                </Text>
              </View>
            ) : (
              <Text></Text>
            )}
          </View>

          <View style={{ flex: 1, gap: 20 }}>
            <View style={{ gap: 0 }}>
              {dataArray.map((data: any, index: any) => (
                <View key={index}>
                  <LinearGradient
                    colors={JSON.parse(data.card_color)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.2, y: 0 }}
                    style={{
                      borderRadius: 15,
                      borderColor: "#C0C0C0",
                      borderWidth: 1,
                      position: "relative",
                      width: "95%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        position: "relative",
                        flexDirection: "column",
                        height: 200,
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
                            fontFamily: "Exo2_700Bold",
                            flex: 1,
                            color: "white",
                            fontSize: 14,
                            padding: 20,
                          }}
                        >
                          {currencyFormat(data.account_balance) + " đ"}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            padding: 20,
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          {/* <Svg width="8" height="8" viewBox="0 0 8 8">
                          <Circle cx="4" cy="4" r="4" fill="#04B00B" />
                        </Svg> */}
                          <Text
                            style={{
                              fontFamily: "Exo2_400Regular",
                              fontSize: 12,
                              color: "white",
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
                            color: "white",
                            fontSize: 14,
                            paddingHorizontal: 20,
                            fontFamily: "Exo2_700Bold",
                          }}
                        >
                          {data.account_number}
                        </Text>
                      </View>
                      <View style={{ flex: 2 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingHorizontal: 20,
                          }}
                        >
                          <Text
                            style={{
                              flex: 1,
                              color: "white",
                              fontFamily: "Exo2_400Regular",
                              fontSize: 13,
                            }}
                          >
                            {data.account_name}
                          </Text>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 14,
                              fontFamily: "Exo2_400Regular",
                              color: "white",
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
                  </LinearGradient>
                  <ButtonComponent
                    onPress={() => {
                      handleUnlinkBank(data.id_financial, data.id);
                    }}
                    disabled={loadingConfirm} // Không cho phép nhấn nút trong khi đang loading
                    overlayStyle={{
                      height: 45,
                      width: "95%",
                      alignSelf: "center",
                      marginVertical: 15,
                      marginBottom: 30,
                    }}
                    title="Hủy liên kết"
                    backgroundColor="rgba(251, 231, 239, 1)"
                    textStyle={{ color: "#DA0000", opacity: 0.7 }}
                  >
                    {loadingConfirm && selectedId == data.id ? (
                      <ActivityIndicator size="small" color="#009A80" />
                    ) : undefined}
                  </ButtonComponent>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  // }
};

export default AccountBank;
