import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
  Animated,
} from "react-native";
import React, { useState } from "react";
import TextView from "../TextView";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const DatePicker = (props: any) => {
  const { defaultDate, onDateChange, scaleValue1, startDate, setOpenStarDate } =
    props;

  const [date, setDate] = useState(new Date(defaultDate));
  const [show, setShow] = useState(false);

  const onChange = (e: any, selectedDate: any) => {
    setDate(new Date(selectedDate));
  };

  const onAndroidChange = (e: any, selectedDate: any) => {
    setShow(false);
    if (selectedDate) {
      setDate(new Date(selectedDate));
    }
  };

  const onCancelPress = () => {
    setDate(new Date(date));
    setShow(false);
  };
  const onDonePress = () => {
    onDateChange(date);
    setShow(false);
  };

  const renderDatePicker = () => {
    return (
      <>
        <DateTimePicker
          display={Platform.OS === "ios" ? "spinner" : "default"}
          timeZoneOffsetInMinutes={0}
          value={new Date(date)}
          mode="date"
          maximumDate={new Date()}
          minimumDate={new Date(2020, 10, 20)}
          onChange={Platform.OS === "ios" ? onChange : onAndroidChange}
        />
      </>
    );
  };

  return (
    <Pressable style={styles.box} onPress={() => setShow(true)}>
      <View>
        <Text style={styles.txt}>{`${new Date().getFullYear()}/${
          new Date().getMonth() + 1
        }/${new Date().getDate()}`}</Text>

        <TextView
          label="Thời gian bắt đầu"
          value={moment(startDate).format("DD/MM/YY")}
          width="100%"
          onPress={() => {
            Animated.timing(scaleValue1, {
              toValue: 0.9,
              duration: 100,
              useNativeDriver: true,
            }).start(() => {
              Animated.timing(scaleValue1, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }).start();
            });
            setOpenStarDate(true);
          }}
        />
        {Platform.OS !== "ios" && show && renderDatePicker()}

        {Platform.OS === "ios" && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={show}
            supportedOrientations={["portrait"]}
            onRequestClose={() => setShow(!show)}
          >
            <View style={styles.screen}>
              <TouchableHighlight
                underlayColor={"#FFF"}
                style={styles.pickerContainer}
              >
                <View style={{ backgroundColor: "#fff" }}>
                  <View style={{ marginTop: 20 }}>{renderDatePicker()}</View>
                  <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={onCancelPress}
                    style={[styles.btnText, styles.btnCancel]}
                  >
                    <Text style={{ fontSize: 18 }}>Cancel</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={onDonePress}
                    style={[styles.btnText, styles.btnDone]}
                  >
                    <Text>Done</Text>
                  </TouchableHighlight>
                </View>
              </TouchableHighlight>
            </View>
          </Modal>
        )}
      </View>
    </Pressable>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#fff",
    width: "100%",
    height: "30%",
    position: "absolute",
    bottom: 0,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    height: 50,
    paddingVertical: 10,
    backgroundColor: "white",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  txt: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  screen: {
    flex: 1,
  },
  btnText: {
    position: "absolute",
    top: 0,
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    left: 0,
  },
  btnDone: {
    right: 0,
  },
  textDate: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
