"use client";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import { RingProgress, RingProgressConfig } from "@ant-design/plots";
import dayjs from "dayjs";

interface LineProps {
  shift: string;
  actual: number;
  target: number;
}

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const TotalRing: React.FC<LineProps> = ({ shift, actual, target }) => {
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const shiftStore = GeneralStore((state) => state.shift);
  const rate = Number(baratsukiRate) / 100;
  console.log(rate);
  const percentage = actual / target;
  const config: RingProgressConfig = {
    height: 150,
    width: 150,
    autoFit: false,
    percent: percentage,
    color:
      percentage >= rate ? "rgba(98, 218, 171, 0.5)" : "rgba(255, 33, 33, 0.5)",
    innerRadius: 0.85,
    radius: 1,
    statistic: {
      title: {
        style: {
          color: shiftStore === "day" ? "#363636" : "#dddddd",
          fontSize: "20px",
          lineHeight: "30px",
        },
        formatter: () => `${shift}`,
      },
      content: {
        style: {
          fontSize: "20px",
          color: shiftStore === "day" ? "black" : "white",
          fontWeight: "bold",
        },
      },
    },
  };

  return <RingProgress {...config} />;
};

export default TotalRing;
