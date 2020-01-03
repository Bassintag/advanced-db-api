import container from './container';
import {IDENTIFIERS} from './constants/identifiers';
import {IServer} from './server';
import {InversifyExpressServer} from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import './controllers/user-controller';
import './controllers/author-controller';
import './controllers/knowledge-controller';
import './controllers/provider-controller';
import './controllers/course-controller';
import './controllers/registration-controller';

setTimeout(() => {

    container.get<IServer>(IDENTIFIERS.SERVER).start();

    const server = new InversifyExpressServer(container);

    server.setConfig((a) => {
        a.use(bodyParser.json());
        a.use(cors());
    }).setErrorConfig((a) => {
        // @ts-ignore
        a.use((err, req, res, next) => {
            console.log(err.stack);
            res.status(500).json({
                error: err.message,
            });
        });
    });

    const app = server.build();

    app.listen(Number.parseInt(process.env['PORT'] || '3000', 10));
}, 10000);
