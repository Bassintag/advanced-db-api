import {Resource} from './resource';
import {relationship} from '../decorators/relationship-decorator';
import {Provider} from './provider';
import {entity} from '../decorators/entity-decorator';
import {Author} from './author';
import {Knowledge} from './knowledge';

@entity()
export class Course extends Resource {

    public title?: string;

    public description?: string;

    public link?: string;

    public imageLink?: string;

    @relationship({
        target: Provider,
        name: 'PROVIDED_BY',
        include: true,
    })
    public provider?: Provider;

    @relationship({
        target: Author,
        name: 'AUTHORED_BY',
        include: true,
        many: true,
    })
    public authors?: Author[];

    @relationship({
        target: Knowledge,
        name: 'TEACHES',
        include: true,
        many: true,
    })
    public knowledges?: Knowledge[];

    constructor(options?: object) {
        super(options);
    }
}
