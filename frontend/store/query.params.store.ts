import { create } from "zustand";
import {
  IQueryStore,
  QueryParameter,
} from "./interfaces/queryparams.interface";
import { workerData } from "worker_threads";

export const initialSearchQuery: QueryParameter = {
  shift: "1",
  line_id: "",
  section_code: "",
  machine_no: "",
  working_date: "",
};

export const QueryParameterStore = create<IQueryStore>((set) => ({
  searchQuery: initialSearchQuery,
  setSearchQuery: (updatedQuery) => {
    console.log("Setting searchQuery:", updatedQuery);
    set(() => ({
      searchQuery: updatedQuery,
    }));
  },
  addSectionCode: (section_code) =>
    set((state) => ({
      searchQuery: {
        ...state.searchQuery,
        section_code: state.searchQuery.section_code
          ? `${state.searchQuery.section_code}_${section_code}`
          : section_code,
      },
    })),
  addLineID: (line_id) =>
    set((state) => ({
      searchQuery: {
        ...state.searchQuery,
        line_id: state.searchQuery.line_id
          ? `${state.searchQuery.line_id}_${line_id}`
          : line_id,
      },
    })),
  addMachineNo: (machineNo) =>
    set((state) => ({
      searchQuery: {
        ...state.searchQuery,
        machine_no: state.searchQuery.machine_no
          ? `${state.searchQuery.machine_no}_${machineNo}`
          : machineNo,
      },
    })),
  addWorkingDate: (working_date) =>
    set((state) => ({
      searchQuery: {
        ...state.searchQuery,
        working_date: state.searchQuery.working_date
          ? `${state.searchQuery.working_date}_${working_date}`
          : working_date,
      },
    })),
  replaceMachineNo: (id, value) =>
    set((state) => {
      const currentMachineNos = state.searchQuery.machine_no
        .split("_")
        .filter(Boolean);
      const newMachineNos = currentMachineNos
        .map((no) => {
          const [machine, machineId] = no.split("v");
          return machineId === id ? `${value}v${id}v` : no;
        })
        .join("_");
      return {
        searchQuery: {
          ...state.searchQuery,
          machine_no: newMachineNos,
        },
      };
    }),
  replaceSectionCode: (id, value) =>
    set((state) => {
      const currentSectionCode = state.searchQuery.section_code
        .split("_")
        .filter(Boolean);
      const newSectionCode = currentSectionCode
        .map((no) => {
          const [section, sectionCode] = no.split("v");
          return sectionCode === id ? `${value}v${id}v` : no;
        })
        .join("_");
      return {
        searchQuery: {
          ...state.searchQuery,
          section_code: newSectionCode,
        },
      };
    }),

  replaceLineID: (id, value) =>
    set((state) => {
      const currentlineId = state.searchQuery.line_id
        .split("_")
        .filter(Boolean);
      const newlineId = currentlineId
        .map((no) => {
          const [line_id, lineId] = no.split("v");
          return lineId === id ? `${value}v${id}v` : no;
        })
        .join("_");
      return {
        searchQuery: {
          ...state.searchQuery,
          line_id: newlineId,
        },
      };
    }),
  replaceWorkingDate: (id, value) =>
    set((state) => {
      const currentworkingDate = state.searchQuery.working_date
        .split("_")
        .filter(Boolean);
      const newworkingDate = currentworkingDate
        .map((no) => {
          const [working, workingDate] = no.split("v");
          return workingDate === id ? `${value}v${id}v` : no;
        })
        .join("_");
      return {
        searchQuery: {
          ...state.searchQuery,
          working_date: newworkingDate,
        },
      };
    }),
  removeMachineNo: (machineNo) =>
    set((state) => ({
      searchQuery: {
        ...state.searchQuery,
        machine_no: state.searchQuery.machine_no
          .split("_")
          .filter((no) => no !== machineNo)
          .join("_"),
      },
    })),
}));
