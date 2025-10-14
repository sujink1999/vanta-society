import React from "react";
import { Circle, Path, Svg } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

interface IconProps {
  size?: number;
  color?: string;
}

// RECOVERY ICONS
export const SleepIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M15.5 12C15.5 8.96 13.04 6.5 10 6.5C6.96 6.5 4.5 8.96 4.5 12C4.5 15.04 6.96 17.5 10 17.5C13.04 17.5 15.5 15.04 15.5 12Z"
      fill={color}
    />
  </Svg>
);

export const WakeUpIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" fill={color} />
    <Path d="M12 2V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 20V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M4.22 4.22L5.64 5.64"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.36 18.36L19.78 19.78"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M2 12H4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M20 12H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M4.22 19.78L5.64 18.36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.36 5.64L19.78 4.22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const WindDownIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" fill={color} />
  </Svg>
);

export const SunlightIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" fill={color} />
    <Path d="M12 1V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 21V23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M4.22 4.22L5.64 5.64"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.36 18.36L19.78 19.78"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M1 12H3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M21 12H23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M4.22 19.78L5.64 18.36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.36 5.64L19.78 4.22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const ColdShowerIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 512.002 512.002">
    <Path
      fill={color}
      d="m420.233 152.32c-5.739-47.458-43.257-85.262-90.583-91.433-6.622-34.629-37.119-60.887-73.649-60.887h-120c-41.355 0-75 33.645-75 75v422c0 8.284 6.716 15 15 15s15-6.716 15-15v-105h30v15c0 8.284 6.716 15 15 15s15-6.716 15-15v-60c0-8.284-6.716-15-15-15s-15 6.716-15 15v15h-30v-287c0-24.813 20.187-45 45-45h120c20.075 0 37.116 13.215 42.895 31.401-45.686 7.518-81.529 44.623-87.127 90.919-17.857 5.971-30.768 22.841-30.768 42.68v30c0 8.284 6.716 15 15 15h240c8.284 0 15-6.716 15-15v-30c0-19.84-12.91-36.709-30.768-42.68zm-104.232-62.32c36.22 0 66.522 25.808 73.491 60h-146.982c6.969-34.192 37.271-60 73.491-60zm105 120h-210v-15c0-8.271 6.729-15 15-15h180c8.271 0 15 6.729 15 15z"
    />
    <Path
      fill={color}
      d="m316.001 272c-8.284 0-15 6.716-15 15v30c0 8.284 6.716 15 15 15s15-6.716 15-15v-30c0-8.284-6.716-15-15-15z"
    />
    <Path
      fill={color}
      d="m316.001 362c-8.284 0-15 6.716-15 15v30c0 8.284 6.716 15 15 15s15-6.716 15-15v-30c0-8.284-6.716-15-15-15z"
    />
    <Path
      fill={color}
      d="m316.001 452c-8.284 0-15 6.716-15 15v30c0 8.284 6.716 15 15 15s15-6.716 15-15v-30c0-8.284-6.716-15-15-15z"
    />
    <Path
      fill={color}
      d="m382.407 331.849c8.201-1.171 13.899-8.769 12.729-16.97l-4.285-30c-1.172-8.201-8.768-13.907-16.971-12.728-8.201 1.171-13.899 8.769-12.729 16.97l4.285 30c1.178 8.237 8.809 13.898 16.971 12.728z"
    />
    <Path
      fill={color}
      d="m395.265 421.849c8.201-1.171 13.899-8.769 12.729-16.97l-4.285-30c-1.172-8.201-8.763-13.905-16.971-12.728-8.201 1.171-13.899 8.769-12.729 16.97l4.285 30c1.177 8.237 8.808 13.898 16.971 12.728z"
    />
    <Path
      fill={color}
      d="m416.566 464.879c-1.172-8.201-8.764-13.908-16.971-12.728-8.201 1.171-13.899 8.769-12.729 16.97l4.285 30c1.177 8.237 8.808 13.898 16.971 12.728 8.201-1.171 13.899-8.769 12.729-16.97z"
    />
    <Path
      fill={color}
      d="m258.122 272.151c-8.21-1.174-15.799 4.527-16.971 12.728l-4.285 30c-1.171 8.201 4.527 15.799 12.729 16.97 8.206 1.175 15.8-4.534 16.971-12.728l4.285-30c1.171-8.201-4.528-15.799-12.729-16.97z"
    />
    <Path
      fill={color}
      d="m245.265 362.151c-8.208-1.179-15.799 4.527-16.971 12.728l-4.285 30c-1.171 8.201 4.527 15.799 12.729 16.97 8.206 1.175 15.8-4.534 16.971-12.728l4.285-30c1.17-8.201-4.528-15.799-12.729-16.97z"
    />
    <Path
      fill={color}
      d="m232.407 452.151c-8.212-1.178-15.799 4.527-16.971 12.728l-4.285 30c-1.171 8.201 4.527 15.799 12.729 16.97 8.206 1.175 15.8-4.534 16.971-12.728l4.285-30c1.171-8.201-4.527-15.799-12.729-16.97z"
    />
  </Svg>
);

