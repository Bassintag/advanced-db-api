import "reflect-metadata";
import {Container} from "inversify";
import {IOrm} from "./orm/orm";
import {IDENTIFIERS} from "./constants/identifiers";
import {Neo4jOrm} from "./orm/neo4j-orm";
import {IRepository} from "./repositories/repository";
import {UserRepository} from "./repositories/user-repository";
import {IServer, Server} from "./server";
import {RESOURCE_NAMES} from "./constants/resources";
import uuid = require("uuid");
import {AuthorRepository} from "./repositories/author-repository";
import {ProviderRepository} from "./repositories/provider-repository";
import {CourseRepository} from "./repositories/course-repository";
import {KnowledgeRepository} from "./repositories/knowledge-repository";
import {AuthMiddleware} from './middlewares/auth-middleware';
import {RegistrationRepository} from './repositories/registration-repository';

const container = new Container();

container.bind<AuthMiddleware>(IDENTIFIERS.AUTH_MIDDLEWARE).to(AuthMiddleware).inSingletonScope();

container.bind<string>(IDENTIFIERS.DB_CONNECTION_STRING)
    .toConstantValue(process.env['DB_CONNECTION_STRING'] || 'bolt://localhost');
container.bind<string | null>(IDENTIFIERS.DB_USERNAME)
    .toConstantValue(process.env['DB_USERNAME'] || null);
container.bind<string | null>(IDENTIFIERS.DB_PASSWORD)
    .toConstantValue(process.env['DB_PASSWORD'] || null);

container.bind<() => string>(IDENTIFIERS.UUID_GENERATOR).toConstantValue(uuid.v4);

function repository(name: string, constructor: new (...args: any[]) => IRepository) {
    container.bind<IRepository>(IDENTIFIERS.REPOSITORY)
        .to(constructor)
        .inSingletonScope()
        .when((r) => {
            return !r.target.isNamed() || r.target.matchesNamedTag(name);
        });
}

repository(RESOURCE_NAMES.USER, UserRepository);
repository(RESOURCE_NAMES.AUTHOR, AuthorRepository);
repository(RESOURCE_NAMES.KNOWLEDGE, KnowledgeRepository);
repository(RESOURCE_NAMES.PROVIDER, ProviderRepository);
repository(RESOURCE_NAMES.COURSE, CourseRepository);
repository(RESOURCE_NAMES.REGISTRATION, RegistrationRepository);

container.bind<IOrm>(IDENTIFIERS.ORM).to(Neo4jOrm).inSingletonScope();

container.bind<IServer>(IDENTIFIERS.SERVER).to(Server);

export default container;
