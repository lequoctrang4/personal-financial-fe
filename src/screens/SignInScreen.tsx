import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import {
  useFonts,
  Exo2_400Regular,
  Exo2_700Bold,
} from "@expo-google-fonts/exo-2";
import LoginLoader from "../components/Loading/LoginLoader";

import * as SplashScreen from "expo-splash-screen";
import { stylesGlobal } from "../components/Style/styles";
import Logo from "../components/Header/LogoLogin";
import { checkTokenExpired, signIn } from "../api/userApi";
import { isValidEmail, storeData, getData } from "../utils/function";
import ButtonComponent from "../components/Button/ButtonComponent";
import AntDesign from "react-native-vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import { handleError } from "../utils/handleError";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import { setAlert } from "../redux/alert";
import * as Google from "expo-auth-session/providers/google";
import { showMessage } from "react-native-flash-message";
import { ANDROID_CLIENT_KEY, IOS_CLIENT_KEY, WEB_CLIENT_KEY } from "@env";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { signInWithGoogle } from "../api/userApi";
import { SCHEME } from "@env";
SplashScreen.preventAutoHideAsync();

const SignInScreen = ({ navigation }: { navigation: any }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState("eye");
  const [secureTextEntry, setSecureTextEntry] = useState(true); // biến boolean hiển thị mắt
  const [loginPending, setLoginPending] = useState(false); // hoạt ảnh khi đăng nhập
  const [errorPassword, setErrorPassword] = useState(false); // biến logic để kiểm tra có đầu vào mật khẩu chưa
  const [errorUser, setErrorUser] = useState(false); // biến logic để kiểm tra có đầu vào tài khoản chưa

  let [fontsLoaded] = useFonts({
    Exo2_400Regular,
    Exo2_700Bold,
  });
  const dispatch = useDispatch();

  //Hiện thực xác thực gọi đến Google và ủy quyền để điều hướng sang trang đăng nhập bằng google
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: WEB_CLIENT_KEY,
      androidClientId: ANDROID_CLIENT_KEY,
      iosClientId: IOS_CLIENT_KEY,
      redirectUri: makeRedirectUri({
        scheme: SCHEME,
      }),
      scopes: ["openid", "profile", "email"],
    },

    {
      native: `${SCHEME}://`,
    }
  );

  //Mỗi khi response việc đăng nhập bằng google thay đổi, gọi đến hàm điều khiển đăng nhập
  useEffect(() => {
    handleSignInWithGoogle();
    // console.log(JSON.stringify(userInfor, null, 2));
  }, [response]);

  //Hàm này kiểm tra xem việc đăng nhập bằng google có thành công không và chuyển hướng sang RouteCenter
  async function handleSignInWithGoogle() {
    if (response?.type === "success") {
      console.log("success");
      try {
        setLoginPending(true);
        let res = await signInWithGoogle(
          response.authentication?.accessToken as any
        );
        // console.log("token là: ", response.authentication?.accessToken);
        console.log("res là ", res);
        if (res.error === 0) {
          storeData("token", res.data.token);
          setLoginPending(false);
          navigation.navigate("RouteCenter");
        }
      } catch (error: any) {
        console.log(error);
        setLoginPending(false);
      }
    } else {
      console.log(response?.type);
    }
  }

  //Hàm hiện thực khi nhấn nút Đăng nhập
  const SignIn = async () => {
    try {
      if (user.trim() == "" && password == "") {
        dispatch(
          setAlert({
            onConfirmPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            onCancelPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            confirmButtonColor: undefined,
            cancelButtonColor: undefined,
            cancelTextColor: undefined,
            confirmTextColor: undefined,
            showCancel: false,
            showConfirm: true,
            confirmText: "Quay lại",
            title: "Đăng nhập thất bại!",
            message: "Vui lòng điền đầy đủ tài khoản và mật khẩu",
            show: true,
          })
        );
        setErrorUser(true);
        setErrorPassword(true);
        return;
      } else if (user.trim() === "") {
        dispatch(
          setAlert({
            onConfirmPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            onCancelPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            confirmButtonColor: undefined,
            cancelButtonColor: undefined,
            cancelTextColor: undefined,
            confirmTextColor: undefined,
            showCancel: false,
            showConfirm: true,
            confirmText: "Quay lại",
            title: "Đăng nhập thất bại!",
            message: "Vui lòng nhập tài khoản",
            show: true,
          })
        );
        setErrorUser(true);
        setErrorPassword(false);
        return;
      } else if (password === "") {
        dispatch(
          setAlert({
            onConfirmPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            onCancelPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            confirmButtonColor: undefined,
            cancelButtonColor: undefined,
            cancelTextColor: undefined,
            confirmTextColor: undefined,
            showCancel: false,
            showConfirm: true,
            confirmText: "Quay lại",
            title: "Đăng nhập thất bại!",
            message: "Vui lòng nhập mật khẩu",
            show: true,
          })
        );
        setErrorUser(false);
        setErrorPassword(true);
        return;
      }
      setLoginPending(true);
      let email;
      let phone_number: string | undefined;
      if (isValidEmail(user.trim())) email = user.trim();
      else phone_number = user.trim();
      let res = await signIn({
        email: email,
        phone_number: phone_number,
        password: password,
      });
      console.log("res là: ", res);
      if (res.error === 0) {
        storeData("token", res.data.token);
        setLoginPending(false);
        navigation.navigate("RouteCenter");
      } else if (res.error === 1) {
        setLoginPending(false);
        setTimeout(() => {
          dispatch(
            setAlert({
              onConfirmPressed: () => {
                dispatch(setAlert({ show: false }));
              },
              onCancelPressed: () => {
                dispatch(setAlert({ show: false }));
              },
              confirmButtonColor: undefined,
              cancelButtonColor: undefined,
              cancelTextColor: undefined,
              confirmTextColor: undefined,
              showCancel: false,
              showConfirm: true,
              confirmText: "Quay lại",
              title: "Đăng nhập thất bại!",
              message: res.message,
              show: true,
            })
          );
        }, 500);
      } else {
        setLoginPending(false);

        dispatch(
          setAlert({
            onConfirmPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            onCancelPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            confirmButtonColor: undefined,
            cancelButtonColor: undefined,
            cancelTextColor: undefined,
            confirmTextColor: undefined,
            showCancel: false,
            showConfirm: true,
            confirmText: "Quay lại",
            title: "Đăng nhập thất bại!",
            message: "Kiểm tra kết nối mạng",
            show: true,
          })
        );
        setLoginPending(false);
      }
      setLoginPending(false);

      setErrorUser(false);
      setErrorPassword(false);
    } catch (error) {
      handleError(error, setAlert, dispatch, navigation);
      setLoginPending(false);
    }
  };
  // Tùy chỉnh icon mật khẩu có hiển thị hay không hiển thị
  const IconSecurity = () => {
    {
      secureTextEntry === true ? setIcon("eye-off") : setIcon("eye");
    }
  };

  //Kiểm tra token còn hạn sử dụng hay không, nếu còn hạn sử dụng điều hướng đến RouteCenter
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        let token = await getData("token");
        if (!token) return;
        let res = await checkTokenExpired(token);
        if (res.error === undefined) throw new Error("Lỗi server");
        if (res.error === 1) throw new Error(res.message);
        navigation.navigate("RouteCenter");
      } catch (error: any) {
        handleError(error, setAlert, dispatch, navigation);
      }
    })();
  }, []);

  // Kiểm tra dữ liệu tài khoản và mật khẩu đã được nhập vào hay chưa
  useEffect(() => {
    if (user !== "") {
      setErrorUser(false);
    }
    if (password !== "") {
      setErrorPassword(false);
    }
  }, [user, password]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <ScrollView
      style={{ flex: 1 }}
      onLayout={onLayoutRootView}
      alwaysBounceVertical={false}
      alwaysBounceHorizontal={false}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({
          android: "position",
          ios: "position",
        })}
        enabled
        style={{ backgroundColor: "white" }}
        keyboardVerticalOffset={Platform.select({
          android: -140,
          ios: -50,
        })}
      >
        <LinearGradient
          colors={["#7EAE4E", "#FFF"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: -0.5 }}
          end={{ x: 0, y: 0.5 }}
        >
          <View style={{ flex: 1, width: "90%", alignSelf: "center" }}>
            <View
              style={{
                position: "relative",
                height: Platform.OS === "android" ? 70 : 120,
              }}
            >
              <Logo />
            </View>
            <View style={{ position: "relative", height: 170 }}>
              <Text
                style={[
                  stylesGlobal.header,
                  { width: 230, paddingVertical: 30, zIndex: 2 },
                ]}
              >
                Quản lý tiền của bạn tự động, tại một nơi duy nhất!
              </Text>

              <Image
                style={{
                  width: 182,
                  height: 168,
                  position: "absolute",
                  right: -15,
                }}
                source={require("../../assets/ImgLogin.png")}
              />
            </View>
            <View
              style={{
                width: "85%",
                alignSelf: "center",
                paddingTop: 20,
                height: Dimensions.get("screen").height * 0.9 - 170,
              }}
            >
              <ButtonComponent
                title="Đăng nhập nhanh bằng Google"
                icon={
                  <AntDesign
                    name="google"
                    size={24}
                    color={"white"}
                    style={{ paddingHorizontal: 5 }}
                  />
                }
                onPress={() => promptAsync()}
              />
              {/* <Text>{JSON.stringify(userInfor, null, 2)}</Text> */}
              <Text
                style={{
                  textAlign: "center",
                  paddingTop: 10,
                  fontFamily: "Exo2_400Regular",
                  color: "#434343",
                }}
              >
                hoặc
              </Text>

              <TextInput
                style={[stylesGlobal.input, { borderRadius: 26 }]}
                label="Email của bạn"
                onChangeText={setUser}
                value={user}
                mode="outlined"
                error={errorUser}
                outlineColor="#c0c0c0"
                activeOutlineColor="#009A80"
                theme={{ roundness: 16 }}
                editable={true}
                right={
                  <TextInput.Icon
                    icon="account"
                    style={{
                      paddingTop: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                }
              />
              <TextInput
                style={stylesGlobal.input}
                label="Mật khẩu của bạn"
                onChangeText={setPassword}
                value={password}
                autoCorrect={false}
                mode="outlined"
                error={errorPassword}
                theme={{ roundness: 16 }}
                outlineColor="#c0c0c0"
                activeOutlineColor="#009A80"
                secureTextEntry={secureTextEntry}
                right={
                  <TextInput.Icon
                    icon={icon}
                    forceTextInputFocus={false}
                    onPress={() => {
                      setSecureTextEntry(!secureTextEntry);
                      if (password === "") {
                        showMessage({
                          message: "Vui lòng nhập mật khẩu trước!",
                          backgroundColor: "#F24C4C",
                        });
                      } else {
                        IconSecurity();
                      }
                    }}
                    style={{
                      paddingTop: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                }
              />
              <Button
                mode="outlined"
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginTop: 15,
                  borderColor: "#009A80",
                }}
                textColor="#009A80"
                labelStyle={{
                  fontSize: 16,
                  paddingTop: 2,
                  height: 30,
                  fontFamily: "Exo2_700Bold",
                }}
                rippleColor={"#009A80"}
                onPress={SignIn}
              >
                Đăng nhập
              </Button>
              <Button
                mode="text"
                style={{
                  width: "60%",
                  alignSelf: "center",
                  marginTop: 10,
                  borderColor: "#009A80",
                }}
                labelStyle={{
                  fontSize: 16,
                  paddingTop: 2,
                  fontFamily: "Exo2_700Bold",
                }}
                textColor="#434343"
                rippleColor={"#fff"}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                Quên mật khẩu
              </Button>
              <Button
                mode="text"
                style={{
                  width: "60%",
                  alignSelf: "center",
                  marginTop: 5,
                  borderColor: "#009A80",
                  marginBottom: 40,
                }}
                labelStyle={{
                  fontSize: 16,
                  paddingTop: 2,
                  fontFamily: "Exo2_700Bold",
                }}
                textColor="#434343"
                rippleColor={"#fff"}
                onPress={() => navigation.navigate("SignUp")}
              >
                Đăng ký
              </Button>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>

      {loginPending && (
        <Modal
          hardwareAccelerated={true}
          visible={true}
          animationType="fade"
          statusBarTranslucent={true}
          // overFullScreen
          transparent={true}
        >
          <LoginLoader />
        </Modal>
      )}
    </ScrollView>
  );
};

export default SignInScreen;
