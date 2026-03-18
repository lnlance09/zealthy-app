import { useState } from "react"
import { setActiveUser } from "../reducers/admin"
import { useDispatch, useSelector } from "react-redux"
import { Button, Card, Divider, Form, Input, List, Select } from "semantic-ui-react"
import { dosageOptions, frequencies, medicationOptions } from "../utils/general"
import { DateTime } from "luxon"
import { Prescription, ReduxState } from "../interfaces"
import { toast } from "react-toastify"
import { toastConfig } from "../utils/toast"
import axios from "axios"
import SemanticDatepicker from "react-semantic-ui-datepickers"

interface Params extends Prescription {
    createMode?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createCallback?: () => any
    isEditMode?: boolean
    userId: number
}

const PrescriptionCard = ({
    createMode = false,
    createCallback = () => null,
    isEditMode = false,
    userId,
    id,
    medication,
    dosage,
    quantity,
    refillOn,
    refillSchedule
}: Params) => {
    const dispatch = useDispatch()

    const dosages = useSelector((state: ReduxState) => state.admin.dosages)
    const medications = useSelector((state: ReduxState) => state.admin.medications)

    const [editMode, setEditMode] = useState(isEditMode)

    const [medicationId, setMedicationId] = useState(medication.id)
    const [dosageId, setDosageId] = useState(dosage.id)
    const [quantityValue, setQuantityValue] = useState(quantity)
    const [refillOnValue, setRefillOnValue] = useState(refillOn)
    const [refillScheduleValue, setRefillScheduleValue] = useState(refillSchedule)

    const getUser = (id: number) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}user/${id}`)
            .then((response) => {
                dispatch(setActiveUser({ user: response.data.data }))
            })
            .catch(() => {})
    }

    const createPrescription = (
        userId: number,
        medicationId: number,
        dosageId: number,
        quantity: number,
        refillOn: string,
        refillSchedule: string
    ) => {
        axios
            .post(
                `${import.meta.env.VITE_API_BASE_URL}prescription/create`,
                {
                    userId,
                    medicationId,
                    dosageId,
                    quantity,
                    refillOn,
                    refillSchedule
                },
                {}
            )
            .then(() => {
                getUser(userId)
                toast("Prescription has been created!", toastConfig)
                createCallback()
            })
            .catch((error) => {
                let errorMsg = ""
                const { status } = error.response
                const { errors } = error.response.data
                if (status === 401) {
                    errorMsg = error.response.data.message
                } else {
                    if (errors.userId) {
                        errorMsg = errors.userId[0]
                    }
                    if (errors.medicationId) {
                        errorMsg = errors.medicationId[0]
                    }
                    if (errors.dosageId) {
                        errorMsg = errors.dosageId[0]
                    }
                    if (errors.quantity) {
                        errorMsg = errors.quantity[0]
                    }
                    if (errors.refillOn) {
                        errorMsg = errors.refillOn[0]
                    }
                    if (errors.refillSchedule) {
                        errorMsg = errors.refillSchedule[0]
                    }
                }
                toast.error(errorMsg, toastConfig)
            })
    }

    const updatePrescription = (
        id: number,
        medicationId: number,
        dosageId: number,
        quantity: number,
        refillOn: string,
        refillSchedule: string
    ) => {
        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}prescription/update`, {
                id,
                medicationId,
                dosageId,
                quantity,
                refillOn,
                refillSchedule
            })
            .then(() => {
                toast("Prescription has been updated!", toastConfig)
                getUser(userId)
                setEditMode(false)
            })
            .catch((error) => {
                let errorMsg = ""
                const { status } = error.response
                const { errors } = error.response.data
                if (status === 401) {
                    errorMsg = error.response.data.message
                } else {
                    if (errors.id) {
                        errorMsg = errors.id[0]
                    }
                    if (errors.medicationId) {
                        errorMsg = errors.medicationId[0]
                    }
                    if (errors.dosageId) {
                        errorMsg = errors.dosageId[0]
                    }
                    if (errors.quantity) {
                        errorMsg = errors.quantity[0]
                    }
                    if (errors.refillOn) {
                        errorMsg = errors.refillOn[0]
                    }
                    if (errors.refillSchedule) {
                        errorMsg = errors.refillSchedule[0]
                    }
                }
                toast.error(errorMsg, toastConfig)
            })
    }

    const deletePrescription = (id: number) => {
        axios
            .delete(`${import.meta.env.VITE_API_BASE_URL}prescription/delete?id=${id}`)
            .then(() => {
                getUser(userId)
                toast("Prescription has been deleted!", toastConfig)
                setEditMode(false)
            })
            .catch(() => {
                toast.error("There was an error deleting this prescription", toastConfig)
            })
    }

    const CardEditMode = (
        <Form>
            <Form.Field>
                <label>Medication</label>
                <Select
                    fluid
                    options={medicationOptions(medications)}
                    onChange={(e, { value }) => setMedicationId(parseInt(`${value}`))}
                    value={medicationId}
                />
            </Form.Field>
            <Form.Field>
                <label>Dosage</label>
                <Select
                    fluid
                    options={dosageOptions(dosages)}
                    onChange={(e, { value }) => setDosageId(parseInt(`${value}`))}
                    value={dosageId}
                />
            </Form.Field>
            <Form.Field>
                <label>Quantity</label>
                <Input
                    fluid
                    onChange={(e, { value }) => {
                        if (parseInt(`${value}`) < 1) {
                            return
                        }
                        setQuantityValue(parseInt(`${value}`))
                    }}
                    placeholder="Quantity"
                    type="number"
                    value={quantityValue}
                />
            </Form.Field>
            <Form.Field>
                <label>Refill On</label>
                <SemanticDatepicker
                    format="MM-DD-YYYY"
                    onChange={(e, data) => {
                        const newDate = DateTime.fromMillis(Date.parse(`${data.value}`)).toFormat(
                            "yyyy-MM-dd HH:mm:ss"
                        )
                        setRefillOnValue(newDate)
                    }}
                    showToday
                    value={DateTime.fromFormat(refillOnValue, "yyyy-MM-dd HH:mm:ss").toJSDate()}
                />
            </Form.Field>
            <Form.Field>
                <label>Refill Schedule</label>
                <Select
                    fluid
                    options={frequencies}
                    onChange={(e, { value }) => {
                        setRefillScheduleValue(`${value}`)
                    }}
                    value={refillScheduleValue}
                />
            </Form.Field>
            {createMode && (
                <Button
                    color="blue"
                    content="Create"
                    fluid
                    onClick={() => {
                        createPrescription(
                            userId,
                            medicationId,
                            dosageId,
                            quantityValue,
                            refillOnValue,
                            refillScheduleValue
                        )
                    }}
                />
            )}
        </Form>
    )

    const CardExtraEditMode = (
        <>
            <Button
                color="blue"
                compact
                content="Save"
                fluid
                onClick={() => {
                    updatePrescription(
                        id,
                        medicationId,
                        dosageId,
                        quantityValue,
                        refillOnValue,
                        refillScheduleValue
                    )
                }}
            />
            <Divider />
            <Button color="red" compact content="Cancel" fluid onClick={() => setEditMode(false)} />
        </>
    )

    const CardContent = (
        <List relaxed>
            <List.Item>
                <b>Medication:</b> {medication.name}
            </List.Item>
            <List.Item>
                <b>Dosage:</b> {dosage.amount}
                {dosage.unit}
            </List.Item>
            <List.Item>
                <b>Quanity:</b> {quantity}
            </List.Item>
            <List.Item>
                <b>Refill on:</b>{" "}
                {DateTime.fromFormat(refillOn, "yyyy-MM-dd HH:mm:ss").toFormat("MMM d, yyyy")}
            </List.Item>
            <List.Item>
                <b>Refill schedule:</b> {refillSchedule}
            </List.Item>
        </List>
    )

    const CardExtra = (
        <>
            <Button
                basic
                compact
                color="blue"
                content="Edit"
                icon="pencil"
                onClick={() => setEditMode(true)}
            />
            <Button
                basic
                compact
                color="red"
                content="Delete"
                icon="close"
                onClick={() => deletePrescription(id)}
            />
        </>
    )

    return (
        <Card fluid>
            <Card.Content>
                <Card.Description>
                    {editMode || createMode ? <>{CardEditMode}</> : <>{CardContent}</>}
                </Card.Description>
            </Card.Content>
            {!createMode && (
                <Card.Content extra>
                    {editMode ? <>{CardExtraEditMode}</> : <>{CardExtra}</>}
                </Card.Content>
            )}
        </Card>
    )
}

export default PrescriptionCard
