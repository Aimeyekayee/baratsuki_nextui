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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import ListBoxMember from "../listbox/listbox.member";
import { GeneralStore } from "@/store/general.store";
import { modal } from "@nextui-org/theme";
import { ModalOpenStore } from "@/store/modal.open.store";
import AreaPlotByHour from "../chart/areaHour";
import TableMock from "../table/table.alarm";
import VideoPlayer from "../video/video.player";
import AreaPlotBy5minutes from "../chart/areaHourBy5minute";
import AreaPlotByAccummulate from "../chart/areaHourByAccummulate";
import BaratsukiChallengeTab from "../tabs/baratsukichallenge.tabs";

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
  const modalOpen = ModalOpenStore((state) => state.openModal);
  const [selected, setSelected] = React.useState<string | number>("1hr");
  const setDataBaratsuki = GeneralStore((state) => state.setDataBaratsuki);
  const setOpenModal = ModalOpenStore((state) => state.setOpenModal);
  const isOdd = GeneralStore((state) => state.isOdd);
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);
  const items = [
    {
      key: "code39",
      label: "Code 39",
    },
    {
      key: "code42",
      label: "Code 42",
    },
    {
      key: "full",
      label: "Full",
    },
  ];
  //status 1=work , 2=rest 3=lunch
  const period1 = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "08:30 - 09:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "09:30 - 09:40", time: 600, status: 2 },
    {
      periodTime: "09:40 - 10:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "10:30 - 11:15",
      time: 2700,
      status: 1,
    },
    { periodTime: "11:15 - 12:15", time: 3600, status: 3 },
    {
      periodTime: "12:15 - 13:30",
      time: 4500,
      status: 1,
    },
    {
      periodTime: "13:30 - 14:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "14:30 - 14:40", time: 600, status: 2 },
    {
      periodTime: "14:40 - 15:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "22:30 - 23:15",
      time: 2700,
      status: 1,
    },
    { periodTime: "23:15 - 00:05", time: 3000, status: 3 },
    {
      periodTime: "00:05 - 01:30",
      time: 5100,
      status: 1,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
    },
  ];
  const period2 = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "08:30 - 09:20",
      time: 3000,
      status: 1,
    },
    { periodTime: "09:20 - 09:30", time: 600, status: 2 },
    {
      periodTime: "09:30 - 10:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "10:30 - 11:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
    {
      periodTime: "12:30 - 13:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "13:30 - 14:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "14:20 - 14:30", time: 600, status: 2 },
    {
      periodTime: "14:30 - 15:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "22:30 - 23:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
    {
      periodTime: "00:20 - 01:30",
      time: 4200,
      status: 1,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
    },
  ];

  const period = isOdd ? period1 : period2;
  // const period = [
  //   { periodTime: "07:35 - 08:30", time: 3300, status: 1 },
  //   { periodTime: "08:30 - 09:40", time: 4200, status: 1 },
  //   { periodTime: "09:40 - 09:50", time: 600, status: 2 },
  //   { periodTime: "09:50 - 10:30", time: 2400, status: 1 },
  //   { periodTime: "10:30 - 11:30", time: 3600, status: 1 },
  //   { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
  //   { periodTime: "12:30 - 13:30", time: 3600, status: 1 },
  //   { periodTime: "13:30 - 14:40", time: 4200, status: 1 },
  //   { periodTime: "14:40 - 14:50", time: 600, status: 2 },
  //   { periodTime: "14:50 - 15:30", time: 2400, status: 1 },
  //   { periodTime: "15:30 - 16:30", time: 3600, status: 1 },
  //   { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
  //   { periodTime: "16:50 - 17:50", time: 3600, status: 1 },
  //   { periodTime: "17:50 - 19:20", time: 5400, status: 1 },
  //   { periodTime: "19:35 - 20:30", time: 3300, status: 1 },
  //   { periodTime: "20:30 - 21:30", time: 3600, status: 1 },
  //   { periodTime: "21:30 - 21:40", time: 600, status: 2 },
  //   { periodTime: "21:40 - 22:30", time: 3000, status: 1 },
  //   { periodTime: "22:30 - 23:30", time: 3600, status: 1 },
  //   { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
  //   { periodTime: "00:20 - 01:30", time: 4200, status: 1 },
  //   { periodTime: "01:30 - 02:30", time: 3600, status: 1 },
  //   { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
  //   { periodTime: "02:50 - 03:30", time: 2400, status: 1 },
  //   { periodTime: "03:30 - 04:30", time: 3600, status: 1 },
  //   { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
  //   { periodTime: "04:50 - 05:50", time: 3600, status: 1 },
  //   { periodTime: "05:50 - 07:20", time: 5400, status: 1 },
  // ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="full"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-1">
              {dataTooltip[0].data.machine_no}{" "}
              {dataTooltip[0].data.machine_name} : {dataTooltip[0].title}{" "}
              {period.map((periodItem) => {
                if (periodItem.periodTime === dataTooltip[0].title) {
                  let statusText = "";
                  if (periodItem.status === 1) {
                    statusText = "Working time";
                  } else if (periodItem.status === 2) {
                    statusText = "Rest time";
                  } else if (periodItem.status === 3) {
                    statusText = "Lunch time";
                  }
                  return (
                    <Chip
                      key={periodItem.periodTime}
                      color="warning"
                      variant="flat"
                    >
                      {statusText} {periodItem.time} sec.
                    </Chip>
                  );
                }
                return null; // Render nothing if periodTime doesn't match
              })}
            </ModalHeader>
            <ModalBody className="flex flex-row">
              <div
                className="flex flex-col gap-2"
                style={{ width: "50%", height: "100%" }}
              >
                <div
                  className="flex gap-4"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <BaratsukiChallengeTab />
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
                  style={{ padding: "1rem", height: "100%" }}
                  shadow="sm"
                  radius="sm"
                  isBlurred
                >
                  {selected === "1hr" && <AreaPlotByHour />}
                  {selected === "5min" && <AreaPlotBy5minutes />}
                  {selected === "accum" && <AreaPlotByAccummulate />}
                </Card>
              </div>
              <div
                className="flex flex-col justify-between gap-4"
                style={{ width: "50%", height: "100%" }}
              >
                <div style={{ width: "100%" }} className="flex gap-4">
                  <div style={{ width: "40%", height: "13rem" }}>
                    <TableMock />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">Person In-Charge</p>
                    <ListBoxMember />
                  </div>
                </div>
                <div className="flex justify-between" style={{ width: "100%" }}>
                  <div className="space-y-1">
                    <h4 className="text-medium font-medium">
                      Recording and Highlights
                    </h4>
                    <p className="text-small text-default-400">
                      Click on any period to watch alarm.
                    </p>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">Download Video</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dynamic Actions" items={items}>
                      {(item) => (
                        <DropdownItem
                          key={item.key}
                          color={item.key === "delete" ? "danger" : "default"}
                          className={item.key === "delete" ? "text-danger" : ""}
                        >
                          {item.label}
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div style={{ width: "100%", height: "70%" }}>
                  <VideoPlayer />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose;
                  setDataBaratsuki([]);
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalHour;
