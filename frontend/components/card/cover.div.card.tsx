import React, { useEffect, useState } from "react";
import { Empty } from "antd";
import { BaratsukiStore } from "@/store/data.baratsuki.store";
import CardDisplay from "./cards.main";
import dayjs from "dayjs";

import { BaratsukiResponse } from "@/types/baratsuki.type";
import { MQTTStore } from "@/store/mqttStore";
import { IMqttResponse } from "@/types/MqttType";

const CoverDivCardDisplay = () => {
  const baratsuki = BaratsukiStore((state) => state.baratsuki);
  const [filterData, setFilterData] =
    useState<BaratsukiResponse[][]>(baratsuki);
  const mqttData = MQTTStore((state) => state.mqttDataMachine);
  useEffect(() => {
    setFilterData(baratsuki);
  }, [baratsuki]);
  const currentDate = dayjs().format("YYYY-MM-DD");
  return (
    <div
      className="flex flex-1 flex-col justify-center items-center gap-4"
      style={{ width: "100%" }}
    >
      {filterData.length > 0 ? (
        filterData.map((item, index) => {
          const working_date = item[0]?.data[0]?.working_date;
          const machine_no = item[0]?.data[0]?.machine_no;
          const formattedDate = working_date
            ? new Date(working_date + "Z").toISOString().split("T")[0]
            : null;
          const currentDateMatches = currentDate === formattedDate;
          const matchingMqttData =
            mqttData.find((data) => data.machine_no === machine_no) || null;
          const mqttSend = currentDateMatches ? matchingMqttData : null;
          return (
            <CardDisplay
              key={index}
              baratsukiResponse={item}
              mqttData={mqttSend}
            />
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="p-40" />
      )}
    </div>
  );
};

export default CoverDivCardDisplay;
