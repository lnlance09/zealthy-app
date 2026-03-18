import "semantic-ui-css/semantic.min.css"
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import "./scss/main.scss"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import StoreProvider from "./components/StoreProvider.tsx"
import Admin from "./pages/Admin.tsx"
import Home from "./pages/Home.tsx"

const el = document.getElementById("root")
if (el) {
    const root = createRoot(el)
    root.render(
        <StrictMode>
            <BrowserRouter>
                <StoreProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </StoreProvider>
            </BrowserRouter>
        </StrictMode>
    )
}
