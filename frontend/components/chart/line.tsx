"use client";
import { useState, useEffect } from "react";
import { Empty, Typography } from "antd";

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
  const setModalOpen = ModalOpenStore((state)=>state.setOpenModal)
  const { InteractionAction, registerInteraction, registerAction } = G2;
  const parameterWithoutZero = parameter.filter((obj) => obj.value !== 0);
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

  const annotations: any[] = parameterWithoutZero
    .filter((d) => d.type === "actual")
    .map((point) => ({
      type: "text",
      data: [point.period, point.value],
      shape: "badge",
      style: {
        text: point.value.toString(),
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

  const annotations142: any[] = parameterWithoutZero
    .filter((d) => d.type === "actual")
    .map((point) => ({
      type: "text",
      content: point.value.toString(),
      position: (xScale: any, yScale: any) => {
        return [
          `${xScale.scale(point.period.toString()) * 100}%`,
          `${(1 - yScale.value.scale(point.value)) * 100 - 5}%`,
        ];
      },
      style: {
        textAlign: "center",
        fill: "white",
        cursor:"pointer"
      },
      offsetY: -4,

      background: {
        padding: 10,
        style: {
          radius: 17,
          cursor:"pointer",
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
  const config = {
    data: parameterWithoutZero,
    xField: "period",
    yField: "value",
    // colorField: "type",
    // point: {
    //   shapeField: "point",
    //   sizeField: 4,
    // },
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
        type: "line",
        start: ["min", lower],
        end: ["max", lower],
        text: {
          content: `Upper = ${upper}`,
          offsetY: -2,
          position: "right",
          style: {
            textAlign: "right",
            fontSize: 22,
            fill: "rgba(44, 53, 66, 0.45)",
            textBaseline: "bottom",
          },
        },
        style: {
          stroke: "rgba(0, 0, 0, 0.55)",
        },
      }, // 目标值
      {
        type: "line",
        start: ["min", upper],
        end: ["max", upper],
        text: {
          position: "right",
          content: `Lower = ${lower}`,
          offsetY: -2,
          style: {
            textAlign: "right",
            fontSize: 22,
            fill: "rgba(44, 53, 66, 0.45)",
            textBaseline: "bottom",
          },
        },
        style: {
          stroke: "rgba(0, 0, 0, 0.55)",
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

  return parameterWithoutZero.length > 0 ? (
    <Line
      {...config}
      onReady={(plot) => {
        plot.chart.on("plot:click", (evt:any) => {
          const { x, y } = evt;
          console.log(plot.chart.getTooltipItems({ x, y }));
        });
      }}
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
};

export default LinePlot;
