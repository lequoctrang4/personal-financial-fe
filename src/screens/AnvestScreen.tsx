import {
  ScrollView,
  SafeAreaView,
  BackHandler,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { WebView } from "react-native-webview";
export default function Anvest({ navigation }: { navigation: any }) {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentURL, setCurrentURL] = useState("https://anvest.vn/");
  // link điều hướng sang web anvest

  const webViewRef: any = useRef(null);
  // kiểm tra người dùng có thể thực hiện trở về trang trước đó hay Back về trang ban đầu
  const backAction = () => {
    if (canGoBack) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  };
  navigation.setOptions({
    headerTitleStyle: {
      fontFamily: "Exo2_700Bold",
      color: "#434343",
      fontSize: 18,
    },
  });

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  console.log(width);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [canGoBack]);

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
          nestedScrollEnabled={true}
          automaticallyAdjustContentInsets={true}
          javaScriptEnabled={true}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
