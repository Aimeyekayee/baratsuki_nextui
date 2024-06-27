"use client";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import { RingProgress, RingProgressConfig } from "@ant-design/plots";
import dayjs from "dayjs";

interface LineProps {
  shift: number;
  actual: number;
  target: number;
  rate: number;
}

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const TotalRing: React.FC<LineProps> = ({ shift, actual, target, rate }) => {
  const shiftStore = GeneralStore((state) => state.shift);
  const percentage = actual / target;
  const config: RingProgressConfig = {
    height: 150,
    width: 150,
    autoFit: false,
    percent: percentage,
    color:
      shiftStore === 1
        ? percentage >= rate / 100
          ? ["rgba(24, 144, 255, 0.5)", "rgba(231, 232, 233, 0.5)"]
          : ["rgba(255, 33, 33, 0.5)", "rgba(231, 232, 233, 0.5)"]
        : percentage >= rate / 100
        ? ["rgba(24, 144, 255, 0.5)", "rgba(24, 232, 233, 0.08)"]
        : ["rgba(255, 33, 33, 0.5)", "rgba(24, 232, 233, 0.08)"],
    innerRadius: 0.85,
    radius: 1,
    statistic: {
      title: {
        style: {
          color: shiftStore === 1 ? "#363636" : "#dddddd",
          fontSize: "20px",
          lineHeight: "30px",
        },
        formatter: () => `${shift === 1 ? "Day" : "Night"}`,
      },
      content: {
        style: {
          fontSize: "20px",
          color: shiftStore === 1 ? "black" : "white",
          fontWeight: "bold",
        },
      },
    },
  };

  return <RingProgress {...config} />;
};

export default TotalRing;
