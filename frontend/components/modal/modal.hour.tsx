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
} from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";
import { modal } from "@nextui-org/theme";
import { ModalOpenStore } from "@/store/modal.open.store";
import AreaPlot from "../chart/areaHour";
import TableMock from "../table/table.alarm";

const ModalHour: React.FC = () => {
  const modalOpen = ModalOpenStore((state) => state.openModal);
  const setOpenModal = ModalOpenStore((state) => state.setOpenModal);
  const dataTooltip = ModalOpenStore((state) => state.dataTooltip);
  const { onOpenChange } = useDisclosure(); // Unused

  const dayShiftTimes = [
    "07:35 - 08:30",
    "08:30 - 09:40",
    "09:40 - 09:50",
    "09:50 - 10:30",
    "10:30 - 11:30",
    "11:30 - 12:30",
    "12:30 - 13:30",
    "13:30 - 14:40",
    "14:40 - 14:50",
    "14:50 - 15:30",
    "15:30 - 16:30",
    "16:30 - 16:50",
    "16:50 - 17:50",
    "17:50 - 19:20",
  ];

  const nightShiftTimes = [
    "19:35 - 20:30",
    "20:30 - 21:30",
    "21:30 - 21:40",
    "21:40 - 22:30",
    "22:30 - 23:30",
    "23:30 - 00:20",
    "00:20 - 01:30",
    "01:30 - 02:30",
    "02:30 - 02:50",
    "02:50 - 03:30",
    "03:30 - 04:30",
    "04:30 - 04:50",
    "04:50 - 05:50",
    "05:50 - 07:20",
  ];
  //status 1=work , 2=rest 3=lunch
  const period = [
    { periodTime: "07:35 - 08:30", time: 3300, status: 1 },
    { periodTime: "08:30 - 09:40", time: 4200, status: 1 },
    { periodTime: "09:40 - 09:50", time: 600, status: 2 },
    { periodTime: "09:50 - 10:30", time: 2400, status: 1 },
    { periodTime: "10:30 - 11:30", time: 3600, status: 1 },
    { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
    { periodTime: "12:30 - 13:30", time: 3600, status: 1 },
    { periodTime: "13:30 - 14:40", time: 4200, status: 1 },
    { periodTime: "14:40 - 14:50", time: 600, status: 2 },
    { periodTime: "14:50 - 15:30", time: 2400, status: 1 },
    { periodTime: "15:30 - 16:30", time: 3600, status: 1 },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    { periodTime: "16:50 - 17:50", time: 3600, status: 1 },
    { periodTime: "17:50 - 19:20", time: 5400, status: 1 },
    { periodTime: "19:35 - 20:30", time: 3300, status: 1 },
    { periodTime: "20:30 - 21:30", time: 3600, status: 1 },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    { periodTime: "21:40 - 22:30", time: 3000, status: 1 },
    { periodTime: "22:30 - 23:30", time: 3600, status: 1 },
    { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
    { periodTime: "00:20 - 01:30", time: 4200, status: 1 },
    { periodTime: "01:30 - 02:30", time: 3600, status: 1 },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    { periodTime: "02:50 - 03:30", time: 2400, status: 1 },
    { periodTime: "03:30 - 04:30", time: 3600, status: 1 },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    { periodTime: "04:50 - 05:50", time: 3600, status: 1 },
    { periodTime: "05:50 - 07:20", time: 5400, status: 1 },
  ];

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onOpenChange={onOpenChange}
        onClose={() => setOpenModal(false)}
        size="5xl"
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
                <AreaPlot />
                  <ModalHour />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalHour;
