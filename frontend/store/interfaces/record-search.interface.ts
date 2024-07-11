import { ISection, ILinename, IMachinename } from "@/types/section.type";

export interface ISearchOptions {
  sections: ISection[];
  line_name: ILinename[];
  name_no_machine: IMachinename[];
  setSections: (newDataArray: ISection[]) => void;
  setLinename: (newDataArray: ILinename[]) => void;
  setMachinename: (newDataArray: IMachinename[]) => void;
}
