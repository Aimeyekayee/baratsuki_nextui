import { VoidFunctionComponent } from "react";
import { create } from "zustand";
import { DataBaratsuki } from "./interfaces/baratsuki.fetch.interface";

interface IMode {
  isLoading: boolean;
  dateStrings: string | string[];
  shift: React.Key | number;
  showGap: React.Key;
  showData: boolean;

  setIsLoading: (isLoading: boolean) => void;
  setShowData: (showData: boolean) => void;
  setShowGap: (key: React.Key) => void;
  setShift: (key: React.Key) => void;
  setDateStrings: (dateStrings: string | string[]) => void;
}

export const GeneralStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    isLoading: false,
    showData: false,
    shift: 1,
    dateStrings: "",
    showGap: "off",
    setIsLoading(isLoading) {
      set({ isLoading });
    },
    setShowData(showData) {
      set({ showData });
    },
    setShowGap: (key) => set({ showGap: key }),
    setShift: (key) => set({ shift: key }),
    setDateStrings(dateStrings) {
      set({ dateStrings });
    },
  };
});
