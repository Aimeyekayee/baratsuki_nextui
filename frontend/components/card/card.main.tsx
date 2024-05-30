import React from "react";
import { Card, Chip, Tooltip, Tab, Tabs } from "@nextui-org/react";
import BaratsukiShiftColumn from "../chart/baratsuki.column";
import { GeneralStore } from "@/store/general.store";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import ColumnPlotTest from "../chart/main.column";
import MonitorData from "../monitor/monitor.data";
import { Empty } from "antd";
import dayjs from "dayjs";

interface Data {
  ct_actual: number;
  prod_actual: number;
}
interface DataProps {
  data: Data;
  date: string;
  line_id: number;
  machine_no: string;
  machine_name: string;
  period: string;
  section_code: number;
  shift: string;
  type: string;
  value: number;
  upper?: number;
  lower?: number;
}

interface IProps {
  zone: any[];
  dataColumn: any[];
  actual: number;
  target: number;
  zone_number: number;
  realtimeActual: number;
}

const CardMainDisplay: React.FC<IProps> = ({
  zone,
  actual,
  target,
  dataColumn,
  zone_number,
  realtimeActual,
}) => {
  const shift = GeneralStore((state) => state.shift);
  const showGap = GeneralStore((state) => state.showGap);
  const dateStrings = GeneralStore((state) => state.dateStrings);
  const setShowGap = GeneralStore((state) => state.setShowGap);
  const capitalizedShift =
    String(shift).charAt(0).toUpperCase() + String(shift).slice(1);

  const currentDate = dayjs().format("YYYY-MM-DD");
  //! this is so static please create logic after
  const dataRealtime = [
    { shift: "day", actual: realtimeActual },
    { shift: "night", actual: 0 },
  ];
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
        justifyContent: "center",
        alignItems: "center",
        background: shift === "day" ? "white" : "#1c2841",
      }}
    >
      <Chip color="warning" variant="flat" size="lg">
        <p className="font-semibold">
          Zone : {zone[0]?.machine_no} - {zone[0]?.machine_name} (
          {capitalizedShift})
        </p>
      </Chip>
      {zone.length > 0 ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            gap: "2rem",
          }}
        >
          <div
            style={{
              width: "30%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: shift === "day" ? "black" : "white",
              }}
            >
              <Tooltip content="Click at Column to change view to that shift.">
                <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
              </Tooltip>
              &nbsp;By Shift (±5%)
            </p>
            <BaratsukiShiftColumn
              parameter={dataColumn}
              parameter_static_realtime={dataRealtime}
            />
          </div>
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
            <div className="flex justify-between">
              <div className="flex justify-center items-center">
                <p
                  style={{
                    paddingLeft: "1.7rem",
                    color: shift === "day" ? "black" : "white",
                  }}
                >
                  Show Gap :&nbsp;
                </p>
                <Tabs
                  aria-label="Tabs sizes"
                  size="sm"
                  selectedKey={showGap}
                  onSelectionChange={setShowGap}
                >
                  <Tab key="on" title="On" />
                  <Tab key="off" title="Off" />
                </Tabs>
              </div>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: shift === "day" ? "black" : "white",
                }}
              >
                <Tooltip content="asda">
                  <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
                </Tooltip>
                &nbsp;By Period-Working
              </p>
            </div>
            <ColumnPlotTest parameter={zone} />
            <MonitorData
              actual={actual}
              target={target}
              dateString={dateStrings}
              currentDate={currentDate}
              zone={zone_number}
            />
          </div>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

export default CardMainDisplay;
