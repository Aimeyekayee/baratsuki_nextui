"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import debounce from "lodash.debounce";
import { FieldValues, useForm } from "react-hook-form";
import { ISection } from "@/types/section.type";
import { useDateFormatter } from "@react-aria/i18n";
import dayjs from "dayjs";
import { MQTTStore } from "@/store/mqttStore";
import { motion } from "framer-motion";

import {
  Button,
  Select,
  SelectItem,
  SelectSection,
  DatePicker,
  Chip,
} from "@nextui-org/react";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import useStoreSearch from "@/action/useStoreSearch";
import {
  requestLinename,
  requestMachinenames,
  requestSection,
} from "@/action/request.search";
import IconDeleteBin4Fill from "../icons";
import {
  QueryParameterStore,
  initialSearchQuery,
} from "@/store/query.params.store";
import RangeCalendars from "../calendar/summary.calendar";
import { QueryParameter } from "@/store/interfaces/queryparams.interface";
import { SearchInputParams } from "@/types/baratsuki.type";
import { requestBaratsuki } from "@/action/request.fetch";
import { GeneralStore } from "@/store/general.store";

interface FormSearchProps {
  id: string;
  onRemove: (id: string) => void;
  sortedSection: any[];
  sortedLinename: any[];
  machinename: any[];
  onSectionChange: (value: string) => void;
  onLineNameChange: (value: string) => void;
  onMachineChange: (value: string) => void;
  onDateChange: (value: any) => void;
  onSearch: () => void;
}

const FormSearchSummary: React.FC = () => {
  const showData = GeneralStore((state) => state.showData);
  const setShowData = GeneralStore((state) => state.setShowData);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    addMachineNo,
    addLineID,
    addSectionCode,
    addWorkingDate,
    replaceMachineNo,
    replaceLineID,
    replaceSectionCode,
    replaceWorkingDate,
    setSearchQuery,
    searchQuery,
  } = QueryParameterStore();
  const { sections, linename, machinename } = useStoreSearch();
  const sortedSection = sections
    .slice()
    .sort((a: ISection, b: ISection) =>
      a.section_name.localeCompare(b.section_name)
    );
  const sortByFirstNumber = (a: any, b: any) => {
    const numA = parseInt(a.line_name.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.line_name.match(/\d+/)?.[0] || "0");
    return numA - numB;
  };
  const sortedLinename = linename.slice().sort(sortByFirstNumber);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await requestSection();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSectionChange = async (id: string, value: string) => {
    await requestLinename(value);
  };

  const handleLineNameChange = async (id: string, value: string) => {
    const parts = value.split("-");
    const line_id = parseInt(parts[parts.length - 1], 10);
    const section_code = parseInt(value.split(" ")[0]);
    await requestMachinenames(section_code);
    const sectionCodeParams = searchParams.get("section_code");
    const lineIdParams = searchParams.get("line_id");
    if (sectionCodeParams?.includes(id)) {
      replaceSectionCode(id, section_code.toString());
    } else {
      addSectionCode(`${section_code.toString()}`);
    }
    if (lineIdParams?.includes(id)) {
      replaceLineID(id, line_id.toString());
    } else {
      addLineID(`${line_id.toString()}`);
    }
  };

  const handleMachineChange = (id: string, value: string) => {
    const machineParams = searchParams.get("machine_no");
    if (machineParams?.includes(id)) {
      replaceMachineNo(id, value);
    } else {
      addMachineNo(`${value}`);
    }
  };

  const updateSearchQuery = debounce(() => {
    const params = new URLSearchParams();
    Object.keys(searchQuery).forEach((key) => {
      if (searchQuery[key as keyof QueryParameter]) {
        params.set(key, searchQuery[key as keyof QueryParameter] as string);
      }
    });
    params.set("shift", "1");
    const queryString = params.toString();
    const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(updatedPath);
  }, 500);

  useEffect(() => {
    updateSearchQuery();
    return () => {
      updateSearchQuery.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  const sectionCodeParams = searchParams.get("section_code");
  const lineIdParams = searchParams.get("line_id");
  const machineNoParams = searchParams.get("machine_no");
  const workingDateParams = searchParams.get("working_date");

  const handleSearch = async () => {
    // Split params into arrays, with default empty arrays if params are undefined
    if (
      !sectionCodeParams ||
      !lineIdParams ||
      !machineNoParams ||
      !workingDateParams
    ) {
      console.error("One or more required parameters are missing.");
      // Optionally handle the error or redirect to an error page
    } else {
      const sectionCode = parseInt(sectionCodeParams);
      const lineId = parseInt(lineIdParams);
      const machineNo = machineNoParams;
      const [startDateStr, endDateStr] = workingDateParams.split("x");

      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      const data: SearchInputParams[] = [];

      // Generate objects for each date in the range
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        data.push({
          section_code: sectionCode,
          line_id: lineId,
          machine_no: machineNo,
          working_date: formattedDate,
        });
      }

      console.log(data);
      await requestBaratsuki(data);
    }
    setShowData(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <h2 style={{ color: "red" }}>*</h2>
          <h2>Section&nbsp;:&nbsp;</h2>
          <Select
            size="sm"
            isRequired
            label="Select Section"
            onChange={(e) => handleSectionChange("", e.target.value)}
            style={{ width: "13rem" }}
            variant="faded"
          >
            <SelectSection>
              {sortedSection.map((option) => (
                <SelectItem
                  key={option.section_name}
                  value={option.section_name}
                >
                  {option.section_name}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <h2 style={{ color: "red" }}>*</h2>
          <h2>Line&nbsp;name&nbsp;:&nbsp;</h2>
          <Select
            size="sm"
            isRequired
            label="Select Line Name"
            onChange={(e) => handleLineNameChange("", e.target.value)}
            style={{ width: "12rem" }}
            variant="faded"
          >
            <SelectSection>
              {sortedLinename.map((option) => (
                <SelectItem
                  key={`${option.line_name}-${option.line_id}`}
                  value={`${option.line_name}-${option.line_id}`}
                >
                  {option.line_name}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <h2 style={{ color: "red" }}>*</h2>
          <h2>Machine&nbsp;name&nbsp;:&nbsp;</h2>
          <Select
            isRequired
            label="Select Machine Name"
            style={{ width: "10rem" }}
            variant="faded"
            size="sm"
            onChange={(e) => handleMachineChange("", e.target.value)}
          >
            <SelectSection>
              {machinename.map((option, idx) => (
                <SelectItem
                  key={`${option.machine_no}`}
                  value={option.machine_no}
                >
                  {option.machine_no + ` - ${option.machine_name}`}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <RangeCalendars />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button color="default" variant="faded">
            Clear
          </Button>
          <Button color="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormSearchSummary;
