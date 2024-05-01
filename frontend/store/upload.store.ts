import { create } from "zustand";
import { IUploadFile } from "./interfaces/record-search.interface";

export const UploadStore = create<IUploadFile>((...args) => {
  const [set, get] = args;
  return {
    upload_list: [],
    internalFileList: [],
    upload_file:[],
    setUploadFile(newDataArray) {
      set({ upload_file: newDataArray });
    },
    setUploadList(newDataArray) {
      set({ upload_list: newDataArray });
    },
    setInternalFileList(newDataArray) {
      set({ internalFileList: newDataArray });
    },
  };
});
