"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import useStoreSearch from "@/action/useStoreSearch";
import FormSearch from "./form.search";
import { ISection } from "@/types/section.type";
import { AnimatePresence } from "framer-motion";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { requestLinename, requestMachinenames } from "@/action/request.search";
import { useDateFormatter } from "@react-aria/i18n";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import ShortUniqueId from "short-unique-id";
import { QueryParameterStore } from "@/store/query.params.store";
import debounce from "lodash.debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { QueryParameter } from "@/store/interfaces/queryparams.interface";
import { SearchInputParams } from "@/types/baratsuki.type";
import dayjs from "dayjs";
import { requestBaratsuki } from "@/action/request.fetch";
import { MQTTStore } from "@/store/mqttStore";
import { IMqttResponse } from "@/types/MqttType";
interface FormItem {
  id: string;
}

//!จะต้องแก้เรื่องการ fetch line name และ machine_name เนื่องจาก set เป็น store เดียวเลยทำให้
//!เมื่อเลือกตัวเลือกที่ 2 store ของตัวเลือกที่ 2 จะโดนทับไป ต้องทำให้แยกกันให้ได้

//!ทำ remove query paramerter ด้วย เมื่อ close form

const FormContainerSumary: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const {
    client,
    isConnected,
    connect,
    disconnect,
    mqttDataMachine,
    addOrUpdatePayload,
  } = MQTTStore();

  const currentDate = dayjs().format("YYYY-MM-DD");
  const sectionCodeParams = searchParams.get("section_code");
  const lineIdParams = searchParams.get("line_id");
  const machineNoParams = searchParams.get("machine_no");
  const workingDateParams = searchParams.get("working_date");
  const formatter = useDateFormatter({ dateStyle: "medium" });
  const uid = new ShortUniqueId({ length: 5 });
  const [forms, setForms] = useState<FormItem[]>([{ id: uid.rnd() }]);

  const addForm = () => {
    setForms([...forms, { id: uid.rnd() }]);
  };

  const removeForm = (id: string) => {
    console.log(...forms);
    const line_id_parts = lineIdParams?.split("_");
    const section_code_parts = sectionCodeParams?.split("_");
    const machine_no_parts = machineNoParams?.split("_");
    const working_date_parts = workingDateParams?.split("_");

    if (
      !line_id_parts ||
      !section_code_parts ||
      !machine_no_parts ||
      !working_date_parts
    ) {
      console.log("One or more parameters are missing.");
      return;
    }

    const index = line_id_parts.findIndex((part) => part.includes(id));

    if (index !== -1) {
      const joinWithDelimiter = (parts: string[], index: number) => {
        const before = parts.slice(0, index).join("_");
        const after = parts.slice(index + 1).join("_");
        return [before, after].filter((part) => part).join("_");
      };

      const newData = {
        shift: "1",
        line_id: joinWithDelimiter(line_id_parts, index),
        section_code: joinWithDelimiter(section_code_parts, index),
        machine_no: joinWithDelimiter(machine_no_parts, index),
        working_date: joinWithDelimiter(working_date_parts, index),
      };

      setSearchQuery(newData);
      setForms(forms.filter((form) => form.id !== id));
    } else {
      console.log("ID not found in line_id parts.");
    }
  };
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
      addSectionCode(`${section_code.toString()}v${id}v`);
    }
    if (lineIdParams?.includes(id)) {
      replaceLineID(id, line_id.toString());
    } else {
      addLineID(`${line_id.toString()}v${id}v`);
    }
  };

  const handleMachineChange = (id: string, value: string) => {
    const machineParams = searchParams.get("machine_no");
    if (machineParams?.includes(id)) {
      replaceMachineNo(id, value);
    } else {
      addMachineNo(`${value}v${id}v`);
    }
  };

  const handleDateChange = (id: string, value: any) => {
    const workingDateParams = searchParams.get("working_date");

    const date = formatter.format(value.toDate(getLocalTimeZone()));
    const orginalDate = new Date(date);
    const year = orginalDate.getFullYear();
    const month = ("0" + (orginalDate.getMonth() + 1)).slice(-2);
    const day = ("0" + orginalDate.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    if (workingDateParams?.includes(id)) {
      replaceWorkingDate(id, formattedDate);
    } else {
      addWorkingDate(`${formattedDate}v${id}v`);
    }
  };

  const [topicMqtt, setTopicMqtt] = useState<string[]>([]);

  useEffect(() => {
    if (!client) return;

    let latestData: IMqttResponse[] = [];

    const handleMessage = (topic: string, payload: Buffer) => {
      const data: IMqttResponse = JSON.parse(payload.toString());
      if (topicMqtt.some((t) => t.includes(data.machine_no))) {
        latestData.push(data);
      }
    };

    client.on("connect", () => {
      console.log("connected!");
      client.subscribe(topicMqtt);
      client.on("message", handleMessage);
    });

    const interval = setInterval(() => {
      if (latestData.length > 0) {
        latestData.forEach((data) => addOrUpdatePayload(data));
        latestData = [];
      }
    }, 15000); // 30 seconds interval

    return () => {
      clearInterval(interval);
      if (client) {
        client.off("message", handleMessage);
        client.unsubscribe(topicMqtt);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, addOrUpdatePayload]);

  const handleSearch = async () => {
    // Split params into arrays, with default empty arrays if params are undefined
    const lineIds = (lineIdParams || "").split("_");
    const sectionCodes = (sectionCodeParams || "").split("_");
    const machineNos = (machineNoParams || "").split("_");
    const workingDates = (workingDateParams || "").split("_");

    // Check if all arrays are defined and have the same length
    if (
      lineIds.length > 0 &&
      lineIds.length === sectionCodes.length &&
      lineIds.length === machineNos.length &&
      lineIds.length === workingDates.length
    ) {
      // Map arrays to create newData array, removing trailing 'v--------------v'
      const newData: SearchInputParams[] = lineIds.map((line_id, index) => ({
        line_id: Number(line_id.replace(/v.*$/, "")),
        section_code: Number(sectionCodes[index].replace(/v.*$/, "")),
        machine_no: machineNos[index].replace(/v.*$/, ""),
        working_date: workingDates[index].replace(/v.*$/, ""),
      }));
      const topic = newData
        .filter((item) => item.working_date === currentDate)
        .map(
          (item) => `${item.section_code}/86/baratsuki/${item.machine_no}/raw`
        );

      //!change 86 to item.line_id
      if (topic.length > 0) {
        console.log(topic);
        setTopicMqtt(topic);
        connect();
      } else {
        disconnect();
        client?.off;
      }
      await requestBaratsuki(newData);
    } else {
      console.error("Arrays are not defined or do not have the same length.");
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

  const isDisable =
    !searchParams.has("section_code") ||
    !searchParams.has("line_id") ||
    !searchParams.has("machine_no") ||
    !searchParams.has("working_date");

  return (
    <div className="flex">
      <div className="flex justify-center items-center gap-2">
        <Accordion defaultExpandedKeys={["form-container"]}>
          <AccordionItem
            style={{ padding: "0rem" }}
            key="form-container"
            title="Please Select Machine you want to see Daily Performance"
            className="flex flex-col justify-center items-center"
          >
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <AnimatePresence>
                  {forms.map((form) => (
                    <FormSearch
                      key={form.id}
                      id={form.id}
                      onRemove={removeForm}
                      sortedSection={sortedSection}
                      sortedLinename={sortedLinename}
                      machinename={machinename}
                      onSectionChange={(value) =>
                        handleSectionChange(form.id, value)
                      }
                      onLineNameChange={(value) =>
                        handleLineNameChange(form.id, value)
                      }
                      onMachineChange={(value) =>
                        handleMachineChange(form.id, value)
                      }
                      onDateChange={(value) => handleDateChange(form.id, value)}
                      onSearch={handleSearch}
                    />
                  ))}
                </AnimatePresence>
                <Button
                  onClick={addForm}
                  variant="flat"
                  className="mt-2"
                  color="primary"
                  startContent
                  style={{
                    width: "70rem",
                    border: "1px solid",
                    borderStyle: "dashed",
                    background: "#E6F1FE",
                  }}
                >
                  + Add the machines you want to compare
                </Button>
              </div>
              <Button
                style={{ height: "6rem" }}
                color={isDisable ? "default" : "primary"}
                onClick={handleSearch}
                isDisabled={isDisable}
              >
                see baratsuki
              </Button>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FormContainerSumary;
