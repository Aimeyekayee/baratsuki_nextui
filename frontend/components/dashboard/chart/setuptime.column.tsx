"use client";

import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";
import { toLocaleFormat } from "@/functions/other/decimal.digit";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

const SetuptimeColumn: React.FC = () => {
  const categories = [
    "24 June",
    "25 June",
    "26 June",
    "20 June",
    "27 June",
    "28 June",
  ];
  const series = [
    {
      name: "Fusing M/C Setup Time",
      data: [1542, 1542, 1542, 1542, 1542, 1542],
    },
    {
      name: "Fan Welding Setup Time",
      data: [1620, 1620, 1620, 1620, 1620, 1620],
    },
    {
      name: "Lathe 1 M/C Setup Time",
      data: [1708, 1708, 1708, 1708, 1708, 1708],
    },
    {
      name: "Lathe 2 M/C Setup Time",
      data: [2324, 2324, 2324, 2324, 2324, 2324],
    },
    {
      name: "R Balance Adj.Setup Time",
      data: [600, 600, 600, 600, 600, 600],
    },
    {
      name: "D Balance Adj.Setup Time",
      data: [600, 600, 600, 600, 600, 600],
    },
  ];
  const setup_target = 10930;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
      },
      fontFamily: "",
      zoom: {
        enabled: true,
      },
    },
    title: {
      text: "Setup time Loss",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    annotations: {
      yaxis: [
        {
          y: 10930,
          borderColor: "#1890ff",
          borderWidth: 2,
          strokeDashArray: 0,
          label: {
            borderColor: "#1890ff",
            offsetX: -5,
            style: {
              color: "#fff",
              background: "#1890ff",
              fontSize: "0.75rem",
            },
            text: `Target Setup ${toLocaleFormat(setup_target)} sec.`,
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        // horizontal: true,
        borderRadius: 1,
        borderRadiusApplication: "end", // 'around', 'end'
        borderRadiusWhenStacked: "last", // 'all', 'last'
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      max: 12000,
      labels: {
        style: {
          colors: "hsl(var(--nextui-default-800))",
        },
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
    colors: ["#FF4500", "#FFD700", "#1E90FF", "#D8BFD8", "#FFA500", "#32CD32"],
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={"100%"}
      width={"100%"}
    />
  );
};

export default SetuptimeColumn;
