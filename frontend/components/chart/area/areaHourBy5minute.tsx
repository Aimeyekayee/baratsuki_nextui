"use client";
import { useState, useEffect } from "react";
import { Area, AreaConfig, G2, Column, ColumnConfig } from "@ant-design/plots";
import { GeneralStore } from "@/store/general.store";
import { ModalOpenStore } from "@/store/modal.open.store";
import { DataProductionDetails } from "@/store/interfaces/baratsuki.fetch.interface";
import zustand from "zustand";
import { useRouter } from "next/navigation";
import { BaratsukiDataAreaResponse } from "@/types/baratsuki.type";

interface IProps {
  parameter: BaratsukiDataAreaResponse[];
}

interface ExtendedInterface extends BaratsukiDataAreaResponse {
  value: number;
  time: string;
  range?: string;
}

const AreaPlotBy5minutes: React.FC<IProps> = ({ parameter }) => {
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

  extendedData.shift();

  // Helper function to format time
  function formatTime(date: any) {
    return date.toISOString().slice(11, 16);
  }

  // Add 'range' key to each object
  for (let i = 1; i < extendedData.length; i++) {
    const currentDate = new Date(extendedData[i].date);
    const previousDate = new Date(extendedData[i - 1].date);
    const range = `${formatTime(previousDate)} - ${formatTime(currentDate)}`;
    extendedData[i].range = range;
  }

  // Special case for the first element
  extendedData[0].range = `09:30 - ${formatTime(
    new Date(extendedData[0].date)
  )}`;
  const target = Math.floor(
    (300 / extendedData[0].ct_target) * (extendedData[0].challenge_rate / 100)
  ); // target by 5 min @challenge_rate

  const generateAnnotations = (
    processedParameter: ExtendedInterface[],
    target: number
  ) => {
    const annotations: any[] = processedParameter
      .map((item) => {
        if (item.value >= target) {
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
                  `${xScale.scale(item.range) * 100}%`,
                  `${
                    (1 - yScale.value.scale((target + item.value) / 2)) * 100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  shift === 1
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
                  `${xScale.scale(item.range) * 100}%`,
                  `${
                    (1 - yScale.value.scale((target + item.value) / 2)) * 100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  shift === 1
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
  const annotations: any[] = generateAnnotations(extendedData, target);
  const annotationsArrow: any[] = extendedData
    .map((item) => {
      if (item.value >= target) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start: [item.range, item.value], // Start slightly below ct_actual
          end: [item.range, target], // End slightly above ct_actual
          style: {
            stroke:
              shift === 1
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
  const config: ColumnConfig = {
    data: extendedData,
    xField: "range",
    slider: false,
    yField: "value",
    label: {
      style: {
        fontSize: 16,
      },
    },
    // onReady: (plot) => {
    //   plot.on("element:click", (evt: any) => {
    //     window.open(
    //       "https://ringtail-popular-ghoul.ngrok-free.app/apl/monitor?boardno=9&pageno=2",
    //       "_blank"
    //     );
    //   });
    // },
    seriesField: "value",
    color: (value) => {
      if (value.value >= target) {
        return "rgba(24, 144, 255, 0.5)";
      } else if (value.value < target) {
        return "rgba(255, 33, 33, 0.5)";
      }
      return "black";
    },
    legend: false,
    xAxis: {
      title: {
        text: "Time",
        style: {
          fontSize: 20,
          fontWeight: "bold",
          fill: shift === 1 ? "#595959" : "white",
        },
      },
    },
    yAxis: {
      maxLimit: target + 8,
      title: {
        text: "Actual (pcs.)",
        style: {
          fontSize: 20,
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

    annotations: [
      ...annotations,
      ...annotationsArrow,
      {
        type: "line",
        start: ["start", target],
        end: ["end", target],
        offsetX: 0,
        text: {
          content: `(calculated at C.T. Target = ${extendedData[0].ct_target} within 5 minutes)`,
          offsetY: -5,
          offsetX: 330,
          style: {
            textAlign: "left",
            fontSize: 14,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "bottom",
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
        start: ["start", target],
        end: ["end", target],
        offsetX: 0,
        text: {
          content: `Actual Target = ${target} pcs.`,
          // offsetY: -150,
          style: {
            textAlign: "left",
            fontSize: 30,
            fontWeight: "bold",
            fill: "rgba(24, 144, 255, 1)",
            textBaseline: "bottom",
          },
        },
        style: {
          stroke: "rgba(24, 144, 255, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
    ],
  };

  return <Column {...config} />;
};

export default AreaPlotBy5minutes;
