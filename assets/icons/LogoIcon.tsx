import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

type IconProps = {
  size?: number;
};

const LogoIcon = ({ size = 24 }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220">
      <Path
        d="     M110 30     C70 30 55 65 55 95     C55 140 110 180 110 180     C110 180 165 140 165 95     C165 65 150 30 110 30 Z"
        fill="#FFC526"
      />

      <Circle cx="110" cy="95" r="40" fill="#262626" />
      <Circle cx="138" cy="75" r="12" fill="#FFC526" />
      <Circle cx="150" cy="88" r="10" fill="#FFC526" />
      <Circle cx="130" cy="95" r="8" fill="#FFC526" />
    </Svg>
  );
};

export default LogoIcon;
