import {Class} from '../../types';
import {IRelationshipMetadata} from '../../decorators/relationship-decorator';
import {METADATA} from '../../constants/metadata';
import {Connection, node, Query, relation} from 'cypher-query-builder';
import {Resource} from '../../models/resource';

export type Example = { [key: string]: string | number };

function getLabel(model: Class) {
    return Reflect.getMetadata(METADATA.ENTITY, model) || model.name;
}

export class QueryHelper<T extends Resource = any> {

    private readonly label: string;
    private readonly relationships: IRelationshipMetadata[];

    constructor(model: Class,
                private readonly conn: Connection,
                private readonly mapConditions?: (r: T) => object,
    ) {
        this.label = getLabel(model);
        this.relationships = Reflect.getMetadata(METADATA.RELATIONSHIP, model) || [];
    }

    applyFilters(conditions?: {}, example: Example = {}): Query {
        const exampleKeys = Object.keys(example).filter(k => example[k] != null);
        const exampleRelationships = this.relationships.filter(
            r => exampleKeys.includes(r.property),
        );
        const matchNode = node('e', this.label, conditions);
        const match = [matchNode];
        for (const rel of exampleRelationships) {
            match.push(
                relation(rel.remote ? 'in' : 'out', '', rel.name),
                node('', getLabel(rel.target), {id: example[rel.property]}),
            );
        }
        return this.conn.match(match);
    }

    prepare(conditions?: {}, example: Example = {}): Query {
        const query = this.applyFilters(conditions, example);
        const returns = ['e'];
        for (const relationship of this.relationships.filter(r => !r.many)) {
            const key = `${relationship.property}_0`;
            query.optionalMatch([
                node('e'),
                relation(relationship.remote ? 'in' : 'out', '', relationship.name),
                node(key, getLabel(relationship.target)),
            ]);
            returns.push(relationship.include ? key : `${key}.id AS ${key}`);
        }
        query.return(returns);
        return query;
    }

    prepareCreate(body: any): Query {
        const createRelations = [];
        const returns = ['e'];
        const query = this.conn.query();
        for (const relationship of this.relationships) {
            const val = body[relationship.property];
            const props = relationship.many ? val : [val];
            for (let i = 0; i < props.length; i += 1) {
                const prop = props[i];
                const key = `${relationship.property}_${i}`;
                const id = prop && relationship.include ? prop['id'] : prop;
                query.matchNode(key, getLabel(relationship.target), {id});
                createRelations.push([
                    node('e'),
                    relation(relationship.remote ? 'in' : 'out', '', relationship.name),
                    node(key),
                ]);
                if (relationship.include) {
                    returns.push(key);
                } else {
                    returns.push(`${key}.id as ${key}`);
                }
            }
            delete body[relationship.property];
        }
        query.merge(node('e', this.label, this.mapConditions ? this.mapConditions(body) : {id: body['id']}));
        query.onCreate.setValues(Object.keys(body).reduce((p, k) => ({...p, [`e.${k}`]: body[k]}), {}));
        for (const relationship of createRelations) {
            query.merge(relationship);
        }
        query.return(returns);
        return query;
    }

    async resolveRelations(resource: any): Promise<void> {
        for (const relationship of this.relationships.filter(r => r.many)) {
            const matched = await this.conn.matchNode('e', this.label, {id: resource.id}).optionalMatch([
                node('e'),
                relation(relationship.remote ? 'in' : 'out', '', relationship.name),
                node('r', getLabel(relationship.target))
            ]).return(relationship.include ? 'r' : 'r.id as r').run();
            console.log('matched', matched);
            resource[relationship.property] = matched.map(m => m['r']).filter(r => r != null).map(r => r.properties);
        }
    }

    mapResult(results: { [key: string]: { properties: any } }[]): T[] {
        return results.map(d => {
            const props = d['e'].properties;
            const keys = Object.keys(d);
            for (const relationship of this.relationships.filter(r => !r.many)) {
                const matching = keys.filter(k => k.startsWith(`${relationship.property}_`));
                const val = d[matching[0]];
                if (val) {
                    props[relationship.property] = relationship.include ? val.properties : val;
                }
            }
            return props;
        });
    }
}
