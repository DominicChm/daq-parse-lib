export default class Sensor {
    static getId() {
        throw new Error("NOT IMPLEMENTED");
        return 0;  //Here to trick Webstorm type checking.
    }

    static getDataLength() {
        throw new Error("NOT IMPLEMENTED");
        return 0;  //Here to trick Webstorm type checking.
    }

    static parse(ArrayBuffer) {
        throw new Error("NOT IMPLEMENTED");
        return {} //Here to trick Webstorm type checking.
    }
}
