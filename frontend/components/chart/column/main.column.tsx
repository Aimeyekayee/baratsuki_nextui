"use client";
import { useDisclosure } from "@nextui-org/react";

import ModalHour from "../../modal/modal.hour";
import { GeneralStore } from "@/store/general.store";
import dayjs from "dayjs";

import { G2, Column, ColumnConfig } from "@ant-design/plots";
import { each, findIndex } from "@antv/util";
import { DataBaratsuki, ModalOpenStore } from "@/store/modal.open.store";

import axios from "axios";
import {
  BaratsukiResponse,
  MachineDataRaw,
  SearchInputParams,
  SearchRequestDataAreaParams,
} from "@/types/baratsuki.type";
import { OffsetX } from "@/functions/chart/annotations.main.column";
import { useEffect, useState } from "react";
import { requestBaratsukiArea } from "@/action/request.fetch";
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
  zone_number?: number;
}
interface LineProps {
  baratsuki: BaratsukiResponse[];
}

// let Liquid:any

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const ColumnPlotTest: React.FC<LineProps> = ({ baratsuki }) => {
  function transformAndMergeData(data: BaratsukiResponse[]): string[] {
    return data.flatMap((shiftData) =>
      shiftData.data
        .filter((machineData) => machineData.plan_type === "B")
        .map((machineData) => machineData.period)
    );
  }
  const brakePeriod = transformAndMergeData(baratsuki);

  const shift = GeneralStore((state) => state.shift);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const setDataTooltip = ModalOpenStore((state) => state.setDataTooltip);
  const { InteractionAction, registerInteraction, registerAction } = G2;

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

  const parameter = shift === 1 ? baratsuki[0].data : baratsuki[1].data;

  const annotationsLower: any[] = parameter
    .map((update, index, array) => {
      const nextUpdate = array[index + 1];
      if (brakePeriod.includes(update.period)) {
        return null;
      } else {
        return {
          type: "line",
          start: [update.period, update.target_challenge_lower],
          end: nextUpdate
            ? [nextUpdate.period, update.target_challenge_lower]
            : [update.period, update.target_challenge_lower],
          offsetX: OffsetX(parameter),
          text: {
            content: `${update.target_challenge_lower}`,
            offsetY: 1,
            position: "right",
            style: {
              textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              fill: "rgba(24, 144, 255, 1)",
              textBaseline: "top",
            },
          },
          style: {
            stroke: "rgba(24, 144, 255, 1)",
            lineDash: [4, 4],
            lineWidth: 2.5,
          },
        };
      }
    })
    .filter((annotation) => annotation !== null);

  if (annotationsLower.length > 1) {
    const lastAnnotation = annotationsLower[annotationsLower.length - 1];
    lastAnnotation.start[0] =
      annotationsLower[annotationsLower.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsLower[annotationsLower.length - 2].end[0];
    if (parameter.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (parameter.length === 3) {
      lastAnnotation.offsetX = 148;
    } else if (parameter.length === 4) {
      lastAnnotation.offsetX = 330;
    } else if (parameter.length === 5) {
      lastAnnotation.offsetX = 89;
    } else if (parameter.length === 6) {
      lastAnnotation.offsetX = 76;
    } else if (parameter.length === 7) {
      lastAnnotation.offsetX = 215;
    } else if (parameter.length === 8) {
      lastAnnotation.offsetX = 165;
    } else if (parameter.length === 9) {
      lastAnnotation.offsetX = 60;
    } else if (parameter.length === 10) {
      lastAnnotation.offsetX = 130;
    } else if (parameter.length === 11) {
      lastAnnotation.offsetX = 50;
    } else if (parameter.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (parameter.length === 13) {
      lastAnnotation.offsetX = 39;
    } else if (parameter.length === 14) {
      lastAnnotation.offsetX = 50;
    }
  }

  const annotationsUpper: any[] = parameter
    .map((update, index, array) => {
      const nextUpdate = array[index + 1];
      if (brakePeriod.includes(update.period)) {
        return null;
      } else {
        return {
          type: "line",
          start: [update.period, update.target_challenge_upper],
          end: nextUpdate
            ? [nextUpdate.period, update.target_challenge_upper]
            : [update.period, update.target_challenge_upper],
          offsetX: OffsetX(parameter),
          text: {
            content: `${update.target_challenge_upper}`,
            offsetY: -12,
            position: "right",
            style: {
              textAlign: "right",
              fontSize: 12,
              fontWeight: "bold",
              fill: "rgba(24, 144, 255, 1)",
              textBaseline: "top",
            },
          },
          style: {
            stroke: "rgba(24, 144, 255, 1)",
            lineDash: [4, 4],
            lineWidth: 2.5,
          },
        };
      }
    })
    .filter((annotation) => annotation !== null);

  // Modify the last object in annotationsLower array
  if (annotationsUpper.length > 1) {
    const lastAnnotation = annotationsUpper[annotationsUpper.length - 1];
    lastAnnotation.start[0] =
      annotationsUpper[annotationsUpper.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsUpper[annotationsUpper.length - 2].end[0];
    if (parameter.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (parameter.length === 3) {
      lastAnnotation.offsetX = 148;
    } else if (parameter.length === 4) {
      lastAnnotation.offsetX = 330;
    } else if (parameter.length === 5) {
      lastAnnotation.offsetX = 89;
    } else if (parameter.length === 6) {
      lastAnnotation.offsetX = 76;
    } else if (parameter.length === 7) {
      lastAnnotation.offsetX = 215;
    } else if (parameter.length === 8) {
      lastAnnotation.offsetX = 165;
    } else if (parameter.length === 9) {
      lastAnnotation.offsetX = 60;
    } else if (parameter.length === 10) {
      lastAnnotation.offsetX = 130;
    } else if (parameter.length === 11) {
      lastAnnotation.offsetX = 50;
    } else if (parameter.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (parameter.length === 13) {
      lastAnnotation.offsetX = 39;
    } else if (parameter.length === 14) {
      lastAnnotation.offsetX = 50;
    }
  }

  const annotationsRegion: any[] = parameter
    .map((update, index, array) => {
      const nextUpdate = array[index + 1];
      if (brakePeriod.includes(update.period)) {
        return null;
      }
      return {
        type: "region",
        start: [update.period, update.target_challenge_lower],
        end: nextUpdate
          ? [nextUpdate.period, update.target_challenge_upper]
          : [update.period, update.target_challenge_upper],
        offsetX: OffsetX(parameter),
        style: {
          fill: "#1890FF",
          fillOpacity: "0.2",
          // opacity: 1,
        },
      }; // Return null for periods without matching or zero lower values
    })
    .filter((annotation) => annotation !== null);

  // Modify the last object in annotationsLower array
  if (annotationsRegion.length > 1) {
    const lastAnnotation = annotationsRegion[annotationsRegion.length - 1];
    lastAnnotation.start[0] =
      annotationsRegion[annotationsRegion.length - 2].start[0];
    lastAnnotation.end[0] =
      annotationsRegion[annotationsRegion.length - 2].end[0];
    if (parameter.length === 2) {
      lastAnnotation.offsetX = 375;
    } else if (parameter.length === 3) {
      lastAnnotation.offsetX = 148;
    } else if (parameter.length === 4) {
      lastAnnotation.offsetX = 330;
    } else if (parameter.length === 5) {
      lastAnnotation.offsetX = 89;
    } else if (parameter.length === 6) {
      lastAnnotation.offsetX = 76;
    } else if (parameter.length === 7) {
      lastAnnotation.offsetX = 215;
    } else if (parameter.length === 8) {
      lastAnnotation.offsetX = 165;
    } else if (parameter.length === 9) {
      lastAnnotation.offsetX = 60;
    } else if (parameter.length === 10) {
      lastAnnotation.offsetX = 130;
    } else if (parameter.length === 11) {
      lastAnnotation.offsetX = 50;
    } else if (parameter.length === 12) {
      lastAnnotation.offsetX = 65;
    } else if (parameter.length === 13) {
      lastAnnotation.offsetX = 39;
    } else if (parameter.length === 14) {
      lastAnnotation.offsetX = 50;
    }
  }

  function getModifiedContent(period: string, value: number): string {
    if (brakePeriod.includes(period)) {
      return "Brake";
    } else {
      return value.toString();
    }
  }

  function getFill(
    period: string,
    value: number,
    upper: any,
    lower: any
  ): string {
    if (brakePeriod.includes(period)) {
      return "black";
    } else {
      return value >= lower ? "#1890FF" : "rgba(255,0,0,0.7)";
    }
  }

  function getModifiedCursor(period: string): string {
    if (brakePeriod.includes(period)) {
      return "default";
    } else {
      return "pointer";
    }
  }

  function calculateInterval(period: string): string {
    const [start, end] = period.split(" - ").map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return { hours, minutes };
    });

    let startDate = new Date();
    startDate.setHours(start.hours, start.minutes, 0, 0);

    let endDate = new Date();
    endDate.setHours(end.hours, end.minutes, 0, 0);

    // Handle crossing midnight
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") : ""} ${
      minutes > 0 ? minutes + " minute" + (minutes > 1 ? "s" : "") : ""
    }`.trim();
  }

  const annotationsTextBox: any[] = parameter.map((point) => ({
    type: "text",
    content: getModifiedContent(point.period, point.actual_this_period),
    position: (xScale: any, yScale: any) => {
      const content = getModifiedContent(
        point.period,
        point.actual_this_period
      );
      if (content !== "Brake") {
        return [
          `${xScale.scale(point.period.toString()) * 100}%`,
          `${
            (1 - yScale.actual_this_period.scale(point.actual_this_period)) *
              100 -
            5
          }%`,
        ];
      } else {
        return [
          `${xScale.scale(point.period.toString()) * 100}%`,
          `${
            (1 - yScale.actual_this_period.scale(point.actual_this_period)) *
              100 -
            5
          }%`,
        ];
      }
    },
    style: {
      textAlign: "center",
      fill: "white",
      cursor: getModifiedCursor(point.period),
      fontSize: 14,
    },
    offsetY: 5,
    background: {
      padding: 8,
      style: {
        z: 0,
        radius: 12,
        cursor: getModifiedCursor(point.period),
        fill: getFill(
          point.period,
          point.actual_this_period,
          point.target_challenge_upper,
          point.target_challenge_lower
        ),
      },
    },
  }));
  let chart: any;

  const afterFilter = parameter.filter((item) => item.plan_type !== "B");

  const combinedData = [
    ...(baratsuki[0]?.data || []), // Ensures it's an array or defaults to empty array
    ...(baratsuki[1]?.data || []), // Same here
  ];
  const combinedDataFilter = combinedData.filter(
    (item) => item.plan_type !== "B"
  );
  let accumulatedDuration = 0;
  combinedDataFilter.forEach((item) => {
    accumulatedDuration += item.duration;
    const accummulateTarget =
      Math.floor(accumulatedDuration / item.ct_target) *
      (item.challenge_target / 100);
    const accummulateUpper = accummulateTarget * 1.05;
    const accummulateLower = accummulateTarget * 0.95;

    item.accummulate_target = Math.floor(accummulateTarget);
    item.accummulate_upper = Math.floor(accummulateUpper);
    item.accummulate_lower = Math.floor(accummulateLower);
  });

  afterFilter.forEach((item) => {
    accumulatedDuration += item.duration;
    const accummulateTarget =
      Math.floor(accumulatedDuration / item.ct_target) *
      (item.challenge_target / 100);
    const accummulateUpper = accummulateTarget * 1.05;
    const accummulateLower = accummulateTarget * 0.95;

    item.accummulate_target = Math.floor(accummulateTarget);
    item.accummulate_upper = Math.floor(accummulateUpper);
    item.accummulate_lower = Math.floor(accummulateLower);
  });

  const config: ColumnConfig = {
    data: parameter,
    xField: "period",
    yField: "actual_this_period",
    columnStyle: {
      cursor: "pointer",
    },
    yAxis: {
      maxLimit: 300,
      title: {
        text: "Performance  Analysis  per  Hour  (pcs.)",
        style: {
          fontSize: 16,
          // fontWeight: "bold",
          fill: shift === 1 ? "#595959" : "white",
        },
      },
      grid: {
        line: {
          style: {
            opacity: 0.2,
          },
        },
      },
    },
    color: (data: any) => {
      const matchingPeriod = parameter.find((p) => p.period === data.period);
      if (matchingPeriod) {
        const value = matchingPeriod.actual_this_period; // Access value from the found object in updatedParameter
        const lower = matchingPeriod.target_challenge_lower ?? 0;
        if (value >= lower) {
          return "rgba(24, 144, 255, 0.5)";
        } else {
          return "rgba(255, 33, 33, 0.5)";
        }
      }
      return "blue";
    },
    xAxis: {
      label: { style: { fontSize: 11 } },
      title: {
        text: "Period",
        style: {
          fontSize: 16,
          // fontWeight: "bold",
          fill: shift === 1 ? "#595959" : "white",
        },
      },
    },

    annotations: [
      ...annotationsLower,
      ...annotationsUpper,
      ...annotationsRegion,
      ...annotationsTextBox,
    ],
    interactions: [
      {
        type: "element-highlight-by-color",
      },
      {
        type: "element-link",
      },
    ],
    onReady: (plot: any) => {
      chart = plot.chart; // Store chart instance
      chart.render(); // Make sure to render the chart to access the scales
    },
    tooltip: {
      showMarkers: false,
    },
  };

  return (
    <>
      <Column
        {...config}
        onReady={(plot) => {
          plot.on("element:click", async (evt: any) => {
            console.log(shift);
            const elements: MachineDataRaw = evt.data.data;
            console.log(elements.period);
            const interval = calculateInterval(elements.period);
            // console.log(mergedData);
            const matchingElement = combinedDataFilter.find((item) => {
              console.log(combinedData);
              console.log(item); // Log each item being checked
              return item.period === elements.period;
            });
            console.log(matchingElement);
            const params: SearchRequestDataAreaParams = {
              section_code: elements.section_code,
              line_id: elements.line_id,
              machine_no: elements.machine_no,
              date: elements.date,
              interval: interval,
              period: elements.period,
              ct_target: elements.ct_target,
              challenge_rate: elements.challenge_target,
              target_challege_lower: elements.target_challenge_lower,
              target_challege_target: elements.target_challenge,
              target_challege_upper: elements.target_challenge_upper,
              ...(matchingElement && {
                accummulate_target: matchingElement.accummulate_target,
                accummulate_upper: matchingElement.accummulate_upper,
                accummulate_lower: matchingElement.accummulate_lower,
                duration: matchingElement.duration,
                exclusion_time: matchingElement.exclusion_time,
              }),
            };
            console.log(params);
            await requestBaratsukiArea(params);
            onOpen();
          });
        }}
      />
      <ModalHour isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ColumnPlotTest;
