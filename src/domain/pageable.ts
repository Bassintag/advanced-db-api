import {IPage, Page} from "./page";

export interface IPageable {

    readonly page: number;

    readonly size: number;

    toPage<T>(items: T[], total: number): IPage<T>;
}

export class PageRequest implements IPageable {

    readonly page: number;

    readonly size: number;

    private constructor(page: number, size: number) {
        this.page = page;
        this.size = size;
    }

    toPage<T>(items: T[], total: number): IPage<T> {
        return new Page(this, items, total);
    }

    static of(page: number, size: number): IPageable {
        return new PageRequest(page, size)
    }
}
