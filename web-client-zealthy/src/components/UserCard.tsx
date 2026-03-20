import { useEffect, useState } from "react"
import { Button, Divider, Form, Header, Input, Label, Segment } from "semantic-ui-react"
import { useDispatch, useSelector } from "react-redux"
import { ReduxState } from "../interfaces"
import { toast } from "react-toastify"
import { toastConfig } from "../utils/toast"
import { setActiveUser } from "../reducers/admin"
import axios from "axios"

type Params = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUsers: () => any
    name: string
    email: string
}

const UserCard = ({ getUsers, name, email }: Params) => {
    const dispatch = useDispatch()

    const activeUser = useSelector((state: ReduxState) => state.admin.activeUser)

    const [isEditing, setIsEditing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    const [userName, setUserName] = useState(name)
    const [userEmail, setUserEmail] = useState(email)

    const [newUserName, setNewUserName] = useState("")
    const [newUserEmail, setNewUserEmail] = useState("")

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserName(name)
        setUserEmail(email)
    }, [name, email])

    const createUser = (name: string, email: string) => {
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}user/register`, {
                name,
                email
            })
            .then(async (response) => {
                const user = response.data.user
                dispatch(setActiveUser({ user }))
                setIsCreating(false)
                setNewUserEmail("")
                setNewUserName("")
                await getUsers()
                toast.success("User has been added!", toastConfig)
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
            .then(async (response) => {
                dispatch(setActiveUser({ user: response.data.data }))
                await getUsers()
                setIsEditing(false)
                toast.success("User has been updated!", toastConfig)
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

    return (
        <div className="userCardComponent">
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
            {isEditing && (
                <Form as={Segment}>
                    <Form.Field>
                        <Input
                            fluid
                            placeholder="Name"
                            value={userName}
                            onChange={(_e, { value }) => setUserName(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            fluid
                            placeholder="Email"
                            value={userEmail}
                            onChange={(_e, { value }) => setUserEmail(value)}
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
                            onChange={(_e, { value }) => setNewUserName(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            fluid
                            placeholder="Email"
                            value={newUserEmail}
                            onChange={(_e, { value }) => setNewUserEmail(value)}
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
        </div>
    )
}

export default UserCard
