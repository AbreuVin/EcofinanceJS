import { JwtPayload } from "jsonwebtoken";

export interface AppJwtPayload extends JwtPayload {
    id: string;
    role: string;
    companyId: string | null;
}