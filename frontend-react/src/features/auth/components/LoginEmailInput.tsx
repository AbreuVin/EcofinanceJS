import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";

function LoginEmailInput() {
    return <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
        />
    </div>;
}

export default LoginEmailInput