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
const BaratsukiShiftColumn: React.FC<LineProps> = ({
  parameter,
  mqttData,
  // parameter_static_realtime,
}) => {
  const shift = GeneralStore((state) => state.shift);
  const setShift = GeneralStore((state) => state.setShift);
  const { theme, setTheme } = useTheme();

  const annotations: any[] = generateAnnotations(parameter);
  const annotationsArrow: any[] = parameter
    .map((item) => {
      const upper = item.challenge_upper;
      const lower = item.challenge_lower;
      if (item.actual >= lower && item.actual <= upper) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start: [item.shift_text, item.actual], // Start slightly below ct_actual
          end: [item.shift_text, (upper + lower) / 2], // End slightly above ct_actual
          style: {
            stroke:
              shift === 1
                ? item.actual < lower
                  ? "rgba(255, 33, 33, 0.5)"
                  : item.actual > upper
                  ? "blue"
                  : "#FF8F8F"
                : "#FF8F8F",
            lineWidth: 2,
            endArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing right
              d: 0,
            },
            startArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing left
              d: 0,
            },
          },
        };
      }
    })
    .filter((annotation) => annotation !== null);

  const annotationsTextGap: any[] = parameter
    .map((item) => {
      const upper = item.challenge_upper;
      const lower = item.challenge_lower;
      if (item.actual >= lower && item.actual <= upper) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        const gapContent = `Gap = ${item.target_challenge - item.actual} pcs.`;
        const percentContent = `${
          item.actual < item.target_challenge ? "-" : "+"
        }${(
          Math.abs(
            (item.target_challenge - item.actual) / item.target_challenge
          ) * 100
        ).toFixed(2)}%`;

        return [
          {
            type: "text",
            content: gapContent,
            offsetX: 40,
            position: (xScale: any, yScale: any) => {
              return [
                `${xScale.scale(item.shift_text) * 100 - 0}%`,
                `${
                  (1 -
                    yScale.actual.scale(
                      (item.target_challenge + item.actual) / 2
                    )) *
                  100
                }%`,
              ];
            },
            style: {
              textAlign: "center",
              fill:
                item.shift === 1
                  ? item.actual < item.target_challenge
                    ? "#C40C0C"
                    : item.actual > item.target_challenge
                    ? "blue"
                    : "#FF8F8F"
                  : "#FF8F8F",
              fontSize: 10,
              fontWeight: "bold",
            },
            background: {
              padding: 10,
              style: {
                z: 0,
                radius: 17,
              },
            },
          },
          {
            type: "text",
            content: percentContent,
            offsetX: 40,
            position: (xScale: any, yScale: any) => {
              return [
                `${xScale.scale(item.shift_text) * 100 - 5}%`,
                `${
                  (1 -
                    yScale.actual.scale(
                      (item.target_challenge + item.actual) / 2 - 85
                    )) *
                  100
                }%`,
              ];
            },
            style: {
              textAlign: "center",
              fill:
                item.shift === 1
                  ? item.actual < item.target_challenge
                    ? "#C40C0C"
                    : item.actual > item.target_challenge
                    ? "blue"
                    : "#FF8F8F"
                  : "#FF8F8F",
              fontSize: 10,
              fontWeight: "bold",
            },
            background: {
              padding: 10,
              style: {
                z: 0,
                radius: 17,
              },
            },
          },
        ];
      }
    })
    .filter((annotation) => annotation !== null)
    .flat(); // Flatten the array of arrays into a single array

  const config: ColumnConfig = {
    data: parameter,
    xField: "shift_text",
    yField: "actual",
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
      const matchingPeriod = parameter.find((p) => p.actual === data.actual);

      if (matchingPeriod) {
        const actual = matchingPeriod.actual; // Access value from the found object in updatedParameter
        const lower = matchingPeriod.challenge_lower ?? 0;
        const upper = matchingPeriod.challenge_upper ?? 0;
        if (actual >= lower) {
          return "rgba(24, 144, 255, 0.5)";
        } else {
          return "rgba(255, 33, 33, 0.5)";
        }
      } else {
        return "blue";
      }
    },
    annotations: [
      {
        type: "line",
        start: ["start", parameter[0]?.challenge_lower],
        end: [parameter[0]?.shift_text, parameter[0]?.challenge_lower],
        offsetX: 42,
        text: {
          content: `${parameter[0]?.challenge_lower}`,
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
        start: ["start", parameter[0]?.target_challenge],
        end: [parameter[0]?.shift_text, parameter[0]?.target_challenge],
        offsetX: 42,
        text: {
          content: `${parameter[0]?.target_challenge}`,
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
        start: ["median", parameter[1]?.target_challenge],
        end: [parameter[1]?.shift_text, parameter[1]?.target_challenge],
        offsetX: 42,
        text: {
          content: `${parameter[1]?.target_challenge}`,
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
        start: ["start", parameter[0]?.challenge_upper],
        end: [parameter[0]?.shift_text, parameter[0]?.challenge_upper],
        offsetX: 42,
        text: {
          content: `${parameter[0]?.challenge_upper}`,
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
        type: "line",
        start: ["median", parameter[1]?.challenge_lower],
        end: [parameter[1]?.shift_text, parameter[1]?.challenge_lower],
        offsetX: 42,
        text: {
          content: `${parameter[1]?.challenge_lower}`,
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
        start: ["median", parameter[1]?.challenge_upper],
        end: [parameter[1]?.shift_text, parameter[1]?.challenge_upper],
        offsetX: 42,
        text: {
          content: `${parameter[1]?.challenge_upper}`,
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
        start: ["start", parameter[0]?.challenge_lower],
        end: [parameter[0]?.shift_text, parameter[0]?.challenge_upper],
        offsetX: 42,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
        },
      },
      {
        type: "region",
        start: ["median", parameter[1]?.challenge_lower],
        end: [parameter[1]?.shift_text, parameter[1]?.challenge_upper],
        offsetX: 42,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
        },
      },
      ...annotationsArrow,
      ...annotationsTextGap,
    ],
  };

  return <Column {...config} />;
};

export default BaratsukiShiftColumn;
