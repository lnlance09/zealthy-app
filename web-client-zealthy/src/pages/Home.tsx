import { useEffect } from "react"
import { useSelector } from "react-redux"
import { ReduxState } from "../interfaces"
import { Card, Container, Grid, Header, Segment } from "semantic-ui-react"
import { DateTime } from "luxon"
import { ToastContainer } from "react-toastify"
import AuthenticationForm from "../components/Authentication"
import PageHeader from "../components/PageHeader"
import PrescriptionCard from "../components/PrescriptionCard"
import PrescriptionFilters from "../components/PrescriptionFilters"
import AppointmentCard from "../components/AppointmentCard"

function Home() {
    const isAuth = useSelector((state: ReduxState) => state.app.auth)
    const user = useSelector((state: ReduxState) => state.app.user)

    const { appointments, prescriptions } = user

    useEffect(() => {
        if (!isAuth) {
            return
        }
    }, [isAuth])

    return (
        <div>
            <PageHeader />
            {isAuth ? (
                <Container style={{ marginTop: 50 }}>
                    <Header size="large">
                        {`Hi, ${user.name.first}`}
                        <Header.Subheader>
                            {DateTime.now().toLocaleString(DateTime.DATE_MED)}
                        </Header.Subheader>
                    </Header>
                    <Grid>
                        <Grid.Column>
                            <Header content="Prescriptions" size="large" />
                            <Segment>
                                <PrescriptionFilters
                                    prescriptions={[...prescriptions.data]}
                                    meds={Array.from(
                                        new Map(
                                            [...prescriptions.data].map((p) => [
                                                p.medication.id,
                                                p.medication
                                            ])
                                        ).values()
                                    )}
                                    dosages={Array.from(
                                        new Map(
                                            [...prescriptions.data]
                                                .sort((a, b) => a.dosage.amount - b.dosage.amount)
                                                .map((p) => [p.dosage.id, p.dosage])
                                        ).values()
                                    )}
                                />
                            </Segment>
                            <Card.Group itemsPerRow={3}>
                                {prescriptions.data.map((p) => (
                                    <PrescriptionCard
                                        editable={false}
                                        userId={user.id}
                                        id={p.id}
                                        medication={p.medication}
                                        dosage={p.dosage}
                                        quantity={p.quantity}
                                        refillOn={p.refillOn}
                                        refillSchedule={p.refillSchedule}
                                    />
                                ))}
                            </Card.Group>

                            <Header content="Appointments" size="large" />
                            <Card.Group itemsPerRow={3}>
                                {appointments.data.map((a) => (
                                    <AppointmentCard
                                        editable={false}
                                        id={a.id}
                                        user={user}
                                        provider={a.provider}
                                        datetime={a.datetime}
                                        repeat={a.repeat}
                                    />
                                ))}
                            </Card.Group>
                        </Grid.Column>
                    </Grid>
                </Container>
            ) : (
                <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <AuthenticationForm />
                    </Grid.Column>
                </Grid>
            )}
            <ToastContainer position="top-center" />
        </div>
    )
}

export default Home
