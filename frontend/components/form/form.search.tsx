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
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  SelectSection,
  Selection,
  DatePicker,
} from "@nextui-org/react";
import { SearchRecStore } from "@/store/search.store";
import {
  DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
import { ISection } from "@/types/section.type";
import { ZonedDateTime } from "@internationalized/date";
import { ModalOpenStore } from "@/store/modal.open.store";

const FormSearch = () => {
  let formatter = useDateFormatter({ dateStyle: "medium" });

  const shift = GeneralStore((state) => state.shift);
  const setShift = GeneralStore((state) => state.setShift);
  const [section, setSection] = useState("");
  const [lineName, setLineName] = useState("");
  const [machineNames, setMachineNames] = useState([]);
  const sections = SearchRecStore((state) => state.sections);
  const machinename = SearchRecStore((state) => state.name_no_machine);
  const modalOpen = ModalOpenStore((state) => state.openModal);

  const sortedSection = sections
    .slice()
    .sort((a: ISection, b: ISection) =>
      a.section_name.localeCompare(b.section_name)
    );
  const set_linename = SearchRecStore((state) => state.setLinename);
  const linename = SearchRecStore((state) => state.line_name);
  const sortByFirstNumber = (a: any, b: any) => {
    const numA = parseInt(a.line_name.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.line_name.match(/\d+/)?.[0] || 0);
    return numA - numB;
  };
  const sortedLinename = linename.slice().sort(sortByFirstNumber);
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

  const machine_no_from_form = ["6EW-0040", "6TM-0315"];

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
  }, [client, setMqttDataMachine1, setMqttDataMachine2]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const onSubmit = async (data: FieldValues) => {
    console.log(data); // { selectedOption: 'selected value' }
  };
  const onSectionChange = async (value: Selection | any) => {
    try {
      const response = await axios.get(`http://localhost:8000/get_linename`, {
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

  const [section_code, setSection_code] = useState<number>(0);

  const onLineNameChange = async (value: Selection | any) => {
    console.log(value);
    const parts: string[] = value.currentKey.split("-");
    // const line_id: number = parseInt(parts[1].trim());
    const line_id = parseInt(parts[2]);
    console.log(line_id);
    setLineID(line_id);
    const section_code = parseInt(value.currentKey.split(" ")[0]);
    console.log(section_code);
    setSection_code(section_code);
    await requestMachinename(section_code);
  };
  const setDateString = GeneralStore((state) => state.setDateStrings);
  const dateStrings = GeneralStore((state) => state.dateStrings);
  const [nextDate, setNextDate] = useState<string>("");
  const currentDate = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    (async () => {
      try {
        await requestSection();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const [lineId, setLineID] = useState<number | undefined>(0);
  const setTargetNotRealTimeMC1 = GeneralStore(
    (state) => state.setTargetNotRealTimeMC1
  );
  const setTargetNotRealTimeMC2 = GeneralStore(
    (state) => state.setTargetNotRealTimeMC2
  );
  const setActualNotRealTimeMC1 = GeneralStore(
    (state) => state.setActualNotRealTimeMC1
  );
  const setActualNotRealTimeMC2 = GeneralStore(
    (state) => state.setActualNotRealTimeMC2
  );
  const setIsOdd = GeneralStore((state) => state.setIsOdd);
  const onMultiChange = (value: Selection | any) => {};

  const onDateChange = (value: DateValue | any) => {
    // console.log(value.month);
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
  const setZone1 = GeneralStore((state) => state.setZone1);
  const setZone2 = GeneralStore((state) => state.setZone2);
  const isOdd = GeneralStore((state) => state.isOdd);
  const FetchSetting = async () => {
    const machine_no = getValues(["machine_no"]);
    const split_machine = machine_no[0].split(",");
    const modifiedData = split_machine.map((item: any) =>
      item.replace(/-\d+$/, "")
    );
    console.log(modifiedData);
    try {
      const response = await axios.get(
        "http://localhost:8000/get_dataparameter",
        {
          params: {
            section_code: section_code,
            line_id: lineId,
            machine_no1: modifiedData[0],
            machine_no2: modifiedData[1],
            date_current: dateStrings,
            next_date: nextDate,
            isOdd: isOdd,
            shift: shift,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const result = response.data;
        console.log(result);
        const dayShiftTimes1 = [
          "07:35:00",
          "08:30:00",
          "09:30:00",
          "09:40:00",
          "10:30:00",
          "11:15:00",
          "12:15:00",
          "13:30:00",
          "14:30:00",
          "14:40:00",
          "15:30:00",
          "16:30:00",
          "16:50:00",
          "17:50:00",
          "19:20:00",
        ];
        const dayShiftTimes2 = [
          "07:35:00",
          "08:30:00",
          "09:20:00",
          "09:30:00",
          "10:30:00",
          "11:30:00",
          "12:30:00",
          "13:30:00",
          "14:20:00",
          "14:30:00",
          "15:30:00",
          "16:30:00",
          "16:50:00",
          "17:50:00",
          "19:20:00",
        ];

        const nightShiftTimes1 = [
          "19:35:00",
          "20:30:00",
          "21:30:00",
          "21:40:00",
          "22:30:00",
          "23:15:00",
          "00:05:00",
          "01:30:00",
          "02:30:00",
          "02:50:00",
          "03:30:00",
          "04:30:00",
          "04:50:00",
          "05:50:00",
          "07:20:00",
        ];

        const nightShiftTimes2 = [
          "19:35:00",
          "20:30:00",
          "21:30:00",
          "21:40:00",
          "22:30:00",
          "23:30:00",
          "00:20:00",
          "01:30:00",
          "02:30:00",
          "02:50:00",
          "03:30:00",
          "04:30:00",
          "04:50:00",
          "05:50:00",
          "07:20:00",
        ];

        // const dayShiftTimes = [
        //   "07:35:00",
        //   "08:30:00",
        //   "09:40:00",
        //   "09:50:00",
        //   "10:30:00",
        //   "11:30:00",
        //   "12:30:00",
        //   "13:30:00",
        //   "14:40:00",
        //   "14:50:00",
        //   "15:30:00",
        //   "16:30:00",
        //   "16:50:00",
        //   "17:50:00",
        //   "19:20:00",
        // ];

        // const nightShiftTimes = [
        //   "19:35:00",
        //   "20:30:00",
        //   "21:30:00",
        //   "21:40:00",
        //   "22:30:00",
        //   "23:30:00",
        //   "00:20:00",
        //   "01:30:00",
        //   "02:30:00",
        //   "02:50:00",
        //   "03:30:00",
        //   "04:30:00",
        //   "04:50:00",
        //   "05:50:00",
        //   "07:20:00",
        // ];

        const uniqueMachines = Array.from(
          new Set(result.map((item: any) => item.machine_no))
        );
        console.log(uniqueMachines);
        const machineNo1Results: any[] = [];
        const machineNo2Results: any[] = [];

        result.forEach((item: any) => {
          if (item.machine_no === uniqueMachines.at(0)) {
            machineNo1Results.push(item);
          } else if (item.machine_no === uniqueMachines.at(1)) {
            machineNo2Results.push(item);
          }
        });
        let previousDayValueMc1 = 0;
        let previousNightValueMc1 = 0;
        let previousDayValueMc2 = 0;
        let previousNightValueMc2 = 0;

        console.log(machineNo1Results);

        machineNo1Results.forEach((entry, index) => {
          const time = new Date(entry.date).toLocaleTimeString("en-US", {
            hour12: false,
          });
          const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
          const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
          const isDayShift = dayShiftTimes.includes(time);
          const isNightShift = nightShiftTimes.includes(time);
          entry.shift = isDayShift ? "day" : "night";

          if (isDayShift) {
            if (
              time === (isOdd ? "09:40:00" : "09:30:00") ||
              time === (isOdd ? "12:15:00" : "12:30:00") ||
              time === (isOdd ? "14:40:00" : "14:30:00") ||
              time === "16:50:00"
            ) {
              entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
            } else {
              entry.value = entry.data.prod_actual - previousDayValueMc1;
              previousDayValueMc1 = entry.data.prod_actual;
            }
          } else if (isNightShift) {
            if (
              time === "21:40:00" ||
              time === (isOdd ? "00:05:00" : "00:20:00") ||
              time === "02:50:00" ||
              time === "04:50:00"
            ) {
              entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
            } else {
              entry.value =
                time === "19:35:00"
                  ? 0
                  : entry.data.prod_actual - previousNightValueMc1;
              previousNightValueMc1 = entry.data.prod_actual;
            }
          }
          entry.period = time;
          entry.type = "actual";
          console.log(entry);
        });
        console.log(machineNo1Results);

        const lastIndexObjectMachine1 =
          machineNo1Results[machineNo1Results.length - 1].data.prod_actual;

        machineNo2Results.forEach((entry, index) => {
          const time = new Date(entry.date).toLocaleTimeString("en-US", {
            hour12: false,
          });
          const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
          const isDayShift = dayShiftTimes.includes(time);
          const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
          const isNightShift = nightShiftTimes.includes(time);

          entry.shift = isDayShift ? "day" : "night";

          if (isDayShift) {
            if (
              time === (isOdd ? "09:40:00" : "09:30:00") ||
              time === (isOdd ? "12:15:00" : "12:30:00") ||
              time === (isOdd ? "14:40:00" : "14:30:00") ||
              time === "16:50:00"
            ) {
              entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
            } else {
              entry.value = entry.data.prod_actual - previousDayValueMc2;
              previousDayValueMc2 = entry.data.prod_actual;
            }
          } else if (isNightShift) {
            if (
              time === "21:40:00" ||
              time === (isOdd ? "00:05:00" : "00:20:00") ||
              time === "02:50:00" ||
              time === "04:50:00"
            ) {
              entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
            } else {
              entry.value =
                time === "19:35:00"
                  ? 0
                  : entry.data.prod_actual - previousNightValueMc2;
              previousNightValueMc2 = entry.data.prod_actual;
            }
          }

          entry.period = time;
          entry.type = "actual";
          console.log(entry);
        });

        const lastIndexObjectMachine2 =
          machineNo2Results[machineNo2Results.length - 1].data.prod_actual;

        const results1 = machineNo1Results.filter(
          (item: any) => item.shift === shift
        );
        const results2 = machineNo2Results.filter(
          (item: any) => item.shift === shift
        );

        console.log("result1", results1);
        console.log("result2", results2);

        const resultTest1 = results1
          .map((item: any, index: any, array: any) => {
            if (index < array.length - 1) {
              const beginDate = new Date(item.date);
              const endDate = new Date(array[index + 1].date);
              const deltaTime =
                (endDate.getTime() - beginDate.getTime()) / 1000;
              return {
                begin: item.date,
                end: array[index + 1].date,
                time: deltaTime,
              };
            }
            return null;
          })
          .filter((item: any) => item !== null); // Filter out nulls

        const resultTest2 = results2
          .map((item: any, index: any, array: any) => {
            if (index < array.length - 1) {
              const beginDate = new Date(item.date);
              const endDate = new Date(array[index + 1].date);
              const deltaTime =
                (endDate.getTime() - beginDate.getTime()) / 1000;
              return {
                begin: item.date,
                end: array[index + 1].date,
                time: deltaTime,
              };
            }
            return null;
          })
          .filter((item: any) => item !== null); // Filter out nulls
        const timesToRemove1 = [
          "09:30:00",
          "11:15:00",
          "14:30:00",
          "16:30:00",
          "21:30:00",
          "23:15:00",
          "02:30:00",
          "04:30:00",
        ];

        const timesToRemove2 = [
          "09:20:00",
          "11:30:00",
          "14:20:00",
          "16:30:00",
          "21:30:00",
          "23:30:00",
          "02:30:00",
          "04:30:00",
        ];

        const timesToRemove = isOdd ? timesToRemove1 : timesToRemove2;

        // const timesToRemove = [
        //   "09:40:00",
        //   "11:30:00",
        //   "14:40:00",
        //   "16:30:00",
        //   "21:30:00",
        //   "23:30:00",
        //   "02:30:00",
        //   "04:30:00",
        // ];

        const filteredResults11 = resultTest1.filter((item) => {
          const timePart = item?.begin.split("T")[1];
          return !timesToRemove.includes(timePart);
        });

        const filteredResults22 = resultTest2.filter((item) => {
          const timePart = item?.begin.split("T")[1];
          return !timesToRemove.includes(timePart);
        });

        console.log(filteredResults11);
        const sumTimeTarget1 =
          filteredResults11.reduce((total, item: any) => total + item.time, 0) /
          16.5;
        setTargetNotRealTimeMC1(sumTimeTarget1);

        const sumTimeTarget2 =
          filteredResults22.reduce((total, item: any) => total + item.time, 0) /
          16.5;
        setTargetNotRealTimeMC2(sumTimeTarget2);

        const excludedPeriods = ["07:35:00", "19:35:00"];

        const filteredResults1 = results1.filter(
          (item: any) => !excludedPeriods.includes(item.period)
        );
        const filteredResults2 = results2.filter(
          (item: any) => !excludedPeriods.includes(item.period)
        );
        console.log(filteredResults1);

        setZone1(filteredResults1);

        const periodsToExclude1 = [
          "21:40:00",
          "00:05:00",
          "02:50:00",
          "04:50:00",
          "09:40:00",
          "12:15:00",
          "14:40:00",
          "16:50:00",
        ];
        const periodsToExclude2 = [
          "21:40:00",
          "00:20:00",
          "02:50:00",
          "04:50:00",
          "09:30:00",
          "12:30:00",
          "14:30:00",
          "16:50:00",
        ];

        // const periodsToExclude = [
        //   "21:40:00",
        //   "00:20:00",
        //   "02:50:00",
        //   "04:50:00",
        //   "09:50:00",
        //   "12:30:00",
        //   "14:50:00",
        //   "16:50:00",
        // ];

        const periodsToExclude = isOdd ? periodsToExclude1 : periodsToExclude2;

        const sumOfNumbers1 = filteredResults1.reduce(
          (accumulator, currentValue) => {
            if (!periodsToExclude.includes(currentValue.period)) {
              return accumulator + currentValue.value;
            } else {
              return accumulator;
            }
          },
          0
        );
        console.log(sumOfNumbers1);
        setActualNotRealTimeMC1(sumOfNumbers1);
        setZone2(filteredResults2);
        console.log(filteredResults2);
        console.log(filteredResults22);
        const sumOfNumbers2 = filteredResults2.reduce(
          (accumulator, currentValue) => {
            if (!periodsToExclude.includes(currentValue.period)) {
              return accumulator + currentValue.value;
            } else {
              return accumulator;
            }
          },
          0
        );
        setActualNotRealTimeMC2(sumOfNumbers2);
        console.log("filterRes2", filteredResults2);

        console.log("res1", results1);
        console.log("res2", results2);
      }
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
      <div className="flex items-center justify-center">
        <h2 style={{ color: "red" }}>*</h2>
        <h2>Section&nbsp;:&nbsp;</h2>
        <Select
          isRequired
          label="Select Section"
          // value={section}
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
          // value={lineName}
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
          // value={machineNames}
          onSelectionChange={onMultiChange}
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
        <h2>Shift&nbsp;:&nbsp;</h2>
        <RadioGroup
          isRequired
          orientation="horizontal"
          value={shift}
          onValueChange={setShift}
          {...register("shift", { required: true })}
        >
          <Radio value="day">Day</Radio>
          <Radio value="night">Night</Radio>
        </RadioGroup>
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
