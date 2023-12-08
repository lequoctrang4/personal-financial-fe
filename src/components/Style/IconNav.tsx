import React from "react";

import HomeIcon from "../Navigation/HomeIcon";
import HistoryIcon from "../Navigation/HistoryIcon";
import AnalyzeIcon from "../Navigation/AnalyzeIcon";
import ProfileIcon from "../Navigation/ProfileIcon";

export const IconNav = {
  HomeIcon,
  HistoryIcon,
  AnalyzeIcon,
  ProfileIcon,
};

const IconDisplay = ({
  type,

  color,
}: {
  type: any;

  color?: any;
}) => {
  const Tag = type;
  return <>{type && <Tag color={color} />}</>;
};

export default IconDisplay;
