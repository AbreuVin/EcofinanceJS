import { Request, Response } from 'express';
import { getRegistryEntry } from './esg.registry';

export const list = async (req: Request, res: Response) => {
    const { sourceType } = req.params;
    const { unitId, year } = req.query;

    const parsedUnitId = unitId && unitId !== 'undefined' && unitId !== 'null' && unitId !== '0'
        ? Number(unitId)
        : undefined;

    const { service } = getRegistryEntry(sourceType as string);

    const data = await service.getByUnitAndYear(parsedUnitId, year ? Number(year) : undefined);

    res.json(data);
};

export const listAdminReports = async (req: Request, res: Response) => {
    const { sourceType, unitId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { service } = getRegistryEntry(sourceType);

    const data = await service.getPaginatedAdminByUnit(Number(unitId), page, limit);
    res.json(data);
};

export const getAdminReportDetail = async (req: Request, res: Response) => {
    const { sourceType, id } = req.params;
    const { service } = getRegistryEntry(sourceType);

    const data = await service.getById(Number(id));
    if (!data) return res.status(404).json({ message: 'Reporte não encontrado' });

    res.json(data);
};

export const create = async (req: Request, res: Response) => {
    const { sourceType } = req.params;
    const { service, schema } = getRegistryEntry(sourceType as string);

    const cleanBody = await schema.parseAsync(req.body);

    const result = await service.create(cleanBody);
    res.status(201).json(result);
};

export const update = async (req: Request, res: Response) => {
    const { sourceType, id } = req.params;
    const { service, schema } = getRegistryEntry(sourceType as string);

    const cleanBody = await schema.partial().parseAsync(req.body);

    const result = await service.update(Number(id), cleanBody);
    res.json(result);
};

export const remove = async (req: Request, res: Response) => {
    const { sourceType, id } = req.params;
    const { service } = getRegistryEntry(sourceType as string);

    await service.delete(Number(id));
    res.status(204).send();
};

export const listAdminReportsByCompany = async (req: Request, res: Response) => {
    const { sourceType, companyId } = req.params;
    const { service } = getRegistryEntry(sourceType);

    const data = await service.getAllByCompany(companyId);
    res.json(data);
};

export const bulkCreateOrUpdate = async (req: Request, res: Response) => {
    const { sourceType } = req.params;
    const { service } = getRegistryEntry(sourceType);
    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({ message: 'Nenhum registro enviado' });
    }

    if (entries.length > 500) {
        return res.status(400).json({ message: 'Máximo 500 registros por envio' });
    }

    const result = await service.bulkCreateOrUpdate(entries);
    res.status(200).json({
        ...result,
        message: `${result.created} registros criados, ${result.updated} atualizados`
    });
};