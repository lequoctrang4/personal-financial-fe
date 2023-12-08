import AwesomeAlert from "react-native-awesome-alerts";
import { useSelector } from "react-redux";
export default function AlertComponent() {
  let alert = useSelector((state: any) => state.alert.alert);
  return (
    <AwesomeAlert
      show={alert.show}
      showProgress={false}
      title={alert.title}
      modalProps={{
        statusBarTranslucent: true,
        presentationStyle: "overFullScreen",
      }}
      overlayStyle={{ height: "100%" }}
      contentContainerStyle={{ width: 300, borderRadius: 15 }}
      titleStyle={[
        {
          fontFamily: "Exo2_700Bold",
          color: "#434343",
          fontSize: 20,
          textAlign: "center",
        },
        alert.titleStyle,
      ]}
      messageStyle={{
        fontFamily: "Exo2_400Regular",
        color: "#434343",
        fontSize: 14,
        textAlign: "center",
      }}
      message={alert.message}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showConfirmButton={alert.showConfirm}
      showCancelButton={alert.showCancel}
      cancelText={alert.cancelText}
      confirmText={alert.confirmText}
      customView={alert.customView}
      actionContainerStyle={{
        flexDirection: "column-reverse",
        width: "90%",
        alignItems: "center",
        alignSelf: "center",
      }}
      confirmButtonTextStyle={{
        color: alert.confirmTextColor ? alert.confirmTextColor : "#da0000",
        textAlign: "center",
        padding: 5,
        fontFamily: "Exo2_700Bold",
      }}
      cancelButtonTextStyle={{
        color: alert.cancelTextColor ? alert.cancelTextColor : "#545454",
        textAlign: "center",
        padding: 5,
        fontFamily: "Exo2_700Bold",
      }}
      cancelButtonStyle={{
        width: "100%",
        borderRadius: 24,
        backgroundColor: alert.cancelButtonColor
          ? alert.cancelButtonColor
          : "#dddddd",
      }}
      confirmButtonStyle={{
        width: "100%",
        borderRadius: 24,
        backgroundColor: alert.confirmButtonColor
          ? alert.confirmButtonColor
          : "#fcdbdb",
      }}
      onCancelPressed={alert.onCancelPressed}
      onConfirmPressed={alert.onConfirmPressed}
      onDismiss={alert.onDismiss}
    />
  );
}
