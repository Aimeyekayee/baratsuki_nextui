"use client";
import { useState, useEffect } from "react";
import { Empty, Typography } from "antd";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import AreaPlot from "./areaHour";
import ModalHour from "../modal/modal.hour";

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
import { ModalOpenStore } from "@/store/modal.open.store";
import ModalHours from "../modal/modal.hour";
interface Data {
  ct_actual: number;
  prod_actual: number;
}
interface DataProps {
  data: Data;
  date_working: string;
  line_id: number;
  machine_no: string;
  period: string;
  section_code: number;
  shift: string;
  type: string;
  value: number;
}
interface LineProps {
  parameter: DataProps[];
}

// let Liquid:any

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
  console.log(document.location.href);
}
const LinePlot: React.FC<LineProps> = ({ parameter }) => {
  console.log(parameter);
  
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
    { periodTime: "07:35 - 08:30", time: 3300, status: 1 },
    { periodTime: "08:30 - 09:40", time: 4200, status: 1 },
    { periodTime: "09:40 - 09:50", time: 600, status: 2 },
    { periodTime: "09:50 - 10:30", time: 2400, status: 1 },
    { periodTime: "10:30 - 11:30", time: 3600, status: 1 },
    { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
    { periodTime: "12:30 - 13:30", time: 3600, status: 1 },
    { periodTime: "13:30 - 14:40", time: 4200, status: 1 },
    { periodTime: "14:40 - 14:50", time: 600, status: 2 },
    { periodTime: "14:50 - 15:30", time: 2400, status: 1 },
    { periodTime: "15:30 - 16:30", time: 3600, status: 1 },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    { periodTime: "16:50 - 17:50", time: 3600, status: 1 },
    { periodTime: "17:50 - 19:20", time: 5400, status: 1 },
    { periodTime: "19:35 - 20:30", time: 3300, status: 1 },
    { periodTime: "20:30 - 21:30", time: 3600, status: 1 },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    { periodTime: "21:40 - 22:30", time: 3000, status: 1 },
    { periodTime: "22:30 - 23:30", time: 3600, status: 1 },
    { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
    { periodTime: "00:20 - 01:30", time: 4200, status: 1 },
    { periodTime: "01:30 - 02:30", time: 3600, status: 1 },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    { periodTime: "02:50 - 03:30", time: 2400, status: 1 },
    { periodTime: "03:30 - 04:30", time: 3600, status: 1 },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    { periodTime: "04:50 - 05:50", time: 3600, status: 1 },
    { periodTime: "05:50 - 07:20", time: 5400, status: 1 },
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
  console.log("updatedParameter", updatedParameter);

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

  const annotations: any[] = updatedParameter
    .filter((d) => d.type === "actual")
    .map((point) => ({
      type: "text",
      data: [point.period, point.value],
      shape: "badge",
      style: {
        text: point.value,
        dy: -1,
        markerSize: 30,
        fontWeight: 30,
        fillOpacity: 1,
        fill: "white",
        markerFill:
          point.value >= upper ? "red" : point.value <= lower ? "red" : "green",
        markerFillOpacity: 1,
        // render: () => <p>123</p>,
      },
      tooltip: false,
    }));

  const annotations142: any[] = updatedParameter.map((point) => ({
    type: "text",
    content: point.value,
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
        radius: 17,
        cursor: "pointer",
        fill:
          point.value >= upper
            ? "rgba(255,0,0,0.7)"
            : point.value <= lower
            ? "rgba(255,0,0,0.7)"
            : "green",
      },
    },
  }));

  let chart: any;
  const value = 158;
  const config: LineConfig = {
    data: updatedParameter,
    xField: "period",
    yField: "value",
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
      {
        type: "region",
        start: ["min", lower],
        end: ["max", upper],
        style: {
          fill: "#2289ff",
          fillOpacity: "0.2",
          // opacity: 1,
        },
      },
      {
        type: "line",
        start: ["min", lower],
        end: ["max", lower],
        text: {
          content: `Lower = ${lower}`,
          offsetY: 1,
          position: "right",
          style: {
            textAlign: "right",
            fontSize: 22,
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
      }, // 目标值
      {
        type: "line",
        start: ["min", upper],
        end: ["max", upper],
        text: {
          position: "right",
          content: `Upper = ${upper}`,
          offsetY: -2,
          style: {
            textAlign: "right",
            fontSize: 22,
            fontWeight: "bold",
            fill: "rgba(34, 137, 255, 1)",
            textBaseline: "bottom",
          },
        },
        style: {
          fill: "#2289ff",
          stroke: "rgba(34, 137, 255, 1)",
          lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
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
          plot.chart.on("plot:click", (evt: any) => {
            const { x, y } = evt;
            const bigDataFromToolItem = plot.chart.getTooltipItems({
              x,
              y,
            });
            console.log(bigDataFromToolItem);
            setDataTooltip(bigDataFromToolItem);
            onOpen();
          });
        }}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="5xl"
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
                <AreaPlot />
                <ModalHour />
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

export default LinePlot;
