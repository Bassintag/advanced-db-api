import {Repository} from "./repository";
import {injectable} from "inversify";
import {Knowledge} from "../models/knowledge";

@injectable()
export class KnowledgeRepository extends Repository<Knowledge> {

    constructor() {
        super(Knowledge, (p) => ({name: p.name}));
    }
}