export const WaterIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L8 8C6.9 9.5 6.9 11.5 8 13C9.1 14.5 11.9 14.5 13 13L17 7L12 2Z"
      fill={color}
    />
    <Path
      d="M12 22C16 22 19 19 19 15C19 11 16 8 12 8C8 8 5 11 5 15C5 19 8 22 12 22Z"
      fill={color}
      opacity="0.6"
    />
  </Svg>
);

// MOVEMENT ICONS
export const WorkoutIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z"
      fill={color}
    />
  </Svg>
);

export const StrengthTrainingIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12H6V8H10V12H14V8H18V12H22V14H18V16H14V12H10V16H6V12H2V14H2V12Z"
      fill={color}
    />
    <Circle cx="4" cy="13" r="2" fill={color} />
    <Circle cx="20" cy="13" r="2" fill={color} />
  </Svg>
);

export const RunningIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path
      fill={color}
      d="m57.11 47.85h-12.54a8.14615 8.14615 0 0 1 -5.8-2.4c-1.07882-1.08091-15.1518-15.14507-15.69-15.7l-12.63-12.63a1.047 1.047 0 0 0 -1.42 0l-4.06 4.07a3.308 3.308 0 0 0 0 4.67l29.06 29.05a9.62275 9.62275 0 0 0 1.14.99 10.11181 10.11181 0 0 0 6.07 2h13.16a5.60355 5.60355 0 0 0 5.6-5.6v-1.52a2.92582 2.92582 0 0 0 -2.89-2.93z"
    />
    <Path
      fill={color}
      d="m24.49 28.34.64.64c.22022-3.44357.78061-11.64959.99-14.98l.21-3.15a4.46431 4.46431 0 0 0 -7.58007-3.43986l-7.71993 7.71986a2.65945 2.65945 0 0 1 .82.56z"
    />
    <Path
      fill={color}
      d="m44.57 45.85h10.69a53.44363 53.44363 0 0 1 -9.37-15.04c-.865.8755-2.74212 2.73449-3.62 3.62a1.00057 1.00057 0 0 1 -1.41-1.42l4.26-4.26c-.86-2.37-1.59-4.46-2.21-6.26-1.029 1.029-4.7162 4.71628-5.81 5.81a.97836.97836 0 0 1 -1.41 0 .99582.99582 0 0 1 0-1.41c1.14767-1.14752 5.45111-5.45131 6.52-6.52-1.06536-3.27654-1.66224-6.69329-5.63014-6.74991a4.72082 4.72082 0 0 0 -4.30986 2.80991c-.58639 1.42964-2.15054 1.72762-3.56 1.59988-.49411.05954-.95834-.41447-.86988.33016l-.0101.21c-.11271 1.49819-.72157 11.01492-.82 12.3l13.16998 13.16996a6.16329 6.16329 0 0 0 4.39 1.81z"
    />
    <Path
      fill={color}
      d="m32.62 56.32-.42-.42h-27.2a1.00012 1.00012 0 0 0 0 2h29.55a10.39327 10.39327 0 0 1 -1.93-1.58z"
    />
    <Path
      fill={color}
      d="m20 49.85156a1.00019 1.00019 0 0 0 -.00007-2h-14.99993a1.00019 1.00019 0 0 0 .00007 2z"
    />
  </Svg>
);

export const CyclingIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="18" r="4" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="6" cy="18" r="4" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M8 16L12 12L16 16"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 12V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="6" r="2" fill={color} />
  </Svg>
);

export const WalkingIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="4" r="2" fill={color} />
    <Path
      d="M15.5 22H13.5L11 16L10 18V22H8V16L10 12L8 8H10L12 12L14 8H16L14 14L15.5 22Z"
      fill={color}
    />
  </Svg>
);

export const PushupsIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 96 96">
    <Path
      fill={color}
      d="m91.44 31.07c-.69-2.42-2.28-4.43-4.48-5.66s-4.75-1.52-7.17-.83c-5 1.42-7.92 6.65-6.49 11.65.69 2.42 2.28 4.43 4.48 5.66 1.42.79 2.99 1.2 4.58 1.2.87 0 1.74-.12 2.59-.36 2.42-.69 4.43-2.28 5.66-4.48s1.52-4.75.83-7.17z"
    />
    <Path
      fill={color}
      d="m88.05 69.79h-7.65c.44-.7.61-1.56.37-2.42l-6.08-21.75-4.54-12.69c-.44-1.51-1.94-2.42-3.41-2.12l-20.88 3.06c-.59.03-5.86.35-9.29 1.09-3.67.8-3.82 6.11-3.77 7.88l-25.5 19.39c-1.33.96-1.64 2.83-.69 4.17l1.96 2.75c.18.25.4.46.64.64h-4.01c-.55 0-1 .45-1 1s.45 1 1 1h82.85c.55 0 1-.45 1-1s-.45-1-1-1zm-46.57-20.34 23.9-3.41 7.65 23.64s.03.07.05.11h-60.24z"
    />
  </Svg>
);

export const PullupsIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="M466,30c-24.652,0-25.991,0-26.044,0c-0.002,0-0.003,0-0.002,0c-0.056,0-1.643,0-33.954,0c0-16.538-13.462-30-30-30c-16.538,0-30,13.462-30,30h-47.763C292.024,12.578,275.53,0,256,0c-19.53,0-36.024,12.578-42.237,30H166c0-16.538-13.462-30-30-30c-16.538,0-30,13.462-30,30c-27.003,0-32.527,0-60,0c-8.291,0-15,6.709-15,15v452c0,8.291,6.709,15,15,15s15-6.709,15-15V60c15.892,0,29.333,0,45,0v60c0,12.935,8.247,24.36,20.508,28.462L181,166.622V482c0,16.567,13.431,30,30,30c16.569,0,30-13.433,30-30c0-108.807,0-87.519,0-136c0-8.286,6.716-15,15-15s15,6.714,15,15c0,75.536,0,89.951,0,136c0,16.567,13.431,30,30,30c16.569,0,30-13.433,30-30V166.622l54.492-18.16C397.753,144.36,406,132.935,406,120V60c15.663,0,29.107,0,45,0v437c0,8.291,6.709,15,15,15c8.291,0,15-6.709,15-15V45C481,36.709,474.291,30,466,30z M346,98.379L281.122,120h-50.244L166,98.379V60h47.763C219.976,77.422,236.47,90,256,90c19.53,0,36.024-12.578,42.237-30H346V98.379z"
    />
  </Svg>
);

// FUEL ICONS
export const EatCleanIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13.09 8.26L22 8L14 12L22 16L13.09 15.74L12 22L10.91 15.74L2 16L10 12L2 8L10.91 8.26L12 2Z"
      fill={color}
    />
  </Svg>
);

export const NoSugarIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path
      fill={color}
      d="m31.95001 7.09003c-15.19 0-27.54999 12.35999-27.54999 27.54999 1.51033 36.5312 53.58892 36.53062 55.09002-.00021-.00005-15.1898-12.35003-27.54978-27.54003-27.54978zm0 50.56995c-5.16998 0-10.22003-1.75-14.27002-4.95001l8.35999-8.35999c-.46394-.25113-2.42192-1.34439-2.91999-1.61999-.36348-.19861-.47303-.66623-.28998-1.01996 0 0 .78999-1.51001.78999-1.51001l-9.26001 9.26996c-17.67072-21.81973 10.62089-50.02088 32.43039-32.41963-.0004-.00036-11.15037 11.13966-11.15037 11.13966s2.79521-.58024 3.07993-.34004c.4666.26223 2.01103 1.1066 2.45003 1.37001 0 0 8.84004-8.84998 8.84004-8.84998 11.89355 14.91242 1.03353 37.36021-18.06 37.28998z"
    />
    <Path
      fill={color}
      d="m37.10999 48.02997 5.86999-.57001 6.21002-11.12994-6.13 1.01001z"
    />
    <Path
      fill={color}
      d="m42.71997 35.87 5.64001-.92999c-1.39444-.78087-8.92752-4.97073-10.14001-5.65002-1.54848.2588-4.1572.67434-5.63996.92005 0 0 10.13996 5.65997 10.13996 5.65997z"
    />
    <Path
      fill={color}
      d="m30.62 30.84003c-1.87661 3.35987-4.25342 7.6184-6.10999 10.94996 1.78062.98427 9.04093 5.04183 10.95001 6.10998 0 0 6.10999-10.95996 6.10999-10.95996z"
    />
    <Path
      fill={color}
      d="m28.08002 32.29999 1.58997-2.84998c.10004-.16998.26001-.29999.46002-.35004.02002-.00995 2.79999-.45996 2.79999-.45996v-6.71002l-4.84998 3.85004z"
    />
    <Path fill={color} d="m31.53998 21.10999h-11.60999l-4.47998 3.54998h11.62z" />
    <Path fill={color} d="m26.58002 34.98999v-8.83002h-12.54004v12.54004h10.47003z" />
  </Svg>
);

export const NoProcessedFoodIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path
      fill={color}
      d="m19.331 19.896-.6 3.002c-.029.148.01.303.108.421.056.067.18.181.382.181h16.333l4-4h-19.734c-.238 0-.445.167-.489.396z"
    />
    <Path
      fill={color}
      d="m39.354 49.354c-.095.094-.223.146-.354.146-.038 0-.077-.004-.115-.013-.169-.04-.305-.164-.359-.329l-.22-.658h-2.661c.399 1.437 1.58 5.038 3.687 6.878 4.178-1.313 7.877-3.718 10.761-6.878h-9.887zm1.646 1.146h1c.276 0 .5.224.5.5s-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5z"
    />
    <Path fill={color} d="m41.207 47.5h9.75c1.014-1.238 1.908-2.578 2.668-4h-8.418z" />
    <Path
      fill={color}
      d="m52 34.5h-10c-3.826 0-5.811 6.037-6.355 8h18.486c.812-1.704 1.432-3.516 1.833-5.409-1.186-1.714-2.518-2.591-3.964-2.591zm-10 6h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1c.276 0 .5.224.5.5s-.224.5-.5.5zm1-3h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1c.276 0 .5.224.5.5s-.224.5-.5.5zm5 2h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1c.276 0 .5.224.5.5s-.224.5-.5.5zm4-2h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1c.276 0 .5.224.5.5s-.224.5-.5.5z"
    />
    <Path
      fill={color}
      d="m51.381 8.445c-5.443-4.478-12.326-6.945-19.381-6.945-16.818 0-30.5 13.682-30.5 30.5 0 7.055 2.467 13.938 6.946 19.382 1.255 1.511 2.66 2.916 4.173 4.173 5.443 4.478 12.326 6.945 19.381 6.945 16.818 0 30.5-13.682 30.5-30.5 0-7.054-2.466-13.937-6.945-19.381-1.257-1.513-2.661-2.917-4.174-4.174zm-39.041 39.475c-.01 0-.02 0-.029-.001-.143-.008-.275-.077-.363-.189-3.564-4.522-5.448-9.961-5.448-15.73 0-14.061 11.439-25.5 25.5-25.5 5.769 0 11.208 1.884 15.729 5.447.112.088.181.221.189.363s-.044.282-.146.383l-35.08 35.08c-.093.095-.22.147-.352.147zm19.66 9.58c-5.769 0-11.208-1.884-15.729-5.447-.112-.088-.181-.221-.189-.363s.044-.282.146-.383l35.08-35.08c.102-.101.245-.147.383-.146.143.008.275.077.363.189 3.562 4.522 5.446 9.961 5.446 15.73 0 14.061-11.439 25.5-25.5 25.5z"
    />
    <Path fill={color} d="m43.793 43.5h-6.099l1.525 4.574z" />
    <Path fill={color} d="m22.853 36.2 11.7-11.7h-12.995z" />
    <Path
      fill={color}
      d="m36.176 43.5c-.604.488-1.822 1.696-1.792 2.761.014.464.278.87.785 1.239h2.803l-1.333-4z"
    />
    <Path
      fill={color}
      d="m25.79 50.5h9.442c-.376-1.042-.596-1.878-.679-2.221-.742-.552-1.146-1.218-1.167-1.992-.031-1.107.733-2.147 1.392-2.842-.064-.032-.122-.076-.168-.133-.095-.119-.131-.273-.098-.421.082-.369 2.009-8.72 6.924-9.332l.759-6.807-18.351 18.352.453 4.061c.083.761.725 1.335 1.493 1.335z"
    />
    <Path fill={color} d="m30.5 11.36v7.14h2v-7.806z" />
  </Svg>
);

