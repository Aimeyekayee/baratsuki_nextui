"use client";
import { useState, useEffect } from "react";
import { Area, AreaConfig, G2, Column, ColumnConfig } from "@ant-design/plots";
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

const AreaPlotBy5minutes: React.FC = () => {
  const ctTarget = 16.5;
  const accum5min = (5 * 60) / ctTarget;
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

  const period3 = [
    {
      periodTime: "08:30",
      time: 3300,
      status: 1,
      upper: 200,
      lower: 140,
    },
    {
      periodTime: "09:40",
      time: 4200,
      status: 1,
      upper: 255,
      lower: 178,
    },
    {
      periodTime: "10:30",
      time: 2400,
      status: 1,
      upper: 145,
      lower: 102,
    },
    {
      periodTime: "11:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "13:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "14:40",
      time: 4200,
      status: 1,
      upper: 255,
      lower: 178,
    },
    {
      periodTime: "15:30",
      time: 2400,
      status: 1,
      upper: 145,
      lower: 102,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 327,
      lower: 229,
    },
    {
      periodTime: "20:30",
      time: 3300,
      status: 1,
      upper: 200,
      lower: 140,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 182,
      lower: 127,
    },
    {
      periodTime: "23:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "01:30",
      time: 4200,
      status: 1,
      upper: 255,
      lower: 178,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 145,
      lower: 102,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 327,
      lower: 229,
    },
  ];

  const graphLimit = period.find((item) => {
    if (item.periodTime === endTime) {
      return true;
    }
  });

  const graphLimit3 = period3.find((item) => {
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

  const firstProdActual = transformedData[0]?.prod_actual;

  const transformData3 = transformedData.map((entry: any, index: number) => ({
    ...entry,
    value: index === 0 ? 0 : entry.prod_actual - firstProdActual,
  }));

  console.log("transformData3", transformData3);

  const lastDataPoint: number =
    transformData3[transformData3.length - 1]?.value;
  console.log("lower", lower);
  console.log("upper", upper);
  console.log(graphLimit);
  console.log("graphlimit3", graphLimit3);

  const config: ColumnConfig = {
    data: transformdata2,
    xField: "date",
    slider:false,
    yField: "value",
    label: {
      style: {
        fontSize: 16,
      },
    },
    seriesField: "value",
    color: (value) => {
      console.log(value);
      if (value.value >= 18) {
        return "#5cdaab";
      }else if(value.value < 18){
        return "red"
      }
      return "blue";
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
      maxLimit: 22,
      title: {
        text: "Actual (pcs.)",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    // areaStyle: () => {
    //   return {
    //     fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
    //   };
    // },
    annotations: [
      {
        type: "line",
        start: ["min", 18],
        end: ["max", 18],
        offsetX: 0,
        text: {
          content: `C.T. Target = ${ctTarget}`,
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
        start: ["min", 18],
        end: ["max", 18],
        offsetX: 0,
        text: {
          content: `Actual Target = ${accum5min.toFixed(0)}`,
          offsetY: -30,

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

  return <Column {...config} />;
};

export default AreaPlotBy5minutes;
