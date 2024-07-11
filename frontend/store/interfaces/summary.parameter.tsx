export interface ISummarySelectStore {
  selectLineID: number;
  selectSectionCode: number;
  selectMachineNo: string;
  setSelectLineID: (selectLineID: number) => void;
  setSelectSectionCode: (selectSectionCode: number) => void;
  setSelectMachineNo: (selectMachineNo: string) => void;
}
