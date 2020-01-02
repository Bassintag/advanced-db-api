export class Resource {

    public id?: string;

    constructor(options: object = {}) {
        Object.assign(this, options);
    }
}
