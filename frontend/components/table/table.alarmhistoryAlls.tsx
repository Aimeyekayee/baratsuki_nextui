import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Chip,
  TableCell,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";
import { SortIcon } from "../icon";

interface AlarmTable {
  key: string;
  machine_process: string;
  count: number;
  waiting_time: number;
  recovery_time: number;
}

export default function AlarmHistoryTable() {
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
  console.log(formattedDate);

  const sortPie = GeneralStore((state) => state.sortPie);
  const setSortPie = GeneralStore((state) => state.setSortPie);

  let data: AlarmTable[] = [
    {
      key: "1",
      machine_process: "MC1",
      count: 18,
      waiting_time: 0,
      recovery_time: 125.0,
    },
    {
      key: "2",

      machine_process: "MC2",
      count: 2,
      waiting_time: 0,
      recovery_time: 138.0,
    },
    {
      key: "3",

      machine_process: "MC3",
      count: 7,
      waiting_time: 0,
      recovery_time: 1034,
    },
    {
      key: "4",

      machine_process: "MC4",
      count: 15,
      waiting_time: 0,
      recovery_time: 8554,
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
        <TableCell>{item.machine_process}</TableCell>
        <TableCell>{item.count}</TableCell>
        <TableCell>{item.waiting_time}</TableCell>
        <TableCell>{item.recovery_time}</TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex">
          <p className="text-xl font-bold">Alarm History Table&nbsp;</p>
          <Chip color="warning" variant="dot">
            {formattedDate}
          </Chip>
        </div>
      </div>
      <Table
        color="primary"
        selectionMode="single"
        // defaultSelectedKeys={["2"]}
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>Machine Process</TableColumn>
          <TableColumn>Count</TableColumn>
          <TableColumn>Waiting Time (s)</TableColumn>
          <TableColumn>Recovery Time (s)</TableColumn>
        </TableHeader>
        <TableBody>{renderRows(data)}</TableBody>
      </Table>
    </div>
  );
}
