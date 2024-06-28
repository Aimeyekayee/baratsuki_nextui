import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Chip,
  TableCell,
} from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";

interface AlarmTable {
  key: string;
  alarm_no: number;
  alarm_message: string;
  count: number;
  waiting_time: number;
  recovery_time: number;
}

export default function AlarmHistoryTableEach() {
  const [selectedColor, setSelectedColor] = React.useState("default");
  const dateString = GeneralStore((state) => state.dateStrings);

  function formatDate(dateInput: string | string[]): string {
    if (Array.isArray(dateInput)) {
      throw new Error("Expected a single date string, but got an array");
    }

    const date = new Date(dateInput);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  }
  const formattedDate = formatDate(dateString);
  const sortPie = GeneralStore((state) => state.sortPie);

  let data: AlarmTable[] = [
    {
      key: "1",
      alarm_no: 100,
      alarm_message: "101_Work None Process",
      count: 8,
      waiting_time: 0,
      recovery_time: 125.0,
    },
    {
      key: "2",
      alarm_no: 99,
      alarm_message: "100_Slip Ring Run Out Check",
      count: 5,
      waiting_time: 0,
      recovery_time: 138.0,
    },
    {
      key: "3",
      alarm_no: 11,
      alarm_message: "012_Robot Loader Emergency",
      count: 2,
      waiting_time: 0,
      recovery_time: 1034,
    },
    {
      key: "4",
      alarm_no: 3,
      alarm_message: "004_[EX]Air Source Decreased",
      count: 1,
      waiting_time: 0,
      recovery_time: 8554,
    },
    {
      key: "5",
      alarm_no: 8,
      alarm_message: "EnterNet Unit0 Fault",
      count: 1,
      waiting_time: 0,
      recovery_time: 39.6,
    },
    {
      key: "6",
      alarm_no: 16,
      alarm_message: "017_Ethernet/IP Unit",
      count: 1,
      waiting_time: 0,
      recovery_time: 39.6,
    },
  ];
  if (sortPie === "1") {
    data.sort((a, b) => b.count - a.count);
  } else {
    data.sort((a, b) => b.recovery_time - a.recovery_time);
  }

  const renderRows = (data: AlarmTable[]) => {
    return data.map((item: AlarmTable) => (
      <TableRow key={item.key}>
        <TableCell>{item.alarm_no}</TableCell>
        <TableCell>{item.alarm_message}</TableCell>
        <TableCell>{item.count}</TableCell>
        <TableCell>{item.waiting_time}</TableCell>
        <TableCell>{item.recovery_time}</TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center">
        <p className="text-xl font-bold">Alarm History Table&nbsp;</p>
        <Chip color="warning" variant="dot">
          {formattedDate}
        </Chip>
      </div>
      <Table
        color="primary"
        selectionMode="single"
        // defaultSelectedKeys={["2"]}
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Alarm No.</TableColumn>
          <TableColumn>Message</TableColumn>
          <TableColumn>Count</TableColumn>
          <TableColumn>Waiting Time (s)</TableColumn>
          <TableColumn>Recovery Time (s)</TableColumn>
        </TableHeader>
        <TableBody>{renderRows(data)}</TableBody>
      </Table>
    </div>
  );
}
