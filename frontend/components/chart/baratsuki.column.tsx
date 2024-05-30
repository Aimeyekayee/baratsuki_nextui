"use client";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import { Column, ColumnConfig } from "@ant-design/plots";
import dayjs from "dayjs";

interface Data {
  ct_actual: number;
  prod_actual: number;
}
interface DataProps {
  data: Data;
  date: string;
  line_id: number;
  machine_no: string;
  period: string;
  section_code: number;
  shift: string;
  type: string;
  value: number;
  upper?: number;
  lower?: number;
  ot?: boolean;
}
interface UnlogicRealtime {
  shift: string;
  actual: number;
}
interface LineProps {
  parameter: DataProps[];
  parameter_static_realtime: UnlogicRealtime[];
}

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}
const BaratsukiShiftColumn: React.FC<LineProps> = ({
  parameter,
  parameter_static_realtime,
}) => {
  const dateStrings = GeneralStore((state) => state.dateStrings);

  const currentDate = dayjs().format("YYYY-MM-DD");
  const isConnected = MQTTStore((state) => state.isConnected);
  console.log(isConnected);
  const targetNotRealTimeMC1 = GeneralStore(
    (state) => state.targetNotRealTimeMC1
  );
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const setShift = GeneralStore((state) => state.setShift);
  const shift = GeneralStore((state) => state.shift);
  console.log("para", parameter);

  type TargetKeys = 77 | 81 | 85 | 100;

  const calculateTargetValues = (
    numberValue: number
  ): { [key in TargetKeys]: number } => ({
    77: Math.floor(numberValue * 0.77),
    81: Math.floor(numberValue * 0.81),
    85: Math.floor(numberValue * 0.85),
    100: Math.floor(numberValue * 1),
  });

  const baratsukiRateNumber = Number(baratsukiRate) as TargetKeys;

  const processedParameter = parameter.map((item: DataProps) => {
    const time = item.date.split("T")[1];
    const shift = time === "19:20:00" ? "Day" : "Night";

    const numberValue = item.ot ? 2200 : 1654; // Define numberValue based on 'ot' key
    const targetValues = calculateTargetValues(numberValue);

    return {
      ...item,
      shift,
      actual: item.data.prod_actual,
      target: targetValues[baratsukiRateNumber], // Use the dynamically calculated target values
      upperBaratsuki: Math.floor(targetValues[baratsukiRateNumber] * 1.05),
      lowerBaratsuki: Math.floor(targetValues[baratsukiRateNumber] * 0.95),
    };
  });

  console.log(processedParameter);
  //!กรณีนี้เป็นกรณีที่ตั้ง target ที่ท้ายไลน์อย่างเดียว ไม่ได้เป็น target ตายตัว
  //!ถ้าในอนาคตเป็น mc อื่นที่ไม่ใช่ท้ายไลน์ จะต้องมี target ของงตัวเอง ในกรณีนั้น
  //!อาจจะต้อง fetch ข้อมูลมาใหม่ทั้งหมดในช่วง shift เพื่อมาคำนวณ target การทำงาน

  const annotationsArrow: any[] = processedParameter
    .map((item) => {
      if (
        item.actual >= item.lowerBaratsuki &&
        item.actual <= item.upperBaratsuki
      ) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start: [item.shift, item.actual], // Start slightly below ct_actual
          end: [item.shift, item.target], // End slightly above ct_actual
          offsetX: -40,
          style: {
            stroke: "#FF4D4F",
            lineWidth: 2,
            opacity: 0.5,
            fillOpactiy: 0.5,
            strokeOpacity: 0.5,
            endArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing right
              d: -1,
            },
            startArrow: {
              path: "M 0,0 L 8,4 L 8,-4 Z", // Arrow pointing left
              d: -1,
            },
          },
        };
      }
    })
    .filter((annotation) => annotation !== null);

  const generateAnnotations = (processedParameter: any[]) => {
    const annotations: any[] = processedParameter
      .map((item) => {
        if (
          item.actual >= item.lowerBaratsuki &&
          item.actual <= item.upperBaratsuki
        ) {
          return null; // Skip periods with zero or invalid actual values
        } else {
          const gapContent = `Gap = ${item.actual < item.target ? "-" : "+"}${
            item.target - item.actual
          } pcs.`;
          const percentContent = `${item.actual < item.target ? "-" : "+"}${(
            Math.abs((item.target - item.actual) / item.target) * 100
          ).toFixed(2)}%`;
          return [
            {
              type: "text",
              content: gapContent,
              offsetX: 70,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.shift) * 100 - 18}%`,
                  `${
                    (1 - yScale.actual.scale((item.target + item.actual) / 2)) *
                    100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  item.shift === "day"
                    ? item.actual < item.target
                      ? "#C40C0C"
                      : item.actual > item.target
                      ? "blue"
                      : "#FF8F8F"
                    : "#FF8F8F",
                fontSize: 10,
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
              offsetX: 45,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.shift) * 100 - 16}%`,
                  `${
                    (1 -
                      yScale.actual.scale((item.target + item.actual) / 2.1)) *
                    100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  item.shift === "day"
                    ? item.actual < item.target
                      ? "#C40C0C"
                      : item.actual > item.target
                      ? "blue"
                      : "#FF8F8F"
                    : "#FF8F8F",
                fontSize: 10,
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

  const generateAnnotationsTargetLineRangeRegion = (
    processedParameter: any[]
  ) => {
    const annotationsTargetLineRangeRegion: any[] = processedParameter
      .map((item) => {
        if (item.shift === "Day") {
          return [
            {
              type: "line",
              start: ["start", item.target],
              end: [item.shift, item.target],
              offsetX: 42,
              text: {
                content: `Target = ${item.target} pcs.`,
                offsetY: -40,
                offsetX: -30,
                style: {
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: "bold",
                  fill: "rgba(86, 191, 150, 1)",
                  textBaseline: "top",
                },
              },
              style: {
                opacity: 0.5,
                stroke: "rgba(98, 218, 171, 1)",
                lineWidth: 2.5,
              },
            },
            {
              type: "line",
              start: ["start", item.lowerBaratsuki],
              end: [item.shift, item.lowerBaratsuki],
              offsetX: 42,
              text: {
                content: `${item.lowerBaratsuki}`,
                offsetY: -9,
                offsetX: -24,
                position: "right",
                style: {
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: "bold",
                  fill: "rgba(86, 191, 150, 1)",
                  textBaseline: "top",
                },
              },
              style: {
                stroke: "rgba(98, 218, 171, 1)",
                lineDash: [4, 4],
                lineWidth: 2.5,
              },
            },
            {
              type: "line",
              start: ["start", item.upperBaratsuki],
              end: [item.shift, item.upperBaratsuki],
              offsetX: 42,
              text: {
                content: `${item.upperBaratsuki}`,
                offsetX: -24,
                offsetY: -10,
                position: "right",
                style: {
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: "bold",
                  fill: "rgba(86, 191, 150, 1)",
                  textBaseline: "top",
                },
              },
              style: {
                stroke: "rgba(98, 218, 171, 1)",
                lineDash: [4, 4],
                lineWidth: 2.5,
              },
            },
            {
              type: "region",
              start: ["start", item.lowerBaratsuki],
              end: [item.shift, item.upperBaratsuki],
              offsetX: 42,
              style: {
                fill: "#62daab",
                fillOpacity: 0.15,
              },
            },
          ];
        } else {
          return [
            {
              type: "line",
              start: [item.shift, item.target],
              end: ["end", item.target],
              offsetX: -42,
              text: {
                content: `Target = ${item.target} pcs.`,
                offsetY: -40,
                offsetX: -30,
                style: {
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: "bold",
                  fill: "rgba(86, 191, 150, 1)",
                  textBaseline: "top",
                },
              },
              style: {
                opacity: 0.5,
                stroke: "rgba(98, 218, 171, 1)",
                lineWidth: 2.5,
              },
            },
            {
              type: "line",
              start: [item.shift, item.lowerBaratsuki],
              end: ["end", item.lowerBaratsuki],
              offsetX: -42,
              text: {
                content: `${item.lowerBaratsuki}`,
                offsetY: -9,
                offsetX: -24,
                position: "right",
                style: {
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: "bold",
                  fill: "rgba(86, 191, 150, 1)",
                  textBaseline: "top",
                },
              },
              style: {
                stroke: "rgba(98, 218, 171, 1)",
                lineDash: [4, 4],
                lineWidth: 2.5,
              },
            },
            {
              type: "line",
              start: [item.shift, item.upperBaratsuki],
              end: ["end", item.upperBaratsuki],
              offsetX: -42,
              text: {
                content: `${item.upperBaratsuki}`,
                offsetX: -24,
                offsetY: -10,
                position: "right",
                style: {
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: "bold",
                  fill: "rgba(86, 191, 150, 1)",
                  textBaseline: "top",
                },
              },
              style: {
                stroke: "rgba(98, 218, 171, 1)",
                lineDash: [4, 4],
                lineWidth: 2.5,
              },
            },
            {
              type: "region",
              start: [item.shift, item.lowerBaratsuki],
              end: ["end", item.upperBaratsuki],
              offsetX: -42,
              style: {
                fill: "#62daab",
                fillOpacity: 0.15,
              },
            },
          ];
        }
      })
      .flat(); // Flatten the array of arrays into a single array

    return annotationsTargetLineRangeRegion;
  };

  const annotations: any[] = generateAnnotations(processedParameter);
  const annotationsTargetLineRangeRegion: any[] =
    generateAnnotationsTargetLineRangeRegion(processedParameter);
  const config: ColumnConfig = {
    data:
      dateStrings === currentDate
        ? parameter_static_realtime
        : processedParameter,
    xField: "shift",
    yField: "actual",
    label: { style: { fontSize: 20, fontWeight: "bold" } },
    legend: false,
    columnStyle: {
      cursor: "pointer",
    },
    onReady: (plot) => {
      plot.on("element:click", (evt: any) => {
        const { data } = evt.data;
        console.log("Clicked data:", data);
        if (data.shift === "Day") {
          setShift("day");
        } else {
          setShift("night");
        }
      });
    },
    seriesField: "actual",
    yAxis: {
      maxLimit: 2200,
      title: {
        text: "Pieces",
        style: {
          fontSize: 16,
          //   fontWeight: "bold",
          fill: shift === "day" ? "#595959" : "white",
        },
      },
    },
    xAxis: {
      title: {
        text: "Period",
        style: {
          fontSize: 16,
          //   fontWeight: "bold",
          fill: shift === "day" ? "#595959" : "white",
        },
      },
    },
    color: (data: any) => {
      if (
        data.actual >= data.lowerBaratsuki &&
        data.actual <= data.upperBaratsuki
      ) {
        return "rgba(98, 218, 171, 0.5)";
      } else {
        return "rgba(255, 33, 33, 0.5)";
      }
    },
    annotations: [
      ...annotationsArrow,
      ...annotations,
      ...annotationsTargetLineRangeRegion,
    ],
    interactions: [
      {
        type: "element-highlight-by-color",
      },
      {
        type: "element-link",
      },
    ],
  };

  return <Column {...config} />;
};

export default BaratsukiShiftColumn;
