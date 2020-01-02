import {Repository} from "./repository";
import {injectable} from "inversify";
import {Course} from "../models/course";

@injectable()
export class CourseRepository extends Repository<Course> {

    constructor() {
        super(Course);
    }
}