export const NoSeedOilsIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path
      fill={color}
      d="M42.71869,26.93854C44.60321,30.35931,46,33.92694,46,37A13.97814,13.97814,0,0,1,22.44934,47.20789Zm-9.98627-13.6192a1.0309,1.0309,0,0,0-1.46484,0C30.72559,13.90283,18,27.71387,18,37a13.97223,13.97223,0,0,0,.33405,3.00873L38.26636,20.07642A84.53138,84.53138,0,0,0,32.73242,13.31934ZM62,32A30,30,0,1,1,32,2,30,30,0,0,1,62,32ZM12.26019,48.91138,48.91138,12.26019A25.99255,25.99255,0,0,0,12.26019,48.91138ZM58,32a25.88982,25.88982,0,0,0-6.26019-16.91138L15.08862,51.73981A25.99255,25.99255,0,0,0,58,32Z"
    />
  </Svg>
);

export const NoGlutenIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Path
      fill={color}
      d="M37,19a9.46168,9.46168,0,0,1-.39,2.73l-5.13,5.13A8.92255,8.92255,0,0,1,27,19a8.902,8.902,0,0,1,4.55-7.89.95612.95612,0,0,1,.9,0A8.902,8.902,0,0,1,37,19ZM18,39v1c0,.11,0,.22.01.33L20.34,38H19A1.003,1.003,0,0,0,18,39Zm1-13a1.003,1.003,0,0,0-1,1v1a9.032,9.032,0,0,0,4.53,7.81l7.49-7.49A8.93635,8.93635,0,0,0,24,26Zm26,0H43.66L31,38.66v2.7a8.61675,8.61675,0,0,0-1.35-1.35l-7.54,7.54A8.91763,8.91763,0,0,0,27,49h4v3a1,1,0,0,0,2,0V49h4a9.01357,9.01357,0,0,0,9-9V39a1.003,1.003,0,0,0-1-1H40a8.96006,8.96006,0,0,0-7,3.36V37h4a9.01357,9.01357,0,0,0,9-9V27A1.003,1.003,0,0,0,45,26Zm17,6A30,30,0,1,1,32,2,30,30,0,0,1,62,32ZM12.26019,48.91138,48.91138,12.26019A25.99255,25.99255,0,0,0,12.26019,48.91138ZM58,32a25.88982,25.88982,0,0,0-6.26019-16.91138L15.08862,51.73981A25.99255,25.99255,0,0,0,58,32Z"
    />
  </Svg>
);

export const NoLactoseIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 3872.98 3872.98">
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m3631.31 1942.32c0 450.45-177.33 878.51-495.8 1196.98s-746.52 495.8-1196.97 495.8-878.51-177.33-1196.98-495.8-495.8-746.52-495.8-1196.98 177.33-878.51 495.8-1196.97c318.47-318.47 746.52-495.8 1196.98-495.8s878.51 177.33 1196.97 495.8c318.47 318.46 495.8 746.51 495.8 1196.97zm-2725.33-1032.57c-274.77 274.77-427.7 643.92-427.7 1032.56s152.93 757.79 427.7 1032.56 643.92 427.7 1032.56 427.7 757.79-152.93 1032.56-427.7 427.7-643.92 427.7-1032.56-152.93-757.79-427.7-1032.56-643.92-427.7-1032.56-427.7-757.79 152.93-1032.56 427.7z"
    />
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m1471.44 1100.62h871.25v169.92h-871.25z"
    />
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m2357.23 1361.22h-900.33l-37.21 94.03 339.24 339.24h727.71v-72.47c0-11.56-1.03-22.73-3.06-33.36-2-10.51-5.14-21.2-9.38-31.91z"
    />
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m2486.63 1885.17h-637.02l602.35 602.36h34.67z"
    />
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m1957.49 2487.53-615.63-615.64-14.37-14.36v630z"
    />
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m2048.18 2578.21h-720.69v323.22h1043.9z"
    />
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="m791.6 1193.4c631.94 631.95 1263.9 1263.9 1895.85 1895.85 47.25-30.92 92.74-64.89 136.23-101.77l-1930.3-1930.3c-36.89 43.48-70.86 88.98-101.78 136.22z"
    />
  </Svg>
);

