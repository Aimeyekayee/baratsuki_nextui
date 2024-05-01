import { create } from "zustand";
import { IToolsRecord } from "./interfaces/record-search.interface";

export const RecordStore = create<IToolsRecord>((set, get) => {
  return {
    section: "",
    line_name: null,
    name_no_machine: null,
    name_no_machine_for_email: null,
    tool_name: "",
    tool_no: "",
    tool_target: 0,
    dateChange: new Date(),
    timeChange: new Date(),
    tool_life_actual: 0,
    tool_type: "",
    tool_usage_fully: null,
    line_id: 0,
    tool_usage_less: {
      tool_issue: null,
      tool_ng: undefined,
      work_ng: undefined,
    },
    measurement: { appearance: "", l1height: 0, l4height: 0 },
    tool_name_no: null,
    setToolNameNo: (tool_name_no) => {
      set({ tool_name_no });
    },
    setLineID: (line_id) => {
      set({ line_id });
    },
    setSection: (section) => {
      set({ section });
    },
    setLineName: (line_name) => {
      set({ line_name });
    },
    setNameNoMachineForEmail: (name_no_machine_for_email) => {
      set({ name_no_machine_for_email });
    },
    setNameNoMachine: (name_no_machine) => {
      set({ name_no_machine });
    },
    setToolName: (tool_name) => {
      set({ tool_name });
    },
    setToolNo: (tool_no) => {
      set({ tool_no });
    },
    setToolTarget: (tool_target) => {
      set({ tool_target });
    },
    setDateChange: (dateChange) => {
      set({ dateChange });
    },
    setTimeChange: (timeChange) => {
      set({ timeChange });
    },
    setToolLifeActual: (tool_life_actual) => {
      set({ tool_life_actual });
    },
    setToolType: (tool_type) => {
      set({ tool_type });
    },
    setToolUsageFully: (tool_usage_fully) => {
      set({ tool_usage_fully });
    },
    setToolUsageLess(key, value) {
      set({
        tool_usage_less: {
          ...get().tool_usage_less,
          [key]: value,
        },
      });
    },
    setMeasurement(key, value) {
      set({
        measurement: {
          ...(get().tool_usage_fully ? [key] : value),
        },
      });
    },
  };
});

// tools_record: {
//     section: "",
//     line_name: "",
//     name_no_machine: "",
//     tool_name: "",
//     tool_no: "",
//     dateChange: new Date(),
//     timeChange: new Date(),
//     tool_life_actual: 0,
//     tool_type: "",
//     tool_usage_fully: { good: null, imprecise: null },
//     tool_usage_less: { tool_issue: null, work_ng: null },
//     measurement: { appearance: "", l1height: "", l4height: "" },
//   },
