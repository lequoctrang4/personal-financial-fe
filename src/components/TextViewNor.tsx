import { StyleSheet, View, Alert, Pressable, TextInput } from "react-native";
import Eye from "./Style/Eye";
import Eyeoff from "./Style/Eyeoff";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import Icon, { Icons } from "./Style/Icons";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons"; // Import thư viện biểu tượng

export default function TextViewNor({
  input,
  setInput,
  placeholder,
}: {
  input: string;
  setInput?: any;
  placeholder?: string;
}) {
  return (
    <TextInput
      value={input}
      editable={true}
      placeholder={placeholder}
      placeholderTextColor={"black"}
      onChangeText={(value) => setInput(value)}
      style={{
        width: "100%",
        textAlign: "left",
        // backgroundColor: "red",
        height: 50,
        borderColor: "#c0c0c0",
        borderRadius: 16,
        borderWidth: 1,
        paddingLeft: 15,
        fontFamily: "Exo2_400Regular",
        fontWeight: "400",
      }}
    />
  );
}
