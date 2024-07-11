// src/ColumnChart.tsx

"use client"; // don't forget this part if you use app dir to mark the whole
// file as client-side components

import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

const TwoLineCompareOAaverage = () => {
  const data_day = [58.03, 80.30, 47.45, 68.80, 71.18];
  const data_night = [58.35, 40.40, 77.40, 80.03, 80.05];
  const minValue = Math.min(...data_day, ...data_night);
  let trueMinValue;

  if (minValue === 0) {
    trueMinValue = 0;
  } else if (minValue > 0) {
    trueMinValue = minValue - 10 < 0 ? 0 : minValue - 10;
  }
  const categories = ["24 June", "25 June", "26 June", "27 June", "28 June"];

  const series = [
    {
      name: "Day",
      data: data_day,
    },
    {
      name: "Night",
      data: data_night,
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      fontFamily: "",
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.05,
      },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      events: {
        click: function (event, chartContext, opts) {
          const seriesIndex = opts.seriesIndex;
          const dataPointIndex = opts.dataPointIndex;
          const selectedValue = series[seriesIndex].data[dataPointIndex];
          const date = categories[dataPointIndex];
          const shift = series[seriesIndex].name;
          const result = { date, shift, oa: selectedValue };
          console.log(result);
        },
        dataPointMouseEnter: function (event) {},
      },
    },
    colors: ["#F5A524", "#66AAF9"],
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val + "%";
      },
      style: {
        fontSize: "1rem",
      },
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "OA% Average each day",
      align: "left",
      style: {
        color: "hsl(var(--nextui-default-800))",
      },
    },
    grid: {
      show: true,
      borderColor: "hsla(var(--nextui-default-100))",
      strokeDashArray: 0,
      position: "back",
    },
    markers: {
      size: 1,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "hsl(var(--nextui-default-800))",
          // fontSize:"5rem"
        },
      },
      axisBorder: {
        color: "hsl(var(--nextui-default-200))",
      },
      axisTicks: {
        color: "hsl(var(--nextui-default-200))",
      },
      title: {
        text: "Date",
        style: {
          color: "hsl(var(--nextui-default-800))",
        },
      },
    },
    yaxis: {
      title: {
        text: "OA%",
        style: {
          color: "hsl(var(--nextui-default-800))",
        },
      },
      min: trueMinValue,
      max: 100,
      labels: {
        style: {
          colors: "hsl(var(--nextui-default-800))",
        },
      },
    },

    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
      labels: {
        colors: "hsl(var(--nextui-default-800))",
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full h-full py-4">
      <div className="w-full h-full">
        <Chart
          options={options}
          series={series}
          type="line"
          height={"100%"}
          width={"100%"}
        />
      </div>
    </div>
  );
};

export default TwoLineCompareOAaverage;
