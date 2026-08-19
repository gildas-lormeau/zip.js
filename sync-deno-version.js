import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VERSION_REGEXP = /("version"\s*:\s*")[^"]*(")/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_PATH = path.resolve(__dirname, "package.json");
const DENO_PATH = path.resolve(__dirname, "deno.json");

syncDenoVersion();

function syncDenoVersion() {
	const { version } = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
	const denoSource = fs.readFileSync(DENO_PATH, "utf8");
	if (!VERSION_REGEXP.test(denoSource)) {
		throw new Error("no version found in deno.json");
	}
	const syncedDenoSource = denoSource.replace(VERSION_REGEXP, "$1" + version + "$2");
	if (syncedDenoSource != denoSource) {
		fs.writeFileSync(DENO_PATH, syncedDenoSource);
	}
}
