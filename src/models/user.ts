import {entity} from '../decorators/entity-decorator';
import {Resource} from './resource';
import {index} from '../decorators/index-decorator';

@entity()
export class User extends Resource {

    @index()
    public username?: string;

    public password?: string;
}
