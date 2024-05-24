import React from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";

const BaratsukiChallengeTab = () => {
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const setBaratsukiRate = GeneralStore((state) => state.setBaratsukiRate);
  return (
    <div className="flex items-center">
      <p>Baratsuki Challenge at : &nbsp;</p>
      <Tabs
        size="lg"
        aria-label="Tabs form"
        selectedKey={baratsukiRate}
        onSelectionChange={setBaratsukiRate}
      >
        <Tab
          key="70"
          title={
            <div className="flex items-center space-x-2">
              <span>70%</span>
            </div>
          }
        />
        <Tab
          key="77"
          title={
            <div className="flex items-center space-x-2">
              <span>77%</span>
            </div>
          }
        ></Tab>
        <Tab
          key="85"
          title={
            <div className="flex items-center space-x-2">
              <span>85%</span>
            </div>
          }
        ></Tab>
      </Tabs>
    </div>
  );
};

export default BaratsukiChallengeTab;