import React, { useState } from "react";
import { PanResponder, Dimensions, View } from "react-native";
import { AreaChart, XAxis, YAxis } from "react-native-svg-charts";
import moment from "moment";
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import * as shape from "d3-shape";
import { currencyFormat } from "../../utils/function";
const LinearChart = ({
  data,
  colorLine,
  styleDate,
}: {
  data: { balance: number; date: string }[];
  colorLine: string;
  styleDate: string;
}) => {
  const apx = (size = 0) => {
    let width = Dimensions.get("window").width;
    return (width / 750) * size;
  };

  const [positionX, setPositionX] = useState(-1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderTerminationRequest: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      updatePosition(evt.nativeEvent.locationX);
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {
      updatePosition(evt.nativeEvent.locationX);
      return true;
    },
    onPanResponderRelease: () => {
      setPositionX(-1);
    },
  });

  const updatePosition = (x: any) => {
    const YAxisWidth = apx(130);
    const x0 = apx(0); // x0 position
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth; //xN position
    const xDistance = chartWidth / data.length; // The width of each coordinate point
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    let value = parseInt(((x - x0) / xDistance).toFixed(0));
    if (value >= data.length - 1) {
      value = data.length - 1; // Out of chart range, automatic correction
    }

    setPositionX(Number(value));
  };
  const CustomGrid = ({ x, y, ticks }: { x: any; y: any; ticks: any }) => (
    <G>
      {
        // Horizontal grid
        ticks.map((tick: any) => (
          <Line
            key={tick}
            x1="0%"
            x2="100%"
            y1={y(tick)}
            y2={y(tick)}
            stroke="#EEF3F6"
          />
        ))
      }
      {
        // Vertical grid
        data.map((_, index) => (
          <Line
            key={index.toString()}
            y1="0%"
            y2="100%"
            x1={x(index)}
            x2={x(index)}
            stroke="#EEF3F6"
          />
        ))
      }
    </G>
  );

  const CustomLine = ({ line }: { line?: any }) => (
    <Path
      key="line"
      d={line}
      stroke={colorLine}
      strokeWidth={apx(4)}
      fill="none"
    />
  );

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor={colorLine} stopOpacity={0.25} />
        <Stop offset="100%" stopColor={colorLine} stopOpacity={0} />
      </LinearGradient>
    </Defs>
  );
  const Tooltip = ({ x, y, ticks }: { x?: any; y?: any; ticks?: any }) => {
    if (positionX < 0 || positionX >= data.length) {
      return null;
    }
    const date = data[positionX]?.date;
    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > data.length / 2 ? -apx(300 + 10) : apx(10)}
          y={y(data[positionX].balance) - apx(10)}
        >
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)} // borderRadius
            ry={apx(12)} // borderRadius
            width={apx(300)}
            height={apx(96)}
            stroke={colorLine}
            fill="rgba(255, 255, 255, 0.8)"
          />

          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {moment(date).format(styleDate)}
          </SvgText>
          <SvgText
            x={apx(20)}
            y={apx(24 + 20)}
            fontSize={apx(24)}
            fontWeight="bold"
            fill={colorLine}
          >
            {currencyFormat(data[positionX].balance) + " đ"}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[ticks.length - 1]}
            stroke={colorLine}
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />

          <Circle
            cy={y(data[positionX].balance)}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill={colorLine}
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = { top: apx(40), bottom: apx(40) };

  return (
    <View style={{ backgroundColor: "#fff", overflow: "hidden" }}>
      <View
        style={{
          flexDirection: "row",
          width: apx(700),
          height: apx(570),
          alignSelf: "stretch",
        }}
      >
        <YAxis
          style={{ width: apx(100) }}
          data={data.map((item) => item.balance)}
          contentInset={verticalContentInset}
          svg={{ fontSize: apx(20), fill: "#617485" }}
          formatLabel={(value) => {
            function formatValue(
              value: number,
              divisor: number,
              suffix: string
            ) {
              let newValue = Math.abs(value) / divisor;
              return (value < 0 ? "-" : "") + newValue + suffix;
            }
            if (value >= 1000000000) {
              return formatValue(value, 1000000000, "b");
            } else if (value <= -1000000000) {
              return formatValue(value, 1000000000, "b");
            } else if (value >= 1000000) {
              return formatValue(value, 1000000, "m");
            } else if (value <= -1000000) {
              return formatValue(value, 1000000, "m");
            } else if (value >= 1000) {
              return formatValue(value, 1000, "k");
            } else if (value <= -1000) {
              return formatValue(value, 1000, "k");
            } else {
              return value.toString();
            }
          }}
        />
        <View style={{ flex: 1, position: "relative" }}>
          <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            <AreaChart
              style={{ flex: 1 }}
              data={data.map((item) => item.balance)}
              curve={shape.curveMonotoneX}
              contentInset={verticalContentInset}
              svg={{ fill: "url(#gradient)" }}
            >
              <CustomLine />
              {/* <CustomGrid /> */}
              <CustomGradient />
              <Tooltip />
            </AreaChart>
          </View>
        </View>
      </View>
      <XAxis
        style={{
          alignSelf: "stretch",
          width: apx(780),
          height: apx(60),
        }}
        numberOfTicks={data.length < 7 ? data.length - 1 : 7}
        data={data.map((item, index) => index)}
        formatLabel={(value) => moment(data[value]?.date).format(styleDate)}
        contentInset={{
          left: apx(136),
          right: apx(130),
        }}
        svg={{
          fontSize: apx(20),
          fill: "#617485",
          y: apx(20),
        }}
      />
    </View>
  );
};

export default LinearChart;
