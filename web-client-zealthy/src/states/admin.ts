import { AdminState } from "@interfaces/index"
import { defaultUser } from "./app"

export const initialAdminState: AdminState = {
    activeUser: defaultUser,
    dosages: [],
    medications: [],
    providers: [],
    users: []
}
