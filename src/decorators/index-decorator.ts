import {METADATA} from "../constants/metadata";

export function index(): PropertyDecorator {
    return (target, key) => {
        const indices: (string | symbol)[] = Reflect.getMetadata(METADATA.INDEX, target) as string[] || [];
        indices.push(key);
        Reflect.defineMetadata(METADATA.INDEX, indices, target.constructor);
    };
}
