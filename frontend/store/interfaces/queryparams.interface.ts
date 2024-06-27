export interface QueryParameter {
  shift: string;
  line_id: string;
  section_code: string;
  machine_no: string;
  working_date: string;
}

export interface IQueryStore {
  searchQuery: QueryParameter;
  setSearchQuery: (searchQuery: QueryParameter) => void;
  addSectionCode: (section_code: string) => void;
  addLineID: (line_id: string) => void;
  addMachineNo: (machine_no: string) => void;
  addWorkingDate: (working_date: string) => void;
  removeMachineNo: (machineNo: string) => void;
  replaceSectionCode: (id: string, value: string) => void;
  replaceLineID: (id: string, value: string) => void;
  replaceWorkingDate: (id: string, value: string) => void;
  replaceMachineNo: (id: string, value: string) => void;
}
