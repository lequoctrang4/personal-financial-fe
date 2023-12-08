import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useCallback, useRef } from "react";
import moment from "moment";
import {
  useFonts,
  Exo2_100Thin,
  Exo2_200ExtraLight,
  Exo2_300Light,
  Exo2_400Regular,
  Exo2_500Medium,
  Exo2_600SemiBold,
  Exo2_700Bold,
  Exo2_800ExtraBold,
  Exo2_900Black,
  Exo2_100Thin_Italic,
  Exo2_200ExtraLight_Italic,
  Exo2_300Light_Italic,
  Exo2_400Regular_Italic,
  Exo2_500Medium_Italic,
  Exo2_600SemiBold_Italic,
  Exo2_700Bold_Italic,
  Exo2_800ExtraBold_Italic,
  Exo2_900Black_Italic,
} from "@expo-google-fonts/exo-2";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
SplashScreen.preventAutoHideAsync();
const FormatThu = (day: string) => {
  switch (day) {
    case "Mon":
      day = "Thứ Hai";
      break;
    case "Tue":
      day = "Thứ Ba";
      break;
    case "Wed":
      day = "Thứ Tư";
      break;
    case "Thu":
      day = "Thứ Năm";
      break;
    case "Fri":
      day = "Thứ Sáu";
      break;
    case "Sat":
      day = "Thứ Bảy";
      break;
    case "Sun":
      day = "Chủ Nhật";
      break;
    default:
      break;
  }
  return day;
};
const DateItem = ({
  date,
  setSelectedDate,
  check,
}: {
  date: string;
  check: boolean;
  setSelectedDate: any;
}) => {
  let [fontsLoaded] = useFonts({
    Exo2_100Thin,
    Exo2_200ExtraLight,
    Exo2_300Light,
    Exo2_400Regular,
    Exo2_500Medium,
    Exo2_600SemiBold,
    Exo2_700Bold,
    Exo2_800ExtraBold,
    Exo2_900Black,
    Exo2_100Thin_Italic,
    Exo2_200ExtraLight_Italic,
    Exo2_300Light_Italic,
    Exo2_400Regular_Italic,
    Exo2_500Medium_Italic,
    Exo2_600SemiBold_Italic,
    Exo2_700Bold_Italic,
    Exo2_800ExtraBold_Italic,
    Exo2_900Black_Italic,
  });
  const day = FormatThu(moment(date).format("ddd"));
  const dayNumber = moment(date).format("D");
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, [date]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedDate(date);
      }}
      style={[styles.card, check ? { backgroundColor: "#009A80" } : {}]}
    >
      <Text style={[styles.big, check ? { color: "white", opacity: 1 } : {}]}>
        {day}
      </Text>
      <View style={{ height: 3 }} />
      <Text
        style={[styles.medium, check ? { color: "white", opacity: 1 } : {}]}
      >
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
};

export default DateItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    paddingVertical: 5,
    marginVertical: 10,
    alignItems: "center",
    height: 60,
    width: 60,
    marginHorizontal: 4,
  },
  big: {
    fontSize: 12,
    fontFamily: "Exo2_400Regular",
    opacity: 0.5,
  },
  medium: {
    fontSize: 16,
    color: "#434343",
    fontFamily: "Exo2_700Bold",
  },
});
