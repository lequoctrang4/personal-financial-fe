import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Animated,
  Alert,
  FlatList,
} from "react-native";
import { getAllTransactions } from "../../api/userApi";
import { getData, getTime } from "../../utils/function";
import ItemTransaction from "./ItemTransaction";
export default function Transaction({
  navigation,
  dataAllTransaction,
  dataInTransaction,
  dataOutTransaction,
  selectButton,
  setSelectButton,
}: {
  navigation: any;
  dataAllTransaction: any;
  dataInTransaction: any;
  dataOutTransaction: any;
  selectButton: any;
  setSelectButton: any;
}) {
  const [activeButtonIndex, setActiveButtonIndex] = useState(selectButton);
  const buttonStates = ["Tất cả", "Tiền vào", "Tiền ra"];
  const animationValue = new Animated.Value(0);
  const handleButtonPress = (index: number) => {
    setSelectButton(index);
    setActiveButtonIndex(index);
    console.log(index);
    Animated.timing(animationValue, {
      toValue: index,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.header}>
        {buttonStates.map((state, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              activeButtonIndex === index && styles.activeButton,
            ]}
            onPress={() => handleButtonPress(index)}
          >
            <Animated.Text
              style={[
                styles.text,
                activeButtonIndex === index && styles.activeText,
              ]}
            >
              {state}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: "column",
        }}
      >
        {activeButtonIndex === 0 ? (
          <ItemTransaction data={dataAllTransaction} />
        ) : activeButtonIndex === 1 ? (
          <ItemTransaction data={dataInTransaction} />
        ) : (
          <ItemTransaction data={dataOutTransaction} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 30,
    width: "95%",
    height: 45,
    backgroundColor: "#e5f5f2",
    alignSelf: "center",
    overflow: "hidden",
    top: 10,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    overflow: "hidden",
    borderRadius: 30,
  },
  text: {
    color: "#009a80",
    fontFamily: "Exo2_700Bold",
    fontSize: 13,
  },
  activeText: {
    fontFamily: "Exo2_700Bold",
    color: "white",
  },
  activeButton: {
    backgroundColor: "#009a80",
    borderRadius: 30,
  },
});
