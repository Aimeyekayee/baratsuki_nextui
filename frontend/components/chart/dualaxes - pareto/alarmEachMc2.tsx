"use client";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import { DualAxes, DualAxesConfig } from "@ant-design/plots";

interface AlarmTable {
  key: string;
  alarm_no: number;
  alarm_message: string;
  count: number;
  waiting_time: number;
  recovery_time: number;
}
if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const data: AlarmTable[] = [
  {
    key: "1",
    alarm_no: 100,
    alarm_message: "101_Work None Process",
    count: 2,
    waiting_time: 0,
    recovery_time: 75,
  },
  {
    key: "2",
    alarm_no: 99,
    alarm_message: "100_Slip Ring Run Out Check",
    count: 9,
    waiting_time: 0,
    recovery_time: 10,
  },
  {
    key: "3",
    alarm_no: 11,
    alarm_message: "012_Robot Loader Emergency",
    count: 1,
    waiting_time: 0,
    recovery_time: 15,
  },
  {
    key: "4",
    alarm_no: 3,
    alarm_message: "004_[EX]Air Source Decreased",
    count: 1,
    waiting_time: 0,
    recovery_time: 20,
  },
  {
    key: "5",
    alarm_no: 8,
    alarm_message: "EnterNet Unit0 Fault",
    count: 2,
    waiting_time: 0,
    recovery_time: 5,
  },
];

const AlarmCountEachMC2: React.FC = () => {
  const sortPie = GeneralStore((state) => state.sortPie);
  let sortedData: AlarmTable[];
  let total: number;

  if (sortPie === "1") {
    sortedData = data.sort((a, b) => b.count - a.count);
    total = sortedData.reduce((acc, curr) => acc + curr.count, 0);
  } else {
    sortedData = data.sort((a, b) => b.recovery_time - a.recovery_time);
    total = sortedData.reduce((acc, curr) => acc + curr.recovery_time, 0);
  }

  // Calculate cumulative percentage
  let cumulativePercentage = 0;
  const chartData = sortedData.map((item, index) => {
    const value = sortPie === "1" ? item.count : item.recovery_time;
    cumulativePercentage += (value / total) * 100;
    return {
      ...item,
      cumulativePercentage,
    };
  });

  // Find the maximum count or recovery time
  const max = Math.max(
    ...chartData.map((item) =>
      sortPie === "1" ? item.count : item.recovery_time
    )
  );
  const yField =
    sortPie === "1"
      ? ["count", "cumulativePercentage"]
      : ["recovery_time", "cumulativePercentage"];

  const colorMc4 = GeneralStore((state) => state.colorMc4);
  const config: DualAxesConfig = {
    data: [chartData, chartData],
    legend: {
      title: {
        text: "Alarm Count History By Machine",
        style: { x: 300, y: 0, fontSize: 18 },
      },
      itemName: {
        formatter: (text: string, item: any, index: number) => {
          return text === "count" ? "Alarm Count" : "Pareto Percentage";
        },
      },
      // offsetX: 240,
      layout: "horizontal",
    },
    xField: "alarm_message",
    yField: yField,
    yAxis: {
      count: {
        max: max + 5,
        tickCount: 5,
        title: {
          text: "Alarm Count",
        },
      },
      cumulativePercentage: {
        tickCount: 5,
        title: {
          text: "Pareto Perentage",
        },
        min: 0,
        grid: null,
        nice: false,
      },
    },
    // label: { style: { fontSize: 20, fontWeight: "bold" } },
    // legend: false,
    geometryOptions: [
      {
        geometry: "column",
        label: {},
        color: colorMc4,
      },
      {
        geometry: "line",
        point: {
          shape: "circle",
          size: 4,
          style: {
            opacity: 0.5,
            stroke: "#5AD8A6",
            fill: "#fff",
          },
        },
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
    annotations: {
      count: chartData.map((item) => ({
        type: "text",
        position: [item.alarm_message, item.count],
        content: `${item.cumulativePercentage.toFixed(2)}%`,
        style: {
          textAlign: "center",
          fontSize: 12,
          fill: "black",
          opacity: 0.6,
        },
        offsetY: -10,
      })),
    },
    // columnStyle: {
    //   cursor: "pointer",
    // },

    onReady: (plot) => {
      plot.on("element:click", (evt: any) => {
        const { data } = evt.data;
        console.log("Clicked data:", data);
      });
    },
  };

  return <DualAxes {...config} />;
};

export default AlarmCountEachMC2;
