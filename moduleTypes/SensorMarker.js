import Module from "../Module.js";

export default class SensorMarker extends Module {
    static getTypeName() {
        return "marker";
    }

    static getDataLength() {
        return 0x01;
    }

    parse(ArrayBuffer) {
        return new DataView(ArrayBuffer).getUint8(0);
    }

}
