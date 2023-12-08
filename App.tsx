import React, { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RouteCenter from "./src/route/RouteCenter";
import AddAccount from "./src/screens/AddAccountScreen";
import Anvest from "./src/screens/AnvestScreen";
import AccountBank from "./src/screens/DeleteAccountScreen";
import SyncAccount from "./src/screens/SyncAccountScreen";
import FlashMessage from "react-native-flash-message";
import { enableScreens } from "react-native-screens";
import Success from "./src/screens/AddAccountSuccessScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import AnvestPolicy from "./src/screens/AnvestPolicyScreen";
import AnvestDKSD from "./src/screens/AnvestProvisionScreen";
import ChangePassword from "./src/screens/ChangePasswordScreen";
import AlertComponent from "./src/components/Alert/AlertComponent";
import UpdateInfor from "./src/screens/UpdateInforScreen";
import VerifyOTP from "./src/screens/VerifyOTPScreen";
import * as NavigationBar from "expo-navigation-bar";
import CreateNewPassword from "./src/screens/CreateNewPasswordScreen";
import { createPaymentLink } from "./src/api/userApi";
enableScreens();

const Stack = createNativeStackNavigator();
const App = () => {
  const visibility = NavigationBar.useVisibility();
  React.useEffect(() => {
    if (visibility === "visible") {
      const interval = setTimeout(() => {
        NavigationBar.setVisibilityAsync("hidden");
      }, /* 3 Seconds */ 3000);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [visibility]);
  useEffect(() =>{
    (async () =>{
      let res = await createPaymentLink();
      console.log(res);
    })();
  });
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: "horizontal",
              animation: "slide_from_right",
              headerTitleStyle: {
                fontFamily: "Exo2_700Bold",
                color: "#434343",
                fontSize: 18,
              },
            }}
          >
            {/* Màn hình đăng nhập */}
            <Stack.Screen
              name="SignIn"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
              component={SignInScreen}
            />
            {/* Màn hình đăng xuất */}
            <Stack.Screen
              name="SignUp"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
              component={SignUpScreen}
            />
            {/* Màn hình quên mật khẩu */}
            <Stack.Screen
              name="ForgotPassword"
              options={{
                headerShown: true,
                title: "Quên mật khẩu",
                animationTypeForReplace: "push",
              }}
              component={ForgotPasswordScreen}
            />
            {/* Màn hình sau khi đăng nhập thành công, RouteCenter thực hiện điều hướng đến các TabScreen */}
            <Stack.Screen
              name="RouteCenter"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
              component={RouteCenter}
            />
            {/* Màn hình sau khi nhấn thêm tài khoản, liên kết ngân hàng*/}
            <Stack.Screen
              name="AddAccount"
              component={AddAccount}
              options={() => ({
                headerShown: true,
                title: "Liên kết ngân hàng",
                animationTypeForReplace: "push",
                animation: "slide_from_right",
              })}
            />
            {/* Màn hình web về Anvest*/}
            <Stack.Screen
              name="Anvest"
              component={Anvest}
              options={() => ({
                headerShown: true,
                title: "Về Anvest",
                animationTypeForReplace: "push",
                animation: "slide_from_right",
              })}
            />
            {/* Màn hình về hủy liên kết tài khoản ngân hàng */}
            <Stack.Screen
              name="AccountBank"
              component={AccountBank}
              options={{
                headerShown: true,
                title: "Hủy liên kết ngân hàng",
                animationTypeForReplace: "push",
                // animation: "slide_from_right",
              }}
            />
            {/* Màn hình web về điều khoản sử dụng của Anvest */}
            <Stack.Screen
              name="AnvestDKSD"
              component={AnvestDKSD}
              options={() => ({
                headerShown: true,
                title: "Điều khoản sử dụng",
              })}
            />
            {/* Màn hình web về chính sách bảo mật thông tin của Anvest */}
            <Stack.Screen
              name="AnvestPolicy"
              component={AnvestPolicy}
              options={() => ({
                headerShown: true,
                title: "Chính sách bảo mật thông tin",
              })}
            />
            {/* Màn hình về đồng bộ tài khoản ngân hàng */}
            <Stack.Screen
              name="SyncAccount"
              component={SyncAccount}
              options={{
                headerShown: true,
                title: "Đồng bộ tài khoản ngân hàng",
              }}
            />
            {/* Màn hình sau khi người dùng đã liên kết tài khoản thành công */}
            <Stack.Screen
              name="Success"
              component={Success}
              options={{
                headerShown: false,
              }}
            />
            {/* Màn hình cập nhật mật khẩu */}

            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{
                headerShown: true,
                title: "Đổi mật khẩu",
              }}
            />
            {/* Màn hình để cập nhật thông tin người dùng*/}

            <Stack.Screen
              name="UpdateInfor"
              component={UpdateInfor}
              options={{
                headerShown: true,
                title: "Cập nhật thông tin tài khoản",
              }}
            />

            {/* Màn hình xác thực OTP */}
            <Stack.Screen
              name="VerifyOTP"
              component={VerifyOTP}
              options={{
                headerShown: true,
                title: "Xác thực tài khoản",
              }}
            />
            {/* Màn hình tạo mật khẩu mới sau khi xác thực OTP thành công */}

            <Stack.Screen
              name="CreateNewPassword"
              component={CreateNewPassword}
              options={{
                headerShown: true,
                title: "Tạo mật khẩu mới",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <AlertComponent />
      </Provider>
      <StatusBar style="auto" />
      <FlashMessage
        position="top"
        statusBarHeight={20}
        style={{
          width: "100%",
          alignSelf: "center",
        }}
        titleStyle={{
          fontFamily: "Exo2_700Bold",
          fontSize: 16,
          textAlign: "center",
          color: "white",
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default App;
