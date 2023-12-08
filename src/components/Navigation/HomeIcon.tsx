import { Svg, Path } from "react-native-svg";
export default function HomeIcon({ color }: { color: any | undefined }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M18.03 4.81774L12.28 0.787741C10.71 -0.312259 8.31 -0.25226 6.8 0.91774L1.79 4.82774C0.78 5.60774 0 7.20774 0 8.46769V15.3677C0 17.9177 2.07 19.9977 4.61 19.9977H15.38C17.92 19.9977 19.99 17.9277 19.99 15.3777V8.59769C20 7.24774 19.13 5.58774 18.03 4.81774Z"
        fill={color}
      />
      <Path
        d="M6 13.9961C6 12.8915 6.89543 11.9961 8 11.9961H12C13.1046 11.9961 14 12.8915 14 13.9961V19.9961H6V13.9961Z"
        fill="white"
      />
    </Svg>
  );
}
