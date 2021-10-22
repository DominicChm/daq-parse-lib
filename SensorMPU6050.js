import Sensor from "./Sensor.js";

export default class SensorMPU6050 extends Sensor {
    static getId() {
        return 0x06;
    }

    static getDataLength() {
        return 2 * 9 + 4 * 10;
    }

    static parse(ArrayBuffer) {
        let o = 0;
        const i16 = () => new DataView(ArrayBuffer).getInt16((o += 2) - 2, true);
        const f32 = () => new DataView(ArrayBuffer).getFloat32((o += 4) - 4, true);

        return {
            rawAccelX: i16(),
            rawAccelY: i16(),
            rawAccelZ: i16(),
            quaternionX: f32(),
            quaternionY: f32(),
            quaternionZ: f32(),
            quaternionW: f32(),
        };
    }

}
