import * as bcrypt from 'bcrypt'
import * as dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.user.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.company.deleteMany();

    const company = await prisma.company.upsert({
        where: { id: 'comp-001' }, // Hardcoded ID for consistency
        update: {},
        create: {
            id: 'comp-001',
            name: 'EcoFinance Demo Corp',
            cnpj: '12.345.678/0001-90',
        },
    });
    console.log(`🏢 Company created: ${company.name}`);

    const unitSP = await prisma.unit.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Matriz São Paulo',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            numberOfWorkers: 150,
            companyId: company.id,
        },
    });

    const unitRJ = await prisma.unit.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Filial Rio de Janeiro',
            city: 'Rio de Janeiro',
            state: 'RJ',
            country: 'Brasil',
            numberOfWorkers: 45,
            companyId: company.id,
        },
    });
    console.log(`🏭 Units created: ${unitSP.name}, ${unitRJ.name}`);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@ecofinance.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@ecofinance.com',
            password: passwordHash,
            role: 'ADMIN',
            companyId: company.id,
            // Admin might not be bound to a specific unit, or bound to HQ
            unitId: unitSP.id,
        },
    });

    // Standard User (Bound to RJ Unit)
    const standardUser = await prisma.user.upsert({
        where: { email: 'user@ecofinance.com' },
        update: {},
        create: {
            name: 'Roberto Operador',
            email: 'user@ecofinance.com',
            password: passwordHash,
            role: 'USER',
            companyId: company.id,
            unitId: unitRJ.id, // Can only see/edit RJ data
        },
    });

    const master = await prisma.user.upsert({
        where: { email: 'master@ecofinance.com' },
        update: {},
        create: {
            name: 'System Master',
            email: 'master@ecofinance.com',
            password: passwordHash,
            role: 'MASTER',
            companyId: null, // Master is above companies
            unitId: null
        }
    });

    console.log(`👤 Users created: Admin (${admin.email}), User (${standardUser.email}), Master (${master.email})`);
    console.log('✅ Seed finished.');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
