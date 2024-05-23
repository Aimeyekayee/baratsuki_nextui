"use client";
import { title, subtitle } from "@/components/primitives";

import FormSearch from "@/components/form/form.search";
import { GeneralStore } from "@/store/general.store";
import MonitorData from "@/components/monitor/monitor.data";
import IconMoon from "@/asset/icon/MoonIcon";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { ConfigProvider, Empty } from "antd";
import ColumnPlotTest from "@/components/chart/main.column";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Tabs,
  Tooltip,
  Tab,
} from "@nextui-org/react";
import { configtheme } from "@/config/themeConfig";
import ModalHour from "@/components/modal/modal.hour";
import SunIcon from "@/asset/icon/SunIcon";
import BaratsukiShiftColumn from "@/components/chart/baratsuki.column";
import BaratsukiChallengeTab from "@/components/tabs/baratsukichallenge.tabs";

export default function Home() {
  const dateStrings = GeneralStore((state) => state.dateStrings);
  const zone1 = GeneralStore((state) => state.zone1);
  const zone2 = GeneralStore((state) => state.zone2);
  const actualNotRealTimeMC1 = GeneralStore(
    (state) => state.actualNotRealTimeMC1
  );
  const actualNotRealTimeMC2 = GeneralStore(
    (state) => state.actualNotRealTimeMC2
  );
  const targetNotRealTimeMC1 = GeneralStore(
    (state) => state.targetNotRealTimeMC1
  );
  const targetNotRealTimeMC2 = GeneralStore(
    (state) => state.targetNotRealTimeMC2
  );
  const dataByShiftColumnMC1 = GeneralStore(
    (state) => state.dataByShiftColumnMC1
  );
  const dataByShiftColumnMC2 = GeneralStore(
    (state) => state.dataByShiftColumnMC2
  );
  const shift = GeneralStore((state) => state.shift);
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const setBaratsukiRate = GeneralStore((state) => state.setBaratsukiRate);
  const setShowGap = GeneralStore((state) => state.setShowGap);
  const showGap = GeneralStore((state) => state.showGap);
  const capitalizedShift =
    String(shift).charAt(0).toUpperCase() + String(shift).slice(1);
  const currentDate = dayjs().format("YYYY-MM-DD");
  return (
    <section className="flex flex-col items-center justify-center gap-4 ">
      <div style={{ textAlign: "center" }}>
        <h1 className={title()} style={{ fontSize: "2rem" }}>
          Red Ratio Graph
        </h1>
        <br />
        <h1 className={title()} style={{ fontSize: "2rem" }}>
          by Time Zone&nbsp;
        </h1>

        <h1 className={title({ color: "blue" })} style={{ fontSize: "2rem" }}>
          (Baratsuki)
        </h1>
        <ConfigProvider theme={configtheme()}>
          <h2 className={subtitle({ class: "mt-2" })}>
            กราฟแสดงชั่วโมงที่ผลิตไม่ได้ตามแผนแยกตามช่วงเวลา
          </h2>
        </ConfigProvider>
      </div>

      <FormSearch />
      <div className="flex items-center justify-center">
        <BaratsukiChallengeTab />
      </div>
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
            Zone 1 : {zone1[0]?.machine_no} - {zone1[0]?.machine_name} (
            {capitalizedShift})
          </p>
        </Chip>
        {zone1.length > 0 ? (
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
                &nbsp;By Shift
              </p>
              <BaratsukiShiftColumn parameter={dataByShiftColumnMC1} />
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
              <ColumnPlotTest parameter={zone1} />
              <MonitorData
                actual={actualNotRealTimeMC1}
                target={targetNotRealTimeMC1}
                dateString={dateStrings}
                currentDate={currentDate}
                zone={1}
              />
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
      <Card
        shadow="md"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "1rem 2rem 2rem 2rem",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          background: shift === "day" ? "white" : "#1c2841",
        }}
      >
        <Chip color="warning" variant="flat" size="lg">
          <p className="font-semibold">
            Zone 2 : {zone2[0]?.machine_no} - {zone2[0]?.machine_name} (
            {capitalizedShift})
          </p>
        </Chip>
        {zone2.length > 0 ? (
          <div className="flex gap-8" style={{ width: "100%", height: "100%" }}>
            <div style={{ width: "30%", height: "100%" }}>
              <BaratsukiShiftColumn parameter={dataByShiftColumnMC2} />
            </div>
            <div
              style={{
                height: "100%",
                width: "70%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <ColumnPlotTest parameter={zone2} />
              <MonitorData
                actual={actualNotRealTimeMC2}
                target={targetNotRealTimeMC2}
                dateString={dateStrings}
                currentDate={currentDate}
                zone={2}
              />
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </section>
  );
}
