import {Resource} from './resource';
import {relationship} from '../decorators/relationship-decorator';
import {Course} from './course';
import {User} from './user';

export class Registration extends Resource {

    public date?: number;

    @relationship({
        include: true,
        target: Course,
        name: 'REGISTERED_IN',
    })
    public course?: Course;

    @relationship({
        include: false,
        target: User,
        name: 'REGISTERED',
        remote: true,
    })
    public userId?: string;

}
