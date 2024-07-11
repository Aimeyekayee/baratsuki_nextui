"use client";

import type { InputProps } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";
import {
  Input,
  Checkbox,
  Link,
  Select,
  SelectSection,
  SelectItem,
} from "@nextui-org/react";

import { cn } from "./cn";
import useStoreSearch from "@/action/useStoreSearch";
import { ISection } from "@/types/section.type";
import {
  requestLinename,
  requestMachinenames,
  requestSection,
} from "@/action/request.search";
import {
  sortedLineName,
  sortedSection,
} from "@/functions/other/sort.selection";
import { SummarySelectStore } from "@/store/summary.select.store";

export type SelectFormProps = React.HTMLAttributes<HTMLFormElement>;

const SelectForm = React.forwardRef<HTMLFormElement, SelectFormProps>(
  ({ className, ...props }, ref) => {
    const inputProps: Pick<InputProps, "labelPlacement" | "classNames"> = {
      labelPlacement: "outside",
      classNames: {
        label:
          "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
      },
    };
    const router = useRouter();
    const { sections, linename, machinename } = useStoreSearch();
    const selectLineID = SummarySelectStore((state) => state.selectLineID);
    const selectSectionCode = SummarySelectStore(
      (state) => state.selectSectionCode
    );
    const selectMachineNo = SummarySelectStore(
      (state) => state.selectMachineNo
    );
    const setSelectLineID = SummarySelectStore(
      (state) => state.setSelectLineID
    );
    const setSelectMachineNo = SummarySelectStore(
      (state) => state.setSelectMachineNo
    );
    const setSelectSectionCode = SummarySelectStore(
      (state) => state.setSelectSectionCode
    );
    useEffect(() => {
      (async () => {
        try {
          await requestSection();
        } catch (err) {
          console.error(err);
        }
      })();
    }, []);

    const handleSectionChange = async (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      await requestLinename(e.target.value);
    };

    const handleLinenameChange = async (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const value = e.target.value;
      const parts = value.split("-");
      const line_id = parseInt(parts[parts.length - 1], 10);
      const section_code = parseInt(value.split(" ")[0]);
      setSelectLineID(line_id);
      setSelectSectionCode(section_code);
      await requestMachinenames(section_code);
    };

    const handleMachineChange = async (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setSelectMachineNo(e.target.value);
    };

    return (
      <>
        <div className="text-3xl font-bold leading-9 text-default-foreground">
          Welcome to Summary Dashboard 👋
        </div>
        <div className="py-2 text-medium text-default-500">
          Do you want to see daily performance?
          <Link className="ml-2 text-secondary underline" size="md">
            <span
              onClick={() => router.push("/daily")}
              className="cursor-pointer"
            >
              Explore
            </span>
          </Link>
        </div>
        <form
          ref={ref}
          {...props}
          className={cn(
            "flex grid grid-cols-12 flex-col gap-4 py-8",
            className
          )}
        >
          <Select
            className="col-span-12"
            isRequired
            label="Section"
            placeholder="Select a section"
            onChange={handleSectionChange}
            {...inputProps}
          >
            <SelectSection>
              {sortedSection(sections).map((option) => (
                <SelectItem
                  key={option.section_name}
                  value={option.section_name}
                >
                  {option.section_name}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>
          <Select
            className="col-span-12"
            isRequired
            label="Line name"
            placeholder="Select a line name"
            onChange={handleLinenameChange}
            {...inputProps}
          >
            <SelectSection>
              {sortedLineName(linename).map((option) => (
                <SelectItem
                  key={`${option.line_name}-${option.line_id}`}
                  value={`${option.line_name}-${option.line_id}`}
                >
                  {option.line_name}
                </SelectItem>
              ))}
            </SelectSection>
          </Select>

          <Select
            className="col-span-12"
            isRequired
            label="Machine No."
            placeholder="Select a machine number"
            onChange={handleMachineChange}
            {...inputProps}
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
        </form>
      </>
    );
  }
);

SelectForm.displayName = "SelectForm";

export default SelectForm;
