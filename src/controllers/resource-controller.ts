import {httpDelete, httpGet, httpPost, queryParam, request, requestBody, requestParam} from 'inversify-express-utils';
import {Author} from '../models/author';
import {IRepository} from '../repositories/repository';
import {injectable} from 'inversify';
import {IPage} from '../domain/page';
import {PageRequest} from '../domain/pageable';
import {Resource} from '../models/resource';
import * as validate from 'validate.js';
import {Example} from '../repositories/mapper/query-helper';
import * as e from 'express';


@injectable()
export class ResourceController<T extends Resource> {

    private _constraints: any;

    set constraints(value: any) {
        this._constraints = value;
    }

    private _filters: string[];

    set filters(value: string[]) {
        this._filters = value;
    }

    constructor(
        private readonly repository: IRepository,
    ) {
        this._constraints = {};
        this._filters = [];
    }

    @httpPost('/')
    private async create(
        @requestBody() body: any,
        @request() req: e.Request,
    ): Promise<Author> {
        const mapped = await this.mapToResource(body, req);
        delete mapped.id;
        return this.mapToDto(await this.repository.save(mapped));
    }

    @httpGet('/')
    private async readMany(
        @queryParam('page') page: string = '0',
        @queryParam('size') size: string = '20',
        @request() req: e.Request,
    ): Promise<IPage<any>> {
        const pageNum = Math.max(0, Number.parseInt(page, 10) || 0);
        const sizeNum = Math.max(0, Math.min(30, Number.parseInt(size, 10) || 20));
        const example = this._filters.reduce((p, v) => ({...p, [v]: req.query[v]}), {});
        const ret = await this.repository.find(PageRequest.of(pageNum, sizeNum), {
            ...example,
            ...this.prepareFilters(req),
        });
        return ret.map((i) => this.mapToDto(i));
    }


    @httpGet('/:id')
    private async read(
        @requestParam('id') id: string,
        @request() req: e.Request,
    ): Promise<T | null> {
        const ret = await this.repository.findById(id, this.prepareFilters(req));
        if (ret) {
            return this.mapToDto(ret);
        } else {
            return ret;
        }
    }

    @httpDelete('/')
    private async delete(
        @requestBody() body: { id: string },
    ): Promise<void> {
        await this.repository.deleteById(body.id);
    }

    protected prepareFilters(request: e.Request): Example {
        return {};
    }

    protected async mapToResource(body: any, request: e.Request): Promise<T> {
        if (typeof body !== 'object') {
            throw new Error('Invalid body');
        }
        body = Object.keys(this._constraints).reduce((prev: object, k: string) => {
            // @ts-ignore
            prev[k] = body[k];
            return prev;
        }, {});
        const errors = validate.validate(body, this._constraints);
        if (errors) {
            throw new Error('Validation failed');
        }
        return body as T;
    }

    protected mapToDto(body: T): any {
        return body;
    }
}
