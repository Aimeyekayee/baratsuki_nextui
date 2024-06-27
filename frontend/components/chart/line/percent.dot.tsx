import React from "react";
import { Line, LineConfig } from "@ant-design/charts";
import { GeneralStore } from "@/store/general.store";
import dayjs from "dayjs";
import { BaratsukiResponse, MachineDataRaw } from "@/types/baratsuki.type";
import { calculateSummaryDuration } from "@/functions/other/cal.baratsukiparams";

interface LineProps {
  baratsuki: BaratsukiResponse[];
}

const PercentOaBaratsuki: React.FC<LineProps> = ({ baratsuki }) => {
  function transformAndMergeData(data: BaratsukiResponse[]): string[] {
    return data.flatMap((shiftData) =>
      shiftData.data
        .filter((machineData) => machineData.plan_type === "B")
        .map((machineData) => machineData.period)
    );
  }
  const brakePeriod = transformAndMergeData(baratsuki);

  const shift = GeneralStore((state) => state.shift);
  const parameter = shift === 1 ? baratsuki[0].data : baratsuki[1].data;

  function findMinValues(data: MachineDataRaw[]): {
    min_lower: number;
    min_upper: number;
    period_min_lower: string | undefined;
    period_min_upper: string | undefined;
  } {
    let minLowerPercent = Infinity;
    let minUpperPercent = Infinity;
    let periodMinLower: string | undefined = undefined;
    let periodMinUpper: string | undefined = undefined;

    data.forEach((entry) => {
      if (
        entry.target_challenge_lower_percent !== undefined &&
        entry.target_challenge_lower_percent < minLowerPercent
      ) {
        minLowerPercent = entry.target_challenge_lower_percent;
        periodMinLower = entry.period;
      }
      if (
        entry.target_challenge_upper_percent !== undefined &&
        entry.target_challenge_upper_percent < minUpperPercent
      ) {
        minUpperPercent = entry.target_challenge_upper_percent;
        periodMinUpper = entry.period;
      }
    });

    return {
      min_lower: minLowerPercent,
      min_upper: minUpperPercent,
      period_min_lower: periodMinLower,
      period_min_upper: periodMinUpper,
    };
  }

  function findMinMaxOaWithPeriod(data: MachineDataRaw[]): {
    minOa: number;
    maxOa: number;
    minOaPeriod: string;
    maxOaPeriod: string;
  } {
    // Initialize variables to hold min and max values
    let minOa = Infinity;
    let maxOa = -Infinity;
    let minOaPeriod = "";
    let maxOaPeriod = "";

    // Loop through data to find min and max oa values with associated periods
    data.forEach((item) => {
      if (item.plan_type === "N") {
        if (item.oa < minOa) {
          minOa = item.oa;
          minOaPeriod = item.period;
        }
        if (item.oa > maxOa) {
          maxOa = item.oa;
          maxOaPeriod = item.period;
        }
      }
    });

    // Return object with minOa, maxOa, minOaPeriod, maxOaPeriod
    return { minOa, maxOa, minOaPeriod, maxOaPeriod };
  }

  const oaMinMax = findMinMaxOaWithPeriod(parameter);
  const minValues = findMinValues(parameter);
  const indices = [
    [0, 1],
    [1, 3],
    [3, 4],
    [4, 6],
    [6, 7],
    [7, 9],
    [9, 10],
    [10, 12],
    [12, 13],
  ];
  const filteredIndices = indices.filter(([startIndex, endIndex]) => {
    const startPeriod = parameter[startIndex]?.period;
    const endPeriod = parameter[endIndex]?.period;
    const startValue = parameter[startIndex]?.actual_this_period;
    const endValue = parameter[endIndex]?.actual_this_period;

    return (
      !(startValue === 0 && brakePeriod.includes(startPeriod)) &&
      !(endValue === 0 && brakePeriod.includes(endPeriod))
    );
  });

  const annotationLine: any[] = filteredIndices.map(
    ([startIndex, endIndex]) => ({
      type: "line",
      start: [parameter[startIndex]?.period, parameter[startIndex]?.oa],
      end: [parameter[endIndex]?.period, parameter[endIndex]?.oa],
      text: {
        content: "",
        position: "right",
        style: {
          textAlign: "right",
        },
      },
      style: {
        lineDash: [4, 4],
        lineWidth: 1.5,
        //   stroke: "rgb(155, 189, 230,1)",
      },
    })
  );

  const config: LineConfig = {
    data: parameter,
    xField: "period",
    yField: "oa",
    xAxis: false,
    legend: { title: { text: "asdas" } },
    yAxis: {
      label: {
        formatter: (oa) => `${oa}%`,
      },
      title: {
        text: "Performance  Analysis  per  Hour (OA%)",
        style: { fill: shift === 1 ? "#595959" : "white", fontSize: 16 },
      },
      tickCount: 3,
      minLimit: 0,
      maxLimit: 100,

      grid: {
        line: {
          style: {
            opacity: 0.2,
          },
        },
      },
    },
    label: {
      formatter: (datum) => {
        if (datum.plan_type === "B") {
          return ""; // Hide the label
        }
        return `${datum.oa} %`;
      },
      style: { fill: shift === 1 ? "black" : "white" },
    },
    lineStyle: { fillOpacity: 0, opacity: 0 },
    point: {
      size: 7,
      shape: "circle",
      style: (datum: any) => {
        if (brakePeriod.includes(datum.period)) {
          return {
            fill: "rgba(255,0,0,0)",
            stroke: "rgba(255,0,0,0)",
          }; // Hide the point
        }
        if (datum.oa >= minValues.min_lower) {
          return { fill: "rgba(24, 144, 255, 1)", cursor: "pointer" };
        } else {
          return { fill: "red", cursor: "pointer" };
        }
      },
    },
    tooltip: {
      showMarkers: true,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
    annotations: [
      {
        type: "text",
        content: "min",
        position: (xScale: any, yScale: any) => {
          return [
            `${xScale.scale(oaMinMax.minOaPeriod) * 100}%`,
            `${(1 - yScale.oa.scale(oaMinMax.minOa + 8)) * 100}%`,
          ];
        },
        style: {
          textAlign: "center",
          fill: "white",
        },
        offsetY: -8,
        background: {
          padding: 4,
          style: {
            radius: 4,
            fill: "black",
          },
        },
      },
      {
        type: "text",
        content: "max",
        position: (xScale: any, yScale: any) => {
          return [
            `${xScale.scale(oaMinMax.maxOaPeriod) * 100}%`,
            `${(1 - yScale.oa.scale(oaMinMax.maxOa + 8)) * 100}%`,
          ];
        },
        style: {
          textAlign: "center",
          fill: "white",
        },
        offsetY: 45,
        background: {
          padding: 4,
          style: {
            radius: 4,
            fill: "black",
          },
        },
      },

      {
        type: "line",
        start: ["start", minValues.min_upper],
        end: ["end", minValues.min_upper],
        text: {
          content: `≈ ${minValues.min_upper}%`,
          position: "right",
          offsetY: 0,
          style: {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "right",
            fill: "rgba(24, 144, 255, 1)",
          },
        },
        style: {
          stroke: "rgba(24, 144, 255, 1)",
          lineDash: [3, 3],
          lineWidth: 1.5,
        },
      },
      {
        type: "line",
        start: ["start", minValues.min_lower],
        end: ["end", minValues.min_lower],
        text: {
          content: `≈ ${minValues.min_lower}%`,
          position: "right",
          style: {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "right",
            fill: "rgba(24, 144, 255, 1)",
          },
        },
        style: {
          stroke: "rgba(24, 144, 255, 1)",
          lineDash: [3, 3],
          lineWidth: 1.5,
        },
      },
      {
        type: "region",
        start: ["start", minValues.min_lower],
        end: ["end", minValues.min_upper],
        offsetX: 0,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
          // opacity: 1,
        },
      },
      ...annotationLine,
    ],
  };
  return <Line {...config} />;
};

export default PercentOaBaratsuki;
