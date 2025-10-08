import React from "react";
import { Circle, Line, Path, Polyline, Svg } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

export const WinterArcIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M12 6L14.5 9L18 8L16 12L20 14L16 16L18 20L14.5 19L12 22L9.5 19L6 20L8 16L4 14L8 12L6 8L9.5 9L12 6Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CommunityIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15C17.9391 15 16.9217 15.4214 16.1716 16.1716C15.4214 16.9217 15 17.9391 15 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ToolsIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.7 6.3C15.0314 5.96863 15.5 5.78137 16 5.78137C16.5 5.78137 16.9686 5.96863 17.3 6.3C17.6314 6.63137 17.8186 7.1 17.8186 7.6C17.8186 8.1 17.6314 8.56863 17.3 8.9L16 10.2L13.8 8L14.7 6.3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V10C3 9.46957 3.21071 8.96086 3.58579 8.58579C3.96086 8.21071 4.46957 8 5 8H11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="13.8" y1="8" x2="16" y2="10.2" stroke={color} strokeWidth="2" />
    <Line x1="11" y1="8" x2="13.8" y2="10.8" stroke={color} strokeWidth="2" />
    <Path
      d="M14.12 15.5C14.4514 15.1686 14.92 14.9814 15.42 14.9814C15.92 14.9814 16.3886 15.1686 16.72 15.5C17.0514 15.8314 17.2386 16.3 17.2386 16.8C17.2386 17.3 17.0514 17.7686 16.72 18.1L15.42 19.4L13.22 17.2L14.12 15.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="13.22" y1="17.2" x2="15.42" y2="19.4" stroke={color} strokeWidth="2" />
  </Svg>
);

export const StoreIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline points="3,6 21,6" stroke={color} strokeWidth="2" />
    <Path
      d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);