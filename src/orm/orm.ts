import {Connection} from "cypher-query-builder";

export interface ISelectOptions {

    limit?: number;

    offset?: number;

    where?: { [key: string]: string | number };
}

export interface IOrm {

    init(): Promise<void>;

    readonly connection: Connection;
}
