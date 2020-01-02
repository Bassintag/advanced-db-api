import {controller, interfaces} from 'inversify-express-utils';
import {inject, named} from 'inversify';
import {IDENTIFIERS} from '../constants/identifiers';
import {RESOURCE_NAMES} from '../constants/resources';
import {ResourceController} from './resource-controller';
import {Example} from '../repositories/mapper/query-helper';
import * as e from 'express';
import {User} from '../models/user';
import {RegistrationRepository} from '../repositories/registration-repository';
import {Registration} from '../models/registration';

@controller('/registrations', IDENTIFIERS.AUTH_MIDDLEWARE)
export class RegistrationController extends ResourceController<Registration> implements interfaces.Controller {


    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.REGISTRATION) repository: RegistrationRepository
    ) {
        super(repository);
        this.constraints = {
            course: {
                presence: true,
            }
        };
        this.filters = ['userId'];
    }

    protected async mapToResource(body: any, request: e.Request): Promise<Registration> {
        const resource = await super.mapToResource(body, request);
        // @ts-ignore
        resource.userId = (request.user as User).id;
        resource.date = new Date().getTime();
        return resource;
    }
}
