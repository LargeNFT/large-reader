import { CID } from 'multiformats/cid';
import fs from "fs";

let args = process.argv.slice(2);

const v1 = CID.parse(args[0]);

fs.writeFileSync("../ipfs.json", JSON.stringify({ cid: v1.toV0().toString()}));

console.log("Successfully updated ipfs.json")