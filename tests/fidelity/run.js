import * as zip from "../../index.js";
import { parseZip } from "./parse.js";
import { diffZip, formatDiffs, firstMismatch } from "./diff.js";
import { rewriteZip } from "./rewrite.js";
import { cases } from "./matrix.js";

const LEGS = ["codec", "passthrough"];
const MAX_REPORTED_DIFFS = 12;

let failedCount = 0;
let identicalCount = 0;
for (const testCase of cases) {
	const source = await testCase.build(zip);
	for (const leg of testCase.legs || LEGS) {
		let status;
		let detail = "";
		try {
			const output = await rewriteZip(zip, source, { leg });
			const mismatchOffset = firstMismatch(source, output);
			if (mismatchOffset == -1) {
				status = "identical";
				identicalCount++;
			} else {
				status = "DIFFERENT";
				failedCount++;
				const diffs = diffZip(parseZip(source), parseZip(output));
				detail = `\n  first byte mismatch at ${mismatchOffset} (${source.length} -> ${output.length} bytes)\n` +
					formatDiffs(diffs.slice(0, MAX_REPORTED_DIFFS)) +
					(diffs.length > MAX_REPORTED_DIFFS ? `\n  … ${diffs.length - MAX_REPORTED_DIFFS} more diffs` : "");
			}
		} catch (error) {
			failedCount++;
			if (error.unreproducible) {
				status = "UNREPRODUCIBLE";
				detail = `\n  ${error.message}`;
			} else {
				status = "ERROR";
				detail = `\n  ${error.stack}`;
			}
		}
		console.log(`${status.padEnd(15)} ${testCase.name} [${leg}]${detail}`);
	}
}
console.log(`\n${identicalCount} identical, ${failedCount} failed`);
if (failedCount) {
	Deno.exit(1);
}
