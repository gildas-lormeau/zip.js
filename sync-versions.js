import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const JSON_VERSION_REGEXP = /("version"\s*:\s*")[^"]*(")/;
const LIB_VERSION_REGEXP = /(const VERSION = ")[^"]*(")/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_PATH = path.resolve(__dirname, "package.json");
const DENO_PATH = path.resolve(__dirname, "deno.json");
const LIB_VERSION_PATH = path.resolve(__dirname, "lib", "core", "version.js");

const { version } = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
syncVersion(DENO_PATH, JSON_VERSION_REGEXP);
syncVersion(LIB_VERSION_PATH, LIB_VERSION_REGEXP);

function syncVersion(filePath, versionRegExp) {
	const source = fs.readFileSync(filePath, "utf8");
	if (!versionRegExp.test(source)) {
		throw new Error("no version found in " + path.basename(filePath));
	}
	const syncedSource = source.replace(versionRegExp, "$1" + version + "$2");
	if (syncedSource != source) {
		fs.writeFileSync(filePath, syncedSource);
	}
}
