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
    count: 3,
    waiting_time: 0,
    recovery_time: 125.0,
  },
  {
    key: "2",
    alarm_no: 99,
    alarm_message: "100_Slip Ring Run Out Check",
    count: 5,
    waiting_time: 0,
    recovery_time: 138.0,
  },
  {
    key: "3",
    alarm_no: 11,
    alarm_message: "012_Robot Loader Emergency",
    count: 16,
    waiting_time: 0,
    recovery_time: 1034,
  },
  {
    key: "4",
    alarm_no: 3,
    alarm_message: "004_[EX]Air Source Decreased",
    count: 4,
    waiting_time: 0,
    recovery_time: 8554,
  },
  {
    key: "5",
    alarm_no: 8,
    alarm_message: "EnterNet Unit0 Fault",
    count: 15,
    waiting_time: 0,
    recovery_time: 39.6,
  },
  {
    key: "6",
    alarm_no: 16,
    alarm_message: "017_Ethernet/IP Unit",
    count: 12,
    waiting_time: 0,
    recovery_time: 39.6,
  },
];

const sortedData = data.sort((a, b) => b.count - a.count);

// Calculate the total count
const totalCount = sortedData.reduce((acc, curr) => acc + curr.count, 0);

// Calculate cumulative percentage
let cumulativePercentage = 0;
const chartData = sortedData.map((item, index) => {
  cumulativePercentage += (item.count / totalCount) * 100;
  return {
    ...item,
    cumulativePercentage,
  };
});
console.log(chartData);
const maxCount = Math.max(...chartData.map((item) => item.count));
const AlarmCountColumn: React.FC = () => {
  const config: DualAxesConfig = {
    data: [chartData, chartData],
    xField: "alarm_message",
    yField: ["count", "cumulativePercentage"],
    yAxis: {
      count: {
        tickCount: 5,
      },
      cumulativePercentage: {
        tickCount: 5,
        min: 0,
        grid: null,
      },
    },
    // label: { style: { fontSize: 20, fontWeight: "bold" } },
    // legend: false,
    geometryOptions: [
      {
        geometry: "column",
      },
      {
        geometry: "line",
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
    // columnStyle: {
    //   cursor: "pointer",
    // },
    onReady: (plot) => {
      plot.on("element:click", (evt: any) => {
        const { data } = evt.data;
        console.log("Clicked data:", data);
      });
    },
    // seriesField: "actual",
  };

  return <DualAxes {...config} />;
};

export default AlarmCountColumn;
