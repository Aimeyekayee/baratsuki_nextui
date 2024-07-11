"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { ApexOptions } from "apexcharts";
import { IconUsersSVG } from "@/components/icons";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

const OverallOaColumn: React.FC = () => {
  const categories = [
    "Day",
    "Night",
    "Day",
    "Night",
    "Day",
    "Night",
    "Day",
    "Night",
    " Day",
    "Night",
  ];

  const series = [
    {
      name: "OA%",
      data: [59.01, 58.35, 80.3, 40.4, 47.45, 77.4, 68.8, 80.03, 71.18, 80.05],
    },
    {
      name: "Setup Time%",
      data: [5.9, 7, 5, 6, 5, 5, 7, 6, 7, 5],
    },
    {
      name: "BM%",
      data: [20, 22, 5, 30, 27, 7, 14, 5, 12, 5],
    },
    {
      name: "CT Loss%",
      data: [5, 7, 5, 15, 14, 7, 5, 4, 5, 5],
    },
    {
      name: "Other%",
      data: [10, 6, 5, 9, 7, 4, 5, 5, 5, 5],
    },
  ];

  const categorie = ["24 June", "25 June", "26 June", "27 June", "28 June"];

  const serie = [
    {
      name: "OA% Day",
      data: [44, 55, 41, 67, 22],
    },
    {
      name: "OA% Night",
      data: [33, 22, 33, 54, 32],
    },
    {
      name: "Setup Time% Day",
      data: [13, 23, 20, 8, 13],
    },
    {
      name: "Setup Time% Night",
      data: [14, 15, 16, 11, 10],
    },
    {
      name: "BM% Day",
      data: [11, 17, 15, 15, 21],
    },
    {
      name: "BM% Night",
      data: [10, 11, 12, 13, 14],
    },
    {
      name: "Other% Day",
      data: [21, 7, 25, 13, 22],
    },
    {
      name: "Other% Night",
      data: [19, 10, 20, 14, 18],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
      fontFamily: "",
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
    // tooltip: {
    //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //     const value = series[seriesIndex][dataPointIndex];
    //     const category = w.config.xaxis.categories[dataPointIndex];
    //     console.log(w);

    //     return `
    //         <div style="padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 5px; display: flex; flex-direction: column;">
    //           <span style="font-weight: bold;">${category}</span><br/>
    //           <span>OA: ${value}%</span>
    //           <span style="display: flex;">CT. avg: 22.32 sec</span>
    //           <span style="display: flex;">${IconUsersSVG}: 4/5</span>

    //         </div>
    //       `;
    //   },
    // },
    // tooltip: {
    //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //     console.log(series, seriesIndex, dataPointIndex);
    //     return (
    //       '<div class="arrow_box">' +
    //       "<span>" +
    //       series[seriesIndex][dataPointIndex] +
    //       "</span>" +
    //       "</div>"
    //     );
    //   },
    // },
    xaxis: {
      categories: categories,
      group: {
        style: {
          fontSize: "10px",
          fontWeight: 700,
          fontFamily: "",
        },
        groups: [
          { title: "24 June", cols: 2 },
          { title: "25 June", cols: 2 },
          { title: "26 June", cols: 2 },
          { title: "27 June", cols: 2 },
          { title: "28 June", cols: 2 },
        ],
      },
    },
    title: {
      text: "100% Stacked Columns Operation Ratio",
    },

    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 1,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
              fontFamily: "",
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      offsetY: 0,
      fontFamily: "",
    },
    colors: ["#80c484", "#FFD700", "#FFA500", "#9373f5", "#1E90FF"],
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

export default OverallOaColumn;
