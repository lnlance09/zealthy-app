import { AppState, Dosage, Medication, Provider } from "@interfaces/index"

const auth = localStorage.getItem("auth")
const user = localStorage.getItem("user")

export const defaultUser = {
    id: 0,
    email: "",
    name: {
        first: "",
        middle: "",
        last: ""
    },
    appointmentCount: 0,
    prescriptionCount: 0,
    appointments: { data: [] },
    prescriptions: { data: [] },
    prescriptionsFiltered: { data: [] }
}

export const defaultProvider: Provider = {
    id: 0,
    name: ""
}

export const defaultMedication: Medication = {
    id: 0,
    name: ""
}

export const defaultDoseage: Dosage = {
    id: 0,
    amount: 0,
    unit: ""
}

export const initialAppState: AppState = {
    auth: auth === "1",
    user: user ? JSON.parse(user) : { ...defaultUser }
}
