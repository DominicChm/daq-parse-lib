export default class Module {
    constructor(moduleConfig) {
        this.id = moduleConfig.id;
        this.name = moduleConfig.name;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    static getTypeName() {
        throw new Error("NOT IMPLEMENTED");
        return 0;  //Here to trick Webstorm type checking.
    }

    static getDataLength() {
        throw new Error("NOT IMPLEMENTED");
        return 0;  //Here to trick Webstorm type checking.
    }

    parse(ArrayBuffer) {
        throw new Error("NOT IMPLEMENTED");
        return {} //Here to trick Webstorm type checking.
    }
}
