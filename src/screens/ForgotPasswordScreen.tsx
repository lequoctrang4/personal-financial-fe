import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { stylesGlobal } from "../components/Style/styles";
import TextViewRN from "../components/TextViewRN";
import { useEffect, useState } from "react";
import ButtonComponent from "../components/Button/ButtonComponent";
import { isValidEmail } from "../utils/function";
import { setAlert } from "../redux/alert";
import { useDispatch } from "react-redux";
import { handleError } from "../utils/handleError";
import { createOTP } from "../api/userApi";
import { showMessage } from "react-native-flash-message";
export default function ForgotPasswordScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [input, setInput] = useState(""); // nơi lưu Email hoặc số điện thoại
  const [click, setClick] = useState(undefined); // biến lưu logic nhấn
  const dispatch = useDispatch();
  //hàm thực hiện cập nhật, gửi OTP khi đã xác nhận người dùng truyền vào tham số email đúng với định dạng
  useEffect(() => {
    if (click === undefined) return;
    const timeout = setTimeout(async () => {
      try {
        if (!isValidEmail(input)) throw new Error("Email không đúng!");
        let res = await createOTP(input);
        console.log(res);
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);

        showMessage({
          message: "OTP đã được gửi đến mail bạn!",
          backgroundColor: "#009A80",
        });
        navigation.navigate("VerifyOTP", { email: input });
        setClick(() => undefined);
        setInput(() => "");
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
              Lấy lại mật khẩu
            </Text>
            <Text
              style={[
                stylesGlobal.textRegular,
                {
                  fontSize: 14,
                  //   width: "50%",
                  textAlign: "center",
                  paddingBottom: 20,
                },
              ]}
            >
              Mã xác nhận sẽ được gửi đến email hoặc số điện thoại đăng ký của
              bạn!
            </Text>
            <TextViewRN
              label="Email / Số điện thoại"
              value={input}
              width="100%"
              editable={true}
              setValue={setInput}
              placeholder={"Nhập email"}
              placeholderTextColor={"#434343"}
            />
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingTop: 25,
              }}
            >
              <ButtonComponent
                title="Gửi mã xác nhận"
                onPress={() => {
                  setClick((prev) => !prev as any);
                }}
              />
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
