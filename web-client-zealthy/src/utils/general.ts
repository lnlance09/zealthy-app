import { Dosage, FullNameType, Medication, Provider } from "../interfaces"

export const capitalize = (str: string) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export const timeout = (delay: number) => new Promise((res) => setTimeout(res, delay))

export const formatPlural = (count: number, term: string) => {
    if (term.substr(term.length - 1) === "y") {
        const word = term.substring(0, term.length - 1)
        return count === 1 ? term : `${word}ies`
    }
    return count === 1 ? term : `${term}s`
}

export const writeFullName = (name: FullNameType) => [name.first, name.middle, name.last].join(" ")

export const frequencies = ["daily", "weekly", "monthly"].map((r, i) => {
    return {
        id: i + 1,
        name: r,
        text: capitalize(r),
        value: r
    }
})

export const medicationOptions = (meds: Medication[]) =>
    [...meds].map((m) => {
        return {
            id: m.name,
            name: m.name,
            text: m.name,
            value: m.id
        }
    })

export const dosageOptions = (dosages: Dosage[]) =>
    [...dosages].map((d) => {
        return {
            id: d.id,
            name: `${d.amount}${d.unit}`,
            text: `${d.amount}${d.unit}`,
            value: d.id
        }
    })

export const providerOptions = (providers: Provider[]) =>
    [...providers].map((m) => {
        return {
            id: m.name,
            name: m.name,
            text: m.name,
            value: m.id
        }
    })
