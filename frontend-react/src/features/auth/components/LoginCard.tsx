import type { FormEvent } from "react";
import { Card } from "@/components/ui/card";
import LoginCardHeader from "@/features/auth/components/LoginCardHeader.tsx";
import LoginCardFooter from "@/features/auth/components/LoginCardFooter.tsx";
import LoginCardContent from "@/features/auth/components/LoginCardContent.tsx";
import { useLogin } from "@/features/auth/hooks/useLogin.ts";

function LoginCard() {
    // 1. Initialize the hook
    const { mutate, isPending } = useLogin();
    const FORM_ID = "login-form";

    // 2. Create the submit handler
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Extract data natively using FormData (no state needed!)
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // 3. Call the mutation
        mutate({ email, password });
    };

    return (
        <Card className="w-full max-w-sm">
            <LoginCardHeader/>

            <LoginCardContent
                formId={FORM_ID}
                onSubmit={handleSubmit}
            />

            <LoginCardFooter
                formId={FORM_ID}
                isLoading={isPending}
            />
        </Card>
    );
}

export default LoginCard;