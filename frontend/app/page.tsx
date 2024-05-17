"use client";
import { title, subtitle } from "@/components/primitives";

import FormSearch from "@/components/form/form.search";
import { GeneralStore } from "@/store/general.store";
import MonitorData from "@/components/monitor/monitor.data";
import IconMoon from "@/asset/icon/MoonIcon";
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
  Tab,
} from "@nextui-org/react";
import { configtheme } from "@/config/themeConfig";
import ModalHour from "@/components/modal/modal.hour";
import SunIcon from "@/asset/icon/SunIcon";

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

  const shift = GeneralStore((state) => state.shift);
  const setShift = GeneralStore((state) => state.setShift);

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
      <Tabs
        size="lg"
        aria-label="Tabs form"
        selectedKey={shift}
        onSelectionChange={setShift}
      >
        <Tab
          key="day"
          title={
            <div className="flex items-center space-x-2">
              <SunIcon />
              <span>Day</span>
            </div>
          }
        />
        <Tab
          key="night"
          title={
            <div className="flex items-center space-x-2">
              <IconMoon />
              <span>Night</span>
            </div>
          }
        ></Tab>
      </Tabs>

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
        }}
      >
        <Chip color="warning" variant="flat" size="lg">
          <p className="font-semibold">
            Zone 1 : {zone1[0]?.machine_no} - {zone1[0]?.machine_name}
          </p>
        </Chip>
        {zone1.length > 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <ColumnPlotTest parameter={zone1} />
            <MonitorData
              actual={actualNotRealTimeMC1}
              target={targetNotRealTimeMC1}
              dateString={dateStrings}
              currentDate={currentDate}
              zone={1}
            />
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
        }}
      >
        <Chip color="warning" variant="flat" size="lg">
          <p className="font-semibold">
            Zone 2 : {zone2[0]?.machine_no} - {zone2[0]?.machine_name}
          </p>
        </Chip>
        {zone2.length > 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
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
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </section>
  );
}
