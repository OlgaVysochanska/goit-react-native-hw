import * as React from "react";
import Svg, { G, Rect, Path, Defs, ClipPath } from "react-native-svg";

const SvgCreate = (props) => (
  <Svg
    width={70}
    height={40}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#a)">
      <Rect width={70} height={40} rx={20} fill="#FF6C00" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.5 13.5h-1v6h-6v1h6v6h1v-6h6v-1h-6v-6Z"
        fill="#fff"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h70v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SvgCreate;
