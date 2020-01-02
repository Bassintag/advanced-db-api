import {Repository} from "./repository";
import {injectable} from "inversify";
import {Provider} from "../models/provider";

@injectable()
export class ProviderRepository extends Repository<Provider> {

    constructor() {
        super(Provider, (p) => ({name: p.name}));
    }
}
