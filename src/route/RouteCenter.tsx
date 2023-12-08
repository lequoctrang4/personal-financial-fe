import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  BackHandler,
  Pressable,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { IconNav } from "../components/Style/IconNav";
import IconDisplay from "../components/Style/IconNav";
import Dashboard from "../screens/DashboardScreen";
import History from "../screens/HistoryScreen";
import Analyze from "../screens/AnalyzeScreen";
import Profile from "../screens/ProfileScreen";

export const TabButton = (props?: any | undefined) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const navigation = useNavigation();
  if (Platform.OS == "android") {
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          // Ngăn chặn quay lại màn hình đăng nhập
          console.log("Người dùng nhấn Back");
          Alert.alert("Chờ đã !", "Bạn có muốn thoát khỏi ứng dụng?", [
            {
              text: "Không",
              onPress: () => null,
              style: "cancel",
            },
            { text: "Có", onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        };

        // Thêm event listener để bắt sự kiện back press
        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        // Xóa event listener khi màn hình không còn focus
        return () => {
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };
      }, [navigation])
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        pressed
          ? {
              flex: 1,
              height: 100,
              alignItems: "center",
              opacity: 0.7,
            }
          : { flex: 1, height: 100, alignItems: "center" }
      }
    >
      <View style={{ flex: 1, paddingTop: 5 }}>
        <IconDisplay type={item.typeNav} color={focused ? "#009a80" : "grey"} />
      </View>
      <Text
        style={
          focused
            ? {
                color: "#009a80",
                fontFamily: "Exo2_400Regular",
                fontSize: 10,
                flex: 1,
                paddingBottom: 30,
              }
            : {
                color: "#434343",
                fontFamily: "Exo2_400Regular",
                fontSize: 10,
                flex: 1,
                paddingBottom: 30,
              }
        }
      >
        {item.label}
      </Text>
    </Pressable>
  );
};
const RouteCenter = () => {
  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "grey",
      }}
    >
      <Tab.Screen
        name={"Home"}
        component={Dashboard}
        options={{
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              item={{ typeNav: IconNav.HomeIcon, label: "Trang chủ" }}
            />
          ),
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name={"History"}
        component={History}
        options={{
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              item={{ typeNav: IconNav.HistoryIcon, label: "Lịch sử" }}
            />
          ),
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name={"Analyze"}
        component={Analyze}
        options={{
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              item={{ typeNav: IconNav.AnalyzeIcon, label: "Phân tích" }}
            />
          ),
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name={"Profile"}
        component={Profile}
        options={{
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <TabButton
              {...props}
              item={{ typeNav: IconNav.ProfileIcon, label: "Trang cá nhân" }}
            />
          ),
          unmountOnBlur: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default RouteCenter;
