import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";
import { SortIcon } from "../icon";

const SortPieSelect = () => {
  const sortPie = GeneralStore((state) => state.sortPie);
  const setSortPie = GeneralStore((state) => state.setSortPie);
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortPie(e.target.value);
    console.log(e.target.value);
  };
  return (
    <Select
      className="w-[10rem] pt-4"
      defaultSelectedKeys={[sortPie]}
      selectedKeys={[sortPie]}
      label="Sort by"
      placeholder="Select an animal"
      color="success"
      size="sm"
      startContent={<SortIcon />}
      onChange={handleSelectionChange}
    >
      <SelectItem key={1}>Count</SelectItem>
      <SelectItem key={2}>Recovery Time</SelectItem>
    </Select>
  );
};

export default SortPieSelect;
