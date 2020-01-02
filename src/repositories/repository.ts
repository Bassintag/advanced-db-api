import {IOrm} from '../orm/orm';
import {inject, injectable} from 'inversify';
import {IDENTIFIERS} from '../constants/identifiers';
import {Class} from '../types';
import {METADATA} from '../constants/metadata';
import {Resource} from '../models/resource';
import {IPageable} from '../domain/pageable';
import {IPage} from '../domain/page';
import {Example, QueryHelper} from './mapper/query-helper';

export interface IRepository<T = any> {

    init(): Promise<void>;

    find(pageable: IPageable, example?: object): Promise<IPage<T>>;

    findById(id: string, example?: object): Promise<T | null>;

    save(entity: T): Promise<T>;

    deleteById(id: string): Promise<void>;

}

@injectable()
export class Repository<T extends Resource> implements IRepository<T> {

    @inject(IDENTIFIERS.ORM)
    protected readonly orm!: IOrm;

    @inject(IDENTIFIERS.UUID_GENERATOR)
    private uuid!: () => string;

    protected readonly label: string;

    private qh!: QueryHelper;

    constructor(
        private readonly model: Class<T>,
        private readonly identityMapper?: (p: T) => object,
    ) {
        this.label = Reflect.getMetadata(METADATA.ENTITY, model) || model.name;
    }

    protected async mapResults(results: { [key: string]: { properties: T } }[]): Promise<T[]> {
        const mapped = this.qh.mapResult(results);
        await Promise.all(mapped.map(m => this.qh.resolveRelations(m)));
        return mapped;
    }

    async init(): Promise<void> {
        const indices = Reflect.getMetadata(METADATA.INDEX, this.model) as string[] || [];
        await Promise.all([...indices, 'id'].map((i) => this.orm.connection.raw(
            `CREATE INDEX ON :${this.model.name}(${i})`,
        ).run()));
        this.qh = new QueryHelper<T>(this.model, this.orm.connection, this.identityMapper);
    }

    async findById(id: string, example: Example = {}): Promise<T | null> {
        const results = await this.qh.prepare({'id': id}, example).run();
        const mapped = await this.mapResults(results);
        return await mapped[0] || null;
    }

    async find(pageable: IPageable, example: Example = {}): Promise<IPage<T>> {
        const [records, count] = await Promise.all([
            this.qh.prepare(undefined, example)
                .skip(pageable.size * pageable.page)
                .limit(pageable.size)
                .run(),
            this.qh.applyFilters(undefined, example)
                .with('count(e) as count')
                .return('count')
                .run(),
        ]);
        const mapped = this.mapResults(records);
        return pageable.toPage(await mapped, count[0]['count']);
    }

    async save(entity: T): Promise<T> {
        let records;
        if (entity.id) {
            records = await this.orm.connection.matchNode('e', this.label, {id: entity.id})
                .setValues(entity, false)
                .return('e')
                .run();
        } else {
            entity.id = this.uuid();
            records = await this.qh.prepareCreate(entity)
                .run();
        }
        return (await this.mapResults(records))[0];
    }

    async deleteById(id: string): Promise<void> {
        await this.orm.connection.matchNode('e', this.label, {id})
            .detachDelete('e')
            .run();
    }
}
