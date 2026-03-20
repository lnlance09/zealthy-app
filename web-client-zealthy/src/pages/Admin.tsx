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
import { dateFormat, formatPlural, timeout, writeFullName } from "../utils/general"
import { defaultDoseage, defaultMedication, defaultProvider } from "../states/app"
import {
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Header,
    Message,
    Modal,
    Placeholder,
    Segment,
    Table
} from "semantic-ui-react"
import { ReduxState } from "../interfaces"
import { ToastContainer } from "react-toastify"
import { DateTime } from "luxon"
import axios from "axios"
import AppointmentCard from "../components/AppointmentCard"
import PrescriptionCard from "../components/PrescriptionCard"
import PrescriptionFilters from "../components/PrescriptionFilters"
import UserCard from "../components/UserCard"
import PageHeader from "../components/PageHeader"

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

    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)

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
                    <UserCard
                        getUsers={() => getUsers()}
                        name={writeFullName(activeUser.name)}
                        email={activeUser.email}
                    />

                    <Segment>
                        <Header>Prescriptions</Header>
                        <PrescriptionFilters
                            prescriptions={[...prescriptions]}
                            prescriptionsFiltered={[...prescriptionsF]}
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
                                <Header content={"No results..."} size="small" textAlign="center" />
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
            <PageHeader />
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
                                <Placeholder fluid>
                                    <Placeholder.Image />
                                </Placeholder>
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
                                                active={u.id === activeUser.id}
                                                onClick={() => {
                                                    setIsSelected(true)
                                                    dispatch(setActiveUser({ user: u }))
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
                        refillOn={DateTime.now().toFormat(dateFormat)}
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
                        datetime={DateTime.now().toFormat(dateFormat)}
                        repeat="monthly"
                    />
                </Modal.Content>
            </Modal>
            <ToastContainer position="top-center" />
        </>
    )
}

export default Admin
