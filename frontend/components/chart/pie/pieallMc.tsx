"use client";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import { Pie, PieConfig } from "@ant-design/plots";

interface Data {
  ct_actual: number;
  prod_actual: number;
}
interface DataProps {
  data: Data;
  date: string;
  line_id: number;
  machine_no: string;
  period: string;
  section_code: number;
  shift: string;
  type: string;
  value: number;
  upper?: number;
  lower?: number;
}
interface LineProps {
  parameter: DataProps[];
}

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const PieAllMachine = () => {
  const setColorMc4 = GeneralStore((state) => state.setColorMc4);
  const setClickMCinPieGraph = GeneralStore(
    (state) => state.setClickMCinPieGraph
  );
  const sortPie = GeneralStore((state) => state.sortPie);
  const pieData = [
    {
      machine_name: "MC1",
      pareto_percentage: 2,
      alarm_count: 18,
      recovery_time: 125,
    },
    {
      machine_name: "MC2",
      pareto_percentage: 2,
      alarm_count: 2,
      recovery_time: 138,
    },
    {
      machine_name: "MC3",
      pareto_percentage: 2,
      alarm_count: 7,
      recovery_time: 1034,
    },
    {
      machine_name: "MC4",
      pareto_percentage: 2,
      alarm_count: 15,
      recovery_time: 8554,
    },
  ];
  let sortedData: any[];
  if (sortPie === "1") {
    sortedData = pieData.sort((a: any, b: any) => b.count - a.count);
  } else {
    sortedData = pieData.sort(
      (a: any, b: any) => b.recovery_time - a.recovery_time
    );
  }

  const config: PieConfig = {
    appendPadding: 2,
    data: sortedData,
    padding: [20, 0, 70, 0],
    width: 300, // Set the desired width
    height: 300,

    angleField: sortPie === "1" ? "alarm_count" : "recovery_time",
    colorField: "machine_name",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent, machine_name }) =>
        `${machine_name}\n${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    legend: {
      itemName: {
        formatter: () => "",
      },
      marker: {
        style: {
          fillOpacity: 0,
        },
      },
      title: {
        text:
          sortPie === "1" ? "  Alarm Count Ratio" : "    Reovery time Ratio",
        style: { fontSize: 18 },
      },
      position: "top",
      itemSpacing: 10,
      offsetY: 230,
      pageNavigator: {
        marker: {
          style: {
            // 非激活，不可点击态时的填充色设置
            inactiveFill: "red",
            inactiveOpacity: 0.45,
            // 默认填充色设置
            fill: "red",
            opacity: 0.8,
            size: 10,
          },
        },
        text: {
          style: {
            fill: "#ccc",
            fontSize: 8,
          },
        },
      },
    },
    pieStyle: {
      cursor: "pointer", // Set cursor to pointer on hover
    },
    onReady: (plot) => {
      plot.on("element:click", (evt: any) => {
        const { data, color } = evt.data;
        console.log("Clicked data:", data);
        console.log("Element color:", color);
        setClickMCinPieGraph(data.machine_name);
        setColorMc4(color);
        // if (data.shift === "Day") {
        //   setShift("day");
        // } else {
        //   setShift("night");
        // }
      });
    },
  };

  return <Pie {...config} />;
};

export default PieAllMachine;
