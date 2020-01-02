import {BaseMiddleware} from 'inversify-express-utils';
import * as e from 'express';
import {inject, injectable, named} from 'inversify';
import {UserRepository} from '../repositories/user-repository';
import {IDENTIFIERS} from '../constants/identifiers';
import {RESOURCE_NAMES} from '../constants/resources';
import * as bcrypt from 'bcrypt';

@injectable()
export class AuthMiddleware extends BaseMiddleware {

    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.USER)
        private readonly userRepository: UserRepository,
    ) {
        super();
    }

    public async handler(
        req: e.Request,
        res: e.Response,
        next: e.NextFunction
    ): Promise<void> {
        const header = req.headers.authorization;
        if (header == null || !header.startsWith('Basic ')) {
            res.status(403).json({
                error: 'Invalid Authorization header',
            });
            return;
        }
        const b64 = header.substring(6);
        const decoded = Buffer.from(b64, 'base64').toString();
        const [username, password] = decoded.split(':');
        if (!username || !password) {
            res.status(403).json({
                error: 'Missing username/password',
            });
            return;
        }
        const existing = await this.userRepository.findByUsername(username);
        console.log(existing);
        if (!existing || !await bcrypt.compare(password, existing.password!)) {
            res.status(403).json({
                error: 'Invalid username/password',
            });
            return;
        }
        // @ts-ignore
        req.user = existing;
        next();
    }

}
