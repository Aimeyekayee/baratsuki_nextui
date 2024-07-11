"use client";
import React from "react";
import OAaverage from "./oa.average";
import TwoLineCompareOAaverage from "./chart/twoline.compare";
import {
  Card,
  Progress,
  Select,
  SelectItem,
  SelectSection,
} from "@nextui-org/react";
import SetuptimeColumn from "./chart/setuptime.column";
import OverallOaColumn from "./chart/overalloa.column";
import StackHundredOeeColumn from "./chart/stackhundredoee";
import TestDiv from "./chart/test";

const DashboardContent = () => {
  const animals = [
    { key: "recovery", label: "Recovery Time" },
    { key: "count", label: "Alarm Count" },
  ];
  return (
    <div
      className="flex flex-col pt-6 py-6 w-full gap-4"
      style={{ width: "100%", flex: "1" }}
    >
      <div className="flex w-full justify-between" style={{ height: "55%" }}>
        <OAaverage width="30%" />
        {/* <TestDiv/> */}
        <div style={{ width: "70%" }}>
          <div style={{ height: "50%" }}>
            <div className="h-full">
              <OverallOaColumn />
              {/* <StackHundredOeeColumn /> */}
            </div>
            <div className="flex pt-6 h-full gap-4" style={{ flex: "1" }}>
              <div className="" style={{ width: "70rem" }}>
                <SetuptimeColumn />
              </div>
              <div className="flex flex-col gap-4 " style={{ height: "100%" }}>
                <div
                  className="flex flex-col gap-2 rounded-medium bg-content1 p-6 shadow-small flex-1"
                  style={{ width: "30rem" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-large font-semibold">
                      BM&nbsp;Loss
                    </span>
                    <div>
                      <Select
                        className=""
                        defaultSelectedKeys={["recovery"]}
                        size="sm"
                        style={{ width: "9rem" }}
                      >
                        <SelectSection>
                          {animals.map((animal) => (
                            <SelectItem key={animal.key}>
                              {animal.label}
                            </SelectItem>
                          ))}
                        </SelectSection>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Progress
                      label="Slip Ring Run Out Check"
                      size="sm"
                      value={555}
                      maxValue={1286}
                      color="warning"
                      // formatOptions={{ style: "currency", currency: "ARS" }}
                      showValueLabel={true}
                      className="max-w-md"
                    />
                    <Progress
                      label="Robot Loader Emergency"
                      size="sm"
                      value={343}
                      maxValue={1286}
                      color="warning"
                      // formatOptions={{ style: "currency", currency: "ARS" }}
                      showValueLabel={true}
                      className="max-w-md"
                    />
                    <Progress
                      label="Work None Process"
                      size="sm"
                      value={208}
                      maxValue={1286}
                      color="warning"
                      // formatOptions={{ style: "currency", currency: "ARS" }}
                      showValueLabel={true}
                      className="max-w-md"
                    />
                    <Progress
                      label="Air Source Decreased"
                      size="sm"
                      value={180}
                      maxValue={1286}
                      color="warning"
                      // formatOptions={{ style: "currency", currency: "ARS" }}
                      showValueLabel={true}
                      className="max-w-md"
                    />
                  </div>

                  <div className="mt-4 flex w-full flex-col gap-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full  rounded-medium bg-content1 p-6 shadow-small flex-1"
        style={{ height: "45%" }}
      >
        <TwoLineCompareOAaverage />
      </div>
    </div>
  );
};

export default DashboardContent;
