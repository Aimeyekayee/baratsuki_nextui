import { create } from "zustand";

interface IMode {
  toggleMode: string;
  isModalOpenRecord:boolean
  setIsModalOpenRecord:(isModalOpenRecord: boolean) => void;
  setToggleMode: (toggleMode: string) => void;
}

export const ModeStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    toggleMode: "light",
    isModalOpenRecord:false,
    setIsModalOpenRecord(isModalOpenRecord) {
      set({ isModalOpenRecord });
    },
    setToggleMode(toggleMode) {
      set({ toggleMode });
    },
  };
});
