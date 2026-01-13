import { CardFooter } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

interface LoginCardFooterProps {
    isLoading: boolean;
    formId: string;
}

function LoginCardFooter({ isLoading, formId }: LoginCardFooterProps) {
    return <CardFooter className="flex-col gap-2">
        <Button
            type="submit"
            className="w-full"
            form={formId}
            disabled={isLoading}
        >
            {isLoading ? "Entrando..." : "Login"}
        </Button>
    </CardFooter>;
}

export default LoginCardFooter;