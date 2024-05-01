import { create } from "zustand";
import { ToolProblemChange } from "@/types/toolproblemchange.type";

interface IToolProblemChange {
  data: ToolProblemChange[];
  pdfUrl: string | undefined;
  setPdfUrl: (pdfUrl: string | undefined) => void;
  setData: (newDataArray: ToolProblemChange[]) => void;
}

export const ToolProblemChangeStore = create<IToolProblemChange>((...args) => {
  const [set, get] = args;
  return {
    data: [],
    pdfUrl: undefined,
    setPdfUrl(pdfUrl) {
      set({ pdfUrl });
    },
    setData(newDataArray) {
      set({ data: newDataArray });
    },
  };
});
