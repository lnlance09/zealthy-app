import { createSlice } from "@reduxjs/toolkit"
import { defaultUser, initialAppState } from "../states/app"

const appSlice = createSlice({
    name: "app",
    initialState: initialAppState,
    reducers: {
        setDosages: (state, action) => {
            state.dosages = action.payload.dosages
        },
        setMedications: (state, action) => {
            state.medications = action.payload.medications
        },
        setProviders: (state, action) => {
            state.providers = action.payload.providers
        },
        setPrescriptions: (state, action) => {
            state.user.prescriptionsFiltered.data = action.payload.prescriptions
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

export const {
    setUserData,
    resetUserData,
    setPrescriptions,
    setDosages,
    setMedications,
    setProviders
} = appSlice.actions
export default appSlice.reducer
