import { create } from "zustand";
import {
  ISearchState,
  ISectionOptions,
  ILinenameOptions,
  IMachinenameOptions,
  IToolConditionOptions,
  IPartNoOptions,
  IControlItem,
} from "./interfaces/record-search.interface";

export const SearchRecStore = create<
  IControlItem &
    IPartNoOptions &
    ISearchState &
    ISectionOptions &
    ILinenameOptions &
    IMachinenameOptions &
    IToolConditionOptions
>((...args) => {
  const [set, get] = args;
  return {
    selectedSection: "",
    selectedLinename: "",
    selectedNameNoMachine: "",
    sections: [],
    part_no: [],
    line_name: [],
    control_item: [],
    name_no_machine: [],
    tool_conditions: undefined,
    setToolconditions(newDataArray) {
      set({ tool_conditions: newDataArray });
    },
    setMachinename(newDataArray) {
      set({ name_no_machine: newDataArray });
    },
    setLinename(newDataArray) {
      set({ line_name: newDataArray });
    },
    setControlItem(newDataArray) {
      set({ control_item: newDataArray });
    },
    setSections(newDataArray) {
      set({ sections: newDataArray });
    },
    setPartno(newDataArray) {
      set({ part_no: newDataArray });
    },
    setselectedSection(selectedSection) {
      set({ selectedSection });
    },
    setselectedLinename(selectedLinename) {
      set({ selectedLinename });
    },
    setselectedNameNoMachine(selectedNameNoMachine) {
      set({ selectedNameNoMachine });
    },
  };
});
