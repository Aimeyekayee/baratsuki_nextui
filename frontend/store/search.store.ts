import { create } from "zustand";
import { ISearchOptions } from "./interfaces/record-search.interface";

export const SearchRecStore = create<ISearchOptions>((...args) => {
  const [set, get] = args;
  return {
    sections: [],
    line_name: [],
    name_no_machine: [],
    setMachinename(newDataArray) {
      set({ name_no_machine: newDataArray });
    },
    setLinename(newDataArray) {
      set({ line_name: newDataArray });
    },
    setSections(newDataArray) {
      set({ sections: newDataArray });
    },
  };
});
