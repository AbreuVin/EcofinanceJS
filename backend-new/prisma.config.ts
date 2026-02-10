import { defineConfig } from "prisma/config";

console.log("Chaves de ambiente injetadas no processo do Prisma:", Object.keys(process.env).filter(k => k.includes('URL')));

const dbUrl = process.env.DIRECT_URL;

if (!dbUrl) {
    throw new Error("ERRO DE INJEÇÃO RENDER: O processo do Node executando o Prisma não recebeu a DIRECT_URL.");
}

export default defineConfig({
    schema: "./prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: dbUrl,
    },
});