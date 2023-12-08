import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import DateItem from "./DateItem";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { setReload } from "../../redux/reload";
import { useDispatch, useSelector } from "react-redux";
import { timeCurrent } from "../../../src/utils/function";

const Calendar = ({
  setSelectedDate,
  selectedDate,
  selectMonth,
  selectYear,
}: {
  setSelectedDate: any;
  selectedDate: any;
  selectMonth: string;
  selectYear: string;
}) => {
  const reload = useSelector((state: any) => state.reload.reload);

  const [dates, setDates] = useState([]);
  const [load, setLoad] = useState(true);
  const [isScrollViewReady, setScrollViewReady] = useState(false);
  const handleScrollViewLayout = () => {
    // Called when the ScrollView layout is calculated
    setScrollViewReady(true);
  };
  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 1000);
    (async () => {
      let day = new Date(selectYear + "-" + selectMonth.substring(6) + "-01");
      console.log(selectMonth);
      const parsedYear: number = parseInt(selectYear, 10);
      const parsedMonth: number = parseInt(selectMonth.substring(6), 10);
      const daysInMonth: number = new Date(
        parsedYear,
        parsedMonth,
        0
      ).getDate();
      const _dates = [];
      for (let i = 1; i <= daysInMonth; i++) {
        day.setDate(i);
        if (day > new Date(new Date().getTime() + 7 * 60 * 60 * 1000)) {
          break;
        }
        _dates.push(day.toISOString().split("T")[0]);
      }
      setDates(_dates as any);
    })();
  }, [selectMonth, selectYear]);
  const horizontalScrollViewRef = useRef(null);

  useEffect(() => {
    // Đảm bảo ScrollView đã sẵn sàng trước khi cuộn đến cuối cùng
    if (isScrollViewReady && horizontalScrollViewRef.current) {
      (horizontalScrollViewRef.current as any).scrollToEnd({ animated: true });
    }
  }, [isScrollViewReady, dates, reload]); //

  return (
    <>
      <View style={styles.dateSection}>
        {load && (
          <ContentLoader speed={0.5}>
            <Rect x="0" y="10" width="60" height="60" rx="4" ry="4" />
            <Rect x="70" y="10" width="60" height="60" rx="4" ry="4" />
            <Rect x="140" y="10" width="60" height="60" rx="4" ry="4" />
            <Rect x="210" y="10" width="60" height="60" rx="4" ry="4" />
            <Rect x="280" y="10" width="60" height="60" rx="4" ry="4" />
            <Rect x="350" y="10" width="60" height="60" rx="4" ry="4" />
            <Rect x="420" y="10" width="60" height="60" rx="4" ry="4" />
          </ContentLoader>
        )}

        <ScrollView
          ref={horizontalScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          alwaysBounceHorizontal={false}
          stickyHeaderIndices={[10]}
          onLayout={handleScrollViewLayout} // Call the handler when ScrollView layout is calculated
        >
          {dates.map((date, index) => {
            return (
              <DateItem
                key={index}
                date={date}
                check={selectedDate === date}
                setSelectedDate={setSelectedDate}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateSection: {
    width: "95%",
    padding: 0,
    alignSelf: "center",
    height: 80,
  },
});
