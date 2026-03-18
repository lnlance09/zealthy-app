import { createSlice } from "@reduxjs/toolkit"
import { initialAdminState } from "../states/admin"

const adminSlice = createSlice({
    name: "admin",
    initialState: initialAdminState,
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
        setUserPrescriptions: (state, action) => {
            state.activeUser.prescriptionsFiltered.data = action.payload.prescriptions
        },
        removePrescription: (state, action) => {
            state.activeUser.prescriptions.data = action.payload.prescriptions
            state.activeUser.prescriptionCount = state.activeUser.prescriptionCount - 1
        },
        setActiveUser: (state, action) => {
            state.activeUser = action.payload.user
        },
        clearUsers: (state) => {
            state.users = []
        },
        setUsers: (state, action) => {
            state.users = action.payload.users
        }
    }
})

export const {
    setUsers,
    clearUsers,
    setActiveUser,
    setDosages,
    setMedications,
    setProviders,
    setUserPrescriptions
} = adminSlice.actions
export default adminSlice.reducer
