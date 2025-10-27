import React, { useEffect, useRef } from "react";
import { Animated, View, useWindowDimensions } from "react-native";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";
import { MAX_PHONE_WIDTH } from "@/constants/layout";
import { useGlobalContext } from "@/contexts/GlobalContext";

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

interface VitalsRadarChartProps {
  scores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
  size?: number;
}

export function VitalsRadarChart({
  scores,
  size,
}: VitalsRadarChartProps) {
  const { isTablet } = useGlobalContext();
  const { width: windowWidth } = useWindowDimensions();

  // Calculate responsive size based on container width
  const containerWidth = isTablet ? MAX_PHONE_WIDTH : windowWidth;
  const chartSize = size ?? containerWidth - 80;
  const center = chartSize / 2;
  const radius = center - 60; // Leave space for labels

  // Chart configuration
  const maxScore = 100;

  // Animation setup
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let animationRef: Animated.CompositeAnimation;

    const heartbeat = () => {
      animationRef = Animated.sequence([
        // First beat (lub) - quick and strong
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 120,
          useNativeDriver: false,
        }),
        // Quick settle
        Animated.timing(pulseAnim, {
          toValue: 0.98,
          duration: 80,
          useNativeDriver: false,
        }),
        // Second beat (dub) - smaller
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 100,
          useNativeDriver: false,
        }),
        // Return to normal
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]);

      animationRef.start(({ finished }) => {
        if (finished) {
          // Wait before next heartbeat (realistic heart rate ~75 BPM)
          timeoutId = setTimeout(heartbeat, 800);
        }
      });
    };

    heartbeat();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (animationRef) {
        animationRef.stop();
      }
    };
  }, [pulseAnim]);

  // Vitals data - reordered to put Overall (society) at top
  const vitals = [
    { key: "society", label: "Overall", color: "#FFD700" },
    { key: "discipline", label: "Discipline", color: "#FF5C2A" },
    { key: "mindset", label: "Mindset", color: "#00D4FF" },
    { key: "strength", label: "Strength", color: "#FF3366" },
    { key: "momentum", label: "Momentum", color: "#00FF88" },
    { key: "confidence", label: "Confidence", color: "#FF00FF" },
  ];

  // Calculate angle for each vital (360° / number of vitals)
  const angleStep = (2 * Math.PI) / vitals.length;

  // Function to get coordinates for a point on the chart
  const getCoordinates = (angle: number, distance: number) => {
    const x = center + distance * Math.cos(angle - Math.PI / 2);
    const y = center + distance * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  // Generate grid lines (radial lines only)
  const gridLines: React.ReactNode[] = [];

  // Radial lines
  vitals.forEach((_, index) => {
    const angle = angleStep * index;
    const { x, y } = getCoordinates(angle, radius);
    gridLines.push(
      <Line
        key={`line-${index}`}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
      />
    );
  });

  // Calculate data points with animation
  const dataPoints = vitals.map((vital, index) => {
    const score = scores[vital.key as keyof typeof scores] || 0;
    const angle = angleStep * index;
    const distance = (radius * score) / maxScore;
    return getCoordinates(angle, distance);
  });

  // Create polygon path for the data
  const polygonPoints = dataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  // Create background polygon for 100% scores (outer edge)
  const maxDataPoints = vitals.map((_, index) => {
    const angle = angleStep * index;
    return getCoordinates(angle, radius);
  });
  const maxPolygonPoints = maxDataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  // Create labels with scores
  const labels = vitals.map((vital, index) => {
    const angle = angleStep * index;
    const labelDistance = radius + 30;
    const { x, y } = getCoordinates(angle, labelDistance);
    const score = Math.round(scores[vital.key as keyof typeof scores] || 0);

    return (
      <React.Fragment key={`label-${index}`}>
        <SvgText
          x={x}
          y={y - 8}
          fill="white"
          fontSize="10"
          fontFamily="TussilagoRegular"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {vital.label}
        </SvgText>
        <SvgText
          x={x}
          y={y + 10}
          fill="rgba(255, 255, 255, 0.7)"
          fontSize="12"
          fontFamily="TussilagoRegular"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {score}
        </SvgText>
      </React.Fragment>
    );
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={chartSize} height={chartSize}>
        {/* Grid lines */}
        {gridLines}

        {/* Background polygon for 100% (max values) */}
        <Polygon
          points={maxPolygonPoints}
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />

        {/* Animated Data polygon */}
        <Animated.View
          style={{
            position: "absolute",
            transform: [{ scale: pulseAnim }],
            left: 0,
            top: 0,
          }}
        >
          <Svg width={chartSize} height={chartSize}>
            <Polygon
              points={polygonPoints}
              fill="rgba(255, 92, 42, 0.6)"
              stroke="white"
              strokeWidth="2"
            />
          </Svg>
        </Animated.View>

        {/* Labels */}
        {labels}
      </Svg>
    </View>
  );
}
