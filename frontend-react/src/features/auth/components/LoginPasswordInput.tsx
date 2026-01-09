import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";

function LoginPasswordInput() {
    return <div className="grid gap-2">
        <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
                Esqueceu sua senha?
            </a>
        </div>
        <Input id="password" type="password" required/>
    </div>;
}

export default LoginPasswordInput;