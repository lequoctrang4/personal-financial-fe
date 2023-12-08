import {
  ScrollView,
  SafeAreaView,
  BackHandler,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { WebView } from "react-native-webview";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function AnvestPolicy({ navigation }: { navigation: any }) {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentURL, setCurrentURL] = useState(
    "https://anvest.vn/privacy-policy"
  ); // link điều hướng sang web anvest

  // kiểm tra người dùng có thể thực hiện trở về trang trước đó hay Back về trang ban đầu
  const backAction = () => {
    if (canGoBack) {
      (webViewRef as any).current.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  };

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  console.log(width);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [canGoBack]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Ngăn chặn quay lại màn hình đăng nhập
        console.log("Người dùng nhấn Back");

        navigation.navigate("Profile");
        return true;
      };

      // Thêm event listener để bắt sự kiện back press
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Xóa event listener khi màn hình không còn focus
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [canGoBack])
  );
  return (
    <ScrollView alwaysBounceVertical={false} bounces={false}>
      <SafeAreaView>
        <WebView
          startInLoadingState
          onNavigationStateChange={(navState) => {
            console.log("URL là: ", navState.url);
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
            setCurrentURL(navState.url);
          }}
          ref={webViewRef}
          source={{
            uri: currentURL,
          }}
          nestedScrollEnabled={true}
          automaticallyAdjustContentInsets={true}
          javaScriptEnabled={true}
          style={{
            marginTop: 0,
            // marginLeft: 18,
            // marginBottom: 20,
            backgroundColor: "black",
            width: width,
            height: height,
            alignSelf: "center",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
