import { VoidFunctionComponent } from "react";
import { create } from "zustand";
import { DataBaratsuki } from "./interfaces/baratsuki.fetch.interface";

interface IMode {
  zone1: any[];
  zone2: any[];
  dataByShiftColumnMC1: any[];
  dataByShiftColumnMC2: any[];
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
  baratsukiRate: React.Key;
  showGap: React.Key;
  colorMc4: string;
  clickMCinPieGraph: string;
  sortPie: string;
  ctTargetZone1: number;
  ctTargetZone2: number;
  targetRealTimeMC1: number;
  targetRealTimeMC2: number;
  setCtTargetZone1: (value: string) => void;
  setCtTargetZone2: (value: string) => void;
  setSortPie: (sortPie: string) => void;
  setClickMCinPieGraph: (clickMCinPieGraph: string) => void;
  setColorMc4: (colorMc4: string) => void;
  setShowGap: (key: React.Key) => void;
  setBaratsukiRate: (key: React.Key) => void;
  setDisabledTabShift: (disabledTabShift: boolean) => void;
  setShift: (key: React.Key) => void;
  setIsOdd: (isOdd: number) => void;
  setOpenModal: (openModal: boolean) => void;
  setTargetRealTimeMC1: (tartgetRealTimeMC1: number) => void;
  setTargetRealTimeMC2: (tartgetRealTimeMC2: number) => void;
  setTargetNotRealTimeMC1: () => void;
  setTargetNotRealTimeMC2: () => void;
  setActualNotRealTimeMC1: (actualNotRealTimeMC1: number) => void;
  setActualNotRealTimeMC2: (actualNotRealTimeMC1: number) => void;
  setDataBaratsuki: (newDataArray: DataBaratsuki[]) => void;
  setZone1: (newDataArray: any[]) => void;
  setZone2: (newDataArray: any[]) => void;
  setDataByShiftColumnMC1: (newDataArray: any[]) => void;
  setDataByShiftColumnMC2: (newDataArray: any[]) => void;
  setDateStrings: (dateStrings: string | string[]) => void;
}

export const GeneralStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    dataBaratsuki: [],
    ctTargetZone1: 16.5,
    ctTargetZone2: 16.5,
    zone1: [],
    zone2: [],
    shift: "day",
    baratsukiRate: "77",
    dateStrings: "",
    colorMc4: "MC1",
    disabledTabShift: true,
    actualNotRealTimeMC1: 0,
    actualNotRealTimeMC2: 0,
    targetNotRealTimeMC1: 0,
    targetNotRealTimeMC2: 0,
    targetRealTimeMC1: 0,
    targetRealTimeMC2: 0,
    clickMCinPieGraph: "",
    showGap: "off",
    openModal: false,
    isOdd: true,
    sortPie: "1",
    dataByShiftColumnMC1: [],
    dataByShiftColumnMC2: [],
    setCtTargetZone1: (value: string) => {
      const setTargetNotRealTimeMC1 = get().setTargetNotRealTimeMC1;
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue)) {
        set({ ctTargetZone1: numberValue });
        setTargetNotRealTimeMC1();
      } else {
        console.error(`Invalid value provided for ctTargetZone1: ${value}`);
      }
    },
    setCtTargetZone2: (value: string) => {
      const setTargetNotRealTimeMC2 = get().setTargetNotRealTimeMC2;
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue)) {
        set({ ctTargetZone2: numberValue });
        setTargetNotRealTimeMC2();
      } else {
        console.error(`Invalid value provided for ctTargetZone1: ${value}`);
      }
    },
    setTargetRealTimeMC1(targetRealTimeMC1) {
      set({ targetRealTimeMC1 });
    },
    setTargetRealTimeMC2(targetRealTimeMC2) {
      set({ targetRealTimeMC2 });
    },
    setSortPie(sortPie) {
      set({ sortPie });
    },
    setIsOdd: (number) => {
      set((state) => ({ isOdd: number % 2 !== 0 }));
    },
    setShowGap: (key) => set({ showGap: key }),
    setBaratsukiRate: (key) => set({ baratsukiRate: key }),
    setShift: (key) => set({ shift: key }),
    setDisabledTabShift(disabledTabShift) {
      set({ disabledTabShift });
    },
    setOpenModal(openModal) {
      set({ openModal });
    },
    setTargetNotRealTimeMC1: () => {
      const zone1 = get().zone1;
      const ctTargetZone1 = get().ctTargetZone1;
      console.log("storezone1", zone1);
      const shift = get().shift;
      if (zone1.length > 0) {
        if (shift === "day") {
          const targetValue = zone1.some(
            (item) => item.period === "19:20:00" && item.value === 0
          )
            ? Math.floor(27300 / ctTargetZone1)
            : Math.floor(36300 / ctTargetZone1);
          set({ targetNotRealTimeMC1: targetValue });
        } else {
          const targetValue = zone1.some(
            (item) => item.period === "07:20:00" && item.value === 0
          )
            ? Math.floor(27300 / ctTargetZone1)
            : Math.floor(36300 / ctTargetZone1);
          set({ targetNotRealTimeMC1: targetValue });
        }
      } else {
        set({ targetNotRealTimeMC1: 0 });
      }
    },
    setTargetNotRealTimeMC2: () => {
      const zone2 = get().zone2;
      const shift = get().shift;
      const ctTargetZone2 = get().ctTargetZone2;
      // console.log("get ctTargetZone2", ctTargetZone2);
      if (zone2.length > 0) {
        if (shift === "day") {
          const targetValue = zone2.some(
            (item) => item.period === "19:20:00" && item.value === 0
          )
            ? Math.floor(27300 / ctTargetZone2)
            : Math.floor(36300 / ctTargetZone2);
          set({ targetNotRealTimeMC2: targetValue });
        } else {
          const targetValue = zone2.some(
            (item) => item.period === "07:20:00" && item.value === 0
          )
            ? Math.floor(27300 / ctTargetZone2)
            : Math.floor(36300 / ctTargetZone2);
          set({ targetNotRealTimeMC2: targetValue });
        }
      } else {
        set({ targetNotRealTimeMC2: 0 });
      }
    },
    setActualNotRealTimeMC1(actualNotRealTimeMC1) {
      set({ actualNotRealTimeMC1 });
    },
    setActualNotRealTimeMC2(actualNotRealTimeMC2) {
      set({ actualNotRealTimeMC2 });
    },
    setClickMCinPieGraph(clickMCinPieGraph) {
      set({ clickMCinPieGraph });
    },
    setColorMc4(colorMc4) {
      set({ colorMc4 });
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
    setDataByShiftColumnMC1(newDataArray) {
      set({ dataByShiftColumnMC1: newDataArray });
    },
    setDataByShiftColumnMC2(newDataArray) {
      set({ dataByShiftColumnMC2: newDataArray });
    },
  };
});
