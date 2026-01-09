import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";

function LoginCardHeader() {
    return <CardHeader className="flex flex-col items-start">
        <CardTitle>Entre em sua conta</CardTitle>
        <CardDescription>
            Insira seu e-mail para entrar
        </CardDescription>
    </CardHeader>;
}

export default LoginCardHeader;