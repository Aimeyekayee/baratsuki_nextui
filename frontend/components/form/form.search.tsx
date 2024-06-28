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

const FormSearch: React.FC<FormSearchProps> = ({
  id,
  onRemove,
  sortedSection,
  sortedLinename,
  machinename,
  onSectionChange,
  onLineNameChange,
  onMachineChange,
  onDateChange,
  onSearch,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();
  const searchParams = useSearchParams();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
  };

  const url_section_code = Number(searchParams.get("section_code"));
  const url_line_id = Number(searchParams.get("line_id"));
  const url_working_date = searchParams.get("working_date");
  const url_machine_no = searchParams.get("machine_no");
  const url_machine_no_array = url_machine_no ? url_machine_no.split("_") : [];

  const searchQuery = QueryParameterStore((state) => state.searchQuery);

  useEffect(() => {
    (async () => {
      try {
        await requestSection();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div className="flex items-center justify-center">
          <Button
            onClick={() => onRemove(id)}
            size="sm"
            isIconOnly
            style={{ background: "#fdd0df", color: "#F31260" }}
            radius="full"
          >
            <IconDeleteBin4Fill />
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <h2 style={{ color: "red" }}>*</h2>
          <h2>Section&nbsp;:&nbsp;</h2>
          <Select
            size="sm"
            isRequired
            label="Select Section"
            onChange={(e) => onSectionChange(e.target.value)}
            style={{ width: "15rem" }}
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
            onChange={(e) => onLineNameChange(e.target.value)}
            style={{ width: "15rem" }}
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
            style={{ width: "15rem" }}
            variant="faded"
            size="sm"
            onChange={(e) => onMachineChange(e.target.value)}
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
          <h2 style={{ color: "red" }}>*</h2>
          <h2>Date&nbsp;:&nbsp;</h2>
          <DatePicker
            onChange={(e) => onDateChange(e)}
            style={{ width: "15rem" }}
            size="lg"
            variant="faded"
            isRequired
          />
        </div>
      </form>
    </motion.div>
  );
};

export default FormSearch;
