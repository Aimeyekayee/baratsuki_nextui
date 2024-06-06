import { create } from "zustand";

interface TypeData {
  ct_actual: number | null;
  prod_actual: number | null;
}

export interface DataBaratsuki {
  data: TypeData;
  date: Date | undefined;
  line_id: number | null;
  machine_no: string | null;
  machine_name: string | null;
  period: string | null;
  section_code: number | null;
  shift: string | null;
  type: string | null;
  value: number | null;
  zone_number: number;
}

interface ToolTipItem {
  color: any;
  data: DataBaratsuki;
  mappingData: any;
  marker: boolean;
  name: string;
  title: string;
  value: string;
  x: any;
  y: any;
}
interface IMode {
  openModal: boolean;
  dataTooltip: ToolTipItem[];
  setDataTooltip: (newDataArray: ToolTipItem[]) => void;
  setOpenModal: (openModal: boolean) => void;
}

export const ModalOpenStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    openModal: false,
    dataTooltip: [],
    setDataTooltip(newDataArray) {
      set({ dataTooltip: newDataArray });
    },
    setOpenModal(openModal) {
      set({ openModal });
    },
  };
});
