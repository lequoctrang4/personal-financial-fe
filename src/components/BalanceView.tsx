import { View, Text } from "react-native";
import UpIcon from "./Transaction/UpIcon";
import DownIcon from "./Transaction//DownIcon";
export default function BalanceView({
  backGroundColor,
  logo,
  value,
  label,
  align,
}: {
  align: any;
  label: string;
  value: string;
  backGroundColor: string;
  logo?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: backGroundColor,
        height: 60,
        borderRadius: 5,
        width: "100%",
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 4,
          flexDirection: "column",
          gap: -7,
          alignItems: align,
        }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "Exo2_400Regular",
              fontSize: 14,
              color: "#434343",
            }}
          >
            {label}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Exo2_700Bold",
              fontSize: 16,
              color: "#434343",
            }}
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>
      </View>
      {logo === "UpIcon" && (
        <View style={{ flex: 1 }}>
          <UpIcon />
        </View>
      )}
      {logo === "DownIcon" && (
        <View style={{ flex: 1 }}>
          <DownIcon />
        </View>
      )}
    </View>
  );
}
