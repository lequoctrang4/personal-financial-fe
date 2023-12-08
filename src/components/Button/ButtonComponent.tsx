import {
  Text,
  View,
  _View,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";

import { useState } from "react";
export default function ButtonComponent({
  icon,
  title,
  onPress,
  textStyle,
  overlayStyle,
  backgroundColor,
  disabled,
  children,
}: {
  icon?: any;
  title: string;
  onPress: Function;
  textStyle?: any;
  overlayStyle?: any;
  backgroundColor?: string;
  disabled?: boolean;
  children?: React.ReactNode | undefined; // Thêm children vào đây
}) {
  const [scaleValue1] = useState(new Animated.Value(1));

  function pressHandler() {
    Animated.timing(scaleValue1, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scaleValue1, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
    onPress();
  }
  return (
    <Animated.View
      style={[
        { height: 56, borderRadius: 28, overflow: "hidden" },
        overlayStyle,
        { transform: [{ scale: scaleValue1 }] },
      ]}
    >
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) =>
          pressed ? { opacity: 0.6, flex: 1 } : { flex: 1 }
        }
        onPress={pressHandler}
        disabled={disabled}
      >
        <View
          style={[
            {
              flexDirection: "row",
              backgroundColor: backgroundColor ? backgroundColor : "#009A80",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            },
          ]}
        >
          {children != undefined ? (
            children
          ) : (
            <>
            {icon && icon}
              <Text
                numberOfLines={1}
                style={[
                  {
                    fontFamily: "Exo2_700Bold",
                    fontSize: 16,
                    color: "white",
                  },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
