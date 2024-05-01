import { create } from "zustand";
import { FormRecordDataResponse, ImagePath } from "@/types/formrec.type";
import type { UploadFile, UploadProps } from "antd";
export interface transformImage {
  uid: string;
  name: string;
  status: string;
  url: string;
}
interface IMode {
  data: FormRecordDataResponse[];
  dataActionable: FormRecordDataResponse[];
  image_path: ImagePath[];
  item: FormRecordDataResponse;
  openModalChecker: boolean;
  closeModalChecker: boolean;
  transformPicture: UploadFile<any>[];
  itemForChecker: FormRecordDataResponse;
  everSave: boolean;
  setEverSave: (everSave: boolean) => void;
  setItemForChecker: (itemForChecker: FormRecordDataResponse) => void;
  setTransformPicture: (newDataArray: UploadFile<any>[]) => void;
  setOpenModalChecker: (openModalChecker: boolean) => void;
  setCloseModalChecker: (closeModalChecker: boolean) => void;
  setItem: (item: FormRecordDataResponse) => void;
  setImage_path: (newDataArray: ImagePath[]) => void;

  setData: (newDataArray: FormRecordDataResponse[]) => void;
  setDataActionable: (newDataArray: FormRecordDataResponse[]) => void;
}

export const RecOverviewStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    data: [],
    dataActionable: [],
    image_path: [],
    openModalChecker: false,
    closeModalChecker: false,
    everSave: false,
    transformPicture: [],
    item: {
      record_uuid: "",
      line_id: undefined,
      machine_no: null,
      tool_no: null,
      part_no: null,
      tool_life_actual: 0,
      tool_life_target: 0,
      tool_type: "",
      tool_usage: "",
      tool_usage_detail: [],
      date_changed: undefined,
      image_path: [],
      control_item_data: [],
      current_status_id: 1,
      note: null,
      user_uuid: undefined,
      supervisor_email: undefined,
      created_at: undefined,
      updated_at: undefined,
      email_list: [],
      approval_user_uuid: null,
      section: "",
    },
    itemForChecker: {
      record_uuid: "",
      line_id: undefined,
      machine_no: null,
      tool_no: null,
      part_no: null,
      tool_life_actual: 0,
      tool_life_target: 0,
      tool_type: "",
      tool_usage: "",
      tool_usage_detail: [],
      date_changed: undefined,
      image_path: [],
      control_item_data: [],
      current_status_id: 1,
      note: null,
      user_uuid: undefined,
      supervisor_email: undefined,
      created_at: undefined,
      updated_at: undefined,
      email_list: [],
      approval_user_uuid: null,
      section: "",
    },
    setEverSave(everSave) {
      set({ everSave });
    },
    setCloseModalChecker(closeModalChecker) {
      set({ closeModalChecker });
    },
    setOpenModalChecker(openModalChecker) {
      set({ openModalChecker });
    },
    setItemForChecker(itemForChecker) {
      set({ itemForChecker });
    },
    setItem(item) {
      set({ item });
    },
    setTransformPicture(newDataArray) {
      set({ transformPicture: newDataArray });
    },
    setImage_path(newDataArray) {
      set({ image_path: newDataArray });
    },
    setData(newDataArray) {
      set({ data: newDataArray });
    },
    setDataActionable(newDataArray) {
      set({ dataActionable: newDataArray });
    },
  };
});
