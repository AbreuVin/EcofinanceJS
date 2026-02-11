import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DIRECT_URL;

export default defineConfig({
    schema: "./prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: dbUrl,
    },
});