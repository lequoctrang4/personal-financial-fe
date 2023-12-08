import React, { useState, useEffect } from "react";

import {
  Text,
  View,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
} from "react-native";

import { WebView } from "react-native-webview";
import { createGrantToken, getBankhubToken } from "../api/userApi";
import { REDIRECT_URI } from "@env";
import Logo from "../components/Header/Logo";
import { storeData, getData } from "../utils/function";
import { stylesAddAccount } from "../components/Style/styles";
import { handleError } from "../utils/handleError";
import ButtonComponent from "../components/Button/ButtonComponent";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/alert";
import LoadProgress from "../components/Loading/LoadProgress";
const AddAccount = ({ navigation }: { navigation: any }) => {
  const [loadProgress, setLoadProgress] = useState(false); // Tín hiệu về tiến độ gọi API, tải dữ liệu
  const [selectBank, setSelectBank] = useState(false); // TÍn hiệu để bật, tắt WebView BankHub
  const [grantToken, setGrantToken] = useState("");
  const [publicToken, setPublicToken] = useState("");

  const dispatch = useDispatch();

  //Hàm tạo grantToken để gọi WebView Bankhub
  const HandleWebView = async () => {
    try {
      let token = await getData("token");
      if (!token)
        throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
      let res = await createGrantToken(
        {
          url: `${REDIRECT_URI}`,
        },
        token
      );
      if (res.error === undefined) throw new Error("Lỗi server!");
      if (res.error) throw new Error(res.message);
      setGrantToken(res.data.grantToken);
      setSelectBank(true); // Tín hiệu bật WebView
    } catch (error) {
      handleError(error, setAlert, dispatch, navigation);
    }
  };

  //Hàm đổi publicToken sau khi đã liên kết thành công để lấy AccessToken, thực hiện lấy giao dịch
  const ExchangeToken = async (data: string) => {
    setLoadProgress(true);
    try {
      let token = await getData("token");
      if (!token)
        throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
      let res = await getBankhubToken(
        {
          public_token: data,
          number_month: 6,
        },
        token
      );
      if (res.error === undefined) throw new Error("Lỗi server");
      if (res.error) throw new Error(res.message);
      storeData("errorLink", "0");
      setLoadProgress(false);
      dispatch(
        setAlert({
          onConfirmPressed: () => {
            dispatch(setAlert({ show: false }));
          },
          onCancelPressed: () => {
            dispatch(setAlert({ show: false }));
            navigation.navigate("Success");
          },
          showConfirm: false,
          showCancel: true,
          confirmButtonColor: undefined,
          cancelButtonColor: undefined,
          cancelTextColor: undefined,
          confirmTextColor: undefined,
          cancelText: "Tiếp tục",
          title: "Liên kết tài khoản ngân hàng thành công!",
          message: "",
          show: true,
        })
      );
    } catch (error: any) {
      handleError(error, setAlert, dispatch, navigation);
    }
  };

  // nếu publicToken cập nhật giá trị so với ban đầu, bật tiến độ tải cho đến khi nó gọi Api đổi AccessToken thành công
  useEffect(() => {
    if (publicToken != "") {
      setLoadProgress(true);
      console.log("loadProgress là: ", loadProgress);
      ExchangeToken(publicToken);
    }
  }, [publicToken]);

  if (loadProgress) {
    // khi chưa tải được dữ liệu, hiển thị hoạt ảnh load tiến độ
    return <LoadProgress />;
  } else {
    return (
      <>
        <ScrollView
          style={stylesAddAccount.container}
          alwaysBounceVertical={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#7EAE4E", "#FFF"]}
            style={{ flex: 1 }}
            start={{ x: 0, y: -0.5 }}
            end={{ x: 0, y: 0.5 }}
          >
            <View style={{ marginVertical: 10 }}>
              <Logo />
            </View>
            <Image
              source={require("../../assets/cardImage.png")}
              style={{
                width: 120,
                height: 100,
                position: "absolute",
                right: 10,
                top: 50,
              }}
            />
            <View style={{ marginVertical: 20 }}>
              <Text style={stylesAddAccount.header}> Thêm tài khoản</Text>
            </View>
            <View
              style={{
                gap: 15,
                width: "95%",
                alignSelf: "center",
                marginBottom: 20,
              }}
            >
              <ButtonComponent
                title="Liên kết tài khoản ngân hàng"
                onPress={HandleWebView}
              />
              <ButtonComponent
                title="Tạo tài khoản tiền mặt (sắp ra mắt)"
                backgroundColor="white"
                overlayStyle={{ borderColor: "#979797", borderWidth: 1 }}
                textStyle={{ color: "#979797" }}
                onPress={() => {
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
                      title: "Sắp ra mắt",
                      message: "",
                      show: true,
                    })
                  );
                }}
              />
              <ButtonComponent
                title="Liên kết tài khoản chứng khoán (sắp ra mắt)"
                backgroundColor="white"
                overlayStyle={{ borderColor: "#979797", borderWidth: 1 }}
                textStyle={{ color: "#979797" }}
                onPress={() => {
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
                      title: "Sắp ra mắt",
                      message: "",
                      show: true,
                    })
                  );
                }}
              />
              <ButtonComponent
                title="Liên kết tài khoản tiết kiệm (sắp ra mắt)"
                backgroundColor="white"
                overlayStyle={{ borderColor: "#979797", borderWidth: 1 }}
                textStyle={{ color: "#979797" }}
                onPress={() => {
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
                      title: "Sắp ra mắt",
                      message: "",
                      show: true,
                    })
                  );
                }}
              />
              <ButtonComponent
                title="Liên kết tài khoản nợ (sắp ra mắt)"
                backgroundColor="white"
                overlayStyle={{ borderColor: "#979797", borderWidth: 1 }}
                textStyle={{ color: "#979797" }}
                onPress={() => {
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
                      title: "Sắp ra mắt",
                      message: "",
                      show: true,
                    })
                  );
                }}
              />
              <ButtonComponent
                title="Liên kết tài khoản tín dụng (sắp ra mắt)"
                backgroundColor="white"
                overlayStyle={{ borderColor: "#979797", borderWidth: 1 }}
                textStyle={{ color: "#979797" }}
                onPress={() => {
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
                      title: "Sắp ra mắt",
                      message: "",
                      show: true,
                    })
                  );
                }}
              />
            </View>
          </LinearGradient>

          <ScrollView alwaysBounceVertical={false} bounces={false}>
            {selectBank === true ? (
              <SafeAreaView>
                <Modal
                  hardwareAccelerated={true}
                  visible={true}
                  animationType="fade"
                  statusBarTranslucent={true}
                  transparent={true}
                  style={{ backgroundColor: "#c0c0c0" }}
                >
                  <KeyboardAvoidingView
                    behavior={Platform.select({
                      android: "position",
                      ios: undefined,
                    })}
                    enabled
                    contentContainerStyle={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.select({
                      android: -140,
                      ios: 0,
                    })}
                    style={{ flexGrow: 1 }}
                  >
                    <WebView
                      containerStyle={{ backgroundColor: "white" }}
                      startInLoadingState={true}
                      onLoad={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        (this as any).url = nativeEvent.url;
                      }}
                      // onError={(syntheticEvent) => {
                      //   const { nativeEvent } = syntheticEvent;
                      //   console.warn("WebView error: ", nativeEvent);
                      // }}
                      onLoadEnd={(syntheticEvent) => {
                        // update component to be aware of loading status
                        const { nativeEvent } = syntheticEvent;
                        (this as any).isLoading = nativeEvent.loading;
                      }}
                      onLoadStart={(syntheticEvent) => {
                        // update component to be aware of loading status
                        const { nativeEvent } = syntheticEvent;
                        (this as any).isLoading = nativeEvent.loading;
                      }}
                      // onLoadProgress={({ nativeEvent }) => {
                      //   (this as any).loadingProgress = nativeEvent.progress;
                      // }}
                      behavior="drag"
                      // ref={(ref) => (this.webview = ref)}
                      source={{
                        uri: `https://dev.link.bankhub.dev/?redirectUri=${REDIRECT_URI}&grantToken=${grantToken}&iframe=true&reactNativeApp=true`,
                      }}
                      nestedScrollEnabled={true}
                      // onNavigationStateChange={handleWebViewNavigationStateChange}
                      automaticallyAdjustContentInsets={false}
                      onMessage={(event) => {
                        // alert(event.nativeEvent.data);
                        let data = JSON.parse(event.nativeEvent.data);
                        console.log(data.data.loading);
                        if (
                          data.type === "credential" &&
                          data.data.publicToken !== ""
                        ) {
                          setPublicToken(data.data.publicToken);
                          console.log(data.data.publicToken);
                        }
                        if (data.data.loading === false) {
                          setSelectBank(false);
                        }
                      }}
                      style={{
                        marginTop: 0,
                        // marginLeft: 18,
                        // marginBottom: 20,
                        backgroundColor: "white",
                        width: "110%",

                        alignSelf: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    />
                  </KeyboardAvoidingView>
                </Modal>
              </SafeAreaView>
            ) : (
              ""
            )}
          </ScrollView>
        </ScrollView>
      </>
    );
  }
  // }
};

export default AddAccount;
