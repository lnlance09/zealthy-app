import { AppState, Dosage, Medication, Provider } from "@interfaces/index"

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
    auth: false,
    user: defaultUser
}
