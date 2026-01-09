import { Route } from "wouter";
import LoginPage from "@/shared/pages/LoginPage.tsx";

function App() {
    return (
        <main className="flex h-screen w-screen items-center justify-center bg-gray-100">
            <Route path="/">
                <LoginPage />
            </Route>
        </main>
    )
}

export default App
