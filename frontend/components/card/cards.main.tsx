import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Chip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
} from "@nextui-org/react";
import IconSettings from "../icon";
import { BaratsukiResponse } from "@/types/baratsuki.type";
import CardCommonShift from "./card.common.shift";
import CardEachShift from "./card.each.shift";
import ParameterInputs from "../popover/setting.parameter.popover";
import { GeneralStore } from "@/store/general.store";
import { IMqttResponse } from "@/types/MqttType";

interface CardDisplayProps {
  baratsukiResponse: BaratsukiResponse[];
  mqttData: IMqttResponse | null;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  baratsukiResponse,
  mqttData,
}) => {
  const shift = GeneralStore((state) => state.shift);
  const zone_name_not_real_time = `${baratsukiResponse[1]?.data[0]?.machine_no} -
      ${baratsukiResponse[1]?.data[0]?.machine_name}`;

  const zone_name = mqttData ? mqttData.machine_no : zone_name_not_real_time;

  const initialFilteredData = baratsukiResponse.map((response) => ({
    ...response,
    data: response.data.slice(1).filter((entry) => entry.plan_type === "N"),
  }));

  const initialFilteredDataWithBrake = baratsukiResponse.map((response) => ({
    ...response,
    data: response.data.slice(1),
  }));

  const [dataBaratsuki, setDataBaratsuki] =
    useState<BaratsukiResponse[]>(initialFilteredData);
  const [dataBaratsukiWithBrake, setDataBaratsukiWithBrake] = useState<
    BaratsukiResponse[]
  >(initialFilteredDataWithBrake);

  const dataBaratsuki2: BaratsukiResponse[] = dataBaratsuki.map((baratsuki) => {
    // Clone the original object to avoid mutation
    const updatedBaratsuki = { ...baratsuki, data: [...baratsuki.data] };

    // Find the corresponding object in dataBaratsukiWithBrake
    const brakeData = dataBaratsukiWithBrake.find(
      (brake) => brake.shift === baratsuki.shift
    );

    if (brakeData) {
      // Filter objects where plan_type === "B"
      const brakePlanBData = brakeData.data.filter(
        (machineData) => machineData.plan_type === "B"
      );
      // Push the filtered objects to the corresponding data array in dataBaratsuki
      updatedBaratsuki.data.push(...brakePlanBData);
    }
    updatedBaratsuki.data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return updatedBaratsuki;
  });

  useEffect(() => {
    setDataBaratsuki(initialFilteredData);
    setDataBaratsukiWithBrake(initialFilteredDataWithBrake);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baratsukiResponse]);

  const updateData = (updater: (dataItem: any, idx?: number) => any) => {
    const newDataBaratsuki = dataBaratsuki.map((response) =>
      response.shift === shift
        ? {
            ...response,
            data: response.data.map((dataItem, idx) => updater(dataItem, idx)),
          }
        : response
    );
    setDataBaratsuki(newDataBaratsuki);
  };

  const handleCTTargetChange = (newCTTarget: number) => {
    updateData((dataItem) => ({
      ...dataItem,
      ct_target: newCTTarget,
    }));
  };

  const handleChallengeTarget = (newChallengeTarget: number) => {
    updateData((dataItem) => ({
      ...dataItem,
      challenge_target: newChallengeTarget,
    }));
  };

  const handleExclusionTimeChange = (
    newExclusionTime: number,
    index: number
  ) => {
    updateData((dataItem, idx) =>
      idx === index
        ? {
            ...dataItem,
            exclusion_time: newExclusionTime,
            target100: Math.floor(
              (dataItem.duration - newExclusionTime) / dataItem.ct_target
            ),
            oa: Number(
              (
                (dataItem.actual_this_period /
                  Math.floor(
                    (dataItem.duration - newExclusionTime) / dataItem.ct_target
                  )) *
                100
              ).toFixed(2)
            ),
          }
        : dataItem
    );
  };

  if (dataBaratsuki.length === 0) {
    return <div>No data available for this shift</div>;
  }

  return (
    <Card
      shadow="md"
      style={{
        width: "100%",
        height: "100%",
        padding: "1rem 2rem 2rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyItems: "center",
        background: shift === 1 ? "white" : "#182228",
      }}
    >
      <div
        className="flex justify-center"
        style={{ height: "2rem", width: "100%", position: "relative" }}
      >
        <div className="flex justift-center items-center">
          <Chip color="warning" variant="flat" size="lg">
            <p className="font-semibold">Zone : {zone_name}</p>
          </Chip>
        </div>
        <div className="absolute right-0">
          <Popover placement="bottom-end" showArrow offset={10} backdrop="blur">
            <PopoverTrigger>
              <Button startContent={<IconSettings />} size="sm">
                Setting Parameter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              {(titleProps) => (
                <ParameterInputs
                  titleProps={titleProps}
                  data={
                    shift === 1 ? dataBaratsuki[0].data : dataBaratsuki[1].data
                  }
                  handleCTTargetChange={handleCTTargetChange}
                  handleExclusionTimeChange={handleExclusionTimeChange}
                  handelChallengeTarget={handleChallengeTarget}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-10">
        <CardCommonShift
          baratsuki={dataBaratsuki}
          mqttData={mqttData}
        ></CardCommonShift>
        <CardEachShift baratsuki={dataBaratsuki2}></CardEachShift>
      </div>
    </Card>
  );
};

export default CardDisplay;
