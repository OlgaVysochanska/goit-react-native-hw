import * as React from "react";
import Svg, { Rect } from "react-native-svg";

const SvgCreate = (props) => (
  <Svg
    width={70}
    height={40}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={70} height={40} rx={20} fill="#FF6C00" />
  </Svg>
);

export default SvgCreate;
