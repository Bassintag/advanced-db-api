import {entity} from "../decorators/entity-decorator";
import {Resource} from "./resource";
import {index} from "../decorators/index-decorator";

@entity()
export class Provider extends Resource {

    @index()
    public name?: string;
}
