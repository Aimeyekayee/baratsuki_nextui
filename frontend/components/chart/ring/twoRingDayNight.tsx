import React from "react";
import TotalRing from "./total.ring";
import { BaratsukiResponse } from "@/types/baratsuki.type";
import {
  calculateProdActualDifference,
  calculateSummaryDuration,
} from "@/functions/other/cal.baratsukiparams";
import { IMqttResponse } from "@/types/MqttType";

interface LineProps {
  parameter: BaratsukiResponse[];
  mqttData: IMqttResponse | null;
}

export const TwoRingShiftChart: React.FC<LineProps> = ({
  parameter,
  mqttData,
}) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      {parameter.map((item, index) => (
        <TotalRing
          key={index}
          rate={item.data[0].challenge_target}
          target={
            mqttData !== null && item.shift === 2
              ? 0
              : Math.floor(
                  calculateSummaryDuration(item) / item.data[0].ct_target
                )
          }
          shift={item.shift}
          actual={
            mqttData !== null && item.shift === 2
              ? 0
              : calculateProdActualDifference(item)
          }
        />
      ))}
    </div>
  );
};
