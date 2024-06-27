import { create } from "zustand";
import { IBaratsukiResponseStore } from "./interfaces/baratsuki.response.interface";

export const BaratsukiStore = create<IBaratsukiResponseStore>((set) => ({
  baratsuki: [],
  baratsukiDataArea: [],
  setBaratsukiDataArea(newDataArray) {
    set({ baratsukiDataArea: newDataArray });
  },
  setBaratsuki(newDataArray) {
    set({ baratsuki: newDataArray });
  },
}));
