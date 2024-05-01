export interface IUserState{
    username: () => string
    shortname: () => string
    isLoggedIn: () => boolean
    loadUser: () => void
    clearUser: () => void
}