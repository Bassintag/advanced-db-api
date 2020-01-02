import {IOrm} from "./orm";
import {inject, injectable} from "inversify";
import {IDENTIFIERS} from "../constants/identifiers";
import {Connection} from 'cypher-query-builder';

@injectable()
export class Neo4jOrm implements IOrm {

    public readonly connection: Connection;

    constructor(
        @inject(IDENTIFIERS.DB_CONNECTION_STRING)
        private readonly dbConnectionString: string,
        @inject(IDENTIFIERS.DB_USERNAME)
        private readonly dbUsername: string,
        @inject(IDENTIFIERS.DB_PASSWORD)
        private readonly dbPassword: string,
    ) {
        this.connection = new Connection(dbConnectionString, {
            username: dbUsername,
            password: dbPassword
        }, {
            driverConfig: {
                logging: {
                    level: "debug", logger(level, message) {
                        console.log(`[neo4J][${level}] ${message}`);
                    }
                }
            }
        });
    }

    async init(): Promise<void> {
    }


}
