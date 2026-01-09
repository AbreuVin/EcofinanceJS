import { Card } from "@/components/ui/card";
import LoginCardHeader from "@/features/auth/components/LoginCardHeader.tsx";
import LoginCardFooter from "@/features/auth/components/LoginCardFooter.tsx";
import LoginCardContent from "@/features/auth/components/LoginCardContent.tsx";


function LoginCard() {
    return (
        <Card className="w-full max-w-sm">
            <LoginCardHeader/>
            <LoginCardContent/>
            <LoginCardFooter/>
        </Card>
    );
}

export default LoginCard;