import Module from "../Module.js";

export default class SensorBrakePressure extends Module {
    static getTypeName() {
        return "brakePressure";
    }

    static getDataLength() {
        return 0x04;
    }

    static parse(ArrayBuffer) {
        return {
            front: new DataView(ArrayBuffer).getUint16(0, true),
            rear: new DataView(ArrayBuffer).getUint16(2, true),
        };
    }

}
