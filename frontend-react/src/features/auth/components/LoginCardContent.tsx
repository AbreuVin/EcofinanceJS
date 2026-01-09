import { CardContent } from "@/components/ui/card.tsx";
import LoginEmailInput from "@/features/auth/components/LoginEmailInput.tsx";
import LoginPasswordInput from "./LoginPasswordInput";


function LoginCardContent() {
    return <CardContent>
        <form>
            <div className="flex flex-col gap-6">
                <LoginEmailInput/>
                <LoginPasswordInput/>
            </div>
        </form>
    </CardContent>;
}

export default LoginCardContent;