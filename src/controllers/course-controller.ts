import {controller, interfaces} from "inversify-express-utils";
import {inject, named} from "inversify";
import {IDENTIFIERS} from "../constants/identifiers";
import {RESOURCE_NAMES} from "../constants/resources";
import {ResourceController} from "./resource-controller";
import {Course} from "../models/course";
import {CourseRepository} from "../repositories/course-repository";

@controller('/courses')
export class CourseController extends ResourceController<Course> implements interfaces.Controller {

    constructor(
        @inject(IDENTIFIERS.REPOSITORY) @named(RESOURCE_NAMES.COURSE) repository: CourseRepository
    ) {
        super(repository);
        this.constraints = {
            title: {
                presence: true,
            },
            description: {
                presence: true,
            },
            link: {
                presence: true,
            },
            imageLink: {
                presence: true,
            },
            authors: {},
            provider: {},
            knowledges: {},
        };
        this.filters = ['authors', 'knowledges'];
    }
}
