import React, { useState, useEffect } from "react";
import { Card, Tooltip } from "@nextui-org/react";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { BaratsukiResponse } from "@/types/baratsuki.type";
import { TwoRingShiftChart } from "../chart/ring/twoRingDayNight";
import { GeneralStore } from "@/store/general.store";
import { toLocaleFormat } from "@/functions/other/decimal.digit";
import {
  calculateProdActualDifference,
  calculateSummaryDuration,
  calculateOADifference,
} from "@/functions/other/cal.baratsukiparams";
import BaratsukiShiftColumn from "../chart/column/baratsuki.column";
import { MQTTStore } from "@/store/mqttStore";
import dayjs from "dayjs";
import { IMqttResponse } from "@/types/MqttType";
import BaratsukiShiftColumnRealtime from "../chart/column/baratsuki.columm.realtime";
interface IProps {
  baratsuki: BaratsukiResponse[];
  mqttData: IMqttResponse | null;
}

const CardCommonShift: React.FC<IProps> = ({ baratsuki, mqttData }) => {
  const shift = GeneralStore((state) => state.shift);
  const transformData = (data: typeof baratsuki) => {
    return data.map((item) => {
      const shiftText = item.shift === 1 ? "Day" : "Night";
      const actual = item.data.reduce(
        (sum, entry) => sum + entry.actual_this_period,
        0
      );
      const duration = calculateSummaryDuration(item);
      const ct_target = item.data[0].ct_target;
      const target100 = duration / ct_target;
      const challengeTarget = item.data[0].challenge_target;
      const target_challenge = target100 * (challengeTarget / 100);

      return {
        challenge_target: challengeTarget,
        actual: actual,
        shift: item.shift,
        shift_text: shiftText,
        target100: target100,
        target_challenge: Math.floor(target_challenge),
        challenge_lower: Math.floor(target_challenge * 0.95),
        challenge_upper: Math.floor(target_challenge * 1.05),
      };
    });
  };

  const [transformedData, setTransformedData] = useState(() =>
    transformData(baratsuki)
  );

  useEffect(() => {
    const updatedData = transformData(baratsuki);
    setTransformedData(updatedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baratsuki]);

  return (
    <Card
      style={{
        width: "30%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem 0rem 1rem 0rem",
        background: shift === 1 ? "white" : "rgba(251,255,255,0.2)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          <Tooltip content="Click at Column to change view to that shift.">
            <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
          </Tooltip>
          &nbsp;OA By Shift
        </p>
        <div>
          <TwoRingShiftChart parameter={baratsuki} mqttData={mqttData} />
        </div>
        <div className="flex gap-10">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="flex gap-4 justify-center items-center"
              style={{ width: "100%" }}
            >
              <div
                className="flex flex-col justify-center items-center"
                style={{ width: "49.5%" }}
              >
                {[
                  "Actual",
                  "Target",
                  "Baratsuki",
                  "CT.Target",
                  `Challenge`,
                ].map((label, i) => (
                  <div key={i} className="flex">
                    <p>{label}&nbsp;:&nbsp;</p>
                    <p className="font-semibold">
                      {index === 0
                        ? i === 0
                          ? mqttData !== null
                            ? mqttData.prod_actual
                            : toLocaleFormat(
                                calculateProdActualDifference(baratsuki[index])
                              )
                          : i === 1
                          ? mqttData !== null
                            ? mqttData.prod_target
                            : Math.floor(
                                calculateSummaryDuration(baratsuki[index]) /
                                  baratsuki[index]?.data[0]?.ct_target
                              )
                          : i === 2
                          ? `${calculateOADifference(baratsuki[index])}%`
                          : i === 3
                          ? `${baratsuki[index]?.data[0]?.ct_target}sec.`
                          : `${baratsuki[index]?.data[0]?.challenge_target}%`
                        : i === 0
                        ? mqttData !== null
                          ? "-"
                          : toLocaleFormat(
                              calculateProdActualDifference(baratsuki[index])
                            )
                        : i === 1
                        ? mqttData !== null
                          ? "-"
                          : Math.floor(
                              calculateSummaryDuration(baratsuki[index]) /
                                baratsuki[index]?.data[0]?.ct_target
                            )
                        : i === 2
                        ? mqttData !== null
                          ? "-"
                          : `${calculateOADifference(baratsuki[index])}%`
                        : i === 3
                        ? mqttData !== null
                          ? "-"
                          : `${baratsuki[index]?.data[0]?.ct_target}sec.`
                        : mqttData !== null
                        ? "-"
                        : `${baratsuki[index]?.data[0]?.challenge_target}%`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: "25rem" }}>
        {mqttData === null ? (
          <BaratsukiShiftColumn
            parameter={transformedData}
            mqttData={mqttData}
            //   parameter_static_realtime={dataRealtime}
          />
        ) : (
          <BaratsukiShiftColumnRealtime
            parameter={transformedData}
            mqttData={mqttData}
          ></BaratsukiShiftColumnRealtime>
        )}
      </div>
    </Card>
  );
};

export default CardCommonShift;
