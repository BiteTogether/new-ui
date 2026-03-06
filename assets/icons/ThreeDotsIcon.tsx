import React from "react";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";
import { colors } from "../../src/utils/constants";

type IconProps = {
  size?: number;
  color?: string;
};

const ThreeDotsIcon = ({ size = 24, color = colors.text }: IconProps) => {
  return (
    <Svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      enable-background="new 0 0 32 32"
      id="Glyph"
    >
      <Path
        d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z"
        id="XMLID_287_"
      />
      <Path
        d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z"
        id="XMLID_289_"
      />
      <Path
        d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z"
        id="XMLID_291_"
      />
    </Svg>
  );
};

export default ThreeDotsIcon;
