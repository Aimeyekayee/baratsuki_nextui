"use client";
import { useState, useEffect } from "react";
import { Area } from "@ant-design/plots";

const AreaPlot: React.FC = () => {
  const data = [
    {
      period: "07:35",
      value: 18,
    },
    {
      period: "07:40",
      value: 34,
    },
    {
      period: "07:45",
      value: 52,
    },
    {
      period: "07:50",
      value: 69,
    },
    {
      period: "07:55",
      value: 87,
    },
    {
      period: "08:00",
      value: 95,
    },
    {
      period: "08:05",
      value: 124,
    },
    {
      period: "08:10",
      value: 149,
    },
    {
      period: "08:15",
      value: 155,
    },
    {
      period: "08:20",
      value: 182,
    },
    {
      period: "08:25",
      value: 200,
    },
    {
      period: "08:30",
      value: 206,
    },
  ];
  const config = {
    data,
    xField: "period",
    yField: "value",
    label:{style:{
        fontSize:16
    }},
    point: {
      size: 5,
      shape: "point",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };

  return <Area {...config} />;
};

export default AreaPlot;
