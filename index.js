import ParseManager from "./ParseManager.js"
import fs from "fs"
import PapaParse from "papaparse"

// const vcfg = JSON.parse(fs.readFileSync("./vehicle_config.json", {encoding: "utf8"}))
//
// const readings = [];
// const pm = new ParseManager((data) => {
//     readings.push(flattenObject(data));
// }, vcfg);
//
// const data = fs.readFileSync("./D12.bin", {encoding: null});
// pm.feedArrayBuffer(data);
//
//
// setTimeout(() => {
//     const csv = PapaParse.unparse(readings);
//     fs.writeFileSync("out.csv", csv);
// }, 0);
//
// function flattenObject(obj)  {
//     const flattened = {}
//
//     Object.keys(obj).forEach((key) => {
//         if (typeof obj[key] === 'object' && obj[key] !== null) {
//             Object.assign(flattened, flattenObject(obj[key]))
//         } else {
//             flattened[key] = obj[key]
//         }
//     })
//
//     return flattened
// }

export default ParseManager;