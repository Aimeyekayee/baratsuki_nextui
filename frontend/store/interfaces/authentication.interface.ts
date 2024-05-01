import {User} from "@/types/user.type"

export interface IAuthenticationState {
  myUser: User | null;
  setMyUser: (myUser: User) => void;
}
