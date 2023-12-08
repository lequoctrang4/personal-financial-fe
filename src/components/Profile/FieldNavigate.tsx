import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { TextInput } from "react-native-paper";
import Icon, { Icons } from "../Style/Icons";

export default function FieldNavigate({ textName }: { textName: string }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "98%",
        padding: 15,
      }}
    >
      <Text style={{ fontFamily: "Exo2_700Bold", color: "#434343"}}>
        {textName}
      </Text>
      <View style={{ alignSelf: "flex-end" }}>
        <Icons.AntDesign
          name="arrowright"
          size={20}
          color="#434343"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
