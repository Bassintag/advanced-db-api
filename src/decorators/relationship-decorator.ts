import {METADATA} from "../constants/metadata";
import {Resource} from "../models/resource";
import {Class} from "../types";

export interface IRelationshipOptions {

    target: Class<Resource>;

    name: string;

    include?: boolean;

    remote?: boolean;

    many?: boolean;
}

export interface IRelationshipMetadata extends IRelationshipOptions {

    property: string;

}

export function relationship(options: IRelationshipOptions): PropertyDecorator {
    return (target, key) => {
        const r = Reflect.getMetadata(METADATA.RELATIONSHIP, target.constructor) as IRelationshipMetadata[] || [];
        console.log(r);
        r.push({
            ...options,
            property: key.toString(),
        });
        Reflect.defineMetadata(METADATA.RELATIONSHIP, r, target.constructor);
    };
}
