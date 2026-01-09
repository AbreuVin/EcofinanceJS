import * as bcrypt from 'bcrypt'
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma";

const adapter = new PrismaBetterSqlite3({
    url: "file:./dev.db"
})

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.assetTypology.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.company.deleteMany();

    const masterPass = await bcrypt.hash('master123', 10)
    await prisma.user.upsert({
        where: { email: 'master@ecofinance.com' },
        update: {},
        create: {
            email: 'master@ecofinance.com',
            password: masterPass,
            name: 'System Master',
            role: 'MASTER'
        },
    });
    console.log('Seed: MASTER user created.');

    const company = await prisma.company.upsert({
        where: { name: 'EcoFinance Demo Corp' },
        update: {},
        create: {
            name: 'EcoFinance Demo Corp',
            cnpj: '12.345.678/0001-90'
        }
    });
    console.log('Seed: Company ensured.');

    const unit = await prisma.unit.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Sao Paulo HQ',
            city: 'Sao Paulo',
            state: 'SP',
            country: 'Brasil',
            numberOfWorkers: 150,
            companyId: company.id
        }
    });
    console.log(`Seed: Unit ensured with ID: ${unit.id}`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
