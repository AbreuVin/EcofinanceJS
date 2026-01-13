import * as adminRepo from '../repositories/adminRepository';

export const getCompanies = async () => adminRepo.findCompanies();
export const createCompany = async (data: any) => adminRepo.createCompany(data);
export const updateCompany = async (id: string, data: any) => adminRepo.updateCompany(id, data);
export const deleteCompany = async (id: string) => adminRepo.deleteCompany(id);

export const getUnits = async () => adminRepo.findUnits();
export const createUnit = async (data: any) => {
    return adminRepo.createUnit({
        name: data.name,
        city: data.city,
        state: data.state,
        country: data.country || 'Brasil',
        numberOfWorkers: Number(data.numberOfWorkers),
        company: { connect: { id: data.companyId } }
    });
};
export const updateUnit = async (id: number, data: any) => {
    const { companyId, ...rest } = data;
    const payload: any = { ...rest };
    if (companyId) payload.company = { connect: { id: companyId } };

    return adminRepo.updateUnit(id, payload);
};
export const deleteUnit = async (id: number) => adminRepo.deleteUnit(id);