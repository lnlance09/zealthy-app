import { useState } from "react"
import { setActiveUser } from "../reducers/admin"
import { useDispatch, useSelector } from "react-redux"
import { Button, Card, Divider, Form, List, Select } from "semantic-ui-react"
import { Appointment, ReduxState } from "../interfaces"
import { dateFormat, frequencies, providerOptions } from "../utils/general"
import { DateTime } from "luxon"
import { toast } from "react-toastify"
import { toastConfig } from "../utils/toast"
import axios from "axios"
import SemanticDatepicker from "react-semantic-ui-datepickers"

interface Params extends Appointment {
    createMode?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createCallback?: () => any
    editable?: boolean
    isEditMode?: boolean
}

const AppointmentCard = ({
    createMode = false,
    createCallback = () => null,
    isEditMode = false,
    editable = true,
    id,
    user,
    provider,
    datetime,
    repeat
}: Params) => {
    const dispatch = useDispatch()

    const providers = useSelector((state: ReduxState) => state.admin.providers)

    const [editMode, setEditMode] = useState(isEditMode)
    const [datetimeValue, setDatetimeValue] = useState(datetime)
    const [repeatValue, setRepeatValue] = useState(repeat)
    const [providerValue, setProviderValue] = useState(provider.id)

    const getUser = (id: number) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}user/${id}`)
            .then((response) => {
                dispatch(setActiveUser({ user: response.data.data }))
            })
            .catch(() => {})
    }

    const createAppointment = (
        userId: number,
        providerId: number,
        datetime: string,
        repeat: string
    ) => {
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}appointment/create`, {
                userId,
                providerId,
                datetime: DateTime.fromISO(new Date(datetime).toISOString()).toFormat(dateFormat),
                repeat
            })
            .then(() => {
                toast.success("Appointment has been created!", toastConfig)
                createCallback()
                getUser(user.id)
                setEditMode(false)
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
                    if (errors.providerId) {
                        errorMsg = errors.providerId[0]
                    }
                    if (errors.datetime) {
                        errorMsg = errors.datetime[0]
                    }
                    if (errors.repeat) {
                        errorMsg = errors.repat[0]
                    }
                }
                toast.error(errorMsg, toastConfig)
            })
    }

    const updateAppointment = (
        id: number,
        providerId: number,
        datetime: string,
        repeat: string
    ) => {
        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}appointment/update`, {
                id,
                providerId,
                datetime: DateTime.fromISO(new Date(datetime).toISOString()).toFormat(dateFormat),
                repeat
            })
            .then(() => {
                toast.success("Appointment has been updated!", toastConfig)
                getUser(user.id)
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
                    if (errors.providerId) {
                        errorMsg = errors.providerId[0]
                    }
                    if (errors.datetime) {
                        errorMsg = errors.datetime[0]
                    }
                    if (errors.repeat) {
                        errorMsg = errors.repat[0]
                    }
                }
                toast.error(errorMsg, toastConfig)
            })
    }

    const deleteAppointment = (id: number) => {
        axios
            .delete(`${import.meta.env.VITE_API_BASE_URL}appointment/delete?id=${id}`)
            .then(() => {
                getUser(user.id)
                toast.success("Appointment has been deleted!", toastConfig)
                setEditMode(false)
            })
            .catch(() => {
                toast.error("There was an error deleting this appointment", toastConfig)
            })
    }

    return (
        <Card fluid>
            <Card.Content>
                {!createMode && (
                    <>
                        <Card.Header>{provider.name}</Card.Header>
                        <Card.Meta>
                            {DateTime.fromFormat(datetime, dateFormat).toFormat("MMM d, yyyy")}
                        </Card.Meta>
                    </>
                )}
                <Card.Description>
                    {editMode || createMode ? (
                        <Form>
                            <Form.Field>
                                <label>Provider</label>
                                <Select
                                    fluid
                                    options={providerOptions(providers)}
                                    onChange={(_e, { value }) => {
                                        if (typeof value !== "number") {
                                            return
                                        }
                                        setProviderValue(value)
                                    }}
                                    value={providerValue}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Date</label>
                                <SemanticDatepicker
                                    format="MM-DD-YYYY"
                                    onChange={(_e, data) => {
                                        const newDate = DateTime.fromMillis(
                                            Date.parse(`${data.value}`)
                                        ).toFormat(dateFormat)
                                        setDatetimeValue(newDate)
                                    }}
                                    showToday
                                    value={DateTime.fromFormat(
                                        datetimeValue,
                                        dateFormat
                                    ).toJSDate()}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Repeat frequency</label>
                                <Select
                                    fluid
                                    options={frequencies}
                                    onChange={(_e, { value }) => {
                                        if (typeof value !== "string") {
                                            return
                                        }
                                        setRepeatValue(value)
                                    }}
                                    value={repeatValue}
                                />
                            </Form.Field>
                            {createMode && (
                                <Button
                                    color="blue"
                                    content="Create"
                                    fluid
                                    onClick={() => {
                                        createAppointment(
                                            user.id,
                                            providerValue,
                                            datetimeValue,
                                            repeatValue
                                        )
                                    }}
                                />
                            )}
                        </Form>
                    ) : (
                        <List>
                            <List.Item>
                                <b>Repeat:</b> {repeatValue}
                            </List.Item>
                        </List>
                    )}
                </Card.Description>
            </Card.Content>
            {!createMode && editable && (
                <Card.Content extra>
                    {editMode ? (
                        <>
                            <Button
                                color="blue"
                                content="Save"
                                fluid
                                onClick={() =>
                                    updateAppointment(id, providerValue, datetimeValue, repeatValue)
                                }
                            />
                            <Divider />
                            <Button
                                color="red"
                                content="Cancel"
                                fluid
                                onClick={() => setEditMode(false)}
                            />
                        </>
                    ) : (
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
                                onClick={() => deleteAppointment(id)}
                            />
                        </>
                    )}
                </Card.Content>
            )}
        </Card>
    )
}

export default AppointmentCard
