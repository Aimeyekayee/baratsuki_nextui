import React from "react";
import { Line, LineConfig } from "@ant-design/charts";
import { GeneralStore } from "@/store/general.store";
import dayjs from "dayjs";
import { scale } from "@antv/g2plot/lib/adaptor/common";

interface Data {
  ct_actual: number;
  prod_actual: number;
}
interface DataProps {
  data: Data;
  date_working: string;
  line_id: number;
  machine_no: string;
  machine_name?: string;
  period: string;
  section_code: number;
  shift: string;
  type: string;
  value: number;
  upper?: number;
  lower?: number;
  zone_number?: number;
}
interface LineProps {
  parameter: DataProps[];
  zone_number: number;
}

const PercentOaBaratsuki: React.FC<LineProps> = ({
  parameter,
  zone_number,
}) => {
  console.log("dot param", parameter);

  const shift = GeneralStore((state) => state.shift);
  const dateStrings = GeneralStore((state) => state.dateStrings);
  const setDataBaratsuki = GeneralStore((state) => state.setDataBaratsuki);
  const currentDate = dayjs().format("YYYY-MM-DD");
  const isOdd = GeneralStore((state) => state.isOdd);
  const ctTargetZone1 = GeneralStore((state) => state.ctTargetZone1);
  const ctTargetZone2 = GeneralStore((state) => state.ctTargetZone2);

  const ctTarget = zone_number === 1 ? ctTargetZone1 : ctTargetZone2;
  const formattedData = parameter.map((entry) => {
    const period = entry.period.slice(0, -3); // Remove the last three characters (":00")
    return { ...entry, period };
  });
  const dayShiftTimes1 = [
    "07:35",
    "08:30",
    "09:30",
    "09:40",
    "10:30",
    "11:15",
    "12:15",
    "13:30",
    "14:30",
    "14:40",
    "15:30",
    "16:30",
    "16:50",
    "17:50",
    "19:20",
  ];
  const dayShiftTimes2 = [
    "07:35",
    "08:30",
    "09:20",
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:20",
    "14:30",
    "15:30",
    "16:30",
    "16:50",
    "17:50",
    "19:20",
  ];
  const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
  const excludedTitles1 = [
    "09:30 - 09:40",
    "11:15 - 12:15",
    "14:30 - 14:40",
    "21:30 - 21:40",
    "23:15 - 00:05",
    "02:30 - 02:50",
    "04:30 - 04:50",
    "16:30 - 16:50",
  ];
  const excludedTitles2 = [
    "09:20 - 09:30",
    "11:30 - 12:30",
    "14:20 - 14:30",
    "21:30 - 21:40",
    "23:30 - 00:20",
    "02:30 - 02:50",
    "04:30 - 04:50",
    "16:30 - 16:50",
  ];
  const excludedTitles = isOdd ? excludedTitles1 : excludedTitles2;

  const nightShiftTimes1 = [
    "19:35",
    "20:30",
    "21:30",
    "21:40",
    "22:30",
    "23:15",
    "00:05",
    "01:30",
    "02:30",
    "02:50",
    "03:30",
    "04:30",
    "04:50",
    "05:50",
    "07:20",
  ];

  const nightShiftTimes2 = [
    "19:35",
    "20:30",
    "21:30",
    "21:40",
    "22:30",
    "23:30",
    "00:20",
    "01:30",
    "02:30",
    "02:50",
    "03:30",
    "04:30",
    "04:50",
    "05:50",
    "07:20",
  ];

  const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const targetRealTimeMC1 = GeneralStore((state) => state.targetRealTimeMC1);
  const targetRealTimeMC2 = GeneralStore((state) => state.targetRealTimeMC2);
  const targetNotRealTimeMC1 = GeneralStore(
    (state) => state.targetNotRealTimeMC1
  );
  const targetNotRealTimeMC2 = GeneralStore(
    (state) => state.targetNotRealTimeMC2
  );

  let targetZoneRate: number = 0;
  if (dateStrings !== currentDate) {
    targetZoneRate =
      zone_number === 1 ? targetNotRealTimeMC1 : targetNotRealTimeMC2;
  } else {
    targetZoneRate = zone_number === 1 ? targetRealTimeMC1 : targetRealTimeMC2;
  }

  const targetValues: { [key: number]: number } = {
    77: Math.floor(targetZoneRate * 0.77),
    81: Math.floor(targetZoneRate * 0.81),
    85: Math.floor(targetZoneRate * 0.85),
    100: Math.floor(targetZoneRate * 1),
  };
  const baratsukiRateNumber = Number(baratsukiRate);
  let target: number = targetValues[baratsukiRateNumber] || 0;
  console.log("mine target", target);
  let targetUpper = (baratsukiRateNumber / 100) * 1.05;
  let targetLower = (baratsukiRateNumber / 100) * 0.95;
  const period1 = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "08:30 - 09:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "09:30 - 09:40", time: 600, status: 2 },
    {
      periodTime: "09:40 - 10:30",
      time: 3000,
    },
    {
      periodTime: "10:30 - 11:15",
      time: 2700,
      status: 1,
    },
    { periodTime: "11:15 - 12:15", time: 3600, status: 3 },
    {
      periodTime: "12:15 - 13:30",
      time: 4500,
      status: 1,
    },
    {
      periodTime: "13:30 - 14:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "14:30 - 14:40", time: 600, status: 2 },
    {
      periodTime: "14:40 - 15:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "22:30 - 23:15",
      time: 2700,
      status: 1,
    },
    { periodTime: "23:15 - 00:05", time: 3000, status: 3 },
    {
      periodTime: "00:05 - 01:30",
      time: 5100,
      status: 1,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
    },
  ];
  const period1_aftermap = period1.map((item) => {
    if (item.status === 2 || item.status === 3) {
      return { ...item, upper: 0, lower: 0 };
    } else {
      return {
        ...item,
        upper: Math.floor((item.time / ctTarget) * targetUpper),
        lower: Math.floor((item.time / ctTarget) * targetLower),
      };
    }
  });
  const period2 = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "08:30 - 09:20",
      time: 3000,
      status: 1,
    },
    { periodTime: "09:20 - 09:30", time: 600, status: 2 },
    {
      periodTime: "09:30 - 10:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "10:30 - 11:30",
      time: 3600,
    },
    { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
    {
      periodTime: "12:30 - 13:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "13:30 - 14:20",
      time: 3600,
      status: 1,
    },
    { periodTime: "14:20 - 14:30", time: 600, status: 2 },
    {
      periodTime: "14:30 - 15:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "22:30 - 23:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
    {
      periodTime: "00:20 - 01:30",
      time: 4200,
      status: 1,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
    },
  ];
  const period2_aftermap = period2.map((item: any) => {
    if (item.status === 2 || item.status === 3) {
      return { ...item, upper: 0, lower: 0 };
    } else {
      return {
        ...item,
        upper: Math.floor((item.time / ctTarget) * targetUpper),
        lower: Math.floor((item.time / ctTarget) * targetLower),
      };
    }
  });

  const period = isOdd ? period1_aftermap : period2_aftermap;

  const interval1 = [
    {
      point: "08:30:00",
      time: "55 minutes",
    },
    {
      point: "09:30:00",
      time: "1 hour",
    },
    {
      point: "09:40:00",
      time: "10 minutes",
    },
    {
      point: "10:30:00",
      time: "50 minutes",
    },
    {
      point: "11:15:00",
      time: "45 minutes",
    },
    {
      point: "12:15:00",
      time: "1 hour",
    },
    {
      point: "13:30:00",
      time: "1 hour 15 minutes",
    },
    {
      point: "14:30:00",
      time: "1 hour",
    },
    {
      point: "14:40:00",
      time: "10 minutes",
    },
    {
      point: "15:30:00",
      time: "50 minutes",
    },
    {
      point: "16:30:00",
      time: "1 hour",
    },
    {
      point: "16:50:00",
      time: "20 minutes",
    },
    {
      point: "17:50:00",
      time: "1 hour",
    },
    {
      point: "19:20:00",
      time: "1 hour 30 minutes",
    },
    {
      point: "20:30:00",
      time: "55 minutes",
    },
    {
      point: "21:30:00",
      time: "1 hour",
    },
    {
      point: "21:40:00",
      time: "10 minutes",
    },
    {
      point: "22:30:00",
      time: "50 minutes",
    },
    {
      point: "23:15:00",
      time: "45 minutes",
    },
    {
      point: "01:30:00",
      time: "1 hour 25 minutes",
    },
    {
      point: "02:30:00",
      time: "1 hour",
    },
    {
      point: "03:30:00",
      time: "40 minutes",
    },
    {
      point: "04:30:00",
      time: "1 hour",
    },
    {
      point: "05:50:00",
      time: "1 hour",
    },
    {
      point: "07:20:00",
      time: "1 hour 30 minutes",
    },
  ];
  const interval2 = [
    {
      point: "08:30:00",
      time: "55 minutes",
    },
    {
      point: "09:20:00",
      time: "50 minutes",
    },
    {
      point: "09:30:00",
      time: "10 minutes",
    },
    {
      point: "10:30:00",
      time: "1 hour",
    },
    {
      point: "11:30:00",
      time: "1 hour",
    },
    {
      point: "12:30:00",
      time: "1 hour",
    },
    {
      point: "13:30:00",
      time: "1 hour",
    },
    {
      point: "14:20:00",
      time: "50 minutes",
    },
    {
      point: "14:30:00",
      time: "10 minutes",
    },
    {
      point: "15:30:00",
      time: "1 hour",
    },
    {
      point: "16:30:00",
      time: "1 hour",
    },
    {
      point: "16:50:00",
      time: "20 minutes",
    },
    {
      point: "17:50:00",
      time: "1 hour",
    },
    {
      point: "19:20:00",
      time: "1 hour 30 minutes",
    },
    {
      point: "20:30:00",
      time: "55 minutes",
    },
    {
      point: "21:30:00",
      time: "1 hour",
    },
    {
      point: "21:40:00",
      time: "10 minutes",
    },
    {
      point: "22:30:00",
      time: "50 minutes",
    },
    {
      point: "23:30:00",
      time: "1 hour",
    },
    {
      point: "01:30:00",
      time: "1 hour 10 minutes",
    },
    {
      point: "02:30:00",
      time: "1 hour",
    },
    {
      point: "03:30:00",
      time: "40 minutes",
    },
    {
      point: "04:30:00",
      time: "1 hour",
    },
    {
      point: "05:50:00",
      time: "1 hour",
    },
    {
      point: "07:20:00",
      time: "1 hour 30 minutes",
    },
  ];
  const interval = isOdd ? interval1 : interval2;

  const updatePeriod = (period: string, shift: string): string => {
    let index = -1;
    if (shift === "day") {
      index = dayShiftTimes.indexOf(period);
      if (index !== -1 && index > 0) {
        return `${dayShiftTimes[index - 1]} - ${period}`;
      }
    } else if (shift === "night") {
      index = nightShiftTimes.indexOf(period);
      if (index !== -1 && index > 0) {
        return `${nightShiftTimes[index - 1]} - ${period}`;
      }
    }
    return period;
  };

  const updatedParameter = formattedData.map((item) => ({
    ...item,
    period: updatePeriod(item.period, item.shift),
  }));
  updatedParameter.forEach((item) => {
    if (excludedTitles.includes(item.period)) {
      item.value = 0;
    }
  });

  updatedParameter.forEach((item: any) => {
    const matchingPeriod = period.find(
      (periodItem) => periodItem.periodTime === item.period
    );
    if (matchingPeriod) {
      item.upper = matchingPeriod.upper;
      item.lower = matchingPeriod.lower;
      if (item.value >= item.lower && item.value <= item.upper) {
        item.color = "red";
      } else {
        item.color = "green";
      }
    }
  });

  const periodsRest1 = [
    "09:30 - 09:40",
    "11:15 - 12:15",
    "14:30 - 14:40",
    "16:30 - 16:50",
    "21:30 - 21:40",
    "23:15 - 00:05",
    "02:30 - 02:50",
    "04:30 - 04:50",
  ];
  const periodsRest2 = [
    "09:20 - 09:30",
    "11:30 - 12:30",
    "14:20 - 14:50",
    "16:30 - 16:50",
    "21:30 - 21:40",
    "23:30 - 00:20",
    "02:30 - 02:50",
    "04:30 - 04:50",
  ];
  const periodsRest = isOdd ? periodsRest1 : periodsRest2;
  const graphData = updatedParameter?.map((update) => {
    const matchingPeriod = period.find(
      (periodItem) => periodItem.periodTime === update.period
    );
    if (matchingPeriod) {
      update.upper = matchingPeriod.upper;
      update.lower = matchingPeriod.lower;
    }
    return update; // Return the updated object
  });
  for (let i = 1; i < graphData.length; i++) {
    const currentPeriod = graphData[i].period;
    const currentProdActual = graphData[i].data.prod_actual;
    const previousProdActual = graphData[i - 1].data.prod_actual;

    if (periodsRest.includes(currentPeriod)) {
      graphData[i].value = 0;
    } else {
      graphData[i].value = currentProdActual - previousProdActual;
    }
  }
  //!ทำให้ filter ot ออก (ไม่โชว์จุด ot หหหหหหมายถึงไม่โชว์ point แต่ยังมีข้อมูลอยู่)
  const addTargetOA = graphData.map((item) => {
    if (item.upper !== undefined && item.upper !== 0) {
      return {
        ...item,
        target: Math.round(item.upper / 1.05 / 0.77),
        oa: Number(
          ((item.value / Math.round(item.upper / 1.05 / 0.77)) * 100).toFixed(2)
        ),
      };
    } else {
      return { ...item, target: null, oa: null };
    }
  });
  console.log(addTargetOA);

  const validEntries = addTargetOA.filter(
    (entry: any) => entry.oa !== null && entry.value !== 0
  );
  console.log(validEntries);
  const minOAEntry = validEntries.reduce((min: any, entry: any) => {
    return entry.oa < min.oa ? entry : min;
  }, validEntries[0]);

  console.log(minOAEntry);
  const maxOAEntry = validEntries.reduce((max: any, entry: any) => {
    return entry.oa > max.oa ? entry : max;
  }, validEntries[0]);

  const maxOAPeriod = maxOAEntry.period;
  const maxOAValue = maxOAEntry.oa;
  const minOAPeriod = minOAEntry.period;
  const minOAValue = minOAEntry.oa;

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
    const startPeriod = addTargetOA[startIndex]?.period;
    const endPeriod = addTargetOA[endIndex]?.period;
    const startValue = addTargetOA[startIndex]?.value;
    const endValue = addTargetOA[endIndex]?.value;

    const isInvalidPeriod = (period: string) =>
      period === "16:30 - 16:50" ||
      period === "16:50 - 17:50" ||
      period === "17:50 - 19:20";

    return (
      !(startValue === 0 && isInvalidPeriod(startPeriod)) &&
      !(endValue === 0 && isInvalidPeriod(endPeriod))
    );
  });

  const annotationLine: any[] = filteredIndices.map(
    ([startIndex, endIndex]) => ({
      type: "line",
      start: [addTargetOA[startIndex]?.period, addTargetOA[startIndex]?.oa],
      end: [addTargetOA[endIndex]?.period, addTargetOA[endIndex]?.oa],
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

  const valueUpper = (baratsukiRate: number) => {
    if (baratsukiRate === 77) {
      return 80.2;
    } else if (baratsukiRate === 81) {
      return 84.4;
    } else {
      return 88.39;
    }
  };

  const valueLower = (baratsukiRate: number) => {
    if (baratsukiRate === 77) {
      return 72.42;
    } else if (baratsukiRate === 81) {
      return 76.24;
    } else {
      return 80;
    }
  };
  console.log(addTargetOA);
  const config: LineConfig = {
    data: addTargetOA,
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
        style: { fill: shift === "day" ? "#595959" : "white", fontSize: 16 },
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
      formatter: (datum: any) => {
        if (
          datum.oa === 0 &&
          (datum.period === "16:30 - 16:50" ||
            datum.period === "16:50 - 17:50" ||
            datum.period === "17:50 - 19:20")
        ) {
          return ""; // Hide the label
        }
        return `${datum.oa} %`;
      },
      style: { fill: shift === "day" ? "black" : "white" },
    },
    lineStyle: { fillOpacity: 0, opacity: 0 },
    point: {
      size: 7,
      shape: "circle",
      style: (datum: any) => {
        console.log(datum);
        if (
          datum.oa === 0 &&
          (datum.period === "16:30 - 16:50" ||
            datum.period === "16:50 - 17:50" ||
            datum.period === "17:50 - 19:20")
        ) {
          return { fill: "rgba(255,0,0,0)", stroke: "rgba(255,0,0,0)" }; // Hide the point
        }
        const matchingPeriod = addTargetOA.find(
          (p) => p.period === datum.period
        );
        if (matchingPeriod && matchingPeriod.oa != null) {
          if (matchingPeriod.oa > Number(baratsukiRate)) {
            return { fill: "rgba(24, 144, 255, 1)" };
          } else if (matchingPeriod.oa < Number(baratsukiRate)) {
            if (
              matchingPeriod.lower != null &&
              matchingPeriod.value != null &&
              matchingPeriod.value >= matchingPeriod.lower &&
              matchingPeriod.value < matchingPeriod.lower / 0.95
            ) {
              return { fill: "rgba(24, 144, 255, 1)" };
            } else if (
              matchingPeriod.lower != null &&
              matchingPeriod.value != null &&
              matchingPeriod.value >= matchingPeriod.lower / 0.95
            ) {
              return { fill: "rgba(24, 144, 255, 1)" };
            } else {
              return { fill: "red" };
            }
          }
        } else {
          return { fill: "black" };
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
            `${xScale.scale(minOAPeriod) * 100}%`,
            `${(1 - yScale.oa.scale(minOAValue + 7)) * 100}%`,
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
            `${xScale.scale(maxOAPeriod) * 100}%`,
            `${(1 - yScale.oa.scale(maxOAValue - 8)) * 100}%`,
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
      ...annotationLine,
      {
        type: "line",
        start: ["start", valueUpper(baratsukiRateNumber)],
        end: ["end", valueUpper(baratsukiRateNumber)],
        text: {
          content: `≈ ${valueUpper(baratsukiRateNumber)}%`,
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
        start: ["start", valueLower(baratsukiRateNumber)],
        end: ["end", valueLower(baratsukiRateNumber)],
        text: {
          content: `≈ ${valueLower(baratsukiRateNumber)}%`,
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
      // {
      //   type: "text",
      //   content: "_",
      //   position: ["end", valueLower(baratsukiRateNumber)],
      //   offsetY: -12,
      //   offsetX: -5,
      //   rotate: 0.7,
      //   style: {
      //     fontSize: 42,
      //     fill: "rgba(24, 144, 255, 1)",
      //   },
      // },
      // {
      //   type: "text",
      //   content: "_",
      //   position: ["end", valueLower(baratsukiRateNumber)],
      //   offsetY: -12,
      //   offsetX: -15,
      //   rotate: 0.7,
      //   style: {
      //     fontSize: 42,
      //     fill: "rgba(24, 144, 255, 1)",
      //   },
      // },
      // {
      //   type: "text",
      //   content: "_",
      //   position: ["end", valueLower(baratsukiRateNumber)],
      //   offsetY: -12,
      //   offsetX: -25,
      //   rotate: 0.7,
      //   style: {
      //     fontSize: 42,
      //     fill: "rgba(24, 144, 255, 1)",
      //   },
      // },

      {
        type: "region",
        start: ["start", valueLower(baratsukiRateNumber)],
        end: ["end", valueUpper(baratsukiRateNumber)],
        offsetX: 0,
        style: {
          fill: "#1890FF",
          fillOpacity: 0.15,
          // opacity: 1,
        },
      },
    ],
  };
  return <Line {...config} />;
};

export default PercentOaBaratsuki;
