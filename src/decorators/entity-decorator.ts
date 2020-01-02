import {METADATA} from "../constants/metadata";

export function entity(name?: string): ClassDecorator {
    return target => {
        Reflect.defineMetadata(METADATA.ENTITY, name || target.name, target);
    };
}
