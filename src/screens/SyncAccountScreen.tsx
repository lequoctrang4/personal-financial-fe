import {
  View,
  ScrollView,
  Text,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { getAllFiAccount, syncTransaction } from "../api/userApi";
import { useEffect, useState } from "react";
import { getData, timeCurrent } from "../utils/function";
import { LinearGradient } from "expo-linear-gradient";
import ButtonComponent from "../components/Button/ButtonComponent";
import { handleError } from "../utils/handleError";
import LoadPending from "../components/Loading/LoadPending";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import LoadProgress from "../components/Loading/LoadProgress";
import { setAlert } from "../redux/alert";
export default function SyncAccount({ navigation }: { navigation: any }) {
  const [FiAccounts, setFiAccounts] = useState([]); // Tên ngân hàng
  const [selectedId, setSelectedId] = useState(-1); // Kiểm tra nút nhấn chọn ID nào
  const [loadProgress, setLoadProgress] = useState(false); //biến tín hiệu tải hoạt ảnh
  const [loadingConfirm, setLoadingConfirm] = useState(false); //

  const [timeCur, setTimeCur] = useState(timeCurrent());
  const reload = useSelector((state: any) => state.reload.reload);
  const dispatch = useDispatch();

  //Khi tín hiệu chọn ID của nút nhấn thay đổi, thực thi hàm đồng bộ nếu giá trị của selectedId khác -1
  useEffect(() => {
    if (selectedId === -1) return;
    (async () => {
      try {
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        if (selectedId === -1) return;
        let res = await syncTransaction(token, selectedId);
        // console.log(res);
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) {
          throw new Error(res.message);
        }
        setTimeout(() => {
          setLoadProgress(false);
          dispatch(
            setAlert({
              onConfirmPressed: () => {
                dispatch(setAlert({ show: false }));
              },
              onCancelPressed: () => {
                dispatch(setAlert({ show: false }));
              },
              showConfirm: false,
              showCancel: true,
              confirmButtonColor: undefined,
              cancelButtonColor: undefined,
              cancelTextColor: undefined,
              confirmTextColor: undefined,
              cancelText: "Quay lại",
              title: "Đồng bộ dữ liệu thành công!",
              message: "",
              show: true,
            })
          );
        }, 500);
        dispatch(setReload());
      } catch (error: any) {
        setTimeout(() => {
          setLoadProgress(false);
          setLoadingConfirm(false);
          handleError(error, setAlert, dispatch, navigation);
        }, 1000);
      }
      setSelectedId(() => -1);
    })();
  }, [selectedId]);

  // Hàm useEffect để tải lại dữ liệu của các thẻ khi có tín hiệu reload
  useEffect(() => {
    setTimeCur(timeCurrent());
    (async () => {
      if (selectedId == -1) setLoadProgress(true);
      try {
        let token = await getData("token");
        if (!token)
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        let res = await getAllFiAccount(token);
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);
        if (!res.data.length) throw new Error("Bạn chưa liên kết tài khoản");

        setFiAccounts(() => res.data);
        setTimeout(() => {
          setLoadProgress(false);
          setLoadingConfirm(false);
        }, 1000);
        if (!res.data.length) throw new Error("Bạn chưa liên kết tài khoản");
      } catch (error: any) {
        setTimeout(() => {
          setLoadingConfirm(false);
          setLoadProgress(false);
          handleError(error, setAlert, dispatch, navigation);
        }, 1000);
      }
    })();
    // console.log("Tín hiệu loadProgress có giá trị là: ", loadProgress);
  }, [reload]);

  //Hàm tính độ chênh lệch về thời gian thẻ đã được đồng bộ so với thời gian hiện tại
  const timeDifferenceAsync = (timeDifference: number) => {
    // const startDate = new Date(dataStartDate);

    // console.log(timeDifference);
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    // console.log(`Thời gian hiện tại ${timeCurrent()}`);
    const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);
    // console.log(
    //   `Chênh lệch: ${hoursDifference} giờ, ${minutesDifference} phút, ${secondsDifference} giây`
    // );

    if (hoursDifference < 0 || minutesDifference < 0 || secondsDifference < 0)
      return `1 giây`;
    else if (hoursDifference == 0 && minutesDifference == 0)
      return `${secondsDifference} giây`;
    else if (hoursDifference != 0) {
      return `${hoursDifference} giờ ${minutesDifference} phút`;
    } else {
      return `${minutesDifference} phút`;
    }
  };

  if (loadProgress) {
    return <LoadProgress />;
  } else {
    return (
      <>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "white",
              zIndex: 2,
              elevation: 0,
              position: "relative",
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            alwaysBounceVertical={false}
          >
            <View style={{ gap: 0 }}>
              {FiAccounts?.length && !loadProgress ? (
                (FiAccounts as any).map((data: any, index: any) => (
                  <View key={index}>
                    <LinearGradient
                      colors={JSON.parse(data.FiService.card_color)}
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
                          <View
                            style={{
                              flex: 1,
                              padding: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Exo2_400Regular",
                                fontSize: 12,
                                color: "white",
                              }}
                            >
                              {data.legal_id}
                            </Text>
                            {/* <Image
                        source={{ uri: data.logo }}
                        style={{ width: 30, height: 30 }}
                      /> */}
                          </View>
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
                            <Text
                              style={{
                                fontFamily: "Exo2_400Regular",
                                fontSize: 12,
                                color: "white",
                              }}
                            >
                              {data.FiService.fi_name}
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
                              {data.FiService.type}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                    <Text
                      style={{
                        fontFamily: "Exo2_400Regular",
                        fontSize: 14,
                        color: "#434343",
                        textAlign: "center",
                        paddingTop: 5,
                      }}
                    >
                      Lần đồng bộ cuối cùng vào lúc{" "}
                      <Text
                        style={{
                          fontFamily: "Exo2_700Bold",
                          fontWeight: "400",
                        }}
                      >
                        {timeDifferenceAsync(
                          Number(new Date(timeCur)) -
                            Number(new Date(data.last_date_sync))
                        )}
                      </Text>{" "}
                      trước
                    </Text>
                    <ButtonComponent
                      onPress={() => {
                        dispatch(
                          setAlert({
                            onConfirmPressed: () => {
                              setSelectedId(() => data.id);
                              setLoadingConfirm(true);
                              dispatch(setAlert({ show: false }));
                            },
                            onCancelPressed: () => {
                              dispatch(setAlert({ show: false }));
                            },
                            showCancel: true,
                            showConfirm: true,
                            confirmButtonColor: undefined,
                            cancelButtonColor: undefined,
                            cancelTextColor: undefined,
                            confirmTextColor: undefined,
                            cancelText: "Quay lại",
                            confirmText: "Đồng bộ ngay",
                            title: "Bạn chắc chắn chứ?",
                            message:
                              "Dữ liệu về tài khoản và ngân hàng sẽ được cập nhập ngay lập tức!",
                            show: true,
                          })
                        );
                      }}
                      disabled={loadingConfirm} // Không cho phép nhấn nút trong khi đang loading
                      overlayStyle={{
                        height: 45,
                        width: "95%",
                        alignSelf: "center",
                        marginVertical: 15,
                        marginBottom: 30,
                      }}
                      title="Đồng bộ giao dịch và tài khoản"
                      backgroundColor="#e5f5f2"
                      textStyle={{ color: "#009A80", opacity: 0.7 }}
                    >
                      {loadingConfirm && selectedId == data.id ? (
                        <ActivityIndicator size="small" color="#009A80" />
                      ) : undefined}
                    </ButtonComponent>
                  </View>
                ))
              ) : loadProgress == false ? (
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
                    Bạn hiện chưa liên kết tài khoản nào
                  </Text>
                </View>
              ) : (
                <Text></Text>
              )}
            </View>
          </ScrollView>
          {loadProgress && (
            // <View style={{ backgroundColor: "black", opacity: 0.5 }}>
            <Modal
              hardwareAccelerated={true}
              visible={true}
              animationType="fade"
              // statusBarTranslucent={true}
              transparent={true}
              style={{
                height: Dimensions.get("window").height - 80,
              }}
            >
              <LoadPending />
            </Modal>
            // </View>
          )}
        </View>
      </>
    );
  }
}
