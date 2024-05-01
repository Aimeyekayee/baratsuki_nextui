
import { create } from "zustand";

interface IMode {
  loadingSpin: boolean;
  loadingFetchLinename: boolean;
  loadingFetchMachineNo: boolean;
  loadingSection: boolean;
  clearFormRec: boolean;
  editableData: boolean;

  loadingSpinModal: boolean;
  setLoadingSpinModal: (loadingSpinModal: boolean) => void;
  setEditableData: (editable: boolean) => void;
  setClearFormRec: (clearFormRec: boolean) => void;
  setloadingSection: (loadingSection: boolean) => void;
  setloadingSpin: (loadingSpin: boolean) => void;
  setloadingFetchLinename: (loadingFetchLinename: boolean) => void;
  setloadingFetchMachineNo: (loadingFetchMachineNo: boolean) => void;
}

export const GeneralStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    loadingSpin: false,
    loadingFetchLinename: false,
    loadingFetchMachineNo: false,
    loadingSection: true,
    clearFormRec: false,
    editableData: false,
    loadingSpinModal: false,
    setLoadingSpinModal(loadingSpinModal) {
      set({ loadingSpinModal });
    },

    setEditableData(editableData) {
      set({ editableData });
    },
    setClearFormRec(clearFormRec) {
      set({ clearFormRec });
    },
    setloadingSection(loadingSection) {
      set({ loadingSection });
    },
    setloadingSpin(loadingSpin) {
      set({ loadingSpin });
    },
    setloadingFetchLinename(loadingFetchLinename) {
      set({ loadingFetchLinename });
    },
    setloadingFetchMachineNo(loadingFetchMachineNo) {
      set({ loadingFetchMachineNo });
    },
  };
});
