import { Route } from "wouter";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import LoginPage from "@/shared/pages/LoginPage";
import HomePage from "@/shared/pages/HomePage";

const queryClient = new QueryClient()

function App() {
    return (
        <div className="h-screen w-screen">
            <QueryClientProvider client={queryClient}>
                <Route path="/">
                    <LoginPage/>
                </Route>
                <Route path="/home">
                    <HomePage/>
                </Route>
            </QueryClientProvider>
        </div>
    )
}

export default App
