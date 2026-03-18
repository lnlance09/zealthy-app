import { useEffect, useState } from "react"
import {
    clearUsers,
    setUsers,
    setActiveUser,
    setDosages,
    setMedications,
    setProviders
} from "../reducers/admin"
import { useDispatch, useSelector } from "react-redux"
import { formatPlural, timeout, writeFullName } from "../utils/general"
import { defaultDoseage, defaultMedication, defaultProvider } from "../states/app"
import {
    Button,
    Card,
    Container,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    Menu,
    Message,
    Modal,
    Placeholder,
    Segment,
    Table
} from "semantic-ui-react"
import { ReduxState } from "../interfaces"
import { ToastContainer, toast } from "react-toastify"
import { toastConfig } from "../utils/toast"
import { DateTime } from "luxon"
import axios from "axios"
import AppointmentCard from "../components/AppointmentCard"
import PrescriptionCard from "../components/PrescriptionCard"
import PrescriptionFilters from "../components/PrescriptionFilters"

function Admin() {
    const dispatch = useDispatch()

    const activeUser = useSelector((state: ReduxState) => state.admin.activeUser)
    const prescriptions = useSelector(
        (state: ReduxState) => state.admin.activeUser.prescriptions.data
    )
    const prescriptionsF = useSelector(
        (state: ReduxState) => state.admin.activeUser.prescriptionsFiltered.data
    )
    const users = useSelector((state: ReduxState) => state.admin.users)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")

    const [newUserName, setNewUserName] = useState("")
    const [newUserEmail, setNewUserEmail] = useState("")

    const [medFilter, setMedFilter] = useState("all")
    const [medFilterText, setMedFilterText] = useState("")
    const [minDosageFilter, setMinDosageFilter] = useState("")
    const [maxDosageFilter, setMaxDosageFilter] = useState("")

    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)
    // const [newUserModalOpen, setNewUserModalOpen] = useState(false)

    const getUsers = async () => {
        setLoading(true)
        dispatch(clearUsers())
        await axios
            .get(`${import.meta.env.VITE_API_BASE_URL}user`)
            .then((response) => {
                setError(false)
                dispatch(setUsers({ users: response.data.data }))
            })
            .catch(() => {
                setError(true)
                dispatch(clearUsers())
            })
        await timeout(400)
        setLoading(false)
    }

    const createUser = (name: string, email: string) => {
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}user/register`, {
                name,
                email
            })
            .then((response) => {
                dispatch(setActiveUser({ user: response.data.user }))
                getUsers()
                setIsCreating(false)
                toast("User has been added!", toastConfig)
            })
            .catch((error) => {
                let errorMsg = ""
                const { status } = error.response
                const { errors } = error.response.data
                if (status === 401) {
                    errorMsg = error.response.data.message
                } else {
                    if (errors.name) {
                        errorMsg = errors.name[0]
                    }
                    if (errors.email) {
                        errorMsg = errors.email[0]
                    }
                }
                toast.error(errorMsg, toastConfig)
            })
    }

    const updateUser = (id: number) => {
        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}user/${id}`, {
                id,
                name: userName,
                email: userEmail
            })
            .then((response) => {
                dispatch(setActiveUser({ user: response.data.data }))
                getUsers()
                setIsEditing(false)
                toast("User has been updated!", toastConfig)
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
                    if (errors.name) {
                        errorMsg = errors.name[0]
                    }
                    if (errors.email) {
                        errorMsg = errors.email[0]
                    }
                }
                toast.error(errorMsg, toastConfig)
            })
    }

    const getDosages = (userId = 0) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}dosage?userId=${userId}`)
            .then((response) => {
                dispatch(setDosages({ dosages: response.data.data }))
            })
            .catch(() => {})
    }

    const getMedications = (userId = 0) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}medication?userId=${userId}`)
            .then((response) => {
                dispatch(setMedications({ medications: response.data.data }))
            })
            .catch(() => {})
    }

    const getProviders = (userId = 0) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}provider?userId=${userId}`)
            .then((response) => {
                dispatch(setProviders({ providers: response.data.data }))
            })
            .catch(() => {})
    }

    useEffect(() => {
        getUsers()
        getDosages()
        getMedications()
        getProviders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ActiveUserSegment = (
        <Segment>
            {activeUser && (
                <>
                    <Header>
                        <Header.Content>
                            {`${activeUser.name.first} ${activeUser.name.last !== null ? activeUser.name.last : ""}`}
                            <Header.Subheader>
                                {activeUser.email}{" "}
                                {!isEditing && (
                                    <Label
                                        color="green"
                                        content="Edit"
                                        onClick={() => {
                                            setIsEditing(true)
                                            setIsCreating(false)
                                        }}
                                    />
                                )}
                                {!isCreating && (
                                    <Label
                                        color="blue"
                                        content="Add new"
                                        onClick={() => {
                                            setIsCreating(true)
                                            setIsEditing(false)
                                        }}
                                    />
                                )}
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Segment>
                        {isEditing && (
                            <Form as={Segment}>
                                <Form.Field>
                                    <Input
                                        fluid
                                        placeholder="Name"
                                        value={userName}
                                        onChange={(e, { value }) => setUserName(value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Input
                                        fluid
                                        placeholder="Email"
                                        value={userEmail}
                                        onChange={(e, { value }) => setUserEmail(value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button
                                        color="blue"
                                        compact
                                        content="Update"
                                        fluid
                                        onClick={() => {
                                            updateUser(activeUser.id)
                                        }}
                                    />
                                    <Divider />
                                    <Button
                                        color="red"
                                        compact
                                        content="Cancel"
                                        fluid
                                        onClick={() => setIsEditing(false)}
                                    />
                                </Form.Field>
                            </Form>
                        )}
                        {isCreating && (
                            <Form as={Segment}>
                                <Form.Field>
                                    <Input
                                        fluid
                                        placeholder="Name"
                                        value={newUserName}
                                        onChange={(e, { value }) => setNewUserName(value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Input
                                        fluid
                                        placeholder="Email"
                                        value={newUserEmail}
                                        onChange={(e, { value }) => setNewUserEmail(value)}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button
                                        color="blue"
                                        compact
                                        content="Create"
                                        fluid
                                        onClick={() => {
                                            createUser(newUserName, newUserEmail)
                                        }}
                                    />
                                    <Divider />
                                    <Button
                                        color="red"
                                        compact
                                        content="Cancel"
                                        fluid
                                        onClick={() => setIsCreating(false)}
                                    />
                                </Form.Field>
                            </Form>
                        )}
                        <Header>Prescriptions</Header>
                        <PrescriptionFilters
                            prescriptions={[...prescriptions]}
                            meds={Array.from(
                                new Map(
                                    [...prescriptions].map((p) => [p.medication.id, p.medication])
                                ).values()
                            )}
                            dosages={Array.from(
                                new Map(
                                    [...prescriptions]
                                        .sort((a, b) => a.dosage.amount - b.dosage.amount)
                                        .map((p) => [p.dosage.id, p.dosage])
                                ).values()
                            )}
                        />

                        <Divider />
                        {prescriptionsF.length > 0 ? (
                            <>
                                <Card.Group itemsPerRow={1}>
                                    {prescriptionsF.map((p) => (
                                        <PrescriptionCard
                                            userId={activeUser.id}
                                            id={p.id}
                                            medication={p.medication}
                                            dosage={p.dosage}
                                            quantity={p.quantity}
                                            refillOn={p.refillOn}
                                            refillSchedule={p.refillSchedule}
                                        />
                                    ))}
                                </Card.Group>
                                <Divider />
                            </>
                        ) : (
                            <Segment placeholder>
                                <Header
                                    content={`${activeUser.name.first} hasn't been prescribed ${medFilter === "all" ? "anything yet" : "any " + medFilterText}.`}
                                    size="small"
                                    textAlign="center"
                                />
                            </Segment>
                        )}
                        <Button
                            color="blue"
                            content={`Prescribe something to ${activeUser.name.first}`}
                            fluid
                            onClick={() => setPrescriptionModalOpen(true)}
                        />
                        <Header>Appointments</Header>
                        {activeUser.appointments.data.length > 0 && (
                            <>
                                <Card.Group itemsPerRow={1}>
                                    {activeUser.appointments.data.map((a) => (
                                        <AppointmentCard
                                            id={a.id}
                                            user={activeUser}
                                            provider={a.provider}
                                            datetime={a.datetime}
                                            repeat={a.repeat}
                                        />
                                    ))}
                                </Card.Group>
                                <Divider />
                            </>
                        )}
                        <Button
                            color="blue"
                            content={`Schedule an appointment with ${activeUser.name.first}`}
                            fluid
                            onClick={() => setAppointmentModalOpen(true)}
                        />
                    </Segment>
                </>
            )}
        </Segment>
    )

    return (
        <>
            <Menu fixed="top" inverted>
                <Menu.Item as="a" header>
                    <Icon name="hospital" style={{ marginRight: "1.5rem" }} />
                    Zealthy
                </Menu.Item>
            </Menu>
            <Grid padded style={{ marginTop: "0.5rem" }}>
                <Grid.Row>
                    {isSelected && (
                        <Grid.Column width={5}>
                            {isSelected && <>{ActiveUserSegment}</>}
                        </Grid.Column>
                    )}
                    <Grid.Column width={isSelected ? 11 : 16}>
                        <Container>
                            <Header>
                                Users
                                <Header.Subheader>
                                    {users.length} {formatPlural(users.length, "user")}
                                </Header.Subheader>
                            </Header>
                            {loading && !error && (
                                <>
                                    <Placeholder fluid>
                                        <Placeholder.Image />
                                    </Placeholder>
                                </>
                            )}
                            {!loading && error && (
                                <Message content="There was an error fetching users" error />
                            )}
                            {!loading && !error && users.length > 0 && (
                                <Table celled selectable striped>
                                    <Table.Header>
                                        <Table.Row textAlign="center">
                                            <Table.HeaderCell>ID</Table.HeaderCell>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Email</Table.HeaderCell>
                                            <Table.HeaderCell>Appointments</Table.HeaderCell>
                                            <Table.HeaderCell>Prescriptions</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {users.map((u) => (
                                            <Table.Row
                                                onClick={() => {
                                                    setIsSelected(true)
                                                    dispatch(setActiveUser({ user: u }))
                                                    setUserName(writeFullName(u.name))
                                                    setUserEmail(u.email)
                                                }}
                                                textAlign="center"
                                            >
                                                <Table.Cell>{u.id}</Table.Cell>
                                                <Table.Cell>{writeFullName(u.name)}</Table.Cell>
                                                <Table.Cell>{u.email}</Table.Cell>
                                                <Table.Cell>{u.appointmentCount}</Table.Cell>
                                                <Table.Cell>{u.prescriptionCount}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                        </Container>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Modal
                onOpen={() => setPrescriptionModalOpen(true)}
                onClose={() => setPrescriptionModalOpen(false)}
                open={prescriptionModalOpen}
            >
                <Modal.Content>
                    <Header
                        content={`Prescribe something to ${activeUser.name.first}`}
                        size="large"
                        textAlign="center"
                    />
                    <PrescriptionCard
                        createMode
                        createCallback={() => {
                            getUsers()
                            setPrescriptionModalOpen(false)
                        }}
                        userId={activeUser.id}
                        id={0}
                        medication={defaultMedication}
                        dosage={defaultDoseage}
                        quantity={1}
                        refillOn={DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss")}
                        refillSchedule="monthly"
                    />
                </Modal.Content>
            </Modal>
            <Modal onClose={() => setAppointmentModalOpen(false)} open={appointmentModalOpen}>
                <Modal.Content>
                    <Header
                        content={`Schedule an appointment with ${activeUser.name.first}`}
                        size="large"
                        textAlign="center"
                    />
                    <AppointmentCard
                        createMode
                        createCallback={() => {
                            getUsers()
                            setAppointmentModalOpen(false)
                        }}
                        id={0}
                        user={activeUser}
                        provider={defaultProvider}
                        datetime={DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss")}
                        repeat="monthly"
                    />
                </Modal.Content>
            </Modal>
            <ToastContainer position="top-center" />
        </>
    )
}

export default Admin
