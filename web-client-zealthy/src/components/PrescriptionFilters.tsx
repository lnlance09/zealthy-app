import { useState } from "react"
import { useDispatch } from "react-redux"
import { Form, Select } from "semantic-ui-react"
import { dateFormat, dosageOptions, frequencies, medicationOptions } from "../utils/general"
import { setUserPrescriptions } from "../reducers/admin"
import { Dosage, Medication, Prescription } from "../interfaces"
import SemanticDatepicker from "react-semantic-ui-datepickers"

interface Params {
    prescriptions: Prescription[]
    prescriptionsFiltered: Prescription[]
    dosages: Dosage[]
    meds: Medication[]
}

const PrescriptionFilters = ({ prescriptions, prescriptionsFiltered, dosages, meds }: Params) => {
    const dispatch = useDispatch()

    const [med, setMed] = useState(0)
    const [minDosage, setMinDosage] = useState(0)
    const [maxDosage, setMaxDosage] = useState(0)
    const [minDate, setMinDate] = useState(0)
    const [schedule, setSchedule] = useState("all")

    const getSelectedAmount = (value: number) => {
        const doses = [...dosages].filter((d) => d.id === value)
        if (doses.length === 0) {
            return false
        }
        return doses[0].amount
    }

    const filterByMedicine = (prescriptions: Prescription[], medicineId: number) =>
        [...prescriptions].filter((p) => p.medication.id === medicineId)

    const filterByMinAmount = (prescriptions: Prescription[], amount: number) => {
        return [...prescriptions]
            .sort((a, b) => a.dosage.amount - b.dosage.amount)
            .filter((p) => p.dosage.amount >= amount)
            .filter((p) => {
                const maxAmount = getSelectedAmount(maxDosage)
                if (!maxAmount) {
                    return p
                }
                return p.dosage.amount <= maxAmount
            })
    }

    const filterByMaxAmount = (prescriptions: Prescription[], amount: number) => {
        return [...prescriptions]
            .sort((a, b) => a.dosage.amount - b.dosage.amount)
            .filter((p) => p.dosage.amount <= amount)
            .filter((p) => {
                const minAmount = getSelectedAmount(minDosage)
                if (!minAmount) {
                    return p
                }
                return p.dosage.amount >= minAmount
            })
    }

    const filterByDate = (prescriptions: Prescription[], date: number) =>
        [...prescriptions].filter((p) => new Date(p.refillOn).getTime() >= date)

    const filterAll = (
        prescriptions: Prescription[],
        med: number,
        minDosage: number,
        maxDosage: number,
        minDate: number
    ) => {
        let _prescriptions = prescriptions
        if (med !== 0) {
            _prescriptions = filterByMedicine(_prescriptions, med)
        }
        if (minDosage) {
            const amount = getSelectedAmount(minDosage)
            console.log("filter all min dosage", amount)
            if (amount) {
                _prescriptions = filterByMinAmount(_prescriptions, amount)
            }
        }
        if (maxDosage) {
            const amount = getSelectedAmount(maxDosage)
            console.log("filter all max dosage", amount)
            if (amount) {
                _prescriptions = filterByMaxAmount(_prescriptions, amount)
            }
        }
        if (minDate) {
            console.log("filter all date", minDate)
            _prescriptions = filterByDate(_prescriptions, minDate)
        }
        return _prescriptions
    }

    return (
        <Form>
            <Form.Field>
                <label>Filter by Medication</label>
                <Select
                    fluid
                    onChange={(_e, { value }) => {
                        if (typeof value !== "number") {
                            return
                        }
                        setMed(value)
                        if (value === 0) {
                            dispatch(setUserPrescriptions({ prescriptions: [...prescriptions] }))
                            return
                        }
                        dispatch(
                            setUserPrescriptions({
                                prescriptions: filterAll(
                                    prescriptions,
                                    value,
                                    minDosage,
                                    maxDosage,
                                    minDate
                                )
                            })
                        )
                    }}
                    options={[
                        {
                            id: "all",
                            key: "all",
                            name: "all",
                            text: "All",
                            value: 0
                        },
                        ...medicationOptions(meds)
                    ]}
                    placeholder="Filter by medicine"
                    value={med}
                />
            </Form.Field>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Min. dosage</label>
                    <Select
                        className="small"
                        fluid
                        onChange={(_e, { value }) => {
                            if (typeof value !== "number") {
                                return
                            }
                            const maxAmount = getSelectedAmount(maxDosage)
                            const currentAmount = getSelectedAmount(value)
                            if (currentAmount && maxAmount ? currentAmount > maxAmount : false) {
                                return
                            }
                            setMinDosage(value)
                            dispatch(
                                setUserPrescriptions({
                                    prescriptions: filterAll(
                                        prescriptions,
                                        med,
                                        value,
                                        maxDosage,
                                        minDate
                                    )
                                })
                            )
                        }}
                        options={[
                            {
                                id: 0,
                                key: "all",
                                name: "all",
                                text: "All",
                                value: 0
                            },
                            ...dosageOptions(dosages)
                        ]}
                        placeholder="Min"
                        value={minDosage}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Max. dosage</label>
                    <Select
                        className="small"
                        fluid
                        onChange={(_e, { value }) => {
                            if (typeof value !== "number") {
                                return
                            }
                            const currentAmount = getSelectedAmount(value)
                            const minAmount = getSelectedAmount(minDosage)
                            if (minAmount && currentAmount ? currentAmount < minAmount : false) {
                                return
                            }
                            setMaxDosage(value)
                            dispatch(
                                setUserPrescriptions({
                                    prescriptions: filterAll(
                                        prescriptions,
                                        med,
                                        minDosage,
                                        value,
                                        minDate
                                    )
                                })
                            )
                        }}
                        options={[
                            {
                                id: 0,
                                key: "all",
                                name: "all",
                                text: "All",
                                value: 0
                            },
                            ...dosageOptions(dosages)
                        ]}
                        placeholder="Max"
                        value={maxDosage}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Field>
                <label>Refill starting on</label>
                <SemanticDatepicker
                    datePickerOnly
                    format="MM-DD-YYYY"
                    onChange={(_e, data) => {
                        const date = data.value?.valueOf()
                        if (typeof date !== "number") {
                            return
                        }
                        setMinDate(date)
                        dispatch(
                            setUserPrescriptions({
                                prescriptions: filterAll(
                                    prescriptions,
                                    med,
                                    minDosage,
                                    maxDosage,
                                    date
                                )
                            })
                        )
                    }}
                    showToday
                />
            </Form.Field>
            <Form.Field>
                <label>Refill Schedule</label>
                <Select
                    fluid
                    options={[
                        {
                            id: "all",
                            key: "all",
                            name: "all",
                            text: "All",
                            value: "all"
                        },
                        ...frequencies
                    ]}
                    onChange={(_e, { value }) => {
                        if (typeof value !== "string") {
                            return
                        }
                        setSchedule(value)

                        if (value === "all") {
                            dispatch(
                                setUserPrescriptions({
                                    prescriptions: [...prescriptionsFiltered]
                                })
                            )
                            return
                        }
                        const _prescriptions = [...prescriptionsFiltered].filter(
                            (p) => p.refillSchedule === value
                        )
                        dispatch(
                            setUserPrescriptions({
                                prescriptions: _prescriptions
                            })
                        )
                    }}
                    value={schedule}
                />
            </Form.Field>
        </Form>
    )
}

export default PrescriptionFilters
