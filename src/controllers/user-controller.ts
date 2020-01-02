import {controller, httpGet, interfaces, request} from 'inversify-express-utils';
import {ResourceController} from './resource-controller';
import {inject, named} from 'inversify';
import {IDENTIFIERS} from '../constants/identifiers';
import {RESOURCE_NAMES} from '../constants/resources';
import {UserRepository} from '../repositories/user-repository';
import {User} from '../models/user';
import * as bcrypt from 'bcrypt';
import * as e from 'express';

@controller('/users')
export class UserController extends ResourceController<User> implements interfaces.Controller {

    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.USER) private readonly userRepository: UserRepository
    ) {
        super(userRepository);
        this.constraints = {
            username: {
                presence: true,
            },
            password: {
                presence: true,
            }
        };
    }

    @httpGet('/me/details', IDENTIFIERS.AUTH_MIDDLEWARE)
    private async readMe(
        @request() req: e.Request,
    ): Promise<User> {
        // @ts-ignore
        return this.mapToDto(req.user);
    }

    protected async mapToResource(body: any): Promise<User> {
        const existing = await this.userRepository.findByUsername(body.username);
        if (existing) {
            throw new Error('User exists already');
        }
        return new User({
            username: body.username,
            password: await bcrypt.hash(body.password, 3),
        });
    }


    protected mapToDto(body: User): any {
        delete body.password;
        return super.mapToDto(body);
    }
}
