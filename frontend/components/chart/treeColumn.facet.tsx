"use client";
import { useState, useEffect } from "react";
import { Mix, MixConfig, G2 } from "@ant-design/plots";

const MixColumn: React.FC = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/antfincdn/HkxWvFrZuC/association-data.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const data1 = {
    pie: [
      {
        machine_name: "MC1",
        pareto_percentage: 2,
        alarm_count: 3,
      },
      {
        machine_name: "MC2",
        pareto_percentage: 2,
        alarm_count: 4,
      },
      {
        machine_name: "MC3",
        pareto_percentage: 2,
        alarm_count: 1,
      },
      {
        machine_name: "MC4",
        pareto_percentage: 2,
        alarm_count: 2,
      },
    ],
    column: [
      {
        pareto_percentage: 33,
        machine_name: "华东",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 238477,
      },
      {
        pareto_percentage: 33,
        machine_name: "中南",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 97700,
      },
      {
        pareto_percentage: 33,
        machine_name: "东北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 133526,
      },
      {
        pareto_percentage: 33,
        machine_name: "华北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 82014,
      },
      {
        pareto_percentage: 33,
        machine_name: "西南",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 104907,
      },
      {
        pareto_percentage: 33,
        machine_name: "西北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 42752,
      },
      {
        pareto_percentage: 33,
        machine_name: "东北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 77127,
      },
      {
        pareto_percentage: 33,
        machine_name: "华北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 192508,
      },
      {
        pareto_percentage: 33,
        machine_name: "华东",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 154431,
      },
      {
        pareto_percentage: 33,
        machine_name: "西北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 45222,
      },
      {
        pareto_percentage: 33,
        machine_name: "中南",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 72768,
      },
      {
        pareto_percentage: 33,
        machine_name: "西南",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 212498,
      },
      {
        pareto_percentage: 33,
        machine_name: "东北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 171283,
      },
      {
        pareto_percentage: 33,
        machine_name: "华北",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 140033,
      },
      {
        pareto_percentage: 33,
        machine_name: "华东",
        alarm_message: "asd",
        alarm_no: "adas",
        alarm_count: 297862,
      },
    ],
  };
  G2.registerInteraction("custom-association-filter", {
    showEnable: [
      {
        trigger: "element:mouseenter",
        action: "cursor:pointer",
      },
      {
        trigger: "element:mouseleave",
        action: "cursor:default",
      },
    ],
    start: [
      {
        trigger: "element:click",
        action: (context) => {
          const { view, event } = context; // 获取第二个 view
          const view1 = view.parent.views[1];
          view1.filter("column", (d) => d === event.data?.data.column);
          view1.render(true);
        },
      },
    ],
    end: [
      {
        trigger: "element:dblclick",
        action: (context) => {
          const { view } = context; // 获取第二个 view

          const view1 = view.parent.views[1];
          view1.filter("column", null);
          view1.render(true);
        },
      },
    ],
  });
  if (!Object.keys(data).length) {
    return null;
  }
  const config: MixConfig = {
    // Disable tooltip on the chart, enable tooltip on sub-views
    tooltip: false,
    plots: [
      {
        type: "pie",
        region: {
          start: {
            x: -0.1,
            y: 0,
          },
          end: {
            x: 0.48,
            y: 1,
          },
        },
        options: {
          data: data1.pie,
          angleField: "alarm_count",
          colorField: "machine_name",
          tooltip: {
            showMarkers: false,
          },
          radius: 0.6,
          label: {
            type: "inner",
            formatter: "{name}",
            offset: "-15%",
          },
          interactions: [
            {
              type: "element-highlight",
            },
            {
              type: "custom-association-filter",
            },
          ],
        },
      },
      {
        type: "column",
        region: {
          start: {
            x: 0.4,
            y: 0,
          },
          end: {
            x: 1,
            y: 1,
          },
        },
        options: {
          data: data1.pie,
          xField: "machine_name",
          yField: "alarm_count",
          seriesField: "machine_name",
          columnStyle: {
            radius: [2, 2, 0, 0],
          },
          meta: {
            time: {
              range: [0, 1],
            },
          },
          tooltip: {
            showCrosshairs: true,
            shared: true,
          },
        },
      },
    ],
  };

  return <Mix {...config} />;
};

export default MixColumn;
