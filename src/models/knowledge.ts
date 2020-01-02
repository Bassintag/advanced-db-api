import {entity} from "../decorators/entity-decorator";
import {Resource} from "./resource";
import {index} from "../decorators/index-decorator";

@entity()
export class Knowledge extends Resource {

    @index()
    public name?: string;
}
