import { PrismaClient } from "../../../generated/prisma";
import * as dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;