import {
  View,
  Text,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Header/LogoLogin";
import { stylesGlobal } from "../components/Style/styles";
import ButtonComponent from "../components/Button/ButtonComponent";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TextInput, Button } from "react-native-paper";
import { useState, useEffect } from "react";
import { signUp } from "../api/userApi";
import { handleError } from "../utils/handleError";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import { setAlert } from "../redux/alert";
import { showMessage } from "react-native-flash-message";
import { WEB_CLIENT_KEY, ANDROID_CLIENT_KEY, IOS_CLIENT_KEY } from "@env";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { signInWithGoogle } from "../api/userApi";
import { storeData } from "../utils/function";
import LoginLoader from "../components/Loading/LoginLoader";
import { SCHEME } from "@env";

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [loginPending, setLoginPending] = useState(false);
  const [user, setUser] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorUser, setErrorUser] = useState(false);
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [icon, setIcon] = useState("eye");
  const IconSecurity = () => {
    {
      secureTextEntry === true ? setIcon("eye-off") : setIcon("eye");
    }
  };
  const dispatch = useDispatch();

  //Xác thực client và điều hướng đến đăng nhập bằng google
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

  //Khi nhận được response từ việc điều hướng, thực thi hàm đăng nhập bằng google
  useEffect(() => {
    handleSignInWithGoogle();
    // console.log(JSON.stringify(userInfor, null, 2));
  }, [response]);

  // Kiểm tra response và thực hiện đăng nhập vào RouteCenter khi đăng nhập bằng google thành công
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

  //Hàm để tạo tài khoản
  async function createAccount() {
    if (user == "" && password == "") {
      dispatch(
        setAlert({
          onConfirmPressed: () => {
            dispatch(setAlert({ show: false }));
          },
          onCancelPressed: () => {
            dispatch(setAlert({ show: false }));
          },
          showConfirm: true,
          showCancel: false,
          confirmButtonColor: undefined,
          cancelButtonColor: undefined,
          cancelTextColor: undefined,
          confirmTextColor: undefined,
          confirmText: "Quay lại",
          title: "Đăng ký thất bại!",
          message: "Vui lòng nhập email và mật khẩu!",
          show: true,
        })
      );
      setErrorUser(true);
      setErrorPassword(true);
      return;
    } else if (user === "") {
      dispatch(
        setAlert({
          onConfirmPressed: () => {
            dispatch(setAlert({ show: false }));
          },
          onCancelPressed: () => {
            dispatch(setAlert({ show: false }));
          },
          showConfirm: true,
          showCancel: false,
          confirmButtonColor: undefined,
          cancelButtonColor: undefined,
          cancelTextColor: undefined,
          confirmTextColor: undefined,
          confirmText: "Quay lại",
          title: "Đăng ký thất bại!",
          message: "Vui lòng nhập tài khoản!",
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
          showConfirm: true,
          showCancel: false,
          confirmButtonColor: undefined,
          cancelButtonColor: undefined,
          cancelTextColor: undefined,
          confirmTextColor: undefined,
          confirmText: "Quay lại",
          title: "Đăng ký thất bại!",
          message: "Vui lòng nhập mật khẩu!",
          show: true,
        })
      );
      setErrorUser(false);
      setErrorPassword(true);
      return;
    }
    try {
      let res = await signUp({ email: user, password: password });
      if (res.error === undefined) throw new Error("Lỗi Server");
      if (res.error) {
        dispatch(
          setAlert({
            onConfirmPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            onCancelPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            showConfirm: true,
            showCancel: false,
            confirmButtonColor: undefined,
            cancelButtonColor: undefined,
            cancelTextColor: undefined,
            confirmTextColor: undefined,
            confirmText: "Quay lại",
            title: "Đăng ký thất bại!",
            message: res.message,
            show: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            onConfirmPressed: () => {
              dispatch(setAlert({ show: false }));
              navigation.navigate("SignIn");
            },
            onCancelPressed: () => {
              dispatch(setAlert({ show: false }));
            },
            showConfirm: true,
            showCancel: false,
            confirmButtonColor: "#009A80",
            cancelButtonColor: undefined,
            cancelTextColor: undefined,
            confirmTextColor: "white",
            confirmText: "Đăng nhập",
            title: res.message,
            message: "Vui lòng quay lại trang đăng nhập!",
            show: true,
          })
        );
      }
    } catch (error: any) {
      handleError(error, setAlert, dispatch, navigation);
    }
  }
  // Kiểm tra user và password đã được điền hay chưa
  useEffect(() => {
    if (user !== "") {
      setErrorUser(false);
    }
    if (password !== "") {
      setErrorPassword(false);
    }
  }, [user, password]);
  return (
    <>
      <ScrollView bounces={false}>
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
            <View
              style={{
                flex: 1,
                width: "90%",
                alignSelf: "center",
                height: Dimensions.get("screen").height,
              }}
            >
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
                style={{ width: "85%", alignSelf: "center", paddingTop: 20 }}
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
                  onPress={promptAsync}
                />
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
                  right={
                    <TextInput.Icon
                      icon="account"
                      style={{
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
                  onPress={createAccount}
                >
                  Tạo tài khoản
                </Button>
                {/* <Button
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
                onPress={() => console.log("Pressed")}
              >
                Quên mật khẩu
              </Button> */}
                <Button
                  mode="text"
                  style={{
                    width: "100%",
                    alignSelf: "center",
                    marginTop: 5,
                    borderColor: "#009A80",
                  }}
                  labelStyle={{
                    fontSize: 16,
                    paddingTop: 2,
                    fontFamily: "Exo2_700Bold",
                  }}
                  textColor="#434343"
                  rippleColor={"#fff"}
                  onPress={() => navigation.navigate("SignIn")}
                >
                  Đăng nhập
                </Button>
              </View>

              <Text
                style={{
                  color: "#434343",
                  fontFamily: "Exo2_400Regular",
                  fontSize: 13.2,
                  textAlign: "center",
                  marginTop: 20,
                  alignSelf: "center",
                }}
              >
                Bằng cách nhấn vào nút “Đăng nhập nhanh bằng Google” hoặc “Tạo
                tài khoản”, bạn đồng ý với{" "}
                <TouchableOpacity
                  style={{
                    margin: 0,
                    padding: 0,
                    alignItems: "flex-end",
                  }}
                  onPress={() => navigation.navigate("AnvestDKSD")}
                >
                  <Text
                    style={{
                      color: "#009A80",
                      top: 5,
                      fontWeight: "700",
                      fontFamily: "Exo2_400Regular",
                      fontSize: 13.2,
                    }}
                  >
                    Điều khoản sử dụng{" "}
                  </Text>
                </TouchableOpacity>
                và{" "}
                <TouchableOpacity
                  style={{
                    margin: 0,
                    padding: 0,
                    alignItems: "flex-end",
                  }}
                  onPress={() => navigation.navigate("AnvestPolicy")}
                >
                  <Text
                    style={{
                      color: "#009A80",
                      top: 5,
                      fontWeight: "700",
                      fontFamily: "Exo2_400Regular",
                      fontSize: 13.2,
                    }}
                  >
                    Chính sách bảo mật
                  </Text>
                </TouchableOpacity>{" "}
                của Anvest.
              </Text>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </ScrollView>
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
    </>
  );
}
