
import { create } from "zustand";

interface IMode {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}

export const ModalOpenStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    openModal: false,
    setOpenModal(openModal) {
      set({ openModal });
    },
  };
});
