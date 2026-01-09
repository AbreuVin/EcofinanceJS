import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";

function LoginEmailInput() {
    return <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
            id="email"
            type="email"
            placeholder="joao@ecofinance.com.br"
            required
        />
    </div>;
}

export default LoginEmailInput