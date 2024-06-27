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
}
const AreaPlotByAccummulate: React.FC<IProps> = ({ parameter }) => {
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
      range: [0, 1],
      tickCount: extendedData.length,
      title: {
        text: "Time",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    yAxis: {
      maxLimit: upper + 10,
      title: {
        text: "Actual (pcs.)",
        style: { fontSize: 20, fontWeight: "bold" },
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
      // ...annotations,
      // ...annotationsArrow,
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
