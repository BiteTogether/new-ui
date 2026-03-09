import React from "react";
import Svg, { Path, G } from "react-native-svg";
import { colors } from "../../src/utils/constants";

interface IconProps {
  size?: number;
  color?: string;
}

const FocusIcon = ({ size = 24, color = colors.text }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G id="SVGRepo_bgCarrier" strokeWidth="0" />

      <G
        id="SVGRepo_tracerCarrier"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <G id="SVGRepo_iconCarrier">
        <Path
          d="M19 12C19 15.866 15.866 19 12 19M19 12C19 8.13401 15.866 5 12 5M19 12H21M12 19C8.13401 19 5 15.866 5 12M12 19V21M5 12C5 8.13401 8.13401 5 12 5M5 12H3M12 5V3M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};

export default FocusIcon;
