import Sensor from "./Sensor.js";

export default class SensorMarker extends Sensor {
    static getId() {
        return 0x03;
    }

    static getDataLength() {
        return 0x01;
    }

    static parse(ArrayBuffer) {
        return {
            marker: new DataView(ArrayBuffer).getUint8(0)
        };
    }

}
