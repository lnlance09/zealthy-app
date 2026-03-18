import { combineReducers } from "redux"
import appSlice from "./app"
import adminSlice from "./admin"

const rootReducer = combineReducers({
    app: appSlice,
    admin: adminSlice
})

export default rootReducer
