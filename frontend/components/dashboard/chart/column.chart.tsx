"use client";

import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

const ColumnChart: React.FC = () => {
  const series = [
    {
      name: "OA%",
      data: [65.15, 67.25],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar" as const,
      height: 350,
      fontFamily: "",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true,
        colors: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: undefined,
            },
          ],
        },
      },
    },
    colors: ["#F5A524", "#66AAF9"],
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val + "%";
      },
    },
    xaxis: {
      categories: ["Day", "Night"],
      labels: {
        style: {
          // colors: "hsl(var(--nextui-default-800))",
        },
      },
      axisBorder: {
        // color: "hsl(var(--nextui-default-200))",
      },
      axisTicks: {
        // color: "hsl(var(--nextui-default-200))",
      },
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          // colors: "hsl(var(--nextui-default-800))",
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 81,
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
            text: "Challenge rate at 81%",
          },
        },
      ],
    },

    grid: {
      show: true,
      // borderColor: "hsl(var(--nextui-default-200))",
      strokeDashArray: 0,
      position: "back",
    },
    legend: {
      position: "top",
      labels: {
        // colors: "hsl(var(--nextui-default-800))",
      },
    },
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

export default ColumnChart;
