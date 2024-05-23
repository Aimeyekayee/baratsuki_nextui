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
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const baratsukiRateNumber = Number(baratsukiRate) / 100;

  const period1: any = [
    {
      periodTime: "08:30",
      time: 3300,
      status: 1,
      upper: 200 * baratsukiRateNumber * 1.05,
      lower: 170 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "09:30",
      time: 3600,
      status: 1,
      upper: 418 * baratsukiRateNumber * 1.05,
      lower: 355 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "10:30",
      time: 3600,
      status: 1,
      upper: 600 * baratsukiRateNumber * 1.05,
      lower: 510 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "11:15",
      time: 2700,
      status: 1,
      upper: 764 * baratsukiRateNumber * 1.05,
      lower: 649 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "13:30",
      time: 4500,
      status: 1,
      upper: 1037 * baratsukiRateNumber * 1.05,
      lower: 881 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "14:30",
      time: 3600,
      status: 1,
      upper: 1255 * baratsukiRateNumber * 1.05,
      lower: 1066 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "15:30",
      time: 3000,
      status: 1,
      upper: 1437 * baratsukiRateNumber * 1.05,
      lower: 1221 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 1655 * baratsukiRateNumber * 1.05,
      lower: 1406 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 1873 * baratsukiRateNumber * 1.05,
      lower: 1591 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 2200 * baratsukiRateNumber * 1.05,
      lower: 1869 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "20:30",
      time: 3600,
      status: 1,
      upper: 200 * baratsukiRateNumber * 1.05,
      lower: 170 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 418 * baratsukiRateNumber * 1.05,
      lower: 355 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 600 * baratsukiRateNumber * 1.05,
      lower: 510 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "23:15",
      time: 2700,
      status: 1,
      upper: 764 * baratsukiRateNumber * 1.05,
      lower: 649 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "01:30",
      time: 5100,
      status: 1,
      upper: 1073 * baratsukiRateNumber * 1.05,
      lower: 912 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 1291 * baratsukiRateNumber * 1.05,
      lower: 1097 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 1436 * baratsukiRateNumber * 1.05,
      lower: 1221 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 1654 * baratsukiRateNumber * 1.05,
      lower: 1406 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 1872 * baratsukiRateNumber * 1.05,
      lower: 1591 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 2200 * baratsukiRateNumber * 1.05,
      lower: 1869 * baratsukiRateNumber * 0.95,
    },
  ];
  const period2: any = [
    {
      periodTime: "08:30",
      time: 3300,
      status: 1,
      upper: 200 * baratsukiRateNumber * 1.05,
      lower: 170 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "09:20",
      time: 3000,
      status: 1,
      upper: 381 * baratsukiRateNumber * 1.05,
      lower: 324 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "10:30",
      time: 3600,
      status: 1,
      upper: 599 * baratsukiRateNumber * 1.05,
      lower: 509 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "11:30",
      time: 3600,
      status: 1,
      upper: 817 * baratsukiRateNumber * 1.05,
      lower: 694 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "13:30",
      time: 3600,
      status: 1,
      upper: 1035 * baratsukiRateNumber * 1.05,
      lower: 879 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "14:20",
      time: 3000,
      status: 1,
      upper: 1216 * baratsukiRateNumber * 1.05,
      lower: 1033 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "15:30",
      time: 3600,
      status: 1,
      upper: 1434 * baratsukiRateNumber * 1.05,
      lower: 1218 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "16:30",
      time: 3600,
      status: 1,
      upper: 1652 * baratsukiRateNumber * 1.05,
      lower: 1402 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "17:50",
      time: 3600,
      status: 1,
      upper: 1870 * baratsukiRateNumber * 1.05,
      lower: 1587 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "19:20",
      time: 5400,
      status: 1,
      upper: 2197 * baratsukiRateNumber * 1.05,
      lower: 1865 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "20:30",
      time: 3600,
      status: 1,
      upper: 200 * baratsukiRateNumber * 1.05,
      lower: 170 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "21:30",
      time: 3600,
      status: 1,
      upper: 481 * baratsukiRateNumber * 1.05,
      lower: 355 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "22:30",
      time: 3000,
      status: 1,
      upper: 662 * baratsukiRateNumber * 1.05,
      lower: 509 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "23:30",
      time: 3600,
      status: 1,
      upper: 880 * baratsukiRateNumber * 1.05,
      lower: 694 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "01:30",
      time: 3000,
      status: 1,
      upper: 1061 * baratsukiRateNumber * 1.05,
      lower: 848 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "02:30",
      time: 3600,
      status: 1,
      upper: 1261 * baratsukiRateNumber * 1.05,
      lower: 1018 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "03:30",
      time: 2400,
      status: 1,
      upper: 1406 * baratsukiRateNumber * 1.05,
      lower: 1141 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "04:30",
      time: 3600,
      status: 1,
      upper: 1606 * baratsukiRateNumber * 1.05,
      lower: 1326 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "05:50",
      time: 3600,
      status: 1,
      upper: 1824 * baratsukiRateNumber * 1.05,
      lower: 1511 * baratsukiRateNumber * 0.95,
    },
    {
      periodTime: "07:20",
      time: 5400,
      status: 1,
      upper: 2151 * baratsukiRateNumber * 1.05,
      lower: 1789 * baratsukiRateNumber * 0.95,
    },
  ];

  period1.forEach((period: any) => {
    period.upper = Math.floor(period.upper);
    period.lower = Math.floor(period.lower);
  });
  period2.forEach((period: any) => {
    period.upper = Math.floor(period.upper);
    period.lower = Math.floor(period.lower);
  });

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
  const shift = GeneralStore((state) => state.shift);
  const annotationsArrow: any[] = transformdata2
    .map((item: any, index: number) => {
      if (item.prod_actual >= lower && item.prod_actual <= upper) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start:
            index === transformdata2.length - 1
              ? [
                  item.date,
                  transformdata2[transformdata2.length - 1].prod_actual,
                ]
              : ["0", "0"], // Use start: ["0", "0"] for all items except the last one
          end:
            index === transformdata2.length - 1
              ? [item.date, (upper + lower) / 2]
              : ["0", "0"], // End slightly above ct_actual
          style: {
            stroke:
              shift === "day"
                ? item.prod_actual < lower
                  ? "#FF4D4F"
                  : item.prod_actual > upper
                  ? "blue"
                  : "#FF8F8F"
                : "#FF8F8F",
            lineWidth: 2,
            endArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing right
              d: 2,
            },
            startArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing left
              d: 2,
            },
          },
        };
      }
    })
    .filter((annotation: any) => annotation !== null);

  const generateAnnotations = (processedParameter: any[], target: number) => {
    const annotations: any[] = processedParameter
      .map((item, index) => {
        if (item.prod_actual === target) {
          return null; // Skip periods with zero or invalid ct_value values
        } else {
          const gapContent = `Gap: ${item.prod_actual < target ? "-" : "+"}${
            target - item.prod_actual
          } pcs.`;
          const percentContent = `${item.prod_actual < target ? "-" : "+"}${(
            Math.abs((target - item.prod_actual) / target) * 100
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
                        (1 -
                          yScale.prod_actual.scale(
                            (target + item.prod_actual) / 2
                          )) *
                        100
                      }%`,
                    ]
                  : ["0", "0"]; // Use position: ["0", "0"] for all items except the last one
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.prod_actual < target
                      ? "#C40C0C"
                      : item.prod_actual > target
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
                        (1 -
                          yScale.prod_actual.scale(
                            (target + item.prod_actual) / 2
                          )) *
                        100
                      }%`,
                    ]
                  : ["0", "0"]; // Use position: ["0", "0"] for all items except the last one
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.prod_actual < target
                      ? "#C40C0C"
                      : item.prod_actual > target
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
    transformdata2,
    (upper + lower) / 2
  );

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
      ...annotations,
      ...annotationsArrow,
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
        type: "line",
        start: ["start", Math.floor((upper + lower) / 2)],
        end: ["end", Math.floor((upper + lower) / 2)],
        text: {
          content: `Target = ${Math.floor(
            (upper + lower) / 2
          )} pcs. (baratsuki at ${baratsukiRate}%)`,
          offsetY: -15,
          //   offsetX: -85,
          //   position: "left",
          style: {
            textAlign: "left",
            fontSize: 16,
            fontWeight: "bold",
            fill: "rgba(86, 191, 150, 1)",
            textBaseline: "top",
          },
        },

        style: {
          opacity: 0.5,
          stroke: "rgba(98, 218, 171, 1)",
          //   lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
    ],
  };

  return <Area {...config} />;
};

export default AreaPlotByAccummulate;
