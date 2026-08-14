/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, {
		encodeText: value => { return new Uint8Array(value.split("").reverse().map(char => char.charCodeAt(0))); }
	});
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	let zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	let entries = await zipReader.getEntries();
	await zipReader.close();
	let firstEntry = entries[0];
	if (firstEntry.filename !== FILENAME.split("").reverse().join("")) {
		throw new Error();
	}
	zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()), {
		decodeText: value => { return String.fromCharCode.apply(null, new Uint8Array(value).reverse()); }
	});
	entries = await zipReader.getEntries();
	await zipReader.close();
	firstEntry = entries[0];
	if (firstEntry.filename !== FILENAME) {
		throw new Error();
	}
	await textTypeIsProvided();
	await zip.terminateWorkers();
}

// The hooks encode/decode both the filename and the comment of an entry, so they are given the type of
// the text they are handling to tell them apart. The hooks above ignore that argument, which is how a
// hook written before the argument existed keeps working.
async function textTypeIsProvided() {
	const encodedTypes = [];
	const decodedTypes = [];
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), {
		encodeText: (text, type) => {
			encodedTypes.push(type + ":" + text);
			return undefined;
		}
	});
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { comment: "note" });
	const data = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), {
		decodeText: (value, encoding, type) => {
			decodedTypes.push(type);
			return undefined;
		}
	});
	const [entry] = await zipReader.getEntries();
	await zipReader.close();
	if (encodedTypes.join(",") != "filename:" + FILENAME + ",comment:note") {
		throw new Error("unexpected encoded text types: " + encodedTypes.join(","));
	}
	if (decodedTypes.join(",") != "filename,comment") {
		throw new Error("unexpected decoded text types: " + decodedTypes.join(","));
	}
	if (entry.filename != FILENAME || entry.comment != "note") {
		throw new Error("returning undefined must fall back to the built-in encoding");
	}
}