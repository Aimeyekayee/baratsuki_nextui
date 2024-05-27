"use client";
import { useState, useEffect } from "react";
import { Empty, Typography } from "antd";
import VideoPlayer from "../video/video.player";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  Card,
  DropdownTrigger,
  DropdownMenu,
  Tooltip,
  Listbox,
  ListboxItem,
  cn,
  Avatar,
} from "@nextui-org/react";
import { users } from "@/asset/member_data/data";
import { ListboxWrapper } from "../listbox/ListboxWrapper";
import TableMock from "../table/table.alarm";
import AreaPlot from "./areaHour";
import ModalHour from "../modal/modal.hour";
import { GeneralStore } from "@/store/general.store";
import dayjs from "dayjs";

import dynamic from "next/dynamic";
import { Line, LineConfig, G2, Column, ColumnConfig } from "@ant-design/plots";
import { each, findIndex } from "@antv/util";

// import { Liquid } from "@ant-design/charts";
// const Line = dynamic(
//   () => import("@ant-design/plots").then((mod) => mod.Line),
//   { ssr: false }
// );

// import type { LineConfig } from "@ant-design/plots";
import { text } from "stream/consumers";
import { DataBaratsuki, ModalOpenStore } from "@/store/modal.open.store";
import ModalHours from "../modal/modal.hour";
import ListBoxMember from "../listbox/listbox.member";
import axios from "axios";
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
}
interface LineProps {
  parameter: DataProps[];
}

// let Liquid:any

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const ColumnPlotTest: React.FC<LineProps> = ({ parameter }) => {
  const shift = GeneralStore((state) => state.shift);
  const dateStrings = GeneralStore((state) => state.dateStrings);
  const setDataBaratsuki = GeneralStore((state) => state.setDataBaratsuki);
  const currentDate = dayjs().format("YYYY-MM-DD");
  const items = [
    {
      key: "code39",
      label: "Code 39",
    },
    {
      key: "code42",
      label: "Code 42",
    },
    {
      key: "full",
      label: "Full",
    },
  ];
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);
  const isOdd = GeneralStore((state) => state.isOdd);
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
  const targetValues: { [key: number]: number } = {
    70: 1540,
    77: 1694,
    85: 1870,
    100: 2200,
  };
  const baratsukiRateNumber = Number(baratsukiRate);
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
        upper: Math.floor((item.time / 16.5) * targetUpper),
        lower: Math.floor((item.time / 16.5) * targetLower),
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
      periodTime: "13:30 - 14:30",
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
        upper: Math.floor((item.time / 16.5) * targetUpper),
        lower: Math.floor((item.time / 16.5) * targetLower),
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

  console.log(graphData);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const setModalOpen = ModalOpenStore((state) => state.setOpenModal);
  const setDataTooltip = ModalOpenStore((state) => state.setDataTooltip);
  const { InteractionAction, registerInteraction, registerAction } = G2;
  // const parameterWithoutZero = parameter.filter((obj) => obj.value !== 0);
  const ct_target = 16.5;
  const upper = Math.floor((3600 / 16.5) * 1.05);
  const lower = Math.floor((3600 / 16.5) * 0.95);

  G2.registerShape("point", "custom-point", {
    draw(cfg, container) {
      const point: any = {
        x: cfg.x,
        y: cfg.y,
      };
      const group = container.addGroup();
      group.addShape("circle", {
        name: "outer-point",
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || "red",
          opacity: 0.5,
          r: 6,
        },
      });
      group.addShape("circle", {
        name: "inner-point",
        attrs: {
          x: point.x,
          y: point.y,
          fill: cfg.color || "red",
          opacity: 1,
          r: 2,
        },
      });
      return group;
    },
  });

  class CustomMarkerAction extends InteractionAction {
    active() {
      const view = this.getView();
      const evt = this.context.event;

      if (evt.data) {
        // items: 数组对象，当前 tooltip 显示的每条内容
        const { items } = evt.data;
        const pointGeometries = view.geometries.filter(
          (geom) => geom.type === "point"
        );
        each(pointGeometries, (pointGeometry) => {
          each(pointGeometry.elements, (pointElement, idx) => {
            const active =
              findIndex(
                items,
                (item: any) => item.data === pointElement.data
              ) !== -1;
            const [point0, point1] = pointElement.shape.getChildren();

            if (active) {
              // outer-circle
              point0.animate(
                {
                  r: 10,
                  opacity: 0.2,
                },
                {
                  duration: 1800,
                  easing: "easeLinear",
                  repeat: true,
                }
              ); // inner-circle

              point1.animate(
                {
                  r: 6,
                  opacity: 0.4,
                },
                {
                  duration: 800,
                  easing: "easeLinear",
                  repeat: true,
                }
              );
            } else {
              this.resetElementState(pointElement);
            }
          });
        });
      }
    }

    reset() {
      const view = this.getView();
      const points = view.geometries.filter((geom) => geom.type === "point");
      each(points, (point) => {
        each(point.elements, (pointElement) => {
          this.resetElementState(pointElement);
        });
      });
    }

    resetElementState(element: any) {
      const [point0, point1] = element.shape.getChildren();
      point0.stopAnimate();
      point1.stopAnimate();
      const { r, opacity } = point0.get("attrs");
      point0.attr({
        r,
        opacity,
      });
      const { r: r1, opacity: opacity1 } = point1.get("attrs");
      point1.attr({
        r: r1,
        opacity: opacity1,
      });
    }

    getView() {
      return this.context.view;
    }
  }

  registerAction("custom-marker-action", CustomMarkerAction);
  registerInteraction("custom-marker-interaction", {
    start: [
      {
        trigger: "tooltip:show",
        action: "custom-marker-action:active",
      },
    ],
    end: [
      {
        trigger: "tooltip:hide",
        action: "custom-marker-action:reset",
      },
    ],
  });
  function getModifiedContent(period: string, value: number): string {
    switch (period) {
      case isOdd ? "09:30 - 09:40" : "09:20 - 09:30":
      case isOdd ? "11:15 - 12:15" : "11:30 - 12:30":
      case isOdd ? "14:30 - 14:40" : "14:20 - 14:30":
      case "21:30 - 21:40":
      case isOdd ? "23:15 - 00:05" : "23:30 - 00:20":
      case "02:30 - 02:50":
      case "04:30 - 04:50":
      case "16:30 - 16:50":
        return "Brake";
      default:
        return value.toString();
    }
  }

  function getModifiedCursor(period: string): string {
    switch (period) {
      case isOdd ? "09:30 - 09:40" : "09:20 - 09:30":
      case isOdd ? "11:15 - 12:15" : "11:30 - 12:30":
      case isOdd ? "14:30 - 14:40" : "14:20 - 14:30":
      case "21:30 - 21:40":
      case isOdd ? "23:15 - 00:05" : "23:30 - 00:20":
      case "02:30 - 02:50":
      case "04:30 - 04:50":
      case "16:30 - 16:50":
        return "default";
      default:
        return "pointer";
    }
  }

  function getFill(
    period: string,
    value: number,
    upper: any,
    lower: any
  ): string {
    switch (period) {
      case isOdd ? "09:30 - 09:40" : "09:20 - 09:30":
      case isOdd ? "11:15 - 12:15" : "11:30 - 12:30":
      case isOdd ? "14:30 - 14:40" : "14:20 - 14:30":
      case "21:30 - 21:40":
      case isOdd ? "23:15 - 00:05" : "23:30 - 00:20":
      case "02:30 - 02:50":
      case "04:30 - 04:50":
      case "16:30 - 16:50":
        return "black";
      default:
        return value >= lower && value <= upper
          ? "green"
          : value > upper
          ? "#0B60B0"
          : "rgba(255,0,0,0.7)";
    }
  }
  //!brake หาย
  const annotations142: any[] = graphData.map((point) => ({
    type: "text",
    content: getModifiedContent(point.period, point.value),
    position: (xScale: any, yScale: any) => {
      const content = getModifiedContent(point.period, point.value);
      if (showGap === "on" && content !== "Brake") {
        return ["0", "0"];
      } else {
        return [
          `${xScale.scale(point.period.toString()) * 100}%`,
          `${(1 - yScale.value.scale(point.value)) * 100 - 5}%`,
        ];
      }
    },
    style: {
      textAlign: "center",
      fill: "white",
      cursor: getModifiedCursor(point.period),
      fontSize: 22,
    },
    offsetY: -4,
    background: {
      padding: 10,
      style: {
        z: 0,
        radius: 17,
        cursor: getModifiedCursor(point.period),
        fill: getFill(point.period, point.value, point.upper, point.lower),
      },
    },
  }));

  const OffsetX = (graphData: DataProps[]): number => {
    console.log(graphData.length);
    if (graphData.length === 1) {
      return -60; // Or any default number value you prefer
    } else if (graphData.length === 2) {
      return -375; // Or any default number value you prefer
    } else if (graphData.length === 3) {
      return -252; // Or any default number value you prefer
    } else if (graphData.length === 4) {
      return -188; // Or any default number value you prefer
    } else if (graphData.length === 5) {
      return -150; // Or any default number value you prefer
    } else if (graphData.length === 6) {
      return -125; // Or any default number value you prefer
    } else if (graphData.length === 7) {
      return -71; // Or any default number value you prefer
    } else if (graphData.length === 8) {
      return -54; // Or any default number value you prefer
    } else if (graphData.length === 9) {
      return -55; // Or any default number value you prefer
    } else if (graphData.length === 10) {
      return -43; // Or any default number value you prefer
    } else if (graphData.length === 11) {
      return -49; // Or any default number value you prefer
    } else if (graphData.length === 12) {
      return -62; // Or any default number value you prefer
    } else if (graphData.length === 13) {
      return -37; // Or any default number value you prefer
    } else if (graphData.length === 14) {
      return -31; // Or any default number value you prefer
    }

    return -60;
  };

  const annotationsLower: any[] = graphData
    .map((update, index, array) => {
      const matchingPeriod = period.find(
        (periodItem) => periodItem.periodTime === update.period
      );
      if (matchingPeriod && matchingPeriod.lower !== 0) {
        const nextUpdate = array[index + 1];
        return {
          type: "line",
          start: [update.period, matchingPeriod.lower],
          end: nextUpdate
            ? [nextUpdate.period, matchingPeriod.lower]
            : [update.period, matchingPeriod.lower],
          offsetX: OffsetX(graphData),
          text: {
            content: `${matchingPeriod.lower}`,
            offsetY: 1,
            position: "right",
            style: {
              textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              fill: "rgba(86, 191, 150, 1)",
              textBaseline: "top",
            },
          },
          style: {
            stroke: "rgba(86, 191, 150, 1)",
            lineDash: [4, 4],
            lineWidth: 2.5,
          },
        };
      }
      return null; // Return null for periods without matching or zero lower values
    })
    .filter((annotation) => annotation !== null);

  // Modify the last object in annotationsLower array
  if (annotationsLower.length > 1) {
    const lastAnnotation = annotationsLower[annotationsLower.length - 1];
    lastAnnotation.start[0] =
      annotationsLower[annotationsLower.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsLower[annotationsLower.length - 2].end[0];
    if (graphData.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (graphData.length === 3) {
      lastAnnotation.offsetX = 252;
    } else if (graphData.length === 4) {
      lastAnnotation.offsetX = 560;
    } else if (graphData.length === 5) {
      lastAnnotation.offsetX = 452;
    } else if (graphData.length === 6) {
      lastAnnotation.offsetX = 128;
    } else if (graphData.length === 7) {
      lastAnnotation.offsetX = 215;
    } else if (graphData.length === 8) {
      lastAnnotation.offsetX = 165;
    } else if (graphData.length === 9) {
      lastAnnotation.offsetX = 60;
    } else if (graphData.length === 10) {
      lastAnnotation.offsetX = 130;
    } else if (graphData.length === 11) {
      lastAnnotation.offsetX = 50;
    } else if (graphData.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (graphData.length === 13) {
      lastAnnotation.offsetX = 39;
    } else if (graphData.length === 14) {
      lastAnnotation.offsetX = 33;
    }
  }

  const annotationsUpper: any[] = graphData
    .map((update, index, array) => {
      const matchingPeriod = period.find(
        (periodItem) => periodItem.periodTime === update.period
      );
      if (matchingPeriod && matchingPeriod.lower !== 0) {
        const nextUpdate = array[index + 1];
        return {
          type: "line",
          start: [update.period, matchingPeriod.upper],
          end: nextUpdate
            ? [nextUpdate.period, matchingPeriod.upper]
            : [update.period, matchingPeriod.upper],
          offsetX: OffsetX(graphData),
          text: {
            content: `${matchingPeriod.upper}`,
            offsetY: -12,
            position: "right",
            style: {
              textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              fill: "rgba(86, 191, 150, 1)",
              textBaseline: "top",
            },
          },
          style: {
            stroke: "rgba(86, 191, 150, 1)",
            lineDash: [4, 4],
            lineWidth: 2.5,
          },
        };
      }
      return null; // Return null for periods without matching or zero lower values
    })
    .filter((annotation) => annotation !== null);

  // Modify the last object in annotationsLower array
  if (annotationsUpper.length > 1) {
    const lastAnnotation = annotationsUpper[annotationsUpper.length - 1];
    lastAnnotation.start[0] =
      annotationsUpper[annotationsUpper.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsUpper[annotationsUpper.length - 2].end[0];
    if (graphData.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (graphData.length === 3) {
      lastAnnotation.offsetX = 252;
    } else if (graphData.length === 4) {
      lastAnnotation.offsetX = 560;
    } else if (graphData.length === 5) {
      lastAnnotation.offsetX = 452;
    } else if (graphData.length === 6) {
      lastAnnotation.offsetX = 128;
    } else if (graphData.length === 7) {
      lastAnnotation.offsetX = 215;
    } else if (graphData.length === 8) {
      lastAnnotation.offsetX = 165;
    } else if (graphData.length === 9) {
      lastAnnotation.offsetX = 60;
    } else if (graphData.length === 10) {
      lastAnnotation.offsetX = 130;
    } else if (graphData.length === 11) {
      lastAnnotation.offsetX = 50;
    } else if (graphData.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (graphData.length === 13) {
      lastAnnotation.offsetX = 39;
    } else if (graphData.length === 14) {
      lastAnnotation.offsetX = 33;
    }
  }

  const annotationsRegion: any[] = graphData
    .map((update, index, array) => {
      const matchingPeriod = period.find(
        (periodItem) => periodItem.periodTime === update.period
      );
      if (matchingPeriod && matchingPeriod.lower !== 0) {
        const nextUpdate = array[index + 1];
        return {
          type: "region",
          start: [update.period, matchingPeriod.lower],
          end: nextUpdate
            ? [nextUpdate.period, matchingPeriod.upper]
            : [update.period, matchingPeriod.upper],
          offsetX: OffsetX(graphData),
          style: {
            fill: "#62daab",
            fillOpacity: "0.2",
            // opacity: 1,
          },
        };
      }
      return null; // Return null for periods without matching or zero lower values
    })
    .filter((annotation) => annotation !== null);

  // Modify the last object in annotationsLower array
  if (annotationsRegion.length > 1) {
    const lastAnnotation = annotationsRegion[annotationsRegion.length - 1];
    lastAnnotation.start[0] =
      annotationsRegion[annotationsRegion.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsRegion[annotationsRegion.length - 2].end[0];
    if (graphData.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (graphData.length === 3) {
      lastAnnotation.offsetX = 252;
    } else if (graphData.length === 4) {
      lastAnnotation.offsetX = 560;
    } else if (graphData.length === 5) {
      lastAnnotation.offsetX = 452;
    } else if (graphData.length === 6) {
      lastAnnotation.offsetX = 128;
    } else if (graphData.length === 7) {
      lastAnnotation.offsetX = 215;
    } else if (graphData.length === 8) {
      lastAnnotation.offsetX = 165;
    } else if (graphData.length === 9) {
      lastAnnotation.offsetX = 60;
    } else if (graphData.length === 10) {
      lastAnnotation.offsetX = 130;
    } else if (graphData.length === 11) {
      lastAnnotation.offsetX = 50;
    } else if (graphData.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (graphData.length === 13) {
      lastAnnotation.offsetX = 39;
    } else if (graphData.length === 14) {
      lastAnnotation.offsetX = 33;
    }
  }

  const annotationsArrow: any[] = graphData
    .map((item) => {
      const upper = item.upper ?? 0; // Provide a default value if upper is undefined
      const lower = item.lower ?? 0;
      if (item.value >= lower && item.value <= upper) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start: [item.period, item.value], // Start slightly below ct_actual
          end: [item.period, (upper + lower) / 2], // End slightly above ct_actual
          style: {
            stroke:
              shift === "day"
                ? item.value < lower
                  ? "#FF4D4F"
                  : item.value > upper
                  ? "blue"
                  : "#FF8F8F"
                : "#FF8F8F",
            lineWidth: 2,
            endArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing right
              d: 2,
            },
            startArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing left
              d: 2,
            },
          },
        };
      }
    })
    .filter((annotation) => annotation !== null);

  const generateAnnotations = (processedParameter: any[]) => {
    const annotations: any[] = processedParameter
      .map((item) => {
        const lowerBaratsuki = item.lower;
        const upperBaratsuki = item.upper;
        const target = (lowerBaratsuki + upperBaratsuki) / 2;
        if (item.value >= lowerBaratsuki && item.value <= upperBaratsuki) {
          return null; // Skip periods with zero or invalid ct_value values
        } else {
          const gapContent = `Gap = ${
            item.value < target ? "-" : "+"
          }${Math.abs(Math.floor(target - item.value))} pcs.`;
          const percentContent = `${item.value < target ? "-" : "+"}${(
            Math.abs((target - item.value) / target) * 100
          ).toFixed(2)}%`;
          return [
            {
              type: "text",
              content: gapContent,
              offsetX: 50,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.period) * 100}%`,
                  `${
                    (1 - yScale.value.scale((target + item.value) / 2)) * 100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.value < target
                      ? "#C40C0C"
                      : item.value > target
                      ? "blue"
                      : "#FF8F8F"
                    : "#FF8F8F",
                fontSize: 14,
                fontWeight: "bold",
              },
              background: {
                padding: 10,
                style: {
                  z: 0,
                  radius: 17,
                },
              },
            },
            {
              type: "text",
              content: percentContent,
              offsetX: 35,
              offsetY: 20,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.period) * 100}%`,
                  `${
                    (1 - yScale.value.scale((target + item.value) / 2)) * 100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.value < target
                      ? "#C40C0C"
                      : item.value > target
                      ? "blue"
                      : "#FF8F8F"
                    : "#FF8F8F",
                fontSize: 14,
                fontWeight: "bold",
              },
              background: {
                padding: 10,
                style: {
                  z: 0,
                  radius: 17,
                },
              },
            },
          ];
        }
      })
      .filter((annotation) => annotation !== null)
      .flat(); // Flatten the array of arrays into a single array

    return annotations;
  };
  const annotationsGap: any[] = generateAnnotations(graphData);
  const showGap = GeneralStore((state) => state.showGap);
  let annotaion = [
    ...annotations142,
    ...annotationsLower,
    ...annotationsUpper,
    ...annotationsRegion,
    ...annotationsArrow,
    ...annotationsGap,
  ];
  if (showGap === "off") {
    annotaion = [
      ...annotations142,
      ...annotationsLower,
      ...annotationsUpper,
      ...annotationsRegion,
    ];
  } else {
    annotaion = [
      ...annotations142,
      ...annotationsLower,
      ...annotationsUpper,
      ...annotationsRegion,
      ...annotationsArrow,
      ...annotationsGap,
    ];
  }
  let chart: any;
  console.log(graphData);
  const config: ColumnConfig = {
    data: graphData,
    xField: "period",
    yField: "value",
    columnStyle: {
      cursor: "pointer",
    },
    label:
      showGap === "off"
        ? false
        : { style: { fontSize: 20, fontWeight: "bold" } },
    yAxis: {
      maxLimit: 340,
      title: {
        text: "Pieces per Period",
        style: {
          fontSize: 16,
          // fontWeight: "bold",
          fill: shift === "day" ? "#595959" : "white",
        },
      },
    },
    color: (data: any) => {
      const matchingPeriod = updatedParameter.find(
        (p) => p.period === data.period
      );
      if (matchingPeriod) {
        const value = matchingPeriod.value; // Access value from the found object in updatedParameter
        const lower = matchingPeriod.lower ?? 0;
        const upper = matchingPeriod.upper ?? 0;
        if (value >= lower && value <= upper) {
          return "rgba(98, 218, 171, 0.5)";
        } else if (value <= lower) {
          return "rgba(255, 33, 33, 0.5)";
        } else if (value > upper) {
          return "rgba(99,149,250, 0.5)";
        }
      }
      // Default color if no matching period found
      return "blue";
    },
    xAxis: {
      title: {
        text: "Period",
        style: {
          fontSize: 16,
          // fontWeight: "bold",
          fill: shift === "day" ? "#595959" : "white",
        },
      },
    },
    onReady: (plot: any) => {
      chart = plot.chart; // Store chart instance
      chart.render(); // Make sure to render the chart to access the scales
    },

    annotations: annotaion,
    tooltip: {
      showMarkers: false,
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
        type: "element-highlight-by-color",
      },
      {
        type: "element-link",
      },
    ],
  };

  return (
    <>
      <Column
        {...config}
        onReady={(plot) => {
          plot.chart.on("plot:click", async (evt: any) => {
            const { x, y } = evt;
            const bigDataFromToolItem = plot.chart.getTooltipItems({
              x,
              y,
            });
            console.log(bigDataFromToolItem);
            if (
              bigDataFromToolItem.length > 0 &&
              !excludedTitles.includes(bigDataFromToolItem[0].title)
            ) {
              setDataTooltip(bigDataFromToolItem);
              onOpen();
              try {
                const data: DataBaratsuki = bigDataFromToolItem[0].data;
                const dateP = bigDataFromToolItem[0].data.date;
                const formattedTime = dayjs(dateP).format("HH:mm:ss");
                const matchingInterval = interval.find(
                  (item: any) => item.point === formattedTime
                );
                const timeToSendToAPI = matchingInterval
                  ? matchingInterval.time
                  : null;
                console.log(data);
                const parameter = {
                  section_code: data.section_code,
                  line_id: data.line_id,
                  machine_no: data.machine_no,
                  date: data.date,
                  interval: timeToSendToAPI,
                };
                console.log(parameter);
                const response = await axios(
                  "http://10.122.77.1:8004/get_data_area",
                  {
                    params: parameter,
                  }
                );
                if (response.status === 200) {
                  setDataBaratsuki(response.data);
                }
              } catch (err) {
                console.error(err);
              }
            } else {
            }
          });
        }}
      />
      <ModalHour isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ColumnPlotTest;
