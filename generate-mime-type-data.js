import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodeMimeTypes } from "./lib/core/util/mime-type.js";

const VALID_NAME_REGEXP = /^[a-z0-9%+.\-_~]+$/i;
const XML_SUFFIX = "+xml";
const XML_MARKER = "!";
const MAX_SHARED_PREFIX_LENGTH = 35;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIME_TYPES_PATH = path.resolve(__dirname, "mime-types.json");
const MIME_TYPE_DATA_PATH = path.resolve(__dirname, "lib/core/util/mime-type-data.js");

export { generateMimeTypeData };

function generateMimeTypeData() {
	const table = JSON.parse(fs.readFileSync(MIME_TYPES_PATH, "utf8"));
	const expectedMimeTypes = {};
	for (const type of Object.keys(table).sort()) {
		if (!VALID_NAME_REGEXP.test(type)) {
			throw new Error("invalid mime type name: " + type);
		}
		for (const [subtype, value] of Object.entries(table[type])) {
			if (!VALID_NAME_REGEXP.test(subtype)) {
				throw new Error("invalid mime subtype name: " + type + "/" + subtype);
			}
			for (const extension of typeof value == "string" ? [value] : value) {
				if (!VALID_NAME_REGEXP.test(extension)) {
					throw new Error("invalid extension: " + extension + " (" + type + "/" + subtype + ")");
				}
				if (expectedMimeTypes[extension]) {
					throw new Error("duplicate extension: " + extension + " (" + expectedMimeTypes[extension] + " and " + type + "/" + subtype + ")");
				}
				expectedMimeTypes[extension] = type + "/" + subtype;
			}
		}
	}
	const encodedMimeTypes = encodeMimeTypes(table);
	const decodedMimeTypes = decodeMimeTypes(encodedMimeTypes);
	const expectedExtensions = Object.keys(expectedMimeTypes);
	if (Object.keys(decodedMimeTypes).length != expectedExtensions.length) {
		throw new Error("mime type data round-trip failed: extension count mismatch");
	}
	for (const extension of expectedExtensions) {
		if (decodedMimeTypes[extension] !== expectedMimeTypes[extension]) {
			throw new Error("mime type data round-trip failed: " + extension);
		}
	}
	const content = "const encodedMimeTypes = " + JSON.stringify(encodedMimeTypes) + ";\n\nexport { encodedMimeTypes };\n";
	if (fs.readFileSync(MIME_TYPE_DATA_PATH, "utf8") != content) {
		fs.writeFileSync(MIME_TYPE_DATA_PATH, content);
	}
}

function encodeMimeTypes(table) {
	const blocks = [];
	for (const type of Object.keys(table).sort()) {
		const entries = [];
		let previousSubtype = "";
		for (const subtype of Object.keys(table[type]).sort()) {
			const markedSubtype = subtype.replaceAll(XML_SUFFIX, XML_MARKER);
			let sharedLength = 0;
			const maxSharedLength = Math.min(previousSubtype.length, markedSubtype.length, MAX_SHARED_PREFIX_LENGTH);
			while (sharedLength < maxSharedLength && previousSubtype[sharedLength] == markedSubtype[sharedLength]) {
				sharedLength++;
			}
			previousSubtype = markedSubtype;
			const key = sharedLength.toString(36) + markedSubtype.slice(sharedLength);
			const value = table[type][subtype];
			const extensions = typeof value == "string" ? [value] : value;
			if (extensions.length == 1 && extensions[0] == subtype.split("+")[0]) {
				entries.push(key);
			} else {
				entries.push(key + " " + extensions.join(" "));
			}
		}
		blocks.push(type + ":" + entries.join(","));
	}
	return blocks.join(";");
}