export const ProteinIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="m101.9 176.8c-7.8-16.6-3-35.9-3.9-53.7 6.9 8.3 15.6 15.4 23.6 22.4 12.4 11 23.7 22.6 33.9 34.9-16.8-3.5-35.3-4.7-53.6-3.6zm409.2 35.8c-.8 1.2-1.6 2.3-2.4 3.4h-.1c-25.4 30.4-78.9 44.4-119.2 50.6 8.3 17.2 13.8 36.5 16.8 55.7 31.7-7.5 70.8-17.5 93.9-45.6 11.7-15.3 12-40.2 11-64.1zm-280-97.5c22 26.6 53 41.9 91.4 44 14.7-12.1 47.1-13.6 64.4-3.8 7.2-13.7 16.5-23.1 27.5-27.8 6.5-2.7 11.9-3.2 17.5-3.7 11.9-.5 27.2-5.1 38.1-12.3-16.7-12-38.2-20.7-61.5-24.6-30-5.1-58.4 2.3-88.8.9-41.1-1.7-77-16.7-111.7-31.3-27.9-13.1-58.2-21.2-85.8-1.6 20.7 16 44.3 23.6 67.8 30.1 20.6 7.5 30.6 18.5 41.1 30.1zm162.3 64.1c-.6-23.7-67.5-27.5-71.2 0 3.9 27.6 70.6 23.6 71.2 0zm2.7-17.6c22.9 23.4-4.3 48.7-38.3 48.1-7.8 0-15-1.2-21.4-3.3-1 1.8-2.1 3.4-3.3 5.1 22.8 7.2 37.8 22.6 50.9 44.7 42.9-6.9 124.8-24.1 125.7-74.6.4-19.1-10.6-38.6-15.2-45.2-4.3-6.5-9.6-12.4-15.5-17.7-12.8 9.2-31.7 15.5-46.1 16-17.2.7-27.8 9.5-36.8 26.9zm-267.1-24.5c16.6 14.8 31.5 30.5 44.5 47.7 29 9 54.2 29.1 68.6 55.9 19.3-18.2 50.7-34.7 78.6-31.7 2-2.2 3.8-4.6 5.5-7.2-12.6-7.3-18.9-20-12.7-32.4-37.2-3.4-69-20.8-90.5-46.9-10.1-11-18.8-20.6-36.9-27.3-24.8-6.5-51.1-16-72.7-33.2-29.7 32.4-12.6 52.4 15.6 75.1zm257.3 151.2c11.8 33.4 14.8 72.1 7.8 100.8-13.6 56-70.2 90.5-126.2 76.9-64.5-14.8-98.4-89.1-69.3-148.2 39-86.2 144.5-153 187.7-29.5zm-79.1 15.9c-53-13.2-96.4 46.1-67.6 92.6 27.9 46.8 101 35.5 113.2-17.7 8.6-32.2-13.1-67.7-45.6-74.9zm-73.7-55.5c-26.9-55.7-95.7-67.7-152.1-58.6-79.4 12.8-103.2 67.1-58.5 134.1 36.1 53.9 95.3 93.7 157.4 67.9-13.6-53.4 16.6-106.5 53.2-143.4zm59.1 64.9c-38.5-.8-64.6 44.3-43.5 77.4 22.9 38.6 82.8 29.1 92.9-14.5 8.4-30.9-17.5-63.8-49.4-62.9z"
    />
  </Svg>
);

export const VegetablesIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C13.1 2 14 2.9 14 4V6C17.31 6 20 8.69 20 12V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V12C4 8.69 6.69 6 10 6V4C10 2.9 10.9 2 12 2Z"
      fill={color}
    />
    <Circle cx="8" cy="14" r="1" fill="white" />
    <Circle cx="12" cy="16" r="1" fill="white" />
    <Circle cx="16" cy="14" r="1" fill="white" />
  </Svg>
);

export const CaloriesIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="3" fill="white" />
  </Svg>
);

export const SupplementsIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z"
      fill={color}
      opacity="0.3"
    />
    <Circle cx="8" cy="8" r="2" fill={color} />
    <Circle cx="16" cy="8" r="2" fill={color} />
    <Circle cx="12" cy="14" r="2" fill={color} />
    <Circle cx="8" cy="18" r="1" fill={color} />
    <Circle cx="16" cy="18" r="1" fill={color} />
  </Svg>
);

// GROWTH ICONS
export const DeepWorkIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="M127.545,326.472c-13.073-22.504-19.983-48.245-19.983-74.437c0-13.023,1.685-25.939,5.008-38.39c2.151-8.058-2.638-16.333-10.695-18.485c-8.056-2.149-16.333,2.637-18.484,10.695c-4.001,14.99-6.03,30.527-6.03,46.179c0,31.514,8.322,62.5,24.068,89.606c2.803,4.825,7.867,7.518,13.071,7.518c2.575,0,5.185-0.659,7.571-2.045C129.284,342.926,131.734,333.684,127.545,326.472z"
    />
    <Path
      fill={color}
      d="M413.685,55.409C369.183,19.678,313.183,0,256.001,0C188.68,0,125.389,26.216,77.785,73.82C30.182,121.422,3.966,184.713,3.966,252.034c0,47.163,13.113,93.159,37.919,133.013c2.861,4.597,7.79,7.123,12.835,7.123c2.724,0,5.483-0.737,7.965-2.283c7.081-4.406,9.248-13.72,4.84-20.8c-21.823-35.06-33.358-75.536-33.358-117.053c0-122.319,99.514-221.832,221.833-221.832c51.06,0,99.048,16.861,138.775,48.757c6.505,5.223,16.009,4.182,21.23-2.32C421.227,70.136,420.188,60.631,413.685,55.409z"
    />
    <Path
      fill={color}
      d="M316.011,335.255c25.807-18.662,42.633-49.012,42.633-83.221c0-56.598-46.045-102.644-102.643-102.644s-102.644,46.046-102.644,102.644c0,34.21,16.826,64.56,42.634,83.221c-65.575,24.423-112.413,87.664-112.413,161.644c0,8.34,6.761,15.101,15.101,15.101h314.644c8.34,0,15.101-6.761,15.101-15.101C428.423,422.918,381.587,359.679,316.011,335.255z"
    />
    <Path
      fill={color}
      d="M256.001,73.396c-54.21,0-104.868,24.203-138.985,66.402c-5.243,6.485-4.236,15.994,2.249,21.237c6.485,5.242,15.994,4.237,21.238-2.249c28.355-35.073,70.452-55.188,115.498-55.188c81.848,0,148.437,66.589,148.437,148.437c0,26.19-6.91,51.93-19.983,74.437c-4.189,7.211-1.738,16.453,5.474,20.642c2.388,1.387,4.995,2.046,7.572,2.046c5.204-0.001,10.27-2.695,13.071-7.518c15.745-27.108,24.068-58.093,24.068-89.606C434.64,153.533,354.504,73.396,256.001,73.396z"
    />
    <Path
      fill={color}
      d="M457.254,100.294c-5.026-6.656-14.494-7.977-21.151-2.952c-6.656,5.026-7.977,14.496-2.952,21.151c29.23,38.711,44.682,84.888,44.682,133.541c0,41.519-11.535,81.994-33.358,117.053c-4.407,7.08-2.24,16.393,4.84,20.8c2.484,1.546,5.241,2.283,7.965,2.283c5.044,0,9.975-2.526,12.835-7.122c24.808-39.852,37.92-85.848,37.92-133.013C508.034,196.761,490.475,144.29,457.254,100.294z"
    />
  </Svg>
);

export const SocialMediaLimitIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 2H20C21.1 2 22 2.9 22 4V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V4C2 2.9 2.9 2 4 2Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path d="M8 22H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 18V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const MeditationIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 512.156 512.156">
    <Path
      fill={color}
      d="m479.993 327.169h-17.172c-5.486 0-10.641-2.624-13.868-7.06l-96.208-132.234c-7.689-10.06-19.628-15.962-32.29-15.962h-21.153c-4.569 0-8.274-3.704-8.274-8.274v-19.601c0-3.87 1.979-7.449 5.213-9.574 20.114-13.213 33.318-36.084 33.015-62.018-.467-39.938-33.501-72.412-73.442-72.229-40.216.185-72.761 32.843-72.761 73.103 0 25.562 13.12 48.06 32.994 61.127 3.243 2.132 5.239 5.712 5.239 9.594v19.598c0 4.569-3.704 8.274-8.274 8.274h-26.764c-12.662 0-24.601 5.902-32.29 15.962l-96.055 133.294c-3.223 4.473-8.4 7.124-13.914 7.124h-11.827c-17.762-.001-32.162 14.399-32.162 32.162 0 17.763 14.399 32.162 32.162 32.162h31.595c-19.493 10.89-32.682 31.715-32.682 55.63 0 35.176 28.516 63.692 63.692 63.692h269.827l-211.97-117.449c-16.85-6.535-34.8-9.935-52.967-9.935h-1.249c2.49-1.989 4.746-4.301 6.678-6.924l61.073-90.942v80.16c.296.14.594.272.885.433l89.753 49.745 83.748-50.241v-80.097l61.229 89.818c2.02 2.743 4.392 5.147 7.017 7.194-23.155.346-47.608 6.708-68.246 18.171v-.102l-53.436 32.057 137.145 76.011c29.28-5.739 51.375-31.53 51.375-62.49v-.306c0-24.024-13.306-44.791-32.945-55.548h37.31c17.763 0 32.162-14.399 32.162-32.162 0-17.764-14.4-32.163-32.163-32.163z"
    />
  </Svg>
);

export const ReadingIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 2H20C21.1 2 22 2.9 22 4V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V4C2 2.9 2.9 2 4 2Z"
      fill={color}
      opacity="0.3"
    />
    <Path d="M6 6H18V8H6V6Z" fill={color} />
    <Path d="M6 10H18V12H6V10Z" fill={color} />
    <Path d="M6 14H14V16H6V14Z" fill={color} />
  </Svg>
);

export const SideHustleIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M12 6L13.5 10.5L18 11L15 14L15.75 18.5L12 16.5L8.25 18.5L9 14L6 11L10.5 10.5L12 6Z"
      fill={color}
    />
  </Svg>
);

export const BusinessIdeaIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13 8L19 9L14 14L15 20L12 18L9 20L10 14L5 9L11 8L12 2Z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="2" fill="white" />
  </Svg>
);

export const EpicGoalIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      fill={color}
    />
  </Svg>
);

export const LearnSkillIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L22 7L12 12L2 7L12 2Z" fill={color} />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BedtimeIcon = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 20 12" fill="none">
    <Path
      d="M19 4.95429V2.57143C19 1.15714 17.65 0 16 0H12C11.23 0 10.53 0.257143 10 0.668572C9.47 0.257143 8.77 0 8 0H4C2.35 0 1 1.15714 1 2.57143V4.95429C0.39 5.42571 0 6.10286 0 6.85714V12H2V10.2857H18V12H20V6.85714C20 6.10286 19.61 5.42571 19 4.95429ZM12 1.71429H16C16.55 1.71429 17 2.1 17 2.57143V4.28571H11V2.57143C11 2.1 11.45 1.71429 12 1.71429ZM3 2.57143C3 2.1 3.45 1.71429 4 1.71429H8C8.55 1.71429 9 2.1 9 2.57143V4.28571H3V2.57143Z"
      fill={color}
    />
  </Svg>
);

// Task name to Ionicons name mapping
export const taskIcons: Record<string, string> = {
  // Recovery
  "Sleep for 8 hours": "bed",
  "Consistent wake time": "sunny",
  "Complete wind-down routine": "moon",
  "Get morning sunlight": "sunny-outline",
  "Cold shower": "water",
  "Drink 2.5 L water": "water-outline",

  // Movement
  Workout: "fitness",
  "Strength Training": "barbell",
  Running: "walk",
  Cycling: "bicycle",
  "Walking steps target": "footsteps",
  Pushups: "body",
  Pullups: "body-outline",

  // Fuel
  "Eat clean": "leaf",
  "No sugar": "close-circle",
  "No processed fooda": "close-circle-outline",
  "No seed oils": "remove-circle",
  "No gluten": "remove-circle-outline",
  "No lactose": "remove",
  "Hit protein target": "nutrition",
  "Eat vegetables": "nutrition-outline",
  "Calorie target": "flame",
  "Take supplements": "medical",

  // Growth
  "Deep work": "laptop",
  "Limit social media": "phone-portrait-outline",
  Meditation: "flower",
  Reading: "book",
  "Work on side hustle": "briefcase",
  "Work on business idea": "bulb",
  "Epic goal": "trophy",
  "Learn a skill": "school",
};

// Custom icon components mapping
const customIcons: Record<string, React.ComponentType<IconProps>> = {
  "Cold shower": ColdShowerIcon,
  Running: RunningIcon,
  Pushups: PushupsIcon,
  Pullups: PullupsIcon,
  "No sugar": NoSugarIcon,
  "No processed fooda": NoProcessedFoodIcon,
  "No seed oils": NoSeedOilsIcon,
  "No gluten": NoGlutenIcon,
  "No lactose": NoLactoseIcon,
  "Hit protein target": ProteinIcon,
  "Deep work": DeepWorkIcon,
  Meditation: MeditationIcon,
};

// Helper function to get icon component by task name
export const getTaskIcon = (
  taskName: string
): React.ComponentType<IconProps> | null => {
  // Check if there's a custom icon first
  const customIcon = customIcons[taskName];
  if (customIcon) return customIcon;

  // Fall back to Ionicons
  const iconName = taskIcons[taskName];
  if (!iconName) return null;

  // Return a component that renders the Ionicon
  const IconComponent = ({ size = 24, color = "currentColor" }: IconProps) => (
    <Ionicons name={iconName as any} size={size} color={color} />
  );

  IconComponent.displayName = `TaskIcon(${iconName})`;

  return IconComponent;
};
