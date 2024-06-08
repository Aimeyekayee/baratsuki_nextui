import React from "react";
import { Input } from "@nextui-org/input";
import { GeneralStore } from "@/store/general.store";

interface IProps {
  zone_number: number;
}

export const AdjustCT: React.FC<IProps> = ({ zone_number }) => {
  const ctTargetZone1 = GeneralStore((state) => state.ctTargetZone1);
  const ctTargetZone2 = GeneralStore((state) => state.ctTargetZone2);
  const setCtTargetZone1 = GeneralStore((state) => state.setCtTargetZone1);
  const setCtTargetZone2 = GeneralStore((state) => state.setCtTargetZone2);
  const shift = GeneralStore((state) => state.shift);
  return (
    <div className="flex items-center py-4" style={{ width: "15rem" }}>
      <p style={{ color: shift === "day" ? "black" : "white" }}>
        CT.&nbsp;Target&nbsp;:&nbsp;
      </p>
      <Input
        className="flex"
        type="number"
        step="0.5"
        color="warning"
        variant="bordered"
        value={
          zone_number === 1
            ? ctTargetZone1.toString()
            : ctTargetZone2.toString()
        }
        onValueChange={zone_number === 1 ? setCtTargetZone1 : setCtTargetZone2}
        labelPlacement="outside"
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">sec.</span>
          </div>
        }
      />
    </div>
  );
};
