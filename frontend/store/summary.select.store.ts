import { create } from "zustand";
import { ISummarySelectStore } from "./interfaces/summary.parameter";

export const SummarySelectStore = create<ISummarySelectStore>((...args) => {
  const [set, get] = args;
  return {
    selectLineID: 0,
    selectSectionCode: 0,
    selectMachineNo: "",
    setSelectLineID(selectLineID) {
      set({ selectLineID });
    },
    setSelectSectionCode(selectSectionCode) {
      set({ selectSectionCode });
    },
    setSelectMachineNo(selectMachineNo) {
      set({ selectMachineNo });
    },
  };
});
