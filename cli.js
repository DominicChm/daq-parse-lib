import ParseManager from "./ParseManager.js"
import fs from "fs"
import PapaParse from "papaparse"

import meow from 'meow';
import chalk from 'chalk'


const cli = meow(`
    Usage
      $ ./baja_converter <file.bin>

    Options
      --output, -o Set an output csv file (optional, outputs 'out.csv' by default)
      --config, -c Set a config file (optional, uses "./vehicle_config.json" by default)

    Example
      $ ./baja_converter D13.bin -o custom_out.csv -c config.json

`, {
	importMeta: import.meta,
	flags: {
		output: {
			type: 'string',
			alias: 'o',
            default: 'out.csv'
		},
        config: {
            type: 'string',
            alias: 'c',
            default: 'vehicle_config.json'
        }
	}
})

console.log("Processing", chalk.green(cli.input[0]))
console.log("Outputting to", chalk.cyan(cli.flags.output))
console.log("Using as config", chalk.cyan(cli.flags.config))


const vcfg = JSON.parse(fs.readFileSync(cli.flags.config, {encoding: "utf8"}))

const readings = [];
const pm = new ParseManager((data) => {
    readings.push(flattenObject(data));
}, vcfg);

const data = fs.readFileSync(cli.input[0], {encoding: null});
pm.feedArrayBuffer(data);


setTimeout(() => {
    const csv = PapaParse.unparse(readings);
    fs.writeFileSync(cli.flags.output, csv);
    console.log("✔️ Done")
}, 0);

function flattenObject(obj)  {
    const flattened = {}
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flattened, flattenObject(obj[key]))
        } else {
            flattened[key] = obj[key]
        }
    })
    return flattened
}
