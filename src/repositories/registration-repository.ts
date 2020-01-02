import {Repository} from './repository';
import {injectable} from 'inversify';
import {Registration} from '../models/registration';

@injectable()
export class RegistrationRepository extends Repository<Registration> {

    constructor() {
        super(Registration);
    }
}
