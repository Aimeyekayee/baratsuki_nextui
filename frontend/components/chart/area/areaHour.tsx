"use client";
import { useState, useEffect } from "react";
import { Area, AreaConfig, G2 } from "@ant-design/plots";
import { GeneralStore } from "@/store/general.store";
import { ModalOpenStore } from "@/store/modal.open.store";
import { DataProductionDetails } from "@/store/interfaces/baratsuki.fetch.interface";
import zustand from "zustand";
import { BaratsukiDataAreaResponse } from "@/types/baratsuki.type";

interface IProps {
  parameter: BaratsukiDataAreaResponse[];
}

interface ExtendedInterface extends BaratsukiDataAreaResponse {
  value: number;
  time: string;
  period_value?: number;
}

const AreaPlotByHour: React.FC<IProps> = ({ parameter }) => {
  const shift = GeneralStore((state) => state.shift);
  const transformData = (
    parameter: BaratsukiDataAreaResponse[]
  ): ExtendedInterface[] => {
    return parameter.map((item, index) => {
      const value =
        index === 0
          ? 0
          : item.data.prod_actual - parameter[index - 1].data.prod_actual;
      const time = new Date(item.date)
        .toLocaleTimeString("en-US", {
          hour12: false,
        })
        .slice(0, 5);
      return {
        ...item,
        value,
        time,
      };
    });
  };

  const extendedData: ExtendedInterface[] = transformData(parameter);
  extendedData.forEach((item: ExtendedInterface, index) => {
    item.period_value = extendedData
      .slice(0, index + 1)
      .reduce((acc, curr) => acc + curr.value, 0);
  });
  const lastDataPoint: number | undefined =
    extendedData[extendedData.length - 1]?.period_value;

  const generateAnnotations = (processedParameter: any[], target: number) => {
    const annotations: any[] = processedParameter
      .map((item, index) => {
        if (item.value === target) {
          return null; // Skip periods with zero or invalid ct_value values
        } else {
          const gapContent = `Gap: ${item.value < target ? "-" : "+"}${
            target - item.value
          } pcs.`;
          const percentContent = `${item.value < target ? "-" : "+"}${(
            Math.abs((target - item.value) / target) * 100
          ).toFixed(2)}%`;
          return [
            {
              type: "text",
              content: gapContent,
              offsetX: -40,
              position: (xScale: any, yScale: any) => {
                return index === processedParameter.length - 1
                  ? [
                      `${xScale.scale(item.date) * 100}%`,
                      `${
                        (1 - yScale.value.scale((target + item.value) / 2)) *
                        100
                      }%`,
                    ]
                  : ["0", "0"]; // Use position: ["0", "0"] for all items except the last one
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.value < target
                      ? "#C40C0C"
                      : item.value > target
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
              offsetX: -25,
              offsetY: 15,
              position: (xScale: any, yScale: any) => {
                return index === processedParameter.length - 1
                  ? [
                      `${xScale.scale(item.date) * 100}%`,
                      `${
                        (1 - yScale.value.scale((target + item.value) / 2)) *
                        100
                      }%`,
                    ]
                  : ["0", "0"]; // Use position: ["0", "0"] for all items except the last one
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.value < target
                      ? "#C40C0C"
                      : item.value > target
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

    return annotations;
  };

  const annotations: any[] = generateAnnotations(
    extendedData,
    extendedData[0].target_challege_lower
    // (upper + lower) / 2
  );

  const config: AreaConfig = {
    data: extendedData,
    xField: "time",
    yField: "period_value",
    label: {
      style: {
        fontSize: 16,
      },
    },
    point: {
      size: 8,
      shape: "point",
      style: {
        fill:
          lastDataPoint &&
          lastDataPoint >= extendedData[0].target_challege_lower
            ? "#1890FF" // Green line
            : "rgba(255,0,0,0.7)", // Red line
        stroke: "white",
        lineWidth: 2,
      },
    },
    line: {
      style: {
        stroke:
          lastDataPoint &&
          lastDataPoint >= extendedData[0].target_challege_lower
            ? "#1890FF" // Green line
            : "rgba(255,0,0,0.7)", // Red line
      },
    },
    xAxis: {
      range: [0, 1],
      tickCount: extendedData.length,
      title: {
        text: "Time",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    yAxis: {
      maxLimit: extendedData[0].target_challege_upper + 10,
      title: {
        text: "Actual (pcs.)",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    annotations: [
      // ...annotationsArrow,
      // ...annotations,
      {
        type: "line",
        start: ["min", extendedData[0].target_challege_lower],
        end: ["max", extendedData[0].target_challege_lower],
        offsetX: 0,
        text: {
          content: `Lower = ${extendedData[0].target_challege_lower}`,
          offsetY: -15,
          style: {
            textAlign: "left",
            fontSize: 12,
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
        start: ["min", extendedData[0].target_challege_upper],
        end: ["max", extendedData[0].target_challege_upper],
        offsetX: 0,
        text: {
          content: `Upper = ${extendedData[0].target_challege_upper}`,
          offsetY: 4,

          style: {
            textAlign: "left",
            fontSize: 12,
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
        start: ["min", extendedData[0].target_challege_lower],
        end: ["max", extendedData[0].target_challege_upper],
        offsetX: 0,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
        },
      },
      {
        type: "line",
        start: [
          "start",
          Math.floor(
            (extendedData[0].target_challege_upper +
              extendedData[0].target_challege_lower) /
              2
          ),
        ],
        end: [
          "end",
          Math.floor(
            (extendedData[0].target_challege_upper +
              extendedData[0].target_challege_lower) /
              2
          ),
        ],
        text: {
          content: `Target = ${Math.floor(
            (extendedData[0].target_challege_upper +
              extendedData[0].target_challege_lower) /
              2
          )} pcs. (baratsuki at ${extendedData[0].challenge_rate}%)`,
          offsetY: -15,
          style: {
            textAlign: "left",
            fontSize: 16,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "top",
          },
        },

        style: {
          opacity: 0.5,
          stroke: "rgba(24, 144, 255, 1)",
          lineWidth: 2.5,
        },
      },
    ],
  };

  return <Area {...config} />;
};

export default AreaPlotByHour;
