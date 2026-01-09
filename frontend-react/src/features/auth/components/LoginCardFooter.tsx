import { CardFooter } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

function LoginCardFooter() {
    return <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
            Login
        </Button>
    </CardFooter>;
}

export default LoginCardFooter;