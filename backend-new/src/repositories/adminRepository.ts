import { Prisma } from "../../generated/prisma";
import prisma from "./prisma";

export const findCompanies = () => prisma.company.findMany({ orderBy: { name: 'asc' } });
export const createCompany = (data: Prisma.CompanyCreateInput) => prisma.company.create({ data });
export const updateCompany = (id: string, data: Prisma.CompanyUpdateInput) => prisma.company.update({ where: { id }, data });
export const deleteCompany = (id: string) => prisma.company.delete({ where: { id } });

export const findUnits = () => prisma.unit.findMany({
    include: { company: true }, // Eager load company name
    orderBy: { name: 'asc' }
});
export const createUnit = (data: Prisma.UnitCreateInput) => prisma.unit.create({ data });
export const updateUnit = (id: number, data: Prisma.UnitUpdateInput) => prisma.unit.update({ where: { id }, data });
export const deleteUnit = (id: number) => prisma.unit.delete({ where: { id } });