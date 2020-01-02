import {inject, injectable, multiInject} from "inversify";
import {IOrm} from "./orm/orm";
import {IDENTIFIERS} from "./constants/identifiers";
import {IRepository} from "./repositories/repository";

export interface IServer {

    start(): void;
}

@injectable()
export class Server implements IServer {

    constructor(
        @inject(IDENTIFIERS.ORM)
        private readonly orm: IOrm,
        @multiInject(IDENTIFIERS.REPOSITORY)
        private readonly repositories: IRepository[],
    ) {
    }

    async start() {
        await this.orm.init();
        await Promise.all(this.repositories.map(r => r.init()));
    }


}
