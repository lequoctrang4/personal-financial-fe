import React, { useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  Easing,
  Button,
  Image,
} from "react-native";
import {
  storeData,
  getData,
  removeData,
  currencyFormat,
} from "../../utils/function";
import AwesomeAlert from "react-native-awesome-alerts";
import * as Clipboard from "expo-clipboard";
import Icon, { Icons } from "../../components/Style/Icons";
import { showMessage, hideMessage } from "react-native-flash-message";
import ClipBoardIcon from "./ClipBoardIcon";
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
const AccountCard = ({ data }: { data: any }) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    confirmText: "",
    confirmButtonColor: "",
  });
  useEffect(() => {
    if (data?.length) setExpandedItems([data[data?.length - 1].id as never]);
  }, [data]);

  const copyToClipboard = (accountNum: any) => {
    showMessage({
      message: "Đã sao chép số tài khoản!",
      backgroundColor: "#009A80",
    });
    Clipboard.setStringAsync(accountNum);
    //   setAlert((prevState) => ({
    //     ...prevState,
    //     confirmButtonColor: "#009A80",
    //     confirmText: "Đã sao chép số tài khoản!",
    //     message: "",
    //     show: true,
    //   }));
    //   setTimeout(() => {
    //     setAlert((prevState) => ({
    //       ...prevState,
    //       show: false,
    //     }));
    //   }, 2000);
  };
  // Function to toggle the expansion of an item
  const toggleItemExpansion = (itemId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (expandedItems.includes(itemId as never)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId as never]);
    }
  };
  return (
    <View style={styles.container}>
      {data?.map((item: any, index: number) => (
        <LinearGradient
          colors={JSON.parse(item.FinancialAccount.FiService.card_color)}
          key={item.id}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 15,
            borderColor: "#C0C0C0",
            borderWidth: 1,
            position: "relative",
            width: "100%",
            top: -index * 25,
          }}
        >
          <TouchableOpacity
            style={
              !expandedItems.includes(item.id as never) ? styles.itemHeader : {}
            }
            onPress={() => toggleItemExpansion(item.id)}
          >
            <View>
              <View style={{ flexDirection: "row", height: 50 }}>
                <Text
                  style={{
                    fontFamily: "Exo2_700Bold",
                    padding: 10,
                    paddingLeft: 20,
                    color: "white",
                    fontSize: 14,
                    flex: 1,
                    alignSelf: "center",
                    fontWeight: "700",
                  }}
                >
                  {currencyFormat(item.account_balance)} đ
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "white",
                      fontFamily: "Exo2_700Bold",
                      fontWeight: "400",
                    }}
                  >
                    {item.FinancialAccount.FiService.fi_name}
                  </Text>
                  {/* <Image
                    source={{
                      uri: item.logo,
                    }}
                    style={styles.icon}
                  /> */}
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {expandedItems.includes(item.id as never) && (
            <View>
              <View
                style={{
                  height: 140,
                  flexDirection: "column",
                  paddingBottom: 30,
                }}
              >
                <View style={{ flex: 4 }}></View>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: "row", gap: 4 }}
                  onPress={() => copyToClipboard(item.account_number)}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start",
                      fontSize: 14,
                      paddingLeft: 20,
                      color: "white",
                      fontFamily: "Exo2_700Bold",
                      fontWeight: "700",
                    }}
                  >
                    {item.account_number}
                  </Text>
                  <View style={{ top: 2 }}>
                    <ClipBoardIcon />
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    paddingLeft: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "white",
                      fontFamily: "Exo2_700Bold",
                      fontWeight: "400",
                      flex: 1,
                    }}
                  >
                    {item.account_name}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      flex: 1,
                      textAlign: "right",
                      paddingRight: 15,
                      fontFamily: "Exo2_700Bold",
                      fontWeight: "400",
                    }}
                  >
                    {item.account_desc === "Spend Account"
                      ? "Tài khoản thanh toán"
                      : ""}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      ))}

      <AwesomeAlert
        show={alert.show}
        alertContainerStyle={{ padding: 0 }}
        overlayStyle={{ opacity: 0, height: "100%" }}
        contentContainerStyle={{
          height: 0,
          flex: 0,
          backgroundColor: "none",
        }}
        confirmButtonStyle={{
          width: Dimensions.get("window").width * 0.95,
          height: 40,
          top: -350,
        }}
        modalProps={{
          statusBarTranslucent: true,
          presentationStyle: "overFullScreen",
          animationType: "none",
        }}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText={alert.confirmText}
        confirmButtonTextStyle={{
          color: "white",
          fontFamily: "Exo2_700Bold",
          fontSize: 14,
          textAlign: "center",
        }}
        confirmButtonColor={alert.confirmButtonColor}
        onConfirmPressed={() => {
          setAlert((prevState) => ({ ...prevState, show: false }));
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flex: 1,
    width: "95%",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignSelf: "center",
    position: "relative",
    borderColor: "#C0C0C0",
    overflow: "hidden",
  },
  itemHeader: {
    width: "100%",
    height: 80,
    borderColor: "#C0C0C0",
    position: "relative",
    overflow: "hidden",
  },
  itemHeaderText: {
    fontWeight: "bold",
  },
  itemContent: {
    padding: 16,
  },
  icon: {
    width: 24,
    height: 24,
    alignContent: "flex-end",
  },
});
export default AccountCard;
