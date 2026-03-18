import { createSlice } from "@reduxjs/toolkit"
import { defaultUser, initialAppState } from "../states/app"

const appSlice = createSlice({
    name: "app",
    initialState: initialAppState,
    reducers: {
        setPrescriptions: (state, action) => {
            state.user.prescriptions.data = action.payload.prescriptions
        },
        setUserData: (state, action) => {
            state.auth = true
            state.user = action.payload.user
        },
        resetUserData: (state) => {
            state.auth = false
            state.user = defaultUser
        }
    }
})

export const { setUserData, resetUserData, setPrescriptions } = appSlice.actions
export default appSlice.reducer
