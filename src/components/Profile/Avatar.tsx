import { Svg, G, Mask, Rect, Path } from "react-native-svg";

export default function Avatar() {
  return (
    <Svg width="150" height="150" viewBox="0 0 96 96">
      <Rect width="96" height="96" rx="16" fill="#BBD08A" />
      <Mask
        id="mask0_887_174"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="96"
        height="96"
      >
        <Rect width="96" height="96" rx="16" fill="white" />
      </Mask>
      <G mask="url(#mask0_887_174)"></G>
    </Svg>
  );
}
