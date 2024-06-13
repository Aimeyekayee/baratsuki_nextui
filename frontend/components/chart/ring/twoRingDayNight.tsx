import React from "react";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import dayjs from "dayjs";
import TotalRing from "./total.ring";
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
  zone_number: number;
}

export const TwoRingShiftChart: React.FC<LineProps> = ({
  parameter,
  parameter_static_realtime,
  zone_number,
}) => {
  console.log(parameter);
  const dateStrings = GeneralStore((state) => state.dateStrings);

  const currentDate = dayjs().format("YYYY-MM-DD");
  const isConnected = MQTTStore((state) => state.isConnected);
  console.log(isConnected);

  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);

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
  console.log(parameter_static_realtime);

  const targetNotRealTimeMC1 = GeneralStore(
    (state) => state.targetNotRealTimeMC1
  );
  const targetNotRealTimeMC2 = GeneralStore(
    (state) => state.targetNotRealTimeMC2
  );
  const targetRealTimeMC1 = GeneralStore((state) => state.targetRealTimeMC1);
  const targetRealTimeMC2 = GeneralStore((state) => state.targetRealTimeMC2);

  const determineTarget = (currentDate: string, zone_number: number) => {
    if (currentDate === dateStrings) {
      if (zone_number === 1) {
        return targetRealTimeMC1;
      } else {
        return targetRealTimeMC2;
      }
    } else {
      if (zone_number === 1) {
        return targetNotRealTimeMC1;
      } else {
        return targetNotRealTimeMC2;
      }
    }
  };
  return (
    <div className="flex gap-4 justify-center items-center">
      <TotalRing
        target={determineTarget(currentDate, zone_number)}
        shift={
          dateStrings !== currentDate
            ? processedParameter[0]?.shift
            : parameter_static_realtime[0]?.shift
        }
        actual={
          dateStrings !== currentDate
            ? processedParameter[0]?.actual
            : parameter_static_realtime[0]?.actual
        }
      />
      <TotalRing
        target={determineTarget(currentDate, zone_number)}
        shift={
          dateStrings !== currentDate
            ? processedParameter[1]?.shift
            : parameter_static_realtime[1]?.shift
        }
        actual={
          dateStrings !== currentDate
            ? processedParameter[1]?.actual
            : parameter_static_realtime[1]?.actual
        }
      />
    </div>
  );
};
