import Module from "../Module.js";

export default class SensorTime extends Module {
    static getTypeName() {
        return "time";
    }

    static getDataLength() {
        return 0x04;
    }

    parse(ArrayBuffer) {
        return new DataView(ArrayBuffer).getUint32(0, true)
    }
}
