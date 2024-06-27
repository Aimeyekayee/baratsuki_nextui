import React, { useEffect, useState } from "react";
import { Empty } from "antd";
import { BaratsukiStore } from "@/store/data.baratsuki.store";
import CardDisplay from "./cards.main";

import { BaratsukiResponse } from "@/types/baratsuki.type";

const CoverDivCardDisplay = () => {
  const baratsuki = BaratsukiStore((state) => state.baratsuki);
  const [filterData, setFilterData] =
    useState<BaratsukiResponse[][]>(baratsuki);

  // useEffect(() => {
  //   const filteredDataPlanType = baratsuki.map((shifts) =>
  //     shifts.map((shift) => ({
  //       ...shift,
  //       data: shift.data.slice(1).filter((entry) => entry.plan_type !== "B"),
  //     }))
  //   );
  //   console.log(filteredDataPlanType)
  //   setFilterData(filteredDataPlanType);
  // }, [baratsuki]);

  useEffect(() => {
    setFilterData(baratsuki);
  }, [baratsuki]);
  return (
    <div
      className="flex flex-1 flex-col justify-center items-center gap-4"
      style={{ width: "100%" }}
    >
      {filterData.length > 0 ? (
        filterData.map((item, index) => (
          <CardDisplay key={index} baratsukiResponse={item} />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="p-40" />
      )}
    </div>
  );
};

export default CoverDivCardDisplay;
