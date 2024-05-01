import { StateCreator } from "zustand";
import { IAuthenticationState } from "../interfaces/authentication.interface";

export const AuthenticationSlice: StateCreator<IAuthenticationState> = (set, get) => ({
  myUser: null,
  setMyUser(myUser) {
    set({ myUser });
  },

  
});
