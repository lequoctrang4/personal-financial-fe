import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import Logo from "../components/Header/Logo";

import { stylesGlobal } from "../components/Style/styles";
import { getData } from "../utils/function";
import TextViewRN from "../components/TextViewRN";
import ButtonComponent from "../components/Button/ButtonComponent";
import { showMessage, hideMessage } from "react-native-flash-message";
import { changePassword, setProfile } from "../api/userApi";
import { handleError } from "../utils/handleError";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../redux/reload";
import { setAlert } from "../redux/alert";

const UpdateInfor = ({ navigation }: { navigation: any }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identify, setIdentify] = useState("");
  const dispatch = useDispatch();

  //Hàm kiểm tra việc cập nhật thông tin của người dùng
  const handleUpdateInfor = async () => {
    try {
      let token = await getData("token");
      if (!token) throw new Error("");
      let res = await setProfile(token, phoneNumber, fullName, identify);
      if (res.error === undefined) throw new Error("Lỗi server");
      if (res.error) throw new Error(res.message);
      showMessage({
        message: "Cập nhật thông tin thành công",
        backgroundColor: "#009A80",
      });
      dispatch(setReload());
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
              { right: 4, marginBottom: 5, fontSize: 22 },
            ]}
          >
            Cập nhật thông tin
          </Text>
        </View>
        <View>
          <View style={styles.dropdownSelector}>
            <TextViewRN
              label="Họ và tên"
              value={fullName}
              width="100%"
              editable={true}
              setValue={setFullName}
              //   placeholder={"Nhập họ và tên"}
              //   placeholderTextColor={"green"}
              iconPara={`account`}
            />
          </View>

          <View style={styles.dropdownSelector}>
            <TextViewRN
              label="Số điện thoại"
              value={phoneNumber}
              width="100%"
              editable={true}
              setValue={setPhoneNumber}
              //   placeholder={"Vui lòng nhập số điện thoại mới"}
              //   placeholderTextColor={"green"}
              iconPara={`phone`}
            />
          </View>

          <View style={styles.dropdownSelector}>
            <TextViewRN
              label="Căn cước công dân"
              value={identify}
              width="100%"
              editable={true}
              setValue={setIdentify}
              //   placeholder={"Nhập căn cước công dân"}
              //   placeholderTextColor={"green"}
              vectorIcon={true}
              iconPara={`cancel`}
            />
          </View>
          <View style={{ width: "95%", alignSelf: "center", paddingTop: 20 }}>
            <ButtonComponent
              title="Cập nhật thông tin"
              onPress={() => {
                if (fullName && phoneNumber && identify) {
                  handleUpdateInfor();
                } else {
                  showMessage({
                    message: "Cập nhật thông tin thất bại",
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

export default UpdateInfor;
