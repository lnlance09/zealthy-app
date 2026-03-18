import { configureStore } from "@reduxjs/toolkit"
import { createLogger } from "redux-logger"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import rootReducer from "../reducers/root"

const logger = createLogger({
    collapsed: true,
    duration: true,
    timestamp: true
})

const isDev = import.meta.env.VITE_NODE_ENV === "development"
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({ serializableCheck: false })
        if (isDev) {
            return middleware.concat(logger)
        }
        return middleware
    },
    devTools: isDev
})

type ThemeProps = {
    children: ReactNode
}

const StoreProvider = ({ children }: ThemeProps) => {
    return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
