"use client";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import { BaratsukiResponse } from "@/types/baratsuki.type";
import { Column, ColumnConfig } from "@ant-design/plots";
import dayjs from "dayjs";
import {
  generateAnnotations,
  generateAnnotationsTargetLineRangeRegion,
} from "@/functions/chart/annotations.baratsuki.column";

import { useTheme } from "next-themes";
import { IMqttResponse } from "@/types/MqttType";

export interface DataShiftColumn {
  challenge_target: number;
  actual: number;
  shift: number;
  shift_text: string;
  target_challenge: number;
  challenge_lower: number;
  challenge_upper: number;
}
interface LineProps {
  parameter: DataShiftColumn[];
  mqttData: IMqttResponse | null;
}

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const BaratsukiShiftColumnRealtime: React.FC<LineProps> = ({
  parameter,
  mqttData,
  // parameter_static_realtime,
}) => {
  if (mqttData) {
    mqttData.shift = 1;
    mqttData.shift_text = "Day";
  }

  const targetRate = parameter[0].challenge_target / 100;
  const target_challenge_mid = Math.floor(
    (mqttData?.prod_target ?? 0) * targetRate
  );
  const target_challenge_upper = Math.floor(
    (mqttData?.prod_target ?? 0) * targetRate * 1.05
  );
  const target_challenge_lower = Math.floor(
    (mqttData?.prod_target ?? 0) * targetRate * 0.95
  );

  const shift = GeneralStore((state) => state.shift);
  const setShift = GeneralStore((state) => state.setShift);
  const { theme, setTheme } = useTheme();
  const config: ColumnConfig = {
    data: mqttData ? [mqttData] : [],
    xField: "shift_text",
    yField: "prod_actual",
    label: { style: { fontSize: 20, fontWeight: "bold" } },
    legend: false,
    columnStyle: {
      cursor: "pointer",
    },
    onReady: (plot) => {
      plot.on("element:click", (evt: any) => {
        const { data } = evt.data;
        if (data.shift === 2) {
          setShift(2);
          setTheme("dark");
        } else {
          setShift(1);
          setTheme("light");
        }
      });
    },
    seriesField: "actual",
    yAxis: {
      maxLimit: 2200,
      title: {
        text: "Performance  Analysis  By  Shift  (Pieces)",
        style: {
          fontSize: 16,
          fontWeight: "bold",
          fill: shift === 1 ? "#595959" : "white",
        },
      },
      grid: {
        line: {
          style: {
            opacity: 0.2,
          },
        },
      },
    },
    xAxis: {
      title: {
        text: "Shift",
        style: {
          fontSize: 16,
          fontWeight: "bold",
          fill: shift === 1 ? "#595959" : "white",
        },
      },
    },
    color: (data: any) => {
      if ((mqttData?.prod_actual ?? 0) < (mqttData?.prod_target ?? 0)) {
        return "rgba(255, 33, 33, 0.5)";
      } else {
        return "rgba(24, 144, 255, 0.5)";
      }

      //   if (matchingPeriod) {
      //     const actual = matchingPeriod.prod_actual; // Access value from the found object in updatedParameter
      //     const lower = matchingPeriod.challenge_lower ?? 0;
      //     const upper = matchingPeriod.challenge_upper ?? 0;
      //     if (actual >= lower) {
      //       return "rgba(24, 144, 255, 0.5)";
      //     } else {
      //       return "rgba(255, 33, 33, 0.5)";
      //     }
      //   } else {
      //     return "blue";
      //   }
    },
    annotations: [
      {
        type: "line",
        start: ["start", target_challenge_lower],
        end: [parameter[0].shift_text, target_challenge_lower],
        offsetX : 90,
        text: {
          content: `${target_challenge_lower}`,
          offsetY: -9,
          offsetX: -24,
          position: "right",
          style: {
            textAlign: "left",
            fontSize: 10,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(24, 144, 255, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
      {
        type: "line",
        start: ["start", target_challenge_mid],
        end: [parameter[0].shift_text, target_challenge_mid],
        offsetX : 90,
        text: {
          content: `${target_challenge_mid}`,
          offsetY: -5,
          offsetX: -110,
          position: "left",
          style: {
            textAlign: "left",
            fontSize: 10,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(24, 144, 255, 0.5)",
        },
      },
      {
        type: "line",
        start: ["start", target_challenge_upper],
        end: [parameter[0].shift_text, target_challenge_upper],
        offsetX : 90,
        text: {
          content: `${target_challenge_upper}`,
          offsetX: -24,
          offsetY: -10,
          position: "right",
          style: {
            textAlign: "left",
            fontSize: 10,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(24, 144, 255, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
      {
        type: "region",
        start: ["start", target_challenge_lower],
        end: [parameter[0].shift_text, target_challenge_upper],
        offsetX : 90,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
        },
      },
    ],
  };

  return <Column {...config} />;
};

export default BaratsukiShiftColumnRealtime;
