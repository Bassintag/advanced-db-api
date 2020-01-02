import {controller, interfaces} from "inversify-express-utils";
import {inject, named} from "inversify";
import {IDENTIFIERS} from "../constants/identifiers";
import {RESOURCE_NAMES} from "../constants/resources";
import {ResourceController} from "./resource-controller";
import {Provider} from "../models/provider";
import {ProviderRepository} from "../repositories/provider-repository";

@controller('/providers')
export class ProviderController extends ResourceController<Provider> implements interfaces.Controller {


    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.PROVIDER) repository: ProviderRepository
    ) {
        super(repository);
        this.constraints = {
            name: {
                presence: true,
            }
        };
    }
}
