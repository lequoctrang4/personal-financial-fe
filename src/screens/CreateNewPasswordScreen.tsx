import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  TextInput,
} from "react-native";
import { stylesGlobal } from "../components/Style/styles";
import TextViewRN from "../components/TextViewRN";
import { useEffect, useState } from "react";
import ButtonComponent from "../components/Button/ButtonComponent";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/alert";
import { handleError } from "../utils/handleError";
import { createNewPassword } from "../api/userApi";

export default function CreateNewPassword({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [click, setClick] = useState(undefined);
  const dispatch = useDispatch();
  //Hàm kiểm tra việc tạo mật khẩu mới
  useEffect(() => {
    if (click === undefined) return;
    const timeout = setTimeout(async () => {
      try {
        if (!newPassword.length) {
          showMessage({
            message: "Vui lòng nhập mật khẩu mới",
            backgroundColor: "#F24C4C",
          });
        } else if (newPassword !== confirmPassword) {
          dispatch(
            setAlert({
              showConfirm: true,
              showCancel: false,
              confirmButtonColor: undefined,
              cancelButtonColor: undefined,
              cancelTextColor: undefined,
              onConfirmPressed: () => {
                dispatch(setAlert({ show: false }));
              },
              onCancelPressed: () => {
                dispatch(setAlert({ show: false }));
              },
              confirmTextColor: undefined,
              confirmText: "Quay lại",
              title: "Mật khẩu nhập lại không giống mật khẩu mới",
              message: "Vui lòng nhập lại",
              show: true,
            })
          );
        }
        const token = route.params.token;
        let res = await createNewPassword(newPassword, token);
        console.log(res);
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);
        setClick(() => undefined);
        showMessage({
          message: "Cập nhập mật khẩu thành công",
          backgroundColor: "#009A80",
        });
        navigation.navigate("RouteCenter");
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
          android: -220,
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
              Vui lòng nhập mật khẩu mới của bạn
            </Text>

            <View style={{ height: 15 }}></View>
            <TextViewRN
              label="Mật khẩu mới"
              value={newPassword}
              width="100%"
              editable={true}
              setValue={setNewPassword}
              placeholder={"Nhập mật khẩu mới"}
              placeholderTextColor={"#434343"}
            />
            <View style={{ height: 15 }}></View>
            <TextViewRN
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              width="100%"
              editable={true}
              setValue={setConfirmPassword}
              placeholder={"Xác nhận mật khẩu"}
              placeholderTextColor={"#434343"}
            />
            <View style={{ height: 15 }}></View>

            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingTop: 25,
              }}
            >
              <ButtonComponent
                title="Đổi mật khẩu"
                onPress={() => setClick((prev) => !prev as any)}
              />
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
