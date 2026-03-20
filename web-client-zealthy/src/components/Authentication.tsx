import { Button, Divider, Form, Header, Input, Message } from "semantic-ui-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setUserData } from "../reducers/app"
import { setSessionData } from "../utils/auth"
import { toast } from "react-toastify"
import { toastConfig } from "../utils/toast"
import axios from "axios"
import isEmail from "validator/lib/isEmail"

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

    const loginDisabled = !isEmail(email) || password.length < 8
    const registerDisabled = !isEmail(regEmail) || regPassword.length < 8 || regName.length < 4

    const submitLoginForm = async (email: string, password: string) => {
        setLoadingLogin(true)
        await axios
            .post(`${import.meta.env.VITE_API_BASE_URL}user/login`, {
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
                toast.error(errorMsg, toastConfig)
            })
        setLoadingLogin(false)
    }

    const submitRegistrationForm = async (name: string, email: string, password: string) => {
        setLoadingRegistration(true)
        await axios
            .post(`${import.meta.env.VITE_API_BASE_URL}user/register`, {
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
                toast.error(errorMsg, toastConfig)
            })
        setLoadingRegistration(false)
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
                                    onChange={(_e, { value }) => setEmail(value)}
                                    placeholder="Email"
                                    value={email}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    onChange={(_e, { value }) => setPassword(value)}
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
                        <Message onClick={() => setShowLogin(false)} size="small">
                            <a href="#">Sign Up</a>
                        </Message>
                    </>
                ) : (
                    <>
                        <Form size={size}>
                            <Form.Field>
                                <Input
                                    onChange={(_e, { value }) => setRegEmail(value)}
                                    placeholder="Email"
                                    value={regEmail}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    onChange={(_e, { value }) => setRegPassword(value)}
                                    placeholder="Password"
                                    value={regPassword}
                                    type="password"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    onChange={(_e, { value }) => setRegName(value)}
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
                        <Message onClick={() => setShowLogin(true)} size="small">
                            <a href="#">Sign In</a>
                        </Message>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthenticationForm
