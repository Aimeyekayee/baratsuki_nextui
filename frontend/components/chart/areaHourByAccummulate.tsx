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

const AreaPlotByAccummulate: React.FC = () => {
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);
  const periodOfThisGraph = dataTooltip[0].data.period;
  const isOdd = GeneralStore((state) => state.isOdd);
  const endTime = periodOfThisGraph?.split("-")[1].trim();

  const period1: any = [
    {
      periodTime: "08:30",
      time: 3300,
      status: 1,
      upper: 200,
      lower: 170,
    },
    {
      periodTime: "09:30",
      time: 3600,
      status: 1,
      upper: 418,
      lower: 355,
    },
    {
      periodTime: "10:30",
      time: 3600,
      status: 1,
      upper: 600,
      lower: 510,
    },
    {
      periodTime: "11:15",
      time: 2700,
      status: 1,
      upper: 764,
      lower: 649,
    },
    {
      periodTime: "13:30",
      time: 4500,
      status: 1,
      upper: 1037,
      lower: 881,
    },
    {
      periodTime: "14:30",
      time: 3600,
      status: 1,
      upper: 1255,
      lower: 1066,
    },
    {
      periodTime: "15:30",
      time: 3000,
      status: 1,
      upper: 1437,
      lower: 1221,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 1655,
      lower: 1406,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 1873,
      lower: 1591,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 2200,
      lower: 1869,
    },
    {
      periodTime: "20:30",
      time: 3600,
      status: 1,
      upper: 200,
      lower: 170,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 418,
      lower: 355,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 600,
      lower: 510,
    },
    {
      periodTime: "23:15",
      time: 2700,
      status: 1,
      upper: 764,
      lower: 649,
    },
    {
      periodTime: "01:30",
      time: 5100,
      status: 1,
      upper: 1073,
      lower: 912,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 1291,
      lower: 1097,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 1436,
      lower: 1221,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 1654,
      lower: 1406,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 1872,
      lower: 1591,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 2200,
      lower: 1869,
    },
  ];
  const period2: any = [
    {
      periodTime: "08:30",
      time: 3300,
      status: 1,
      upper: 200,
      lower: 170,
    },
    {
      periodTime: "09:20",
      time: 3000,
      status: 1,
      upper: 381,
      lower: 324,
    },
    {
      periodTime: "10:30",
      time: 3600,
      status: 1,
      upper: 599,
      lower: 509,
    },
    {
      periodTime: "11:30",
      time: 3600,
      status: 1,
      upper: 817,
      lower: 694,
    },
    {
      periodTime: "13:30",
      time: 3600,
      status: 1,
      upper: 1035,
      lower: 879,
    },
    {
      periodTime: "14:20",
      time: 3000,
      status: 1,
      upper: 1216,
      lower: 1033,
    },
    {
      periodTime: "15:30",
      time: 3600,
      status: 1,
      upper: 1434,
      lower: 1218,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 1652,
      lower: 1402,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 1870,
      lower: 1587,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 2197,
      lower: 1865,
    },
    {
      periodTime: "20:30",
      time: 3600,
      status: 1,
      upper: 200,
      lower: 170,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 481,
      lower: 355,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 662,
      lower: 509,
    },
    {
      periodTime: "23:30",
      time: 3600,
      status: 1,
      upper: 880,
      lower: 694,
    },
    {
      periodTime: "01:30",
      time: 3000,
      status: 1,
      upper: 1061,
      lower: 848,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 1261,
      lower: 1018,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 1406,
      lower: 1141,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 1606,
      lower: 1326,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 1824,
      lower: 1511,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 2151,
      lower: 1789,
    },
  ];

  const period = isOdd ? period1 : period2;
  const graphLimit = period.find((item: any) => {
    if (item.periodTime === endTime) {
      return true;
    }
  });
  console.log(graphLimit);
  // If graphLimit is undefined, set upper and lower to 0
  const upper = graphLimit ? graphLimit.upper : 0;
  console.log(upper);
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

  let transformdata2: any[] = [];

  // Perform the transformation
  transformdata2 = transformedData.map((item: any, index: number) => ({
    ...item,
    value:
      index === 0
        ? 0
        : item.prod_actual - transformedData[index - 1]?.prod_actual,
  }));

  console.log(transformdata2);

  const lastDataPoint: number =
    transformdata2[transformdata2.length - 1]?.prod_actual;

  const config: AreaConfig = {
    data: transformdata2,
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
      tickCount: transformdata2.length,
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
    ],
  };

  return <Area {...config} />;
};

export default AreaPlotByAccummulate;
