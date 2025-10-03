import { Colors } from "@/constants/theme";
import moment from "moment";
import React from "react";
import { Dimensions } from "react-native";
import Svg, {
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

interface ProgressChartProps {
  tasksCompletedCumulative: number[];
  startDate: string;
  currentDay: number;
}

export function ProgressChart({
  tasksCompletedCumulative,
  startDate,
  currentDay,
}: ProgressChartProps) {
  const chartWidth = screenWidth - 20; // padding
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 20 };

  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max value including projected future values
  const calculateMaxTasks = () => {
    let lastTaskCount =
      tasksCompletedCumulative[tasksCompletedCumulative.length - 1] || 0;
    const projectedValues = [];

    for (let day = 0; day < 66; day++) {
      if (tasksCompletedCumulative[day] !== undefined) {
        lastTaskCount = tasksCompletedCumulative[day];
      } else {
        lastTaskCount += 7;
      }
      projectedValues.push(lastTaskCount);
    }

    const maxProjected = Math.max(...projectedValues, 1);

    // Show 3x current progress or minimum 10
    const currentMax = tasksCompletedCumulative[currentDay - 1] || 0;
    const scaledMax = Math.max(currentMax * 3, 10);

    // Use the smaller of projected max or scaled max to keep chart visible
    return Math.min(maxProjected, scaledMax);
  };

  const maxTasks = calculateMaxTasks();

  // Generate points for the line chart
  const generatePath = (endDay: number) => {
    if (endDay === 0 || tasksCompletedCumulative.length === 0)
      return { path: "", areaPath: "" };

    const points: string[] = [];
    //
    // Calculate projected values for all 66 days
    const projectedTasks = [];
    let lastTaskCount =
      tasksCompletedCumulative[tasksCompletedCumulative.length - 1] || 0;

    for (let day = 0; day < 66; day++) {
      if (tasksCompletedCumulative[day] !== undefined) {
        lastTaskCount = tasksCompletedCumulative[day];
        projectedTasks.push(lastTaskCount);
      } else {
        lastTaskCount += Math.max(currentDay * 3, 10) / 66; // Linear projection
        projectedTasks.push(lastTaskCount);
      }
    }

    for (let day = 0; day < endDay; day++) {
      const x = padding.left + (day / 65) * plotWidth;
      const taskCount = projectedTasks[day];
      const y = padding.top + plotHeight - (taskCount / maxTasks) * plotHeight;

      if (day === 0) {
        points.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`);
      } else {
        points.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
      }
    }

    const path = points.join(" ");

    // Create area path (same as line path but closes to bottom)
    const lastPoint = points[points.length - 1].split(" ");
    const firstPoint = points[0].split(" ");
    const areaPath = `${path} L ${lastPoint[1]} ${
      chartHeight - padding.bottom
    } L ${firstPoint[1]} ${chartHeight - padding.bottom} Z`;

    return { path, areaPath };
  };

  const actualPath = generatePath(currentDay);
  const futurePath = generatePath(66);

  const start = moment(startDate);
  const end = start.clone().add(65, "days");

  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Defs>
        <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.6" />
          <Stop offset="1" stopColor={Colors.primary} stopOpacity="0.05" />
        </LinearGradient>
      </Defs>

      {/* X-axis */}
      <Line
        x1={padding.left}
        y1={chartHeight - padding.bottom}
        x2={chartWidth - padding.right}
        y2={chartHeight - padding.bottom}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
      />

      {/* Future area (faded) */}
      {currentDay < 66 && futurePath.areaPath && (
        <Path d={futurePath.areaPath} fill="rgba(255, 255, 255, 0.05)" />
      )}

      {/* Future path (faded) */}
      {currentDay < 66 && futurePath.path && (
        <Path
          d={futurePath.path}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="6,6"
        />
      )}

      {/* Actual area with gradient */}
      {actualPath.areaPath && (
        <Path d={actualPath.areaPath} fill="url(#areaGradient)" />
      )}

      {/* Actual path */}
      {actualPath.path && (
        <Path
          d={actualPath.path}
          stroke={Colors.primary}
          strokeWidth="1"
          fill="none"
        />
      )}

      {/* Start date label */}
      <SvgText
        x={padding.left}
        y={chartHeight - 10}
        fill="rgba(255, 255, 255, 0.7)"
        fontSize="10"
        fontFamily="TussilagoRegular"
        textAnchor="middle"
      >
        {start.format("MMM D")}
      </SvgText>

      {/* End date label */}
      <SvgText
        x={chartWidth - padding.right}
        y={chartHeight - 10}
        fill="rgba(255, 255, 255, 0.7)"
        fontSize="10"
        fontFamily="TussilagoRegular"
        textAnchor="middle"
      >
        {end.format("MMM D")}
      </SvgText>
    </Svg>
  );
}
