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
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);

  const zone_number = dataTooltip[0].data.zone_number;
  const ctTargetZone1 = GeneralStore((state) => state.ctTargetZone1);
  const ctTargetZone2 = GeneralStore((state) => state.ctTargetZone2);

  const targetZoneRate = zone_number === 1 ? ctTargetZone1 : ctTargetZone2;
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const targetValues: { [key: number]: number } = {
    77: Math.floor(((5 * 60) / targetZoneRate) * 0.77),
    81: Math.floor(((5 * 60) / targetZoneRate) * 0.81),
    85: Math.floor(((5 * 60) / targetZoneRate) * 0.85),
    100: Math.floor(((5 * 60) / targetZoneRate) * 1),
  };
  const baratsukiRateNumber = Number(baratsukiRate);
  let target: number = targetValues[baratsukiRateNumber] || 0;
  console.log(target);
  console.log(`The target for baratsukiRate ${baratsukiRate} is ${target}`);

  const periodOfThisGraph = dataTooltip[0].data.period;
  const endTime = periodOfThisGraph?.split("-")[1].trim();

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

  const shift = GeneralStore((state) => state.shift);
  const annotationsArrow: any[] = transformdata2
    .map((item) => {
      if (item.value >= lower && item.value <= upper) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start: [item.date, item.value], // Start slightly below ct_actual
          end: [item.date, target], // End slightly above ct_actual
          style: {
            stroke:
              shift === "day"
                ? item.value < target
                  ? "red"
                  : item.value > target
                  ? "blue"
                  : "green"
                : item.value < target
                ? "red"
                : item.value > target
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
        };
      }
    })
    .filter((annotation) => annotation !== null);
  const maxValue = Math.max(...transformdata2.map((item) => item.value));
  const maxLimit =
    maxValue > target ? Math.floor(maxValue + 3) : Math.floor(target + 3);

  const generateAnnotations = (processedParameter: any[], target: number) => {
    const annotations: any[] = processedParameter
      .map((item) => {
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
              offsetX: 32,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.date) * 100}%`,
                  `${
                    (1 - yScale.value.scale((target + item.value) / 2)) * 100
                  }%`,
                ];
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
              offsetX: 25,
              offsetY: 15,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.date) * 100}%`,
                  `${
                    (1 - yScale.value.scale((target + item.value) / 2)) * 100
                  }%`,
                ];
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
  const annotations: any[] = generateAnnotations(transformdata2, target);
  const config: ColumnConfig = {
    data: transformdata2,
    xField: "date",
    // slider: false,
    yField: "value",
    label: {
      style: {
        fontSize: 16,
      },
    },
    seriesField: "value",
    color: (value) => {
      console.log(value);
      if (value.value === target) {
        return "#5cdaab";
      } else if (value.value < target) {
        return "#F4664A";
      }
      return "#A0DEFF";
    },
    legend: false,
    xAxis: {
      range: [0, 1],
      tickCount: transformdata2.length,
      title: {
        text: "Time",
        style: { fontSize: 20, fontWeight: "bold" },
      },
    },
    yAxis: {
      maxLimit: maxLimit,
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
      ...annotations,
      ...annotationsArrow,
      {
        type: "line",
        start: ["min", target],
        end: ["max", target],
        offsetX: 0,
        text: {
          content: `(calculated at C.T. Target = ${targetZoneRate})`,
          offsetY: -18,
          offsetX: 430,
          style: {
            textAlign: "left",
            fontSize: 12,
            fontWeight: "bold",
            fill: "rgba(86, 191, 150, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(86, 191, 150, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
      {
        type: "line",
        start: ["min", target],
        end: ["max", target],
        offsetX: 0,
        text: {
          content: `Actual Target = ${target} pcs. / 5min`,
          offsetY: -150,

          style: {
            textAlign: "left",
            fontSize: 30,
            fontWeight: "bold",
            fill: "rgba(86, 191, 150, 1)",
            textBaseline: "top",
          },
        },
        style: {
          stroke: "rgba(86, 191, 150, 1)",
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
