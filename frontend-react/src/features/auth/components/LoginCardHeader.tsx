import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";

function LoginCardHeader() {
    return <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
            Enter your email below to login to your account
        </CardDescription>
    </CardHeader>;
}

export default LoginCardHeader;