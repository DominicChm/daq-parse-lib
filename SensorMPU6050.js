import Sensor from "./Sensor.js";

export default class SensorMPU6050 extends Sensor {
    static getId() {
        return 0x06;
    }

    static getDataLength() {
        return 2 * 6 + 4 * 4;
    }

    static parse(ArrayBuffer) {
        let o = 0;
        const i16 = () => new DataView(ArrayBuffer).getInt16((o += 2) - 2, true);
        const f32 = () => new DataView(ArrayBuffer).getFloat32((o += 4) - 4, true);

        //The order of all these extractions is important - changes will give fked up results.
        const rawAccel = {x: i16(), y: i16(), z: i16()};
        const rawGyro = {x: i16(), y: i16(), z: i16()};
        const quaternion = {x: f32(), y: f32(), z: f32(), w: f32()};

        const gravity = calcGravity(quaternion);
        const linearAccel = calcLinearAcceleration(rawAccel, gravity)
        const ypr = calcYawPitchRoll(quaternion, gravity);

        return {
            rawAccelX: rawAccel.x,
            rawAccelY: rawAccel.y,
            rawAccelZ: rawAccel.z,
            rawGyroX: rawGyro.x,
            rawGyroY: rawGyro.y,
            rawGyroZ: rawGyro.z,
            quaternionX: quaternion.x,
            quaternionY: quaternion.y,
            quaternionZ: quaternion.z,
            quaternionW: quaternion.w,
            linearAccelX: linearAccel.x,
            linearAccelY: linearAccel.y,
            linearAccelZ: linearAccel.z,
            yaw: ypr.yaw,
            pitch: ypr.pitch,
            roll: ypr.roll,
            gravityX: gravity.x,
            gravityY: gravity.y,
            gravityZ: gravity.z,
        }
    }

}


function calcReadAcceleration(rawAccel, quaternion) {

}

function calcYawPitchRoll(quaternion, gravity) {
    let ypr = {yaw: 0, pitch: 0, roll: 0};
    const q = quaternion;
    const g = gravity;

    // yaw: (about Z axis)
    ypr.yaw = Math.atan2(2 * q.x * q.y - 2 * q.w * q.z, 2 * q.w * q.w + 2 * q.x * q.x - 1);
    // pitch: (nose up/down, about Y axis)
    ypr.pitch = Math.atan2(g.x, Math.sqrt(g.y * g.y + g.z * g.z));
    // roll: (tilt left/right, about X axis)
    ypr.roll = Math.atan2(g.y, g.z);
    if (g.z < 0) {
        if (ypr.pitch > 0) {
            ypr.pitch = Math.PI - ypr.pitch;
        } else {
            ypr.pitch = -Math.PI - ypr.pitch;
        }
    }

    return ypr;
}


/*
uint8_t MPU6050::dmpGetGravity(VectorFloat *v, Quaternion *q) {
    v -> x = 2 * (q -> x*q -> z - q -> w*q -> y);
    v -> y = 2 * (q -> w*q -> x + q -> y*q -> z);
    v -> z = q -> w*q -> w - q -> x*q -> x - q -> y*q -> y + q -> z*q -> z;
    return 0;
}
 */
function calcGravity(quaternion) {
    const q = quaternion;
    return {
        x: 2 * (q.x * q.z - q.w * q.y),
        y: 2 * (q.w * q.x + q.y * q.z),
        z: q.w ** 2 - q.x ** 2 - q.y ** 2 + q.z ** 2
    }
}

/*
uint8_t MPU6050::dmpGetLinearAccel(VectorInt16 *v, VectorInt16 *vRaw, VectorFloat *gravity) {
    // get rid of the gravity component (+1g = +8192 in standard DMP FIFO packet, sensitivity is 2g)
    v -> x = vRaw -> x - gravity -> x*8192;
    v -> y = vRaw -> y - gravity -> y*8192;
    v -> z = vRaw -> z - gravity -> z*8192;
    return 0;
}
*/
function calcLinearAcceleration(rawAccel, gravity) {
    // get rid of the gravity component (+1g = +8192 in standard DMP FIFO packet, sensitivity is 2g)
    return {
        x: rawAccel.x - gravity.x * 8192,
        y: rawAccel.y - gravity.y * 8192,
        z: rawAccel.z - gravity.z * 8192,
    }
}

/*
// uint8_t MPU6050::dmpGetLinearAccelInWorld(long *data, const uint8_t* packet);
uint8_t MPU6050::dmpGetLinearAccelInWorld(VectorInt16 *v, VectorInt16 *vReal, Quaternion *q) {
    // rotate measured 3D acceleration vector into original state
    // frame of reference based on orientation quaternion
    memcpy(v, vReal, sizeof(VectorInt16));
    v -> rotate(q);
    return 0;
}
 */
function getLinearAccelerationInWorld(linearAcceleration, quaternion) {
    const worldAccel = {...linearAcceleration};
}