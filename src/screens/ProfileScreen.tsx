import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LogOutLoader from "../components/Loading/LogOutLoader";
import { getData, removeData } from "../utils/function";
import Logo from "../components/Header/Logo";
import { deleteUser } from "../api/userApi";
import FieldNavigate from "../components/Profile/FieldNavigate";
import TitleMini from "../components/Profile/TitleMini";
import LoadPending from "../components/Loading/LoadPending";
import Avatar from "../components/Profile/Avatar";
import Name from "../components/Profile/NameAvatar";
import { useDispatch, useSelector } from "react-redux";
import { handleError } from "../utils/handleError";
import DangerIcon from "../components/Style/DangerIcon";
import { getProfile } from "../api/userApi";
import { setAlert } from "../redux/alert";
const Profile = ({ navigation }: { navigation: any }) => {
  const reload = useSelector((state: any) => state.reload.reload);
  const [logOutPending, setLogOutPending] = useState(false); //Hoạt ảnh khi đăng xuất
  const [loadPending, setLoadPending] = useState(false);
  const [dataUser, setDataUser] = useState({}); // Dữ liệu về người dùng
  const dispatch = useDispatch();
  //Hàm thực hiện đăng xuất
  const LogOut = () => {
    removeData("token"); // Gỡ token đăng nhập được lưu vào async store
    removeData("user");
    setLogOutPending(true);
    setTimeout(() => {
      removeData("errorLink");
      setLogOutPending(false);
      navigation.navigate("SignIn");
    }, 2000);
  };
  //Hàm hiện thực xóa tài khoản
  const deleteHandler = () => {
    dispatch(
      setAlert({
        onConfirmPressed: async () => {
          dispatch(setAlert({ show: false }));
          setLoadPending(() => true);
          try {
            let token = await getData("token");
            if (!token)
              throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
            let res = await deleteUser(token);
            if (res.error === undefined) throw new Error("Lỗi server");
            if (res.error) throw new Error(res.message);
            setLoadPending(() => false);
            dispatch(
              setAlert({
                onConfirmPressed: () => {
                  dispatch(setAlert({ show: false }));
                },
                onCancelPressed: () => {
                  dispatch(setAlert({ show: false }));
                  navigation.navigate("SignIn");
                },
                show: true,
                customView: undefined,
                titleStyle: undefined,
                showCancel: true,
                showConfirm: false,
                cancelText: "Đăng nhập",
                title: "Xóa tài khoản thành công",
                message: "Vui lòng tiến đến trang đăng nhập",
              })
            );
          } catch (error) {
            setLoadPending(() => false);
            handleError(error, setAlert, dispatch, navigation);
          }
        },
        onCancelPressed: () => {
          dispatch(
            setAlert({
              show: false,
              customView: undefined,
              titleStyle: undefined,
            })
          );
        },
        show: true,
        showCancel: true,
        showConfirm: true,
        cancelText: "Quay lại",
        titleStyle: { marginTop: 50 },
        customView: (
          <View style={{ position: "absolute", paddingBottom: 80 }}>
            <DangerIcon />
          </View>
        ),
        confirmButtonColor: "#f24c4c",
        confirmTextColor: "#fff",
        cancelTextColor: "#434343",
        confirmText: "Xóa tải khoản",
        title: "Bạn chắc chắn chứ!",
        message:
          "Mọi dữ liệu của bạn sẽ bị xoá hoàn toàn và không thể khôi phục!",
      })
    );
  };
  //Khi nhấn liên kết ngân hàng, chuyển hướng sang trang AddAccount
  const handleLinkBank = () => {
    navigation.navigate("AddAccount");
  };

  //cập nhật lại thông tin của người dùng khi có sự thay đổi khi cập nhật thông tin
  useEffect(() => {
    (async () => {
      let token = await getData("token");
      if (!token)
        throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
      try {
        let res = await getProfile(token);
        if (res.error === undefined) throw new Error("Lỗi server!");
        if (res.error) throw new Error(res.message);
        setDataUser(res.data);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [reload]);

  return (
    <>
      <ScrollView
        style={styles.container}
        alwaysBounceVertical={false}
        bounces={false}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <LinearGradient
            colors={["#BACF89", "#FFFFFF"]}
            style={{
              width: "100%",
              height: 400,
              borderRadius: 16,
            }}
            start={{ x: 0, y: -0.5 }}
            end={{ x: 0, y: 0.5 }}
          >
            <Logo />
            <View style={{ alignItems: "center", bottom: 25, flex: 1 }}>
              <Avatar />
              <View
                style={{ position: "absolute", alignSelf: "center", top: 30 }}
              >
                <Name />
              </View>
              <View style={{ height: 10 }}></View>
              <Text
                style={{
                  fontFamily: "Exo2_700Bold",
                  fontSize: 25,
                  color: "#434343",
                }}
              >
                {(dataUser as any).user_name ? (dataUser as any).user_name : ""}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#434343",
                  fontFamily: "Exo2_400Regular",
                }}
              >
                {(dataUser as any).email}
              </Text>
            </View>

            <View style={{ flexDirection: "row", flex: 1 }}></View>
          </LinearGradient>
        </View>

        <TitleMini textName2={"Tài khoản"} />
        <TouchableOpacity onPress={handleLinkBank}>
          <FieldNavigate textName={"Liên kết ngân hàng"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SyncAccount")}>
          <FieldNavigate textName={"Đồng bộ giao dịch và tài khoản"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AccountBank")}>
          <FieldNavigate textName={"Hủy liên kết ngân hàng"} />
        </TouchableOpacity>
        <TitleMini textName2={"Cài đặt"} />
        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
          <FieldNavigate textName={"Thay đổi mật khẩu"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("UpdateInfor")}>
          <FieldNavigate textName={"Cập nhật thông tin"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={deleteHandler}>
          <FieldNavigate textName={"Xóa tài khoản của tôi"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={LogOut}>
          <FieldNavigate textName={"Đăng xuất"} />
        </TouchableOpacity>
        <TitleMini textName2={"Thông tin ứng dụng"} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Anvest");
          }}
        >
          <FieldNavigate textName={"Về Anvest"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AnvestDKSD");
          }}
        >
          <FieldNavigate textName={"Điều khoản sử dụng"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AnvestPolicy");
          }}
        >
          <FieldNavigate textName={"Chính sách bảo mật thông tin"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            // await Linking.openURL(
            //   "mailto:cskh@anvest.vn?subject=Tôi cần hỗ trợ / Tôi muốn góp ý về sản phẩm của Anvest"
            // )
            //   .then(() => console.log("Điều hướng thành công"))
            //   .catch((error: any) => console.log("Có lỗi xảy ra", error));
            Linking.canOpenURL(
              "mailto:cskh@anvest.vn?subject=Tôi cần hỗ trợ / Tôi muốn góp ý về sản phẩm của Anvest"
            )
              .then((supported) => {
                if (!supported) {
                  console.log("Không hỗ trợ điều hướng", supported);
                  // throw new Error("Không thể điều hướng sang");
                } else {
                  console.log("Điều hướng thành công");
                  return Linking.openURL(
                    "mailto:cskh@anvest.vn?subject=Tôi cần hỗ trợ / Tôi muốn góp ý về sản phẩm của Anvest"
                  );
                }
              })
              .catch((err: any) => {
                console.error("Điều hướng xảy ra lỗi ", err);
              });
          }}
        >
          <FieldNavigate textName={"Báo lỗi/Góp ý"} />
        </TouchableOpacity>
        <Text style={{ height: 70 }}> </Text>
      </ScrollView>
      {logOutPending && (
        <Modal
          hardwareAccelerated={true}
          visible={true}
          animationType="fade"
          statusBarTranslucent={true}
          transparent={true}
        >
          <LogOutLoader />
        </Modal>
      )}
      {loadPending && (
        <Modal
          hardwareAccelerated={true}
          visible={true}
          animationType="fade"
          statusBarTranslucent={true}
          transparent={true}
        >
          <LoadPending />
        </Modal>
      )}
    </>
    // <TransactionList />
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
  },
  logo: {
    flex: 1,
    marginLeft: 13,
  },
  header: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: 700,
    fontFamily: "Exo2_600SemiBold",
  },
  header2: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: 700,
    marginBottom: 25,
    fontFamily: "Exo2_600SemiBold",
  },
  button: {
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#C0C0C0",
    color: "blue",
    borderRadius: 24,
    marginBottom: 10,
    height: 45,
  },
  buttonText: {
    fontSize: 17,
    color: "#434343",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Exo2_600SemiBold",
  },
  buttonSignIn: {
    marginTop: 5,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    borderWidth: 2,
    borderColor: "#C0C0C0",
    color: "blue",
    borderRadius: 24,
    marginBottom: 10,
    height: 45,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  checkbox: {
    marginTop: 10,
  },
  textArea: {
    fontFamily: "Exo2_600SemiBold",
    fontSize: 12,
    marginTop: 15,
    marginRight: 5,
    marginLeft: -20,
  },
  input: {
    height: 50,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    borderColor: "#C0C0C0",
    color: "white",
    fontFamily: "Exo2_600SemiBold",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Profile;
