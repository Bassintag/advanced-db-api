import {controller, interfaces} from "inversify-express-utils";
import {inject, named} from "inversify";
import {IDENTIFIERS} from "../constants/identifiers";
import {RESOURCE_NAMES} from "../constants/resources";
import {ResourceController} from "./resource-controller";
import {Knowledge} from "../models/knowledge";
import {KnowledgeRepository} from "../repositories/knowledge-repository";

@controller('/knowledges')
export class KnowledgeController extends ResourceController<Knowledge> implements interfaces.Controller {


    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.KNOWLEDGE) repository: KnowledgeRepository
    ) {
        super(repository);
        this.constraints = {
            name: {
                presence: true,
            }
        };
    }
}
