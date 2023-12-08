import React, { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import _isEmpty from "lodash/isEmpty";
import { Calendar } from "react-native-calendars";
import { StyleSheet } from "react-native";
import { getAccounts, getAllTransactions } from "../../api/userApi";
import {
  getData,
  getTime,
  getDateofBeforeMonth,
  getDateofCurrentMonth,
  FormatDateCalendar,
} from "../../utils/function";
import { alertType } from "../../../types/type";

interface CustomCalendarProps {
  setFromDate: any;
  setToDate: any;
  reload: boolean;
  setNum: any;
  setNumIn: any;
  setNumOut: any;
  selectAccount: any;
  navigation?: any;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  setFromDate,
  setToDate,
  reload,
  setNum,
  setNumIn,
  setNumOut,
  selectAccount,
  navigation,
}) => {
  const [start, setStart] = useState<any>({});
  const [end, setEnd] = useState<any>({});
  const [period, setPeriod] = useState<any>({});
  const [multiDots, setMultiDots] = useState<any>({});
  const [dataAccount, setDataAccount] = useState([]);
  const [fromDateCalendar, setFromDateCalendar] = useState(
    getDateofBeforeMonth(new Date().getMonth() - 1)
  );
  const [toDateCalendar, setToDateCalendar] = useState(
    getDateofCurrentMonth(new Date().getMonth() + 1)
  );

  const [dataAllTransaction, setDataAllTransaction] = useState([]);

  //Lấy thời gian ở dạng kí tự
  const getDateString = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let dateString = `${year}-`;
    if (month < 10) {
      dateString += `0${month}-`;
    } else {
      dateString += `${month}-`;
    }
    if (day < 10) {
      dateString += `0${day}`;
    } else {
      dateString += day;
    }

    return dateString;
  };

  // Hàm lấy khoảng thời gian
  const getPeriod = (startTimestamp: number, endTimestamp: number) => {
    const newPeriod: any = {};
    let currentTimestamp = startTimestamp;
    while (currentTimestamp < endTimestamp) {
      const dateString = getDateString(currentTimestamp);
      newPeriod[dateString] = {
        startingDay: currentTimestamp === startTimestamp,
        selected: true,
        selectedColor: "#009a80",
      };
      currentTimestamp += 24 * 60 * 60 * 1000;
    }
    const dateString = getDateString(endTimestamp);
    newPeriod[dateString] = {
      endingDay: true,
      selected: true,
      selectedColor: "#009a80",
    };
    return newPeriod;
  };

  //Hàm thực hiện lưu và kiểm tra ngày bắt đầu, ngày kết thúc khi nhấn chọn ngày trên lịch
  const setDay = (dayObj: any) => {
    const { dateString, day, month, year } = dayObj;
    const timestamp = new Date(year, month - 1, day).getTime();
    const newDayObj = { ...dayObj, timestamp };

    if (_isEmpty(start) || (!_isEmpty(start) && !_isEmpty(end))) {
      const newPeriod = {
        [dateString]: {
          color: "#009a80",
          endingDay: true,
          startingDay: true,
          selected: true,
          selectedColor: "#009a80",
        },
      };
      setStart(newDayObj);
      setPeriod(newPeriod);
      setEnd({});
    } else {
      const savedTimestamp = start.timestamp;
      if (savedTimestamp > timestamp) {
        const newPeriod = getPeriod(timestamp, savedTimestamp);
        setStart(newDayObj);
        setEnd(start);
        setPeriod(newPeriod);
        setFromDate(newDayObj.dateString);
        setToDate(start.dateString);
        setNum(0);
        setNumIn(0);
        setNumOut(0);
      } else {
        const newPeriod = getPeriod(savedTimestamp, timestamp);
        setEnd(newDayObj);
        setStart(start);
        setPeriod(newPeriod);
        setToDate(newDayObj.dateString);
        setFromDate(start.dateString);
        setNum(0);
        setNumIn(0);
        setNumOut(0);
      }
    }
  };

  //Những ngày năm ngoài vùng minDate và maxDate được giới hạn sẽ bị Disabled, người dùng không thể nhấn được
  const isDateDisabled = (date: Date) => {
    const minDate = new Date(
      new Date().getFullYear() - 1,
      new Date().getMonth(),
      new Date().getDate() - 1
    );
    const maxDate = new Date(getTime(new Date().getMonth() + 1));
    const currentDate = new Date(date);

    return currentDate < minDate || currentDate > maxDate;
  };

  //Hàm lấy dữ liệu giao dịch, và cập nhật khi có sự thay đổi của các biến
  useEffect(() => {
    setStart({});
    setEnd({});
    setPeriod({});
    setMultiDots({});
    (async () => {
      try {
        let token = await getData("token");

        if (!token) {
          throw new Error("Bạn không có phân quyền truy cập vào dữ liệu!");
        }
        // console.log("select Account là: ", selectAccount);
        let res = await getAccounts(token);

        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);

        setDataAccount(res.data);

        res = await getAllTransactions(
          token,
          fromDateCalendar,
          toDateCalendar,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          selectAccount == "Tất cả tài khoản" ? undefined : selectAccount
        );
        if (res.error === undefined) throw new Error("Lỗi Server");
        if (res.error) throw new Error(res.message);

        setDataAllTransaction(res.data);
      } catch (error: any) {
        console.log("Có lỗi xảy ra");
      }
    })();
    // console.log("Tài khoản", selectAccount);
  }, [reload, selectAccount, fromDateCalendar, toDateCalendar]);

  // console.log("Thời gian hiện tại là: ", getTime(new Date().getMonth() + 1));
  //Hàm tinh chỉnh dấu chấm hiển thị trên lịch
  useEffect(() => {
    // console.log(dataAllTransaction);
    (async () => {
      const newMultiDots: any = {};

      dataAllTransaction.map((item: any, index: any) => {
        let dateString = FormatDateCalendar(item?.transaction_date.toString());
        // console.log("DateString là: ", dateString);
        if (item.transaction_amount > 0) {
          // console.log("check Tiền vào- true");

          if (!(dateString in newMultiDots)) {
            newMultiDots[dateString] = {
              dots: [{ marked: true, color: "#0A9F86" }],
            };
          } else {
            // console.log("Dữ liệu dots là: ", newMultiDots[dateString].dots);
            if (
              dateString in newMultiDots &&
              newMultiDots[dateString].dots[
                newMultiDots[dateString].dots?.length - 1
              ].color != "#0A9F86" &&
              newMultiDots[dateString].dots?.length <= 1
            ) {
              newMultiDots[dateString].dots.push({
                marked: true,
                color: "#0A9F86",
              });
            }
          }
        } else if (item.transaction_amount < 0) {
          // console.log("check tiền ra - true");

          if (!(dateString in newMultiDots)) {
            newMultiDots[dateString] = {
              dots: [{ marked: true, color: "#F24C4C" }],
            };
          } else {
            // console.log("Dữ liệu dots là: ", newMultiDots[dateString].dots);

            if (
              dateString in newMultiDots &&
              newMultiDots[dateString].dots[
                newMultiDots[dateString].dots?.length - 1
              ].color != "#F24C4C" &&
              newMultiDots[dateString].dots?.length <= 1
            ) {
              newMultiDots[dateString].dots.push({
                marked: true,
                color: "#F24C4C",
              });
            }
          }
        } else {
          console.log("Trường hợp khác, giao dịch bằng 0");
        }

        setMultiDots(newMultiDots);
      });

      // console.log("newMultiDots là: ", newMultiDots);
    })();
  }, [
    reload,
    fromDateCalendar,
    toDateCalendar,
    selectAccount,
    dataAllTransaction.length,
  ]);

  // console.log(fromDateCalendar, toDateCalendar);
  return (
    <View>
      <Calendar
        style={styles.calendar}
        onDayPress={(dayObj) => {
          setDay(dayObj);
        }}
        minDate={String(
          new Date(
            new Date().getFullYear() - 1,
            new Date().getMonth(),
            new Date().getDate()
          )
        )}
        maxDate={getTime(new Date().getMonth() + 1)}
        markingType="multi-dot"
        markedDates={{ ...multiDots, ...period }}
        onMonthChange={(nativeEvent: any) => {
          const currentMonth = nativeEvent?.month;

          setFromDateCalendar(getDateofBeforeMonth(currentMonth - 2));
          setToDateCalendar(getDateofBeforeMonth(currentMonth + 1));
        }}
        theme={{
          selectedDayBackgroundColor: "red",
          todayTextColor: "#009a80",
          monthTextColor: "black",
          textMonthFontWeight: "bold",
          textMonthFontSize: 22,
          arrowColor: "black",
          // calendarBackground: "lightblue",
          dayTextColor: "black",
          textSectionTitleColor: "black",
          textInactiveColor: "#c0c0c0",
          textDayFontFamily: "Exo2_400Regular",
          textDayHeaderFontFamily: "Exo2_400Regular",
          textSectionTitleDisabledColor: "#c0c0c0",
          todayButtonTextColor: "red",
          agendaTodayColor: "purple",
        }}
        dayTextStyle={(date: any) => {
          const isDisabled = isDateDisabled(date);
          const textColor = isDisabled ? "blue" : "black";
          return {
            color: textColor,
          };
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    alignSelf: "center",
    width: Dimensions.get("screen").width * 0.95,
    // Platform.OS == "ios" ? Dimensions.get("screen").width * 0.95 : "100%",
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 3,
    marginLeft: 1,
    marginRight: 1,
  },
});

export default CustomCalendar;
