import React from "react";
import { Tooltip, Chip, Button } from "@nextui-org/react";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { GeneralStore } from "@/store/general.store";
import { BaratsukiResponse } from "@/types/baratsuki.type";
import PercentOaBaratsuki from "../chart/line/percent.dot";
import ColumnPlotTest from "../chart/column/main.column";
import { IconCursorDefaultClick } from "@/components/icons";
import { useTheme } from "next-themes";
interface IProps {
  baratsuki: BaratsukiResponse[];
}
const CardEachShift: React.FC<IProps> = ({ baratsuki }) => {
  const { theme, setTheme } = useTheme();
  const shift = GeneralStore((state) => state.shift);
  const setShift = GeneralStore((state) => state.setShift);

  const transformData: BaratsukiResponse[] = baratsuki.map((shiftData) => ({
    shift: shiftData.shift,
    data: shiftData.data.map((machineData) => ({
      ...machineData,
      target_challenge: Math.floor(
        machineData.target100 * (machineData.challenge_target / 100)
      ),
      target_challenge_upper: Math.floor(
        machineData.target100 * (machineData.challenge_target / 100) * 1.05
      ),
      target_challenge_lower: Math.floor(
        machineData.target100 * (machineData.challenge_target / 100) * 0.95
      ),
      target_challenge_upper_percent: Number(
        (
          (100 / machineData.target100) *
          Math.floor(
            machineData.target100 * (machineData.challenge_target / 100) * 1.05
          )
        ).toFixed(2)
      ),
      target_challenge_lower_percent: Number(
        (
          (100 / machineData.target100) *
          Math.floor(
            machineData.target100 * (machineData.challenge_target / 100) * 0.95
          )
        ).toFixed(2)
      ),
    })),
  }));

  return (
    <div
      style={{
        height: "100%",
        width: "70%",
        display: "flex",
        flexDirection: "column",
        textAlign: "right",
        gap: "1rem",
      }}
    >
      <div className="flex justify-between items-center">
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: shift === 1 ? "black" : "white",
          }}
        >
          <Tooltip content="asda">
            <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
          </Tooltip>
          &nbsp;By Period-Working
        </p>
        <div className="flex gap-2">
          <Chip
            color="danger"
            variant="dot"
            classNames={{
              base: "bg-red-200 border-0",
              content: "text-black ",
            }}
          >
            จำนวนชิ้นงานในชั่วโมงการผลิตไม่อยู่ในเกณฑ์ที่ยอมรับได้
            {/* {Number}%) */}
          </Chip>
          <Chip
            variant="dot"
            color="primary"
            classNames={{
              base: "bg-blue-200 border-0",
              content: "text-black ",
            }}
          >
            จำนวนชิ้นงานในชั่วโมงการผลิตอยู่ในเกณฑ์ที่ยอมรับได้
            {/* {Number(baratsukiRate)}% - 100%) */}
          </Chip>
        </div>
      </div>
      <div className="flex flex-col  gap-4">
        <div className="h-80">
          <div style={{ height: "100%" }}>
            <PercentOaBaratsuki baratsuki={transformData} />
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          <p className="text-center font-light">
            You&apos;re watching &apos;Performance Analysis&apos; of{" "}
            <span className="font-medium">{shift === 1 ? "Day" : "Night"}</span>{" "}
            shift. Challenge rate at{" "}
            <span className="font-medium">
              {shift === 1
                ? transformData[0].data[0].challenge_target
                : transformData[1].data[1].challenge_target}
              %
            </span>{" "}
            and CT. target at{" "}
            <span className="font-medium">
              {shift === 1
                ? transformData[0].data[0].ct_target
                : transformData[1].data[1].ct_target}{" "}
              sec
            </span>
          </p>
          <Chip
            startContent={<IconCursorDefaultClick size={18} />}
            variant="flat"
            color="primary"
            className="cursor-pointer"
            onClick={() => {
              if (shift === 1) {
                setShift(2);
                setTheme("dark");
              } else {
                setShift(1);
                setTheme("light");
              }
            }}
          >
            Click here to change to see {shift === 1 ? "Night" : "Day"} Shift
          </Chip>
        </div>
        <div style={{ height: "28rem" }}>
          <ColumnPlotTest baratsuki={transformData} />
        </div>
      </div>
    </div>
  );
};

export default CardEachShift;
