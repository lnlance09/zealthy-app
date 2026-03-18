import { Nullable, User } from "../interfaces"

export const setSessionData = (auth: number, bearer: Nullable<string>, user: User) => {
    localStorage.setItem("auth", `${auth}`)
    if (bearer) {
        localStorage.setItem("bearer", bearer)
    }
    localStorage.setItem("user", JSON.stringify(user))
}

export const resetSessionData = () => {
    localStorage.setItem("auth", "0")
    localStorage.setItem("bearer", "")
    localStorage.setItem("user", JSON.stringify({}))
}
