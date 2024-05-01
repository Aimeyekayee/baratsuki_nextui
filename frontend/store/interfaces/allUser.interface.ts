import {AllUsersDetail} from "@/types/user.type"

export interface IAllUsers {
  users: AllUsersDetail[]
  setMyUsers: (newDataArray: AllUsersDetail[]) => void;
}
