import { StyleSheet, View, Alert, Pressable } from "react-native";
import { TextInput } from "react-native-paper";
import Eye from "./Style/Eye";
import Eyeoff from "./Style/Eyeoff";
import { useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";

export default function TextViewRN({
  label,
  value,
  width,
  editable,
  setValue,
  placeholder,
  secureTextEntry,
  setSecureTextEntry,
  placeholderTextColor,
  onFocus,
  iconPara,
  vectorIcon,
  ...props
}: {
  label?: string | undefined;
  value: string;
  width: string;
  editable?: boolean | undefined;
  setValue?: any | undefined;
  placeholder?: string | undefined;
  secureTextEntry?: boolean | undefined;
  setSecureTextEntry?: any | undefined;
  placeholderTextColor?: any | undefined;
  onFocus?: any | undefined;
  iconPara?: any | undefined;
  vectorIcon?: boolean;
}) {
  useEffect(() => {
    if (value) {
      setError(false);
    }
  }, [value]);

  const styles = StyleSheet.create({
    inputContainer: {
      zIndex: -1,
      width: width as any,
      fontFamily: "Exo2_700Bold",
    },
  });
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(false);
  //   if (isFocused) {
  //     console.log("Text in Focus in field", label);
  //   } else {
  //     console.log("Text in Blur in field", label);
  //   }
  return (
    <TextInput
      style={styles.inputContainer}
      label={label}
      value={value ? value : ""}
      mode="outlined"
      textColor="#434343"
      outlineColor="#c0c0c0"
      activeOutlineColor="#009A80"
      editable={editable ? editable : false}
      numberOfLines={1}
      contentStyle={{ fontFamily: "Exo2_700Bold" }}
      onChangeText={(text) => setValue(text)}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      autoCorrect={false}
      cursorColor={"#009A80"}
      // onBlur={handleBlur}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => setIsFocused(false)}
      error={error}
      right={
        secureTextEntry != null ? (
          <TextInput.Icon
            icon={() =>
              secureTextEntry && value ? (
                <View>
                  <Eye />
                </View>
              ) : (
                <View style={{ top: 8 }}>
                  <Eyeoff />
                </View>
              )
            }
            forceTextInputFocus={false}
            onPress={() => {
              setSecureTextEntry(!secureTextEntry);
              if (value === "") {
                showMessage({
                  message: "Thông tin chưa được điền ở trường \n" + label,
                  backgroundColor: "#F24C4C",
                });
                setError(true);
              }
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            {...props}
          />
        ) : (
          <TextInput.Icon
            icon={iconPara}
            style={{
              paddingTop: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )
      }
    />
  );
}
