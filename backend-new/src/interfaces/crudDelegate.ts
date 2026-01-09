export interface CrudDelegate<T> {
    findMany(args?: any): Promise<T[]>;

    findUnique(args: any): Promise<T | null>;

    create(args: { data: any }): Promise<T>;

    update(args: { where: any; data: any }): Promise<T>;

    delete(args: { where: any }): Promise<T>;

    count(args?: any): Promise<number>;
}