import {Repository} from './repository';
import {User} from '../models/user';
import {injectable} from 'inversify';

@injectable()
export class UserRepository extends Repository<User> {

    constructor() {
        super(User);
    }

    async findByUsername(username: string): Promise<User | null> {
        const results = await this.orm.connection.matchNode('e', this.label, {username})
            .return('e')
            .run();
        const mapped = await this.mapResults(results);
        return mapped[0] || null;
    }
}
