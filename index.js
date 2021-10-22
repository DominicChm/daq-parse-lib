import ParseManager from "./ParseManager.js"
import fs from "fs"
import PapaParse from "papaparse"

const readings = [];
const pm = new ParseManager((data) => {
    readings.push(data);
});

const data = fs.readFileSync("./D5.bin", {encoding: null});
pm.feedArrayBuffer(data);


setTimeout(() => {
    const csv = PapaParse.unparse(readings);
    fs.writeFileSync("out.csv", csv);
}, 0);