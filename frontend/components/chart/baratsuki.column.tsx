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
  const processedParameter = parameter.map((item: DataProps) => {
    const time = item.date.split("T")[1];
    const shift =
      time === "19:20:00" ? "Day" : time === "07:20:00" ? "Night" : "Night";

    return {
      ...item,
      shift,
      actual: item.data.prod_actual,
    };
  });
  console.log(processedParameter);
  //!กรณีนี้เป็นกรณีที่ตั้ง target ที่ท้ายไลน์อย่างเดียว ไม่ได้เป็น target ตายตัว
  //!ถ้าในอนาคตเป็น mc อื่นที่ไม่ใช่ท้ายไลน์ จะต้องมี target ของงตัวเอง ในกรณีนั้น
  //!อาจจะต้อง fetch ข้อมูลมาใหม่ทั้งหมดในช่วง shift เพื่อมาคำนวณ target การทำงาน

  const targetValues: { [key: number]: number } = {
    70: Math.floor(targetNotRealTimeMC1 * 0.7),
    77: Math.floor(targetNotRealTimeMC1 * 0.77),
    85: Math.floor(targetNotRealTimeMC1 * 0.85),
    100: Math.floor(targetNotRealTimeMC1 * 1),
  };

  const baratsukiRateNumber = Number(baratsukiRate);
  let target: number = targetValues[baratsukiRateNumber] || 0;
  console.log(`The target for baratsukiRate ${baratsukiRate} is ${target}`);
  const upperBaratsuki: number = Math.floor(target * 1.05);
  const lowerBaratsuki: number = Math.floor(target * 0.95);

  const annotationsArrow: any[] = processedParameter
    .map((item) => {
      if (item.actual >= lowerBaratsuki && item.actual <= upperBaratsuki) {
        return null; // Skip periods with zero or invalid ct_actual values
      } else {
        return {
          type: "line",
          start: [item.shift, item.actual], // Start slightly below ct_actual
          end: [item.shift, target], // End slightly above ct_actual
          style: {
            stroke: "#FF4D4F",
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

  const generateAnnotations = (
    processedParameter: any[],
    target: number,
    lowerBaratsuki: number,
    upperBaratsuki: number
  ) => {
    const annotations: any[] = processedParameter
      .map((item) => {
        if (item.actual >= lowerBaratsuki && item.actual <= upperBaratsuki) {
          return null; // Skip periods with zero or invalid ct_actual values
        } else {
          const gapContent = `Gap = ${item.actual < target ? "-" : "+"}${
            target - item.actual
          } pcs.`;
          const percentContent = `${item.actual < target ? "-" : "+"}${(
            Math.abs((target - item.actual) / target) * 100
          ).toFixed(2)}%`;
          return [
            {
              type: "text",
              content: gapContent,
              offsetX: 70,
              position: (xScale: any, yScale: any) => {
                return [
                  `${xScale.scale(item.shift) * 100}%`,
                  `${
                    (1 - yScale.actual.scale((target + item.actual) / 2)) * 100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.actual < target
                      ? "#C40C0C"
                      : item.actual > target
                      ? "blue"
                      : "#FF8F8F"
                    : "#FF8F8F",
                fontSize: 18,
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
                  `${xScale.scale(item.shift) * 100}%`,
                  `${
                    (1 - yScale.actual.scale((target + item.actual) / 2.2)) *
                    100
                  }%`,
                ];
              },
              style: {
                textAlign: "center",
                fill:
                  shift === "day"
                    ? item.actual < target
                      ? "#C40C0C"
                      : item.actual > target
                      ? "blue"
                      : "#FF8F8F"
                    : "#FF8F8F",
                fontSize: 18,
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
  const annotations: any[] = generateAnnotations(
    processedParameter,
    target,
    lowerBaratsuki,
    upperBaratsuki
  );

  const config: ColumnConfig = {
    data: dateStrings === currentDate ? parameter_static_realtime : processedParameter,
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
      if (data.actual >= lowerBaratsuki && data.actual <= upperBaratsuki) {
        return "rgba(98, 218, 171, 0.5)";
      } else {
        return "rgba(255, 33, 33, 0.5)";
      }
    },
    annotations: [
      ...annotationsArrow,
      ...annotations,
      {
        type: "line",
        start: ["start", target],
        end: ["end", target],
        text: {
          content: `Target = ${target} pcs. (baratsuki at ${baratsukiRate}%)`,
          offsetY: -32,
          //   offsetX: -85,
          //   position: "left",
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
          //   lineDash: [4, 4],
          lineWidth: 2.5,
        },
      },
      {
        type: "line",
        start: ["start", lowerBaratsuki],
        end: ["end", lowerBaratsuki],
        text: {
          content: `-5% = ${lowerBaratsuki}`,
          offsetY: 3,
          offsetX: -72,
          position: "right",
          style: {
            textAlign: "left",
            fontSize: 12,
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
        start: ["start", upperBaratsuki],
        end: ["end", upperBaratsuki],
        text: {
          content: `+5% = ${upperBaratsuki}`,
          offsetX: -72,
          offsetY: -18,
          position: "right",
          style: {
            textAlign: "left",
            fontSize: 12,
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
        start: ["start", lowerBaratsuki],
        end: ["end", upperBaratsuki],
        style: {
          fill: "#62daab",
          fillOpacity: 0.15,
          // opacity: 1,
        },
      },
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
