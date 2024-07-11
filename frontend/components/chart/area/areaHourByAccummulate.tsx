"use client";
import { useState, useEffect } from "react";
import { Area, AreaConfig, G2 } from "@ant-design/plots";
import { GeneralStore } from "@/store/general.store";
import { DataProductionDetails } from "@/store/interfaces/baratsuki.fetch.interface";
import zustand from "zustand";
import { BaratsukiDataAreaResponse } from "@/types/baratsuki.type";
interface IProps {
  parameter: BaratsukiDataAreaResponse[];
}

interface ExtendedInterface extends BaratsukiDataAreaResponse {
  value: number;
  time: string;
}
const AreaPlotByAccummulate: React.FC<IProps> = ({ parameter }) => {
  console.log(parameter);
  const transformData = (
    parameter: BaratsukiDataAreaResponse[]
  ): ExtendedInterface[] => {
    return parameter.map((item, index) => {
      const value = item.data.prod_actual;
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
  const shift = GeneralStore((state) => state.shift);
  const lastDataPoint: number = extendedData[extendedData.length - 1]?.value;
  const lower: number = extendedData[0]?.accummulate_lower;
  const upper: number = extendedData[0]?.accummulate_upper;

  const config: AreaConfig = {
    data: extendedData,
    xField: "time",
    yField: "value",
    label: {
      style: {
        fontSize: 16,
        fill: shift === 1 ? "black" : "white",
      },
    },
    point: {
      size: 8,
      shape: "point",
      style: {
        fill:
          lastDataPoint >= lower && lastDataPoint <= upper
            ? "#1890FF"
            : "rgba(255,0,0,0.7)",
        stroke: "white",
        lineWidth: 2,
      },
    },
    line: {
      style: {
        stroke:
          lastDataPoint >= lower && lastDataPoint <= upper
            ? "#1890FF"
            : "rgba(255,0,0,0.7)",
      },
    },
    xAxis: {
      label: {
        style: {
          fill: shift === 1 ? "black" : "white",
        },
      },
      range: [0, 1],
      tickCount: extendedData.length,
      title: {
        text: "Time",
        style: {
          fontSize: 20,
          fontWeight: "bold",
          fill: shift === 1 ? "black" : "white",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: shift === 1 ? "black" : "white",
        },
      },
      grid: {
        line: {
          style: {
            strokeOpacity: 0.2,
          },
        },
      },
      maxLimit: upper + 10,
      title: {
        text: "Actual (pcs.)",
        style: {
          fontSize: 20,
          fontWeight: "bold",
          fill: shift === 1 ? "black" : "white",
        },
      },
    },
    areaStyle: () => {
      return {
        fill:
          lastDataPoint >= lower && lastDataPoint <= upper
            ? "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff"
            : "l(270) 0:#ffffff 0.5:#ff9673 1:#ff5218",
      };
    },
    annotations: [
      {
        type: "text",
        content: `Gap: ${lastDataPoint - (lower + upper) / 2} pcs.`,
        offsetX: -50,
        offsetY: 0,
        position: (xScale: any, yScale: any) => {
          return [
            `${
              xScale.scale(extendedData[extendedData.length - 1].time) * 100
            }%`,
            `${
              (1 -
                yScale.value.scale(
                  ((lower + upper) / 2 +
                    extendedData[extendedData.length - 1].value) /
                    2
                )) *
              100
            }%`,
          ];
        },
        style: {
          textAlign: "center",
          fill:
            shift === 1
              ? extendedData[extendedData.length - 1].value <
                (lower + upper) / 2
                ? "#C40C0C"
                : extendedData[extendedData.length - 1].value >
                  (lower + upper) / 2
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
        content: `-${((lastDataPoint / ((lower + upper) / 2)) * 100).toFixed(
          2
        )}%`,
        offsetX: -50,
        offsetY: 20,
        position: (xScale: any, yScale: any) => {
          return [
            `${
              xScale.scale(extendedData[extendedData.length - 1].time) * 100
            }%`,
            `${
              (1 -
                yScale.value.scale(
                  ((lower + upper) / 2 +
                    extendedData[extendedData.length - 1].value) /
                    2
                )) *
              100
            }%`,
          ];
        },
        style: {
          textAlign: "center",
          fill:
            shift === 1
              ? extendedData[extendedData.length - 1].value <
                (lower + upper) / 2
                ? "#C40C0C"
                : extendedData[extendedData.length - 1].value >
                  (lower + upper) / 2
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
        type: "line",
        start: [
          extendedData[extendedData.length - 1].time,
          extendedData[extendedData.length - 1].value,
        ], // Start slightly below ct_actual
        end: [extendedData[extendedData.length - 1].time, (lower + upper) / 2], // End slightly above ct_actual
        style: {
          stroke:
            shift === 1
              ? extendedData[extendedData.length - 1].value <
                (lower + upper) / 2
                ? "red"
                : extendedData[extendedData.length - 1].value >
                  (lower + upper) / 2
                ? "blue"
                : "green"
              : extendedData[extendedData.length - 1].value <
                (lower + upper) / 2
              ? "red"
              : extendedData[extendedData.length - 1].value >
                (lower + upper) / 2
              ? "blue"
              : "green",
          lineWidth: 2,
          endArrow: {
            path: "M 1,0 L 8,4 L 8,-4 Z", // Arrow pointing right
            d: 0,
            opacity: 0.5,
            fillOpacity: 0.5,
          },
          startArrow: {
            path: "M 1,0 L 8,4 L 8,-4 Z", // Arrow pointing left
            d: 0,
            opacity: 0.5,
            fillOpacity: 0.5,
          },
        },
      },
      {
        type: "line",
        start: ["start", lower],
        end: ["end", lower],
        offsetX: 0,
        text: {
          content: `Lower = ${lower}`,
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
        start: ["start", upper],
        end: ["end", upper],
        offsetX: 0,
        text: {
          content: `Upper = ${upper}`,
          // offsetY: -15,
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
        start: ["end", lower],
        end: ["start", upper],
        offsetX: 0,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
          // opacity: 1,
        },
      },
      {
        type: "line",
        start: ["start", Math.floor((upper + lower) / 2)],
        end: ["end", Math.floor((upper + lower) / 2)],
        text: {
          content: `Target = ${Math.floor(
            (upper + lower) / 2
          )} pcs. (baratsuki at ${extendedData[0].challenge_rate}%)`,
          offsetY: -15,
          //   offsetX: -85,
          //   position: "left",
          style: {
            textAlign: "left",
            fontSize: 16,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "top",
          },
        },

        style: {
          opacity: 0.2,
          stroke: "rgba(24, 144, 255, 1)",
          //   lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
    ],
  };

  return <Area {...config} />;
};

export default AreaPlotByAccummulate;
