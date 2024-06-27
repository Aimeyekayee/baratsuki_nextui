import React from "react";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import dayjs from "dayjs";
import TotalRing from "./total.ring";
import { BaratsukiResponse } from "@/types/baratsuki.type";
import {
  calculateSummaryActualThisPeriod,
  calculateSummaryDuration,
  calculateOADifference,
} from "@/functions/other/cal.baratsukiparams";

interface LineProps {
  parameter: BaratsukiResponse[];
}

export const TwoRingShiftChart: React.FC<LineProps> = ({ parameter }) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      {parameter.map((item, index) => (
        <TotalRing
          key={index}
          rate={item.data[0].challenge_target}
          target={Math.floor(
            calculateSummaryDuration(item) / item.data[0].ct_target
          )}
          shift={item.shift}
          actual={calculateSummaryActualThisPeriod(item)}
        />
      ))}
    </div>
  );
};
