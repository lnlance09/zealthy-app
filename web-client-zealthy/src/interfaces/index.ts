export type Nullable<T> = T | null

export type FullNameType = {
    first: string
    middle: string
    last: string
}

export interface User {
    id: number
    name: FullNameType
    email: string
}

export type Provider = {
    id: number
    name: string
}

export type Medication = {
    id: number
    name: string
}

export type Dosage = {
    id: number
    amount: number
    unit: string
}

export type Appointment = {
    id: number
    provider: Provider
    user: User
    datetime: string
    repeat: string
}

export interface Prescription {
    id: number
    medication: Medication
    dosage: Dosage
    quantity: number
    refillOn: string
    refillSchedule: string
}

export interface ExtendedUser extends User {
    appointmentCount: number
    appointments: {
        data: Appointment[]
    }
    prescriptionCount: number
    prescriptions: {
        data: Prescription[]
    }
    prescriptionsFiltered: {
        data: Prescription[]
    }
}

export type AdminState = {
    activeUser: ExtendedUser
    dosages: Dosage[]
    medications: Medication[]
    providers: Provider[]
    users: ExtendedUser[]
}

export type AppState = {
    auth: boolean
    user: ExtendedUser
}

export type ReduxState = {
    app: AppState
    admin: AdminState
}
