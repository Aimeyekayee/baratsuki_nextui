"use client";

import { Column, ColumnConfig } from "@ant-design/plots";

import { useTheme } from "next-themes";
import { IMqttResponse } from "@/types/MqttType";

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const OAaverageColumn = () => {
  const data = [
    {
      type: "Nigt",
      value: 77,
    },
    {
      type: "Day",
      value: 78,
    },
  ];
  const paletteSemanticRed = "#F4664A";
  const brandColor = "#5B8FF9";
  const config: ColumnConfig = {
    data,
    xField: "type",
    yField: "value",
    seriesField: "",
    // height: 500,
    color: ({ type }) => {
      if (type === "Night") {
        return paletteSemanticRed;
      }

      return brandColor;
    },

    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return <Column {...config} />;
};

export default OAaverageColumn;
