"use client";
import { useState, useEffect } from "react";
import { Area, AreaConfig, G2 } from "@ant-design/plots";
import { GeneralStore } from "@/store/general.store";
import { ModalOpenStore } from "@/store/modal.open.store";
import { DataProductionDetails } from "@/store/interfaces/baratsuki.fetch.interface";
import zustand from "zustand";

interface TransformData {
  section_code: number;
  line_id: number;
  machine_no: string;
  date: string;
  prod_actual: number;
  data: DataProductionDetails;
}

const AreaPlot: React.FC = () => {
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);
  const periodOfThisGraph = dataTooltip[0].data.period;
  const endTime = periodOfThisGraph?.split("-")[1].trim();

  const period = [
    {
      periodTime: "08:30",
      upper: 200,
      lower: 140,
    },
    {
      periodTime: "09:40",
      upper: 455,
      lower: 318,
    },
    {
      periodTime: "10:30",
      time: 2400,
      status: 1,
      upper: 600,
      lower: 420,
    },
    {
      periodTime: "11:30",
      upper: 818,
      lower: 573,
    },
    {
      periodTime: "13:30",
      upper: 1036,
      lower: 726,
    },
    {
      periodTime: "14:40",
      upper: 1291,
      lower: 904,
    },
    {
      periodTime: "15:30",
      upper: 1436,
      lower: 1006,
    },
    {
      periodTime: "16:30",
      upper: 1654,
      lower: 1159,
    },
    {
      periodTime: "17:50",
      upper: 1872,
      lower: 1312,
    },
    {
      periodTime: "19:20",
      upper: 2200,
      lower: 1541,
    },
    {
      periodTime: "20:30",
      upper: 200,
      lower: 140,
    },
    {
      periodTime: "21:30",
      upper: 418,
      lower: 293,
    },
    {
      periodTime: "22:30",
      upper: 600,
      lower: 420,
    },
    {
      periodTime: "23:30",
      upper: 818,
      lower: 573,
    },
    {
      periodTime: "01:30",
      upper: 1073,
      lower: 751,
    },
    {
      periodTime: "02:30",
      upper: 1291,
      lower: 904,
    },
    {
      periodTime: "03:30",
      upper: 1436,
      lower: 1006,
    },
    {
      periodTime: "04:30",
      upper: 1654,
      lower: 1159,
    },
    {
      periodTime: "05:50",
      upper: 1872,
      lower: 1312,
    },
    {
      periodTime: "07:20",
      upper: 2200,
      lower: 1541,
    },
  ];

  const graphLimit = period.find((item) => {
    if (item.periodTime === endTime) {
      return true;
    }
  });
  // If graphLimit is undefined, set upper and lower to 0
  const upper = graphLimit ? graphLimit.upper : 0;
  const lower = graphLimit ? graphLimit.lower : 0;
  const dataBaratsuki = GeneralStore((state) => state.dataBaratsuki);
  dataBaratsuki.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  console.log(dataBaratsuki);
  const transformedData: any = dataBaratsuki?.map((item) => {
    const date = new Date(item.date);
    const formattedHours = String(date.getHours()).padStart(2, "0");
    const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
    const formattedSeconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${formattedHours}:${formattedMinutes}`;
    return {
      section_code: item.section_code,
      line_id: item.line_id,
      machine_no: item.machine_no,
      date: formattedDate,
      prod_actual: item.data.prod_actual,
      data: item.data,
    };
  });

  const judgePoint = transformedData.map((item: any, index: number) => {
    const isLastDataPoint = index === transformedData.length - 1;
    const isAboveUpperLimit =
      graphLimit &&
      typeof graphLimit.upper === "number" &&
      item.prod_actual >= graphLimit.upper;

    return {
      size: 8,
      shape: "point",
      style: {
        fill: isAboveUpperLimit && isLastDataPoint ? "red" : "green",
        stroke: "white",
        lineWidth: 2,
      },
    };
  });

  const lastDataPoint: number =
    transformedData[transformedData.length - 1]?.prod_actual;
  console.log("lower", lower);
  console.log("upper", upper);
  console.log(graphLimit);

  const config: AreaConfig = {
    data: transformedData,
    xField: "date",
    yField: "prod_actual",
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
          lastDataPoint >= lower && lastDataPoint <= upper ? "green" : "red",
        stroke: "white",
        lineWidth: 2,
      },
    },
    line: {
      style: {
        stroke:
          lastDataPoint >= lower && lastDataPoint <= upper ? "green" : "red",
      },
    },
    xAxis: {
      range: [0, 1],
      tickCount: transformedData.length,
      title: {
        text: "Time",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    yAxis: {
      maxLimit: upper + 10,
      title: {
        text: "Actual Cycle point",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    areaStyle: () => {
      return {
        fill:
          lastDataPoint >= lower && lastDataPoint <= upper
            ? "l(270) 0:#ffffff 0.5:#ade0cc 1:#62daab"
            : "l(270) 0:#ffffff 0.5:#ff9673 1:#ff5218",
      };
    },
    annotations: [
      {
        type: "line",
        start: ["min", lower],
        end: ["max", lower],
        offsetX: 0,
        text: {
          content: `Lower = ${lower}`,
          offsetY: -15,
          style: {
            textAlign: "left",
            fontSize: 12,
            fontWeight: "bold",
            fill: "rgba(86, 191, 150, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(98, 218, 171, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
      {
        type: "line",
        start: ["min", upper],
        end: ["max", upper],
        offsetX: 0,
        text: {
          content: `Upper = ${upper}`,
          offsetY: 4,

          style: {
            textAlign: "left",
            fontSize: 12,
            fontWeight: "bold",
            fill: "rgba(86, 191, 150, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(98, 218, 171, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
      {
        type: "region",
        start: ["min", lower],
        end: ["max", upper],
        offsetX: 0,
        style: {
          fill: "#62daab",
          fillOpacity: 0.15,
          // opacity: 1,
        },
      },
      {
        type: "text",
        content: "Hello",
        position: [transformedData[0]?.date, (upper + lower) / 2],
        offsetX: 20,

        // ✅ 4. 支持直接设置 x,y 坐标 (相对于 canvas 坐标，相对起点在左上方) - 需要外部自我感知画布大小，不建议使用
        // x: 180,
        // y: 105,

        /** 图形样式属性 */
        style: {
          textAlign: "center",
          fill: "rgba(0,0,0,0.85)",
        },
      },
    ],
  };

  return <Area {...config} />;
};

export default AreaPlot;
