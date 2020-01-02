import {controller, interfaces} from "inversify-express-utils";
import {AuthorRepository} from "../repositories/author-repository";
import {inject, named} from "inversify";
import {IDENTIFIERS} from "../constants/identifiers";
import {RESOURCE_NAMES} from "../constants/resources";
import {ResourceController} from "./resource-controller";
import {Author} from "../models/author";

@controller('/authors')
export class AuthorController extends ResourceController<Author> implements interfaces.Controller {


    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.AUTHOR) repository: AuthorRepository
    ) {
        super(repository);
        this.constraints = {
            name: {
                presence: true,
            }
        };
    }
}
