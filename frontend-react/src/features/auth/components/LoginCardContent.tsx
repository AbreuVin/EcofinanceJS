import { CardContent } from "@/components/ui/card.tsx";
import LoginEmailInput from "@/features/auth/components/LoginEmailInput.tsx";
import LoginPasswordInput from "./LoginPasswordInput";
import type { FormEvent } from "react";

interface LoginCardContentProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    formId: string;
}

function LoginCardContent({ onSubmit, formId }: LoginCardContentProps) {
    return (
        <CardContent>
            <form id={formId} onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                    <LoginEmailInput/>
                    <LoginPasswordInput/>
                </div>
            </form>
        </CardContent>
    );
}

export default LoginCardContent;