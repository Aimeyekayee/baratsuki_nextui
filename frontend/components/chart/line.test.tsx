"use client";
import { useState, useEffect } from "react";
import { Empty, Typography } from "antd";
import VideoPlayer from "../video/video.player";
import { updateParamMoc, graphDataMock } from "./datamock";
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
import { Line, LineConfig, G2 } from "@ant-design/plots";
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

// let Liquid:any

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
  console.log(document.location.href);
}
const LinePlotTest: React.FC<LineProps> = ({ parameter }) => {
  console.log(parameter);
  const dateStrings = GeneralStore((state) => state.dateStrings);
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
  const formattedData = parameter.map((entry) => {
    const period = entry.period.slice(0, -3); // Remove the last three characters (":00")
    return { ...entry, period };
  });
  const dayShiftTimes = [
    "07:35",
    "08:30",
    "09:40",
    "09:50",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:40",
    "14:50",
    "15:30",
    "16:30",
    "16:50",
    "17:50",
    "19:20",
  ];

  const nightShiftTimes = [
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
  const period = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
      upper: 200,
      lower: 140,
    },
    {
      periodTime: "08:30 - 09:40",
      time: 4200,
      status: 1,
      upper: 255,
      lower: 178,
    },
    { periodTime: "09:40 - 09:50", time: 600, status: 2, upper: 0, lower: 0 },
    {
      periodTime: "09:50 - 10:30",
      time: 2400,
      status: 1,
      upper: 145,
      lower: 102,
    },
    {
      periodTime: "10:30 - 11:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    { periodTime: "11:30 - 12:30", time: 3600, status: 3, upper: 0, lower: 0 },
    {
      periodTime: "12:30 - 13:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "13:30 - 14:40",
      time: 4200,
      status: 1,
      upper: 255,
      lower: 178,
    },
    { periodTime: "14:40 - 14:50", time: 600, status: 2, upper: 0, lower: 0 },
    {
      periodTime: "14:50 - 15:30",
      time: 2400,
      status: 1,
      upper: 145,
      lower: 102,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2, upper: 0, lower: 0 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
      upper: 327,
      lower: 229,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
      status: 1,
      upper: 200,
      lower: 140,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2, upper: 0, lower: 0 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
      upper: 182,
      lower: 127,
    },
    {
      periodTime: "22:30 - 23:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    { periodTime: "23:30 - 00:20", time: 3000, status: 3, upper: 0, lower: 0 },
    {
      periodTime: "00:20 - 01:30",
      time: 4200,
      status: 1,
      upper: 255,
      lower: 178,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2, upper: 0, lower: 0 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
      upper: 145,
      lower: 102,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2, upper: 0, lower: 0 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
      upper: 218,
      lower: 153,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
      upper: 327,
      lower: 229,
    },
  ];

  const interval = [
    {
      point: "08:30:00",
      time: "55 minutes",
    },
    {
      point: "09:40:00",
      time: "1 hour 10 minutes",
    },
    {
      point: "09:50:00",
      time: "10 minutes",
    },
    {
      point: "10:30:00",
      time: "40 minutes",
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
      point: "14:40:00",
      time: "1 hour 10 minutes",
    },
    {
      point: "14:50:00",
      time: "10 minutes",
    },
    {
      point: "15:30:00",
      time: "40 minutes",
    },
    {
      point: "08:30:00",
      time: "55 minutes",
    },
    {
      point: "08:30:00",
      time: "55 minutes",
    },
  ];
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

  //   const graphData = updatedParameter?.map((update) => {
  //     const matchingPeriod = period.find(
  //       (periodItem) => periodItem.periodTime === update.period
  //     );
  //     if (matchingPeriod) {
  //       update.upper = matchingPeriod.upper;
  //       update.lower = matchingPeriod.lower;
  //     }
  //     return update; // Return the updated object
  //   });
  //   console.log(graphData);

  // console.log("updatedParameter", updatedParameter);

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
      case "09:40 - 09:50":
      case "11:30 - 12:30":
      case "14:40 - 14:50":
      case "21:30 - 21:40":
      case "23:30 - 00:20":
      case "02:30 - 02:50":
      case "04:30 - 04:50":
      case "16:30 - 16:50":
        return "Brake";
      default:
        return value.toString();
    }
  }

  function getFill(
    period: string,
    value: number,
    upper: any,
    lower: any
  ): string {
    switch (period) {
      case "09:40 - 09:50":
      case "11:30 - 12:30":
      case "14:40 - 14:50":
      case "21:30 - 21:40":
      case "23:30 - 00:20":
      case "02:30 - 02:50":
      case "04:30 - 04:50":
      case "16:30 - 16:50":
        return "blue";
      default:
        return value >= upper || value <= lower ? "rgba(255,0,0,0.7)" : "green";
    }
  }
  const annotations142: any[] = graphDataMock.map((point) => ({
    type: "text",
    content: getModifiedContent(point.period, point.value),
    position: (xScale: any, yScale: any) => {
      return [
        `${xScale.scale(point.period.toString()) * 100}%`,
        `${(1 - yScale.value.scale(point.value)) * 100 - 5}%`,
      ];
    },
    style: {
      textAlign: "center",
      fill: "white",
      cursor: "pointer",
      fontSize: 22,
    },
    offsetY: -4,
    background: {
      padding: 10,
      style: {
        z: 0,
        radius: 17,
        cursor: "pointer",
        fill: getFill(point.period, point.value, point.upper, point.lower),
      },
    },
  }));

  const OffsetX = (graphData: DataProps[]): number => {
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
      return -108; // Or any default number value you prefer
    } else if (graphData.length === 8) {
      return -94; // Or any default number value you prefer
    } else if (graphData.length === 9) {
      return -84; // Or any default number value you prefer
    } else if (graphData.length === 10) {
      return -75; // Or any default number value you prefer
    } else if (graphData.length === 11) {
      return -69; // Or any default number value you prefer
    } else if (graphData.length === 12) {
      return -62; // Or any default number value you prefer
    } else if (graphData.length === 13) {
      return -58; // Or any default number value you prefer
    } else if (graphData.length === 14) {
      return -54; // Or any default number value you prefer
    }

    return -60;
  };

  const annotationsLower: any[] = graphDataMock
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
          offsetX: OffsetX(graphDataMock),
          text: {
            content: `${matchingPeriod.lower}`,
            offsetY: 1,
            position: "right",
            style: {
              textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              fill: "rgba(34, 137, 255, 1)",
              textBaseline: "top",
            },
          },
          style: {
            stroke: "rgba(34, 137, 255, 1)",
            lineDash: [4, 4],
            lineWidth: 2.5,
          },
        };
      }
      return null; // Return null for periods without matching or zero lower values
    })
    .filter((annotation) => annotation !== null);
  console.log(annotationsLower);

  // Modify the last object in annotationsLower array
  if (annotationsLower.length > 1) {
    const lastAnnotation = annotationsLower[annotationsLower.length - 1];
    lastAnnotation.start[0] =
      annotationsLower[annotationsLower.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsLower[annotationsLower.length - 2].end[0];
    if (graphDataMock.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (graphDataMock.length === 3) {
      lastAnnotation.offsetX = 252;
    } else if (graphDataMock.length === 4) {
      lastAnnotation.offsetX = 560;
    } else if (graphDataMock.length === 5) {
      lastAnnotation.offsetX = 151;
    } else if (graphDataMock.length === 6) {
      lastAnnotation.offsetX = 128;
    } else if (graphDataMock.length === 7) {
      lastAnnotation.offsetX = 326;
    } else if (graphDataMock.length === 8) {
      lastAnnotation.offsetX = 93;
    } else if (graphDataMock.length === 9) {
      lastAnnotation.offsetX = 84;
    } else if (graphDataMock.length === 10) {
      lastAnnotation.offsetX = 225;
    } else if (graphDataMock.length === 11) {
      lastAnnotation.offsetX = 68;
    } else if (graphDataMock.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (graphDataMock.length === 13) {
      lastAnnotation.offsetX = 175;
    } else if (graphDataMock.length === 14) {
      lastAnnotation.offsetX = 53;
    }
  }

  const annotationsUpper: any[] = graphDataMock
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
          offsetX: OffsetX(graphDataMock),
          text: {
            content: `${matchingPeriod.upper}`,
            offsetY: -12,
            position: "right",
            style: {
              textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              fill: "rgba(34, 137, 255, 1)",
              textBaseline: "top",
            },
          },
          style: {
            stroke: "rgba(34, 137, 255, 1)",
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
    if (graphDataMock.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (graphDataMock.length === 3) {
      lastAnnotation.offsetX = 252;
    } else if (graphDataMock.length === 4) {
      lastAnnotation.offsetX = 560;
    } else if (graphDataMock.length === 5) {
      lastAnnotation.offsetX = 151;
    } else if (graphDataMock.length === 6) {
      lastAnnotation.offsetX = 128;
    } else if (graphDataMock.length === 7) {
      lastAnnotation.offsetX = 326;
    } else if (graphDataMock.length === 8) {
      lastAnnotation.offsetX = 93;
    } else if (graphDataMock.length === 9) {
      lastAnnotation.offsetX = 84;
    } else if (graphDataMock.length === 10) {
      lastAnnotation.offsetX = 225;
    } else if (graphDataMock.length === 11) {
      lastAnnotation.offsetX = 68;
    } else if (graphDataMock.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (graphDataMock.length === 13) {
      lastAnnotation.offsetX = 175;
    }else if (graphDataMock.length === 14) {
        lastAnnotation.offsetX = 53;
      }
  }

  const annotationsRegion: any[] = graphDataMock
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
          offsetX: OffsetX(graphDataMock),
          style: {
            fill: "#2289ff",
            fillOpacity: "0.2",
            // opacity: 1,
          },
        };
      }
      return null; // Return null for periods without matching or zero lower values
    })
    .filter((annotation) => annotation !== null);
  console.log(annotationsRegion);

  // Modify the last object in annotationsLower array
  if (annotationsRegion.length > 1) {
    const lastAnnotation = annotationsRegion[annotationsRegion.length - 1];
    lastAnnotation.start[0] =
      annotationsRegion[annotationsRegion.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsRegion[annotationsRegion.length - 2].end[0];
    if (graphDataMock.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (graphDataMock.length === 3) {
      lastAnnotation.offsetX = 252;
    } else if (graphDataMock.length === 4) {
      lastAnnotation.offsetX = 560;
    } else if (graphDataMock.length === 5) {
      lastAnnotation.offsetX = 151;
    } else if (graphDataMock.length === 6) {
      lastAnnotation.offsetX = 128;
    } else if (graphDataMock.length === 7) {
      lastAnnotation.offsetX = 326;
    } else if (graphDataMock.length === 8) {
      lastAnnotation.offsetX = 93;
    } else if (graphDataMock.length === 9) {
      lastAnnotation.offsetX = 84;
    } else if (graphDataMock.length === 10) {
      lastAnnotation.offsetX = 225;
    } else if (graphDataMock.length === 11) {
      lastAnnotation.offsetX = 68;
    } else if (graphDataMock.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (graphDataMock.length === 13) {
      lastAnnotation.offsetX = 175;
    }else if (graphDataMock.length === 14) {
        lastAnnotation.offsetX = 53;
      }
  }

  let chart: any;
  const value = 158;
  const config: LineConfig = {
    data: updateParamMoc,
    xField: "period",
    yField: "value",
    yAxis: { maxLimit: 340 },
    point: {
      size: 5,
      shape: "custom-point",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    onReady: (plot: any) => {
      chart = plot.chart; // Store chart instance
      chart.render(); // Make sure to render the chart to access the scales
    },
    annotations: [
      ...annotations142,
      ...annotationsLower,
      ...annotationsUpper,
      ...annotationsRegion,
    ],
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
        type: "custom-marker-interaction",
      },
    ],
  };

  return (
    <>
      <Line
        {...config}
        onReady={(plot) => {
          plot.chart.on("plot:click", async (evt: any) => {
            const { x, y } = evt;
            const bigDataFromToolItem = plot.chart.getTooltipItems({
              x,
              y,
            });
            console.log(bigDataFromToolItem);
            setDataTooltip(bigDataFromToolItem);
            onOpen();
            // try {
            //   const data: DataBaratsuki = bigDataFromToolItem[0];
            //   const response = await axios(
            //     "http://localhost:8000/get_data_area",
            //     {
            //       params: {
            //         section_code: data.section_code,
            //         line_id: data.line_id,
            //         machine_no: data.machine_no,
            //         date: data.date,
            //       },
            //     }
            //   );
            // } catch (err) {
            //   console.error(err);
            // }
          });
        }}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="full"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-1">
                {dataTooltip[0].data.machine_no}{" "}
                {dataTooltip[0].data.machine_name} : {dataTooltip[0].title}{" "}
                {period.map((periodItem) => {
                  if (periodItem.periodTime === dataTooltip[0].title) {
                    let statusText = "";
                    if (periodItem.status === 1) {
                      statusText = "Working time";
                    } else if (periodItem.status === 2) {
                      statusText = "Rest time";
                    } else if (periodItem.status === 3) {
                      statusText = "Lunch time";
                    }
                    return (
                      <Chip
                        key={periodItem.periodTime}
                        color="warning"
                        variant="flat"
                      >
                        {statusText} {periodItem.time} sec.
                      </Chip>
                    );
                  }
                  return null; // Render nothing if periodTime doesn't match
                })}
              </ModalHeader>
              <ModalBody className="flex flex-row">
                <Card
                  style={{ width: "50%", height: "100%", padding: "1rem" }}
                  shadow="sm"
                  radius="sm"
                  isBlurred
                >
                  <AreaPlot />
                </Card>
                <div
                  className="flex flex-col justify-between gap-4"
                  style={{ width: "50%", height: "100%" }}
                >
                  <div style={{ width: "100%" }} className="flex gap-4">
                    <div style={{ width: "40%", height: "13rem" }}>
                      <TableMock />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold">Person In-Charge</p>
                      <ListBoxMember />
                    </div>
                  </div>
                  <div
                    className="flex justify-between"
                    style={{ width: "100%" }}
                  >
                    <div className="space-y-1">
                      <h4 className="text-medium font-medium">
                        Recording and Highlights
                      </h4>
                      <p className="text-small text-default-400">
                        Click on any period to watch alarm.
                      </p>
                    </div>
                    <Tooltip
                      placement="top-end"
                      content="Choose to Download clip on period"
                    >
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered">Download Video</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Dynamic Actions"
                          items={items}
                        >
                          {(item) => (
                            <DropdownItem
                              key={item.key}
                              color={
                                item.key === "delete" ? "danger" : "default"
                              }
                              className={
                                item.key === "delete" ? "text-danger" : ""
                              }
                            >
                              {item.label}
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </Tooltip>
                  </div>
                  <div style={{ width: "100%", height: "70%" }}>
                    <VideoPlayer />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LinePlotTest;