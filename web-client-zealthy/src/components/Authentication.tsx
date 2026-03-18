import { Button, Divider, Form, Header, Icon, Input, Transition } from "semantic-ui-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserData, resetUserData } from "../reducers/app"
import { ReduxState } from "../interfaces"
import { setSessionData, resetSessionData } from "../utils/auth"
import { toast } from "react-toastify"
import { toastConfig } from "../utils/toast"
import axios from "axios"

type ButtonSize = "medium" | "large"
type Props = {
    login?: boolean
    size?: ButtonSize
}

const AuthenticationForm = ({ login = true, size = "large" }: Props) => {
    const dispatch = useDispatch()

    const [showLogin, setShowLogin] = useState(login)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loadingLogin, setLoadingLogin] = useState(false)

    const [regName, setRegName] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [loadingRegistration, setLoadingRegistration] = useState(false)

    const loginDisabled = email.length < 4 || password.length < 8
    const registerDisabled = regEmail.length < 4 || regPassword.length < 8 || regName.length < 4

    const submitLoginForm = (email: string, password: string) => {
        setLoadingLogin(true)
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}users/login`, {
                email,
                password
            })
            .then(async (response) => {
                const { bearer, user } = response.data
                dispatch(setUserData({ user }))
                setSessionData(1, bearer, user)
                toast.success("You have been logged in!", toastConfig)
            })
            .catch((error) => {
                let errorMsg = ""
                const { status } = error.response
                const { errors } = error.response.data
                if (status === 401) {
                    errorMsg = error.response.data.message
                } else {
                    if (errors.password) {
                        errorMsg = errors.password[0]
                    }
                    if (errors.email) {
                        errorMsg = errors.email[0]
                    }
                }
                setLoadingLogin(false)
                toast.error(errorMsg, toastConfig)
            })
    }

    const submitRegistrationForm = (name: string, email: string, password: string) => {
        setLoadingRegistration(true)
        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}users/register`, {
                name,
                email,
                password
            })
            .then(async (response) => {
                const { bearer, user } = response.data
                dispatch(setUserData({ user }))
                setSessionData(1, bearer, user)
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
                    if (errors.password) {
                        errorMsg = errors.password[0]
                    }
                    if (errors.email) {
                        errorMsg = errors.email[0]
                    }
                }
                setLoadingRegistration(false)
                toast.error(errorMsg, toastConfig)
            })
    }

    return (
        <div className="authComponent">
            <Header as="h1" className="huge" content="Sign In" textAlign="center" />
            <div className="authSegment">
                {showLogin ? (
                    <>
                        <Form size={size}>
                            <Form.Field>
                                <Input
                                    onChange={(e, { value }) => setEmail(value)}
                                    placeholder="Email"
                                    value={email}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    onChange={(e, { value }) => setPassword(value)}
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                />
                            </Form.Field>
                        </Form>
                        <Divider />
                        <Button
                            color="blue"
                            content="Sign In"
                            disabled={loginDisabled}
                            fluid
                            loading={loadingLogin}
                            onClick={() => submitLoginForm(email, password)}
                            size={size}
                        />
                        <Header onClick={() => setShowLogin(false)} size="small" textAlign="center">
                            Sign Up
                        </Header>
                    </>
                ) : (
                    <>
                        <Form size={size}>
                            <Form.Field>
                                <Input
                                    onChange={(e, { value }) => setRegEmail(value)}
                                    placeholder="Email"
                                    value={regEmail}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    onChange={(e, { value }) => setRegPassword(value)}
                                    placeholder="Password"
                                    value={regPassword}
                                    type="password"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    onChange={(e, { value }) => setRegName(value)}
                                    placeholder="Name"
                                    value={regName}
                                />
                            </Form.Field>
                        </Form>
                        <Divider />
                        <Button
                            color="blue"
                            content="Sign Up"
                            disabled={registerDisabled}
                            fluid
                            loading={loadingRegistration}
                            onClick={() => submitRegistrationForm(regName, regEmail, regPassword)}
                            size={size}
                        />
                        <Header onClick={() => setShowLogin(true)} size="small" textAlign="center">
                            Sign In
                        </Header>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthenticationForm
