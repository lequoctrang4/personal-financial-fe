import { Text, View } from "react-native";
export default function TitleMini({ textName2 }: { textName2: any }) {
  return (
    <View>
      <Text
        style={{
          width: "95%",
          alignItems: "flex-start",
          paddingLeft: 14.56,
          color: "#8e8e8e",
          paddingBottom: 20,
          fontFamily: "Exo2_400Regular",
          fontWeight: "400",
          paddingTop: 20,
        }}
      >
        {textName2}
      </Text>
    </View>
  );
}
