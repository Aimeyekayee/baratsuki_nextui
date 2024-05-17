import { VoidFunctionComponent } from "react";
import { create } from "zustand";
import { DataBaratsuki } from "./interfaces/baratsuki.fetch.interface";

interface IMode {
  zone1: any[];
  zone2: any[];
  dateStrings: string | string[];
  actualNotRealTimeMC1: number;
  actualNotRealTimeMC2: number;
  targetNotRealTimeMC1: number;
  targetNotRealTimeMC2: number;
  openModal: boolean;
  isOdd: boolean;
  dataBaratsuki: DataBaratsuki[];
  shift: React.Key;
  disabledTabShift: boolean;
  setDisabledTabShift: (disabledTabShift: boolean) => void;
  setShift: (key: React.Key) => void;
  setIsOdd: (isOdd: number) => void;
  setOpenModal: (openModal: boolean) => void;
  setTargetNotRealTimeMC1: (targetNotRealTimeMC1: number) => void;
  setTargetNotRealTimeMC2: (targetNotRealTimeMC2: number) => void;
  setActualNotRealTimeMC1: (actualNotRealTimeMC1: number) => void;
  setActualNotRealTimeMC2: (actualNotRealTimeMC1: number) => void;
  setDataBaratsuki: (newDataArray: DataBaratsuki[]) => void;
  setZone1: (newDataArray: any[]) => void;
  setZone2: (newDataArray: any[]) => void;
  setDateStrings: (dateStrings: string | string[]) => void;
}

export const GeneralStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    dataBaratsuki: [],
    zone1: [],
    zone2: [],
    shift: "day",
    dateStrings: "",
    disabledTabShift: true,
    actualNotRealTimeMC1: 0,
    actualNotRealTimeMC2: 0,
    targetNotRealTimeMC1: 0,
    targetNotRealTimeMC2: 0,
    openModal: false,
    isOdd: true,
    setIsOdd: (number) => {
      set((state) => ({ isOdd: number % 2 !== 0 }));
    },
    setShift: (key) => set({ shift: key }),
    setDisabledTabShift(disabledTabShift) {
      set({ disabledTabShift });
    },
    setOpenModal(openModal) {
      set({ openModal });
    },
    setTargetNotRealTimeMC1(targetNotRealTimeMC1) {
      set({ targetNotRealTimeMC1 });
    },
    setTargetNotRealTimeMC2(targetNotRealTimeMC2) {
      set({ targetNotRealTimeMC2 });
    },
    setActualNotRealTimeMC1(actualNotRealTimeMC1) {
      set({ actualNotRealTimeMC1 });
    },
    setActualNotRealTimeMC2(actualNotRealTimeMC2) {
      set({ actualNotRealTimeMC2 });
    },
    setDateStrings(dateStrings) {
      set({ dateStrings });
    },
    setDataBaratsuki(newDataArray) {
      set({ dataBaratsuki: newDataArray });
    },
    setZone1(newDataArray) {
      set({ zone1: newDataArray });
    },
    setZone2(newDataArray) {
      set({ zone2: newDataArray });
    },
  };
});
