import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { stylesGlobal } from "../components/Style/styles";
import { useEffect, useRef, useState } from "react";
import ButtonComponent from "../components/Button/ButtonComponent";
import { verifiedOTP } from "../api/userApi";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/alert";
import { handleError } from "../utils/handleError";
import { showMessage } from "react-native-flash-message";
import { storeData } from "../utils/function";
export default function VerifyOTP({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(0);
  const email = route.params.email;
  const [click, setClick] = useState(undefined);
  const dispatch = useDispatch();
  const inputRefs: any = useRef([]);
  // Hàm kiểm tra kí tự và thêm vào vị trí index trong OTP
  const handleOtpChange = (text: any, index: any) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text;
    setOtpValues(newOtpValues);

    if (text !== "" && index < otpValues.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  useEffect(() => {
    console.log(otpValues.join(""), otpValues.length);
  }, [otpValues]);

  //Hàm useEffect đếm lùi tự động 60s
  useEffect(() => {
    setSeconds(60);
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(timer);
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  //Hàm định dạng hiển thị thời gian
  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  //Hàm useEffect kiểm tra việc cập nhật OTP từ người dùng
  useEffect(() => {
    if (click === undefined) return;
    const timeout = setTimeout(async () => {
      try {
        console.log(email);
        console.log(otpValues);
        const otp: string = otpValues.join("");
        console.log(otp);
        if (otp.length < 6) {
          showMessage({
            message: "Vui lòng nhập mã OTP",
            backgroundColor: "#F24C4C",
          });
        }
        let res = await verifiedOTP(email, otp);
        console.log(res);
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);
        setClick(() => undefined);
        setOtpValues(() => ["", "", "", "", "", ""]);
        showMessage({
          message: "Xác thực OTP thành công!",
          backgroundColor: "#009A80",
        });
        await storeData("token", res.data);
        navigation.navigate("CreateNewPassword", { token: res.data });
      } catch (error) {
        handleError(error, setAlert, dispatch, navigation);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [click]);
  return (
    <ScrollView bounces={false}>
      <KeyboardAvoidingView
        behavior={Platform.select({
          android: "position",
          ios: "position",
        })}
        enabled
        style={{ backgroundColor: "white" }}
        keyboardVerticalOffset={Platform.select({
          android: -300,
          ios: -50,
        })}
      >
        <LinearGradient
          colors={["#7EAE4E", "#FFF"]}
          style={{ flex: 1, height: Dimensions.get("screen").height }}
          start={{ x: 0, y: -0.5 }}
          end={{ x: 0, y: 0.5 }}
        >
          <View
            style={{
              width: "80%",
              alignSelf: "center",
              marginVertical: 70,
              backgroundColor: "white",
              borderRadius: 26,
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignItems: "center",
              height: Dimensions.get("screen").height / 1.5,
              elevation: 2,
              shadowColor: "black",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
            }}
          >
            <Text style={[stylesGlobal.header2, { justifyContent: "center" }]}>
              Xác thực tài khoản
            </Text>
            <Text
              style={[
                stylesGlobal.textRegular,
                {
                  fontSize: 14,
                  //   width: "50%",
                  textAlign: "center",
                  paddingBottom: 10,
                },
              ]}
            >
              Mã xác nhận sẽ được gửi đến email hoặc số điện thoại đăng ký của
              bạn!
            </Text>

            <View
              style={{
                flexDirection: "row",
                padding: 15,
              }}
            >
              {otpValues.map((value, index) => (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderColor: "#c0c0c0",
                    borderRadius: 16,
                    borderWidth: 1,
                    marginHorizontal: 4,
                    backgroundColor: `rgba(0, 154, 128, ${
                      value ? "0.1" : "0.05"
                    })`,
                  }}
                  key={index}
                >
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    value={value}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    style={{
                      alignSelf: "center",
                      textAlign: "center",
                      width: 30,
                      height: 30,
                      margin: 3,
                      fontSize: 22,
                      fontFamily: "Exo2_700Bold",
                      fontWeight: "700",
                    }}
                  />
                </View>
              ))}
            </View>
            <Text
              style={[
                stylesGlobal.textRegular,
                {
                  fontSize: 14,
                  //   width: "50%",
                  textAlign: "center",
                },
              ]}
            >
              Tôi chưa nhận được mã xác thực
              {seconds != 0 ? (
                <Text
                  style={[
                    stylesGlobal.textRegular,
                    {
                      fontSize: 14,
                      //   width: "50%",
                      textAlign: "center",
                      color: "#009A80",
                      fontWeight: "400",
                    },
                  ]}
                >
                  {"\n"}
                  Gửi lại trong {formatTime(seconds)}
                </Text>
              ) : (
                <Pressable
                  android_ripple={{ color: "#ccc" }}
                  style={({ pressed }: { pressed: boolean }) =>
                    pressed && { opacity: 0.5 }
                  }
                  onPress={() => setSeconds(60)}
                >
                  <Text
                    style={[
                      stylesGlobal.textRegular,
                      {
                        fontSize: 14,
                        //   width: "50%",
                        textAlign: "center",
                        color: "#009A80",
                        fontWeight: "400",
                      },
                    ]}
                  >
                    {"\n"}Lấy OTP mới
                  </Text>
                </Pressable>
              )}
            </Text>

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingTop: 25,
              }}
            >
              <ButtonComponent
                title="Xác nhận"
                onPress={() => setClick((prev) => !prev as any)}
              />
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
