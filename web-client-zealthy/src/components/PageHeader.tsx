import { useDispatch, useSelector } from "react-redux"
import { resetSessionData } from "../utils/auth"
import { resetUserData } from "../reducers/app"
import { ReduxState } from "../interfaces"
import { Icon, Menu } from "semantic-ui-react"

function PageHeader() {
    const dispatch = useDispatch()
    const isAuth = useSelector((state: ReduxState) => state.app.auth)

    return (
        <Menu fixed="top" inverted>
            <Menu.Item as="a" header>
                <Icon name="hospital" style={{ marginRight: "1.5rem" }} />
                Zealthy
            </Menu.Item>
            {isAuth && (
                <Menu.Item
                    onClick={() => {
                        dispatch(resetUserData())
                        resetSessionData()
                    }}
                    position="right"
                >
                    Logout
                </Menu.Item>
            )}
        </Menu>
    )
}

export default PageHeader
