import React, { Component, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Animated, Easing } from "react-native";
import LottieView from "lottie-react-native";
export default function LoadPending({
  colorBackground,
}: {
  colorBackground?: any | undefined;
}) {
  const animationProgress = useRef(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colorBackground ? colorBackground : "gray",
      opacity: 0.5,
      zIndex: 1,
    },
  });
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        source={require("../../../assets/animation_lk9jjy42.json")}
        autoPlay
        loop
      />
    </View>
  );
}
