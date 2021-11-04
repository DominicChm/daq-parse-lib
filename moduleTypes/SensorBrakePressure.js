import Module from "../Module.js";


export default class SensorBrakePressure extends Module {
    constructor(config) {
        super(config);
        this.front_min_v = config.front_min_v
        this.rear_min_v = config.rear_min_v
        this.front_psi_per_v = config.front_psi_per_v
        this.rear_psi_per_v = config.rear_psi_per_v
    }

    static getTypeName() {
        return "brakePressure";
    }

    static getDataLength() {
        return 0x04;
    }

    parse(ArrayBuffer) {
        const to_volts = (ain) => 3.3 * ain / 65535;
        const voltages = {
            front: to_volts(new DataView(ArrayBuffer).getUint16(0, true)),
            rear: to_volts(new DataView(ArrayBuffer).getUint16(2, true)),
        };

        return {
            front: (voltages.front - this.front_min_v) * this.front_psi_per_v,
            rear: (voltages.rear - this.rear_min_v) * this.rear_psi_per_v,
        };
    }

}
