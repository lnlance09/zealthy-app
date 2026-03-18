import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form, Select } from "semantic-ui-react"
import { dosageOptions, medicationOptions } from "../utils/general"
import { setUserPrescriptions } from "../reducers/admin"
import { Dosage, Medication, Prescription, ReduxState } from "../interfaces"
import axios from "axios"
import SemanticDatepicker from "react-semantic-ui-datepickers"

interface Params {
    prescriptions: Prescription[]
    dosages: Dosage[]
    meds: Medication[]
}

const PrescriptionFilters = ({ prescriptions, dosages, meds }: Params) => {
    const dispatch = useDispatch()

    const [med, setMed] = useState("all")

    const [minOptions, setMinOptions] = useState<Dosage[]>([...dosages])
    const [minDosage, setMinDosage] = useState(0)

    const [maxOptions, setMaxOptions] = useState<Dosage[]>([...dosages])
    const [maxDosage, setMaxDosage] = useState([...dosages][dosages.length - 1].amount)

    return (
        <Form>
            <Form.Field>
                <label>Filter by Medication</label>
                <Select
                    fluid
                    onChange={(e, { value }) => {
                        setMed(value)
                        if (value !== "all") {
                            dispatch(
                                setUserPrescriptions({
                                    prescriptions: [...prescriptions].filter(
                                        (p) => p.medication.id === parseInt(`${value}`)
                                    )
                                })
                            )
                        } else {
                            dispatch(setUserPrescriptions({ prescriptions: [...prescriptions] }))
                        }
                    }}
                    options={[
                        {
                            id: "all",
                            key: "all",
                            name: "all",
                            text: "All",
                            value: "all"
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
                        onChange={(e, { value }) => {
                            if (!value) {
                                return
                            }
                            setMinDosage(parseInt(`${value}`))
                            console.log("min dosage change", parseInt(`${value}`))
                            dispatch(
                                setUserPrescriptions({
                                    prescriptions: [...prescriptions]
                                        .sort((a, b) => a.dosage.amount - b.dosage.amount)
                                        .filter(
                                            (p) =>
                                                p.dosage.amount >=
                                                [...dosages].filter(
                                                    (d) => d.id === parseInt(`${value}`)
                                                )[0].amount
                                        )
                                })
                            )
                            setMaxDosage(
                                [...dosages]
                                    .filter((d) => d.amount >= parseInt(`${value}`))
                                    .sort((a, b) => b.amount - a.amount)[0].id
                            )
                        }}
                        options={dosageOptions(dosages)}
                        placeholder="Min"
                        value={minDosage}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Max. dosage</label>
                    <Select
                        className="small"
                        fluid
                        onChange={(e, { value }) => {
                            if (!value) {
                                return
                            }
                            setMaxDosage(parseInt(`${value}`))
                            dispatch(
                                setUserPrescriptions({
                                    prescriptions: [...prescriptions]
                                        .sort((a, b) => a.dosage.amount - b.dosage.amount)
                                        .filter(
                                            (p) =>
                                                p.dosage.amount <=
                                                [...dosages].filter(
                                                    (d) => d.id === parseInt(`${value}`)
                                                )[0].amount
                                        )
                                })
                            )
                        }}
                        options={dosageOptions(
                            [...dosages]
                                .filter((d) => d.amount >= parseInt(`${minDosage}`))
                                .sort((a, b) => b.amount - a.amount)
                        )}
                        placeholder="Max"
                        value={maxDosage}
                    />
                </Form.Field>
            </Form.Group>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Min. Quantity</label>
                </Form.Field>
                <Form.Field>
                    <label>Max. Quantity</label>
                </Form.Field>
            </Form.Group>
        </Form>
    )
}

export default PrescriptionFilters
