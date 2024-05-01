import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IAuthenticationState } from "./interfaces/authentication.interface";
import { AuthenticationSlice } from "./slice/authentication.slice";
import { IUserState } from "./interfaces/user.interface";
import { capitalizeFirstLetter } from "@/utils";

export const useUserStore = create<IUserState & IAuthenticationState>()(
  persist(
    (...args) => ({
      ...AuthenticationSlice(...args),
      isLoggedIn() {
        const get = args[1];
        return get().myUser != null;
      },

      username() {
        const get = args[1];
        const { myUser } = get();
        return myUser ? `${myUser.firstname} ${myUser.lastname}` : "Guest";
      },

      shortname() {
        const get = args[1];
        const { myUser } = get();
        return myUser
          ? `${capitalizeFirstLetter(myUser.firstname)}${capitalizeFirstLetter(myUser.lastname)}`
          : "Guest";
      },

      loadUser() {
        const set = args[0];
        const userStr = localStorage.getItem("user-storage") ?? null;
        const myUser = userStr ? JSON.parse(userStr) : null;
        set({ myUser });
      },

      clearUser() {
        const set = args[0];
        localStorage.removeItem("user-storage");
        set({ myUser: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ myUser: state.myUser }),
    }
  )
);
