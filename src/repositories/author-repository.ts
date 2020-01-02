import {Repository} from "./repository";
import {injectable} from "inversify";
import {Author} from "../models/author";

@injectable()
export class AuthorRepository extends Repository<Author> {

    constructor() {
        super(Author, (p) => ({name: p.name}));
    }
}
