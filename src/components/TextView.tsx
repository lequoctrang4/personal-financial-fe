import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function TextView({
  label,
  value,
  width,
  editable,
  setValue,
  placeholder,
  onPress,
}: {
  label: string;
  value: string;
  width: string;
  editable?: boolean | undefined;
  setValue?: any | undefined;
  placeholder?: string | undefined;
  onPress?: () => void;
}) {
  // const handleBlur = () => {
  //   console.log("TextInput has lost focus.");
  //   return true;
  // };
  const styles = StyleSheet.create({
    inputContainer: {
      zIndex: -1,
      marginTop: 10,
      width: width as any,
      alignSelf: "center",
    },
  });
  return (
    <TextInput
      style={styles.inputContainer}
      onPressIn={onPress ? onPress : undefined}
      label={label}
      value={value ? value : ""}
      mode="outlined"
      textColor="#434343"
      outlineColor="#c0c0c0"
      activeOutlineColor="black"
      editable={editable ? editable : false}
      numberOfLines={1}
      contentStyle={{ fontFamily: "Exo2_700Bold" }}
      onChangeText={(text) => setValue(text)}
      placeholder={placeholder ? placeholder : ""}
      placeholderTextColor="green"
    />
  );
}
