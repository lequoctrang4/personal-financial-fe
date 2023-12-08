import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

// import Icon, { Icons } from "../components/Style/Icons";
import Logo from "../components/Header/Logo";
import { stylesGlobal } from "../components/Style/styles";
import { getData } from "../utils/function";
import TextViewRN from "../components/TextViewRN";
import ButtonComponent from "../components/Button/ButtonComponent";
import { showMessage, hideMessage } from "react-native-flash-message";
import { changePassword } from "../api/userApi";
import { handleError } from "../utils/handleError";
import { useDispatch } from "react-redux";
import { setAlert } from "../redux/alert";
const ChangePassword = ({ navigation }: { navigation: any }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntrycurrentPassword, setSecureTextEntrycurrentPassword] =
    useState(false); //biến tín hiệu tùy chỉnh icon mắt của mật khẩu hiện tại
  const [secureTextEntrynewPassword, setSecureTextEntrynewPassword] =
    useState(false); //biến tín hiệu tùy chỉnh icon mắt của mật khẩu mới
  const [secureTextEntryconfirmPassword, setSecureTextEntryconfirmPassword] =
    useState(false); //biến tín hiệu tùy chỉnh icon mắt xác nhận mật khẩu mới

  const dispatch = useDispatch();

  //Hàm thực hiện đổi mật khẩu và back về trang Profile khi đổi mật khẩu thành công
  const handleChangePassword = async () => {
    try {
      let token = await getData("token");
      if (!token) throw new Error("");
      let res = await changePassword(
        token,
        currentPassword,
        newPassword,
        confirmPassword
      );
      if (res.error === undefined) throw new Error("Lỗi server");
      if (res.error) throw new Error(res.message);
      showMessage({
        message: "Đổi mật khẩu thành công",
        backgroundColor: "#009A80",
      });
      navigation.navigate("RouteCenter", {
        screen: "Profile",
      });
    } catch (error: any) {
      showMessage({
        message: error.message,
        backgroundColor: "#F24C4C",
      });
      handleError(error, setAlert, dispatch, navigation);
    }
  };
  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
          position: "relative",
        }}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1 }}
        alwaysBounceVertical={false}
      >
        <View>
          <Logo />
        </View>

        <View style={{ paddingBottom: 10 }}>
          <Text
            style={[
              stylesGlobal.header2,
              { marginBottom: 5, fontSize: 22, right: 4 },
            ]}
          >
            Thay đổi mật khẩu
          </Text>
        </View>
        <View>
          <View style={styles.dropdownSelector}>
            <TextViewRN
              label="Mật khẩu cũ"
              value={currentPassword}
              width="100%"
              editable={true}
              setValue={setCurrentPassword}
              placeholder={"Nhập mật khẩu cũ"}
              secureTextEntry={secureTextEntrycurrentPassword}
              setSecureTextEntry={setSecureTextEntrycurrentPassword}
              placeholderTextColor={"#434343"}
            />
          </View>

          <View style={styles.dropdownSelector}>
            <TextViewRN
              label="Mật khẩu mới"
              value={newPassword}
              width="100%"
              editable={true}
              setValue={setNewPassword}
              placeholder={"Nhập mật khẩu mới"}
              secureTextEntry={secureTextEntrynewPassword}
              setSecureTextEntry={setSecureTextEntrynewPassword}
              placeholderTextColor={"green"}
            />
          </View>

          <View style={styles.dropdownSelector}>
            <TextViewRN
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              width="100%"
              editable={true}
              setValue={setConfirmPassword}
              placeholder={"Xác nhận mật khẩu mới"}
              secureTextEntry={secureTextEntryconfirmPassword}
              setSecureTextEntry={setSecureTextEntryconfirmPassword}
              placeholderTextColor={"green"}
            />
          </View>
          <View style={{ width: "95%", alignSelf: "center", paddingTop: 20 }}>
            <ButtonComponent
              title="Đổi mật khẩu"
              onPress={() => {
                if (currentPassword && newPassword && confirmPassword) {
                  handleChangePassword();
                } else {
                  showMessage({
                    message: "Đổi mật khẩu thất bại",
                    backgroundColor: "#F24C4C",
                  });
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
  // }
};

const styles = StyleSheet.create({
  dropdownSelector: {
    width: "95%",
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 25,
    position: "relative",
  },
});

export default ChangePassword;
