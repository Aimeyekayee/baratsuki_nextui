import {
  BaratsukiResponse,
  BaratsukiDataAreaResponse,
} from "@/types/baratsuki.type";

export interface IBaratsukiResponseStore {
  baratsuki: BaratsukiResponse[][];
  baratsukiDataArea: BaratsukiDataAreaResponse[];
  setBaratsuki: (newDataArray: BaratsukiResponse[][]) => void;
  setBaratsukiDataArea: (newDataArray: BaratsukiDataAreaResponse[]) => void;
}
