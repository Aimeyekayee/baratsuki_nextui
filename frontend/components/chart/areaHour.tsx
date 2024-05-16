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

const AreaPlotByHour: React.FC = () => {
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);
  const periodOfThisGraph = dataTooltip[0].data.period;
  const endTime = periodOfThisGraph?.split("-")[1].trim();

  const period3_1: any = [
    {
      periodTime: "08:30",
      time: 3300,
      status: 1,
      upper: 3300 / 16.5,
      lower: (3300 / 16.5) * 0.85,
    },
    {
      periodTime: "09:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "10:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "11:15",
      time: 2700,
      status: 1,
      upper: 2700 / 16.5,
      lower: (2700 / 16.5) * 0.85,
    },
    {
      periodTime: "13:30",
      time: 4500,
      status: 1,
      upper: 4500 / 16.5,
      lower: (4500 / 16.5) * 0.85,
    },
    {
      periodTime: "14:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "15:30",
      time: 3000,
      status: 1,
      upper: 3000 / 16.5,
      lower: (3000 / 16.5) * 0.85,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 5400 / 16.5,
      lower: (5400 / 16.5) * 0.85,
    },
    {
      periodTime: "20:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 3000 / 16.5,
      lower: (3000 / 16.5) * 0.85,
    },
    {
      periodTime: "23:15",
      time: 2700,
      status: 1,
      upper: 2700 / 16.5,
      lower: (2700 / 16.5) * 0.85,
    },
    {
      periodTime: "01:30",
      time: 5100,
      status: 1,
      upper: 5100 / 16.5,
      lower: (5100 / 16.5) * 0.85,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 2400 / 16.5,
      lower: (2400 / 16.5) * 0.85,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 5400 / 16.5,
      lower: (5400 / 16.5) * 0.85,
    },
  ];
  const period3_2: any = [
    {
      periodTime: "08:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "09:20",
      time: 3000,
      status: 1,
      upper: 3000 / 16.5,
      lower: (3000 / 16.5) * 0.85,
    },
    {
      periodTime: "10:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "11:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "13:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "14:20",
      time: 3000,
      status: 1,
      upper: 3000 / 16.5,
      lower: (3000 / 16.5) * 0.85,
    },
    {
      periodTime: "15:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 5400 / 16.5,
      lower: (5400 / 16.5) * 0.85,
    },
    {
      periodTime: "20:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 3000 / 16.5,
      lower: (3000 / 16.5) * 0.85,
    },
    {
      periodTime: "23:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "01:30",
      time: 3000,
      status: 1,
      upper: 3000 / 16.5,
      lower: (3000 / 16.5) * 0.85,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 2400 / 16.5,
      lower: (2400 / 16.5) * 0.85,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 3600 / 16.5,
      lower: (3600 / 16.5) * 0.85,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 5400 / 16.5,
      lower: (5400 / 16.5) * 0.85,
    },
  ];
  const isOdd = GeneralStore((state) => state.isOdd);
  const period3 = isOdd ? period3_1 : period3_2;

  const ceilMinusOne = (value: number): number => Math.ceil(value) - 1;

  const modifiedPeriod3 = period3.map((item: any) => ({
    ...item,
    upper: ceilMinusOne(item.upper),
    lower: ceilMinusOne(item.lower),
  }));

  const graphLimit3 = modifiedPeriod3.find((item: any) => {
    if (item.periodTime === endTime) {
      return true;
    }
  });
  // If graphLimit is undefined, set upper and lower to 0
  const upper = graphLimit3 ? graphLimit3.upper : 0;
  const lower = graphLimit3 ? graphLimit3.lower : 0;
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

  const firstProdActual = transformedData[0]?.prod_actual;

  const transformData3 = transformedData.map((entry: any, index: number) => ({
    ...entry,
    value: index === 0 ? 0 : entry.prod_actual - firstProdActual,
  }));

  console.log("transformData3", transformData3);

  const lastDataPoint: number =
    transformData3[transformData3.length - 1]?.value;
  const config: AreaConfig = {
    data: transformData3,
    xField: "date",
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
      tickCount: transformData3.length,
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
      // {
      //   type: "text",
      //   content: "Hello",
      //   position: [transformData3[0]?.date, (upper + lower) / 2],
      //   offsetX: 20,

      //   // ✅ 4. 支持直接设置 x,y 坐标 (相对于 canvas 坐标，相对起点在左上方) - 需要外部自我感知画布大小，不建议使用
      //   // x: 180,
      //   // y: 105,

      //   /** 图形样式属性 */
      //   style: {
      //     textAlign: "center",
      //     fill: "rgba(0,0,0,0.85)",
      //   },
      // },
    ],
  };

  return <Area {...config} />;
};

export default AreaPlotByHour;
