import React, { use, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Card,
  Tooltip,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import ListBoxMember from "../listbox/listbox.member";
import { GeneralStore } from "@/store/general.store";
import { modal } from "@nextui-org/theme";
import { ModalOpenStore } from "@/store/modal.open.store";
import AreaPlotByHour from "../chart/area/areaHour";
import TableMock from "../table/table.alarm";
import VideoPlayer from "../video/video.player";
import AreaPlotBy5minutes from "../chart/area/areaHourBy5minute";
import AreaPlotByAccummulate from "../chart/area/areaHourByAccummulate";
import BaratsukiChallengeTab from "../tabs/baratsukichallenge.tabs";
import AlarmHistoryTable from "../table/table.alarmhistoryEach";
import AlarmCountColumn from "../chart/dualaxes - pareto/alarmfreq.column";
import PieAllMachine from "../chart/pie/pieallMc";
import AlarmCountEachMC from "../chart/dualaxes - pareto/alarmEachMc1";
import AlarmCountEachMC1 from "../chart/dualaxes - pareto/alarmEachMc1";
import AlarmCountEachMC2 from "../chart/dualaxes - pareto/alarmEachMc2";
import AlarmHistoryTableAlls from "../table/table.alarmhistoryAlls";
import { SortIcon } from "../icon";
import SortPieSelect from "../select/select.sortPie";
import AlarmHistoryTableEach from "../table/table.alarmhistoryEach";
import { AdjustCT } from "../input/adjustCT.input";
import { BaratsukiStore } from "@/store/data.baratsuki.store";

interface ModalManagement {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
}

const ModalHour: React.FC<ModalManagement> = ({
  isOpen,
  onOpen,
  onOpenChange,
}) => {
  const baratsukiDataArea = BaratsukiStore((state) => state.baratsukiDataArea);
  const shift = GeneralStore((state) => state.shift);
  const setBaratsukiDataArea = BaratsukiStore(
    (state) => state.setBaratsukiDataArea
  );
  const clickMCinPieGraph = GeneralStore((state) => state.clickMCinPieGraph);
  const [selected, setSelected] = React.useState<string | number>("5min");
  const [selectedView, setSelectedView] = React.useState<string | number>(
    "each"
  );
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => setBaratsukiDataArea([])}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="full"
      style={{ overflowY: "auto", paddingBottom: "2rem" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-1">
              {baratsukiDataArea[0].machine_no}{" "}
              {baratsukiDataArea[0].machine_name} :{" "}
              {baratsukiDataArea[0].period}{" "}
            </ModalHeader>
            <ModalBody className="flex flex-row">
              <div
                className="flex flex-col gap-2"
                style={{ width: "50%", height: "100%" }}
              >
                <div className="flex gap-4 justify-end">
                  <div className="flex items-center gap-2">
                    <Tooltip content="asda">
                      <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
                    </Tooltip>
                    <Tabs
                      size="md"
                      aria-label="Tabs form"
                      selectedKey={selected}
                      onSelectionChange={setSelected}
                    >
                      <Tab key="5min" title="5 minutes" />
                      <Tab key="1hr" title="By Period"></Tab>
                      <Tab key="accum" title="Accumulate"></Tab>
                    </Tabs>
                  </div>
                </div>
                <Card
                  style={{
                    padding: "3rem",
                    height: "100%",
                    background: shift === 1 ? "white" : "#182228",
                  }}
                  shadow="sm"
                  radius="sm"
                  isBlurred
                >
                  {selected === "1hr" && (
                    <AreaPlotByHour parameter={baratsukiDataArea} />
                  )}
                  {selected === "5min" && (
                    <AreaPlotBy5minutes parameter={baratsukiDataArea} />
                  )}
                  {selected === "accum" && (
                    <AreaPlotByAccummulate parameter={baratsukiDataArea} />
                  )}
                </Card>
              </div>
              <div
                className="flex flex-col justify-between gap-4"
                style={{ width: "50%", height: "100%" }}
              >
                <div
                  className="flex flex-col"
                  style={{
                    height: "100%",
                    width: "100%",
                    padding: "0 1rem 0 1rem",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <Tabs
                      size="md"
                      aria-label="Tabs form"
                      selectedKey={selectedView}
                      onSelectionChange={setSelectedView}
                    >
                      <Tab key="each" title="By Machine" />
                      <Tab key="all" title="All Machine"></Tab>
                    </Tabs>
                  </div>
                  {selectedView === "all" ? (
                    <div className="flex gap-4">
                      <div
                        style={{ width: "30%" }}
                        className="flex flex-col items-center justify-center"
                      >
                        <SortPieSelect />
                        <PieAllMachine />
                      </div>
                      <div style={{ width: "70%" }}>
                        {clickMCinPieGraph === "MC1" ? (
                          <AlarmCountEachMC1 />
                        ) : (
                          <AlarmCountEachMC2 />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <SortPieSelect />
                      <AlarmCountColumn />
                    </div>
                  )}
                </div>
                <div style={{ padding: "0 1rem 0 1rem" }}>
                  {selectedView === "all" ? (
                    <AlarmHistoryTableAlls />
                  ) : (
                    <AlarmHistoryTableEach />
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalHour;
