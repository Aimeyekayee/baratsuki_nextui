"use client";
import { Area, AreaConfig, G2 } from "@ant-design/plots";
import { GeneralStore } from "@/store/general.store";
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
  const target =
    (extendedData[0].target_challege_upper +
      extendedData[0].target_challege_lower) /
    2;
  const lower = extendedData[0].target_challege_lower;
  const upper = extendedData[0].target_challege_upper;

  const config: AreaConfig = {
    data: extendedData,
    xField: "time",
    yField: "period_value",
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
    areaStyle: () => {
      return {
        fill:
          lastDataPoint &&
          lastDataPoint >= extendedData[0].target_challege_lower &&
          lastDataPoint <= extendedData[0].target_challege_upper
            ? "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff"
            : "l(270) 0:#ffffff 0.5:#ff9673 1:#ff5218",
      };
    },
    xAxis: {
      label: {
        style: {
          fill: shift === 1 ? "black" : "white",
        },
      },
      range: [0, 1],
      tickCount: extendedData.length,
      tickLine: {
        style: {
          fill: shift === 1 ? "black" : "white",
        },
      },
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
      maxLimit: extendedData[0].target_challege_upper + 10,
      title: {
        text: "Actual (pcs.)",
        style: {
          fontSize: 20,
          fontWeight: "bold",
          fill: shift === 1 ? "black" : "white",
        },
      },
    },
    annotations: [
      {
        type: "text",
        content:
          lastDataPoint && lastDataPoint >= lower
            ? ""
            : `Gap: ${
                lastDataPoint !== undefined ? lastDataPoint - target : "Unknown"
              } pcs.`,
        offsetX: -50,
        offsetY: 0,
        position: (xScale: any, yScale: any) => {
          const lastPeriodValue =
            extendedData[extendedData.length - 1].period_value;
          if (
            lastPeriodValue !== undefined &&
            yScale.period_value !== undefined
          ) {
            const targetValue = (target + lastPeriodValue) / 2;
            const xPosition =
              xScale.scale(extendedData[extendedData.length - 1].time) * 100;
            const yPosition =
              (1 - yScale.period_value.scale(targetValue)) * 100;

            return [`${xPosition}%`, `${yPosition}%`];
          } else {
            // Handle case where lastPeriodValue or yScale.period_value is undefined
            return ["0%", "0%"]; // or some default values as needed
          }
        },
        style: {
          textAlign: "center",
          fill:
            shift === 1
              ? extendedData[extendedData.length - 1].value < target
                ? "#C40C0C"
                : extendedData[extendedData.length - 1].value > target
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
          extendedData[extendedData.length - 1].period_value ?? "Unknown",
        ], // Start slightly below ct_actual
        end: [extendedData[extendedData.length - 1].time, target], // End slightly above ct_actual
        style: {
          stroke:
            shift === 1
              ? extendedData[extendedData.length - 1].value < target
                ? "red"
                : extendedData[extendedData.length - 1].value > target
                ? "blue"
                : "green"
              : extendedData[extendedData.length - 1].value < target
              ? "red"
              : extendedData[extendedData.length - 1].value > target
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
        type: "text",
        content:
          lastDataPoint && lastDataPoint >= lower
            ? ""
            : `-${(
                (lastDataPoint !== undefined
                  ? lastDataPoint / target
                  : 0 / target) * 100
              ).toFixed(2)}%`,
        offsetX: -50,
        offsetY: 20,
        position: (xScale: any, yScale: any) => {
          const lastPeriodValue =
            extendedData[extendedData.length - 1].period_value;
          if (
            lastPeriodValue !== undefined &&
            yScale.period_value !== undefined
          ) {
            const targetValue = (target + lastPeriodValue) / 2;
            const xPosition =
              xScale.scale(extendedData[extendedData.length - 1].time) * 100;
            const yPosition =
              (1 - yScale.period_value.scale(targetValue)) * 100;

            return [`${xPosition}%`, `${yPosition}%`];
          } else {
            // Handle case where lastPeriodValue or yScale.period_value is undefined
            return ["0%", "0%"]; // or some default values as needed
          }
        },
        style: {
          textAlign: "center",
          fill:
            shift === 1
              ? extendedData[extendedData.length - 1].value < target
                ? "#C40C0C"
                : extendedData[extendedData.length - 1].value > target
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
