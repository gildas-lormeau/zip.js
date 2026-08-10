import * as zip from "../../index.js";
import { parseZip } from "./parse.js";
import { diffZip, formatDiffs, firstMismatch } from "./diff.js";
import { rewriteZip } from "./rewrite.js";

const corpusDirectory = new URL("./corpus/", import.meta.url).pathname;
const LEGS = ["codec", "passthrough"];
const MAX_REPORTED_DIFFS = 10;

const manifest = JSON.parse(await Deno.readTextFile(`${corpusDirectory}corpus.json`));
const summary = new Map();
for (const { file } of manifest) {
	const source = await Deno.readFile(`${corpusDirectory}${file}`);
	for (const leg of LEGS) {
		let status;
		let detail = "";
		try {
			const output = await rewriteZip(zip, source, { leg });
			const mismatchOffset = firstMismatch(source, output);
			if (mismatchOffset == -1) {
				status = "identical";
			} else {
				status = "different";
				const diffs = diffZip(parseZip(source), parseZip(output));
				detail = `\n${formatDiffs(diffs.slice(0, MAX_REPORTED_DIFFS))}` +
					(diffs.length > MAX_REPORTED_DIFFS ? `\n  … ${diffs.length - MAX_REPORTED_DIFFS} more diffs` : "");
			}
		} catch (error) {
			if (error.unreproducible) {
				status = "unreproducible";
				detail = `\n  ${error.message}`;
			} else {
				status = "error";
				detail = `\n  ${error.stack.split("\n").slice(0, 3).join("\n")}`;
			}
		}
		summary.set(status, (summary.get(status) || 0) + 1);
		console.log(`${status.padEnd(15)} ${file} [${leg}]${detail}`);
	}
}
console.log("\nsummary: " + [...summary.entries()].map(([status, count]) => `${status}=${count}`).join(", "));
