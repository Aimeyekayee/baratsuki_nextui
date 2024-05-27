"use client";
import React, { useState, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { requestSection } from "@/action/request.record";
import { requestMachinename } from "@/action/request.record";
import { useDateFormatter } from "@react-aria/i18n";
import dayjs from "dayjs";
import { GeneralStore } from "@/store/general.store";
import { MQTTStore } from "@/store/mqttStore";
import {
  Button,
  Select,
  SelectItem,
  SelectSection,
  Selection,
  DatePicker,
} from "@nextui-org/react";
import { SearchRecStore } from "@/store/search.store";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { ISection } from "@/types/section.type";
import {
  requestDataByShiftColumn,
  requestDataDay,
  requestDataNight,
} from "@/action/requrest.data";

const FormSearch = () => {
  let formatter = useDateFormatter({ dateStyle: "medium" });
  const currentDate = dayjs().format("YYYY-MM-DD");
  const shift = GeneralStore((state) => state.shift);
  const dateStrings = GeneralStore((state) => state.dateStrings);
  const setDateString = GeneralStore((state) => state.setDateStrings);
  const setIsOdd = GeneralStore((state) => state.setIsOdd);
  const sections = SearchRecStore((state) => state.sections);
  const machinename = SearchRecStore((state) => state.name_no_machine);
  const linename = SearchRecStore((state) => state.line_name);
  const set_linename = SearchRecStore((state) => state.setLinename);
  const {
    client,
    isConnected,
    connect,
    disconnect,
    setMqttDataMachine1,
    setMqttDataMachine2,
    mqttDataMachine1,
    mqttDataMachine2,
  } = MQTTStore();

  const [section, setSection] = useState("");
  const [section_code, setSection_code] = useState<number>(0);
  const [nextDate, setNextDate] = useState<string>("");
  const [lineId, setLineID] = useState<number | undefined>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();
  const machine_no_from_form = ["6EW-0040", "6TM-0315"];
  const sortedSection = sections
    .slice()
    .sort((a: ISection, b: ISection) =>
      a.section_name.localeCompare(b.section_name)
    );

  const sortByFirstNumber = (a: any, b: any) => {
    const numA = parseInt(a.line_name.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.line_name.match(/\d+/)?.[0] || 0);
    return numA - numB;
  };
  const sortedLinename = linename.slice().sort(sortByFirstNumber);

  const onSubmit = async (data: FieldValues) => {
    console.log(data); // { selectedOption: 'selected value' }
  };
  const onSectionChange = async (value: Selection | any) => {
    setSection(value.currentKey);
    try {
      const response = await axios.get(`http://10.122.77.1:8004/get_linename`, {
        params: { section_name: value.currentKey },
      });
      if (response.status === 200) {
        console.log(response.data);
        set_linename(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onLineNameChange = async (value: Selection | any) => {
    console.log(value);
    const parts: string[] = value.currentKey.split("-");
    const line_id = parseInt(parts[2]);
    console.log(line_id);
    setLineID(line_id);
    const section_code = parseInt(value.currentKey.split(" ")[0]);
    console.log(section_code);
    setSection_code(section_code);
    await requestMachinename(section_code);
  };

  const onDateChange = (value: DateValue | any) => {
    setIsOdd(value.month);
    const date = formatter.format(value.toDate(getLocalTimeZone()));
    const orginalDate = new Date(date);
    const year = orginalDate.getFullYear();
    const month = ("0" + (orginalDate.getMonth() + 1)).slice(-2);
    const day = ("0" + orginalDate.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    setDateString(formattedDate);
    const selectDate = new Date(formattedDate);
    selectDate.setDate(selectDate.getDate() + 1);
    const nextDate = selectDate.toISOString().split("T")[0];
    setNextDate(nextDate);
  };
  const isOdd = GeneralStore((state) => state.isOdd);
  const FetchSetting = async () => {
    const machine_no = getValues(["machine_no"]);
    const split_machine = machine_no[0]?.split(",");
    const modifiedData = split_machine.map((item: any) =>
      item.replace(/-\d+$/, "")
    );
    console.log(modifiedData);
    try {
      const paramsDay = {
        section_code: section_code,
        line_id: lineId,
        machine_no1: modifiedData[0],
        machine_no2: modifiedData[1],
        date_current: dateStrings,
        next_date: nextDate,
        isOdd: isOdd,
        shift: "day",
      };
      const paramsNight = {
        section_code: section_code,
        line_id: lineId,
        machine_no1: modifiedData[0],
        machine_no2: modifiedData[1],
        date_current: dateStrings,
        next_date: nextDate,
        isOdd: isOdd,
        shift: "night",
      };
      const paramsByColumn = {
        section_code: section_code,
        line_id: lineId,
        machine_no1: modifiedData[0],
        machine_no2: modifiedData[1],
        date_current: dateStrings,
        next_date: nextDate,
      };
      if (shift === "day") {
        await requestDataDay(paramsDay);
      } else {
        await requestDataNight(paramsNight);
      }
      await requestDataByShiftColumn(paramsByColumn);
    } catch (err) {
      console.error(err);
    }
  };

  const onSearch = async () => {
    if (currentDate === dateStrings) {
      connect();
      const now = new Date();
      const nextRun = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        Math.floor(now.getMinutes() / 5) * 5, // Round down to the nearest 5th minute
        0 // Set seconds to 0
      );

      const delay = nextRun.getTime() - now.getTime(); // Calculate delay in milliseconds
      setTimeout(async () => {
        await FetchSetting();
      }, delay);
    } else {
      FetchSetting();
      disconnect();
    }
  };

  useEffect(() => {
    if (!client) return;

    client.on("connect", () => {
      console.log("connected!");
      //!อาจจะพิจารณาแค่ 2 อันตาม form ที่เก็บจาก select
      client.subscribe([
        "414273/86/baratsuki/+/raw",
        // "test1emqxmqtt414272/A220/AddOn_Zone2/faultcode/Raw",
      ]);
      client.on("message", async (topic, payload) => {
        const data = JSON.parse(payload.toString());
        if (data.machine_no === machine_no_from_form.at(0)) {
          console.log(data);
          setMqttDataMachine1(data);
        } else if (data.machine_no === machine_no_from_form.at(1)) {
          setMqttDataMachine2(data);
        }
      });
    }); //ดึงจาก environment

    return () => {
      console.log("run before change page");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, setMqttDataMachine1, setMqttDataMachine2]);

  useEffect(() => {
    (async () => {
      try {
        await requestSection();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (section !== "") {
      const machine_no = getValues(["machine_no"]);
      const split_machine = machine_no[0]?.split(",");
      const modifiedData = split_machine.map((item: any) =>
        item.replace(/-\d+$/, "")
      );
      const paramsDay = {
        section_code: section_code,
        line_id: lineId,
        machine_no1: modifiedData[0],
        machine_no2: modifiedData[1],
        date_current: dateStrings,
        next_date: nextDate,
        isOdd: isOdd,
        shift: "day",
      };
      const paramsNight = {
        section_code: section_code,
        line_id: lineId,
        machine_no1: modifiedData[0],
        machine_no2: modifiedData[1],
        date_current: dateStrings,
        next_date: nextDate,
        isOdd: isOdd,
        shift: "night",
      };
      const paramsByColumn = {
        section_code: section_code,
        line_id: lineId,
        machine_no1: modifiedData[0],
        machine_no2: modifiedData[1],
        date_current: dateStrings,
        next_date: nextDate,
      };
      if (shift === "day") {
        requestDataDay(paramsDay);
      } else {
        requestDataNight(paramsNight);
      }
      requestDataByShiftColumn(paramsByColumn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
      <div className="flex items-center justify-center">
        <h2 style={{ color: "red" }}>*</h2>
        <h2>Section&nbsp;:&nbsp;</h2>
        <Select
          isRequired
          label="Select Section"
          onSelectionChange={onSectionChange}
          {...register("section", { required: true })}
          style={{ width: "15rem" }}
          variant="faded"
        >
          <SelectSection>
            {sortedSection.map((option) => (
              <SelectItem key={option.section_name} value={option.section_name}>
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
          isRequired
          label="Select Line Name"
          onSelectionChange={onLineNameChange}
          {...register("line_name", { required: true })}
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
          selectionMode="multiple"
          style={{ width: "15rem" }}
          variant="faded"
          {...register("machine_no", {
            validate: (value) =>
              value.length === 2 || "Please select exactly 2 options.",
          })}
        >
          <SelectSection>
            {machinename.map((option, idx) => (
              <SelectItem
                key={`${option.machine_no}-${idx}`}
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
          onChange={onDateChange}
          style={{ width: "15rem" }}
          size="lg"
          variant="faded"
          isRequired
        />
      </div>
      <div className="flex items-center justify-center">
        <Button
          type="submit"
          disabled={isSubmitting}
          color="primary"
          onClick={onSearch}
        >
          See Baratsuki
        </Button>
      </div>
    </form>
  );
};

export default FormSearch;
