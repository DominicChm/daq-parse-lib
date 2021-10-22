import SensorTime from "./SensorTime.js"
import CalcChecksum from "./parseChecksum.js";
import SensorBrakePressure from "./SensorBrakePressure.js";
import SensorMarker from "./SensorMarker.js"
import SensorMPU6050 from "./SensorMPU6050.js";

const STATE_SEARCH_MAGIC_1 = 0;
const STATE_SEARCH_MAGIC_2 = 1;
const STATE_PARSE_LENGTH = 2;
const STATE_PARSE_SUBPACKET_TYPE = 3;
const STATE_PARSE_SUBPACKET = 4;
const STATE_PARSE_CRC = 5;

const MAGIC_1 = 0x42;
const MAGIC_2 = 0x0F;

//0x42, 0x0F, LEN, LEN ...... CHECK, CHECK;
export default class ParseManager {
    static SENSOR_TYPES = [SensorTime, SensorBrakePressure, SensorMarker, SensorMPU6050];

    constructor(onParse) {
        this.onParse = onParse;
        this.littleEndian = true;
        this.packet = [];
        this.packetDataBuf = [];
        this.subpacket = [];
        this.crc = [];
        this.subpacketType = 0;
        this.len = 0;
        this.parsedDataLen = 0;
        this.state = STATE_SEARCH_MAGIC_1;

        this.packetData = {};

        this.idSensorMap = {};
        for (const sensor of ParseManager.SENSOR_TYPES) {
            this.idSensorMap[sensor.getId()] = sensor;
        }
    }

    feedByte(b) {
        switch (this.state) {
            case STATE_SEARCH_MAGIC_1:
                if (b === MAGIC_1) this.state = STATE_SEARCH_MAGIC_2;
                else console.log("MAGIC BYTE DESYNC - CORRUPT OR MISSING BYTES?")
                break;

            case STATE_SEARCH_MAGIC_2:
                if (b !== MAGIC_2) {
                    this.state = STATE_SEARCH_MAGIC_1;
                    break;
                }
                //Got magic byte 2, start parsing this packet.
                this.state = STATE_PARSE_LENGTH;
                this.packet = [];
                this.crc = [];
                this.subpacket = [];
                break;

            case STATE_PARSE_LENGTH:
                this.packet.push(b);
                if (this.packet.length < 2) break;

                //Have both length bytes - parse them.
                this.len = new DataView(new Uint8Array(this.packet).buffer).getUint16(0, this.littleEndian);
                this.packetDataBuf = [];
                this.packetData = {};

                if (this.len > 512)
                    this.state = STATE_SEARCH_MAGIC_1;
                else
                    this.state = STATE_PARSE_SUBPACKET_TYPE;
                break;

            case STATE_PARSE_SUBPACKET_TYPE:
                this.subpacketType = b;
                this.packetDataBuf.push(b);

                if (!this.idSensorMap[b]) {
                    this.state = STATE_SEARCH_MAGIC_1;
                    console.log(`UNRECOGNIZED ID ${b}`);
                } else
                    this.state = STATE_PARSE_SUBPACKET;

                this.subpacketType = this.idSensorMap[b];
                this.subpacket = [];
                break;

            case
            STATE_PARSE_SUBPACKET:
                this.subpacket.push(b);
                this.packetDataBuf.push(b);

                if (this.subpacket.length < this.subpacketType.getDataLength()) break;

                //Have full sub packet
                let subPacketData = this.subpacketType.parse(new Uint8Array(this.subpacket).buffer);

                this.packetData = {...this.packetData, ...subPacketData};

                if (this.packetDataBuf.length >= this.len)
                    this.state = STATE_PARSE_CRC;
                else
                    this.state = STATE_PARSE_SUBPACKET_TYPE;
                break;

            case STATE_PARSE_CRC:
                //TODO: REJECT IF CHECKSUM IS BAD
                const checksum = CalcChecksum(new Uint8Array(this.packetDataBuf).buffer);
                //console.log("chksum", checksum, b);
                this.onParse(this.packetData);
                this.state = STATE_SEARCH_MAGIC_1;
        }

    }

    feedArrayBuffer(buffer) {
        for (const b of buffer)
            this.feedByte(b);

    }
}


/* For testing in online cpp compiler

#include <iostream>

using namespace std;

uint8_t CalcChecksum(uint8_t *buffer, uint16_t len) {
    uint8_t c = 0;
    uint8_t table[] = {0, 94, 188, 226, 97, 63, 221, 131, 194, 156, 126, 32, 163, 253, 31, 65, 157, 195, 33, 127, 252,
        162, 64, 30, 95, 1, 227, 189, 62, 96, 130, 220, 35, 125, 159, 193, 66, 28, 254, 160, 225, 191,
        93, 3, 128, 222, 60, 98, 190, 224, 2, 92, 223, 129, 99, 61, 124, 34, 192, 158, 29, 67, 161, 255,
        70, 24, 250, 164, 39, 121, 155, 197, 132, 218, 56, 102, 229, 187, 89, 7, 219, 133, 103, 57, 186,
        228, 6, 88, 25, 71, 165, 251, 120, 38, 196, 154, 101, 59, 217, 135, 4, 90, 184, 230, 167, 249,
        27, 69, 198, 152, 122, 36, 248, 166, 68, 26, 153, 199, 37, 123, 58, 100, 134, 216, 91, 5, 231,
        185, 140, 210, 48, 110, 237, 179, 81, 15, 78, 16, 242, 172, 47, 113, 147, 205, 17, 79, 173, 243,
        112, 46, 204, 146, 211, 141, 111, 49, 178, 236, 14, 80, 175, 241, 19, 77, 206, 144, 114, 44, 109,
        51, 209, 143, 12, 82, 176, 238, 50, 108, 142, 208, 83, 13, 239, 177, 240, 174, 76, 18, 145, 207,
        45, 115, 202, 148, 118, 40, 171, 245, 23, 73, 8, 86, 180, 234, 105, 55, 213, 139, 87, 9, 235,
        181, 54, 104, 138, 212, 149, 203, 41, 119, 244, 170, 72, 22, 233, 183, 85, 11, 136, 214, 52, 106,
        43, 117, 151, 201, 74, 20, 246, 168, 116, 42, 200, 150, 21, 75, 169, 247, 182, 232, 10, 84, 215,
        137, 107, 53};

    for (int i = 0; i < len; i++) {
        c = table[(c ^ buffer[i]) % 256];
    }
    return c;
}

uint8_t buf[] = {0x01, 0x01, 0x06, 0x00, 0x00, 0x04, 0x00, 0x7c, 0x00, 0xb0};

int main()
{
    printf("%d", CalcChecksum(buf, 10));

    return 0;
}

 */