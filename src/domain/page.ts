import {IPageable, PageRequest} from "./pageable";

export interface IPage<T> {

    readonly page: number;

    readonly size: number;

    readonly count: number;

    readonly total: number;

    readonly items: T[];

    map<U>(mapper: (item: T) => U): IPage<U>;
}

export class Page<T> implements IPage<T> {

    readonly count: number;

    readonly items: T[];

    readonly page: number;

    readonly size: number;

    readonly total: number;

    constructor(pageable: IPageable, items: T[], total: number) {
        this.page = pageable.page;
        this.size = pageable.size;
        this.items = items;
        this.count = items.length;
        this.total = total;
    }

    map<U>(mapper: (item: T) => U): IPage<U> {
        return new Page(
            PageRequest.of(this.page, this.size),
            this.items.map(mapper),
            this.total,
        );
    }
}
