import { Icon, Menu } from "semantic-ui-react"

function PageHeader() {
    return (
        <Menu fixed="top" inverted>
            <Menu.Item as="a" header>
                <Icon name="hospital" style={{ marginRight: "1.5rem" }} />
                Zealthy
            </Menu.Item>
        </Menu>
    )
}

export default PageHeader
