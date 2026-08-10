import * as zip from "../../index.js";
import { firstMismatch } from "./diff.js";
import { rewriteZip } from "./rewrite.js";
import { cases } from "./matrix.js";

Deno.test("fidelity coverage", async () => {
	for (const testCase of cases) {
		const source = await testCase.build(zip);
		for (const leg of ["codec", "passthrough"]) {
			const output = await rewriteZip(zip, source, { leg });
			if (firstMismatch(source, output) != -1) {
				throw new Error(`${testCase.name} [${leg}] not identical`);
			}
		}
	}
	const corpusDirectory = new URL("./corpus/", import.meta.url).pathname;
	const manifest = JSON.parse(await Deno.readTextFile(`${corpusDirectory}corpus.json`));
	for (const { file } of manifest) {
		const source = await Deno.readFile(`${corpusDirectory}${file}`);
		for (const leg of ["codec", "passthrough"]) {
			try {
				await rewriteZip(zip, source, { leg });
			} catch (error) {
				if (!error.unreproducible) {
					throw error;
				}
			}
		}
	}
});
