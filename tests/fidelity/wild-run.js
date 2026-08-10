import * as zip from "../../index.js";
import { parseZip } from "./parse.js";
import { diffZip, formatDiffs, firstMismatch } from "./diff.js";
import { rewriteZip } from "./rewrite.js";

const wildDirectory = new URL("./corpus/wild/", import.meta.url).pathname;
const MAX_REPORTED_DIFFS = 8;

const manifest = JSON.parse(await Deno.readTextFile(`${wildDirectory}manifest.json`));
const statusCounts = new Map();
const reasonCounts = new Map();
for (const { file, source } of manifest) {
	const data = await Deno.readFile(wildDirectory + file).catch(() => null);
	if (!data) {
		continue;
	}
	let status;
	let detail = "";
	try {
		const output = await rewriteZip(zip, data, { leg: "passthrough" });
		const mismatchOffset = firstMismatch(data, output);
		if (mismatchOffset == -1) {
			status = "identical";
		} else {
			status = "DIFFERENT";
			const diffs = diffZip(parseZip(data), parseZip(output));
			detail = `\n${formatDiffs(diffs.slice(0, MAX_REPORTED_DIFFS))}`;
		}
	} catch (error) {
		if (error.unreproducible) {
			status = "unreproducible";
			const reasons = [...new Set(error.message.split("; ").map(reason => reason.replace(/^entry \d+: /, "")))];
			detail = `\n  ${reasons.join("\n  ")}`;
			for (const reason of reasons) {
				reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
			}
		} else {
			status = "ERROR";
			detail = `\n  ${error.message}`;
			reasonCounts.set(`error: ${error.message}`, (reasonCounts.get(`error: ${error.message}`) || 0) + 1);
		}
	}
	statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
	console.log(`${status.padEnd(15)} ${file} [${source}]${detail}`);
}
console.log(`\nstatus: ${[...statusCounts.entries()].map(([status, count]) => `${status}=${count}`).join(", ")}`);
console.log("\nreason histogram (files):");
for (const [reason, count] of [...reasonCounts.entries()].sort((entryA, entryB) => entryB[1] - entryA[1])) {
	console.log(`  ${String(count).padStart(4)}  ${reason}`);
}
