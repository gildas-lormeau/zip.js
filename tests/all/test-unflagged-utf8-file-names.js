/* global Blob, atob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "hello\n";
const FILENAME = "é-日本.txt";
const COMMENT = "café";
// "é.txt" encoded in CP437, then in UTF-8
const CP437_FILENAME = new Uint8Array([0x82, 0x2e, 0x74, 0x78, 0x74]);
const UTF8_FILENAME = new Uint8Array([0xc3, 0xa9, 0x2e, 0x74, 0x78, 0x74]);
// written with `ditto -c -k` on macOS 26: UTF-8 names, general purpose bit 11 clear, made by Unix
const DITTO_ZIP = "UEsDBBQACAAIAO16LF0AAAAAAAAAAAAAAAANABAAw6kt5pel5pysLnR4dFVYDABOUqVqTlKlavUBAADLSM3JyecCAFBLBwggMDo2CAAAAAYAAABQSwMEFAAIAAgA7XosXQAAAAAAAAAAAAAAAAkAEABwbGFpbi50eHRVWAwATlKlak5SpWr1AQAAy0jNycnnAgBQSwcIIDA6NggAAAAGAAAAUEsBAhUDFAAIAAgA7XosXSAwOjYIAAAABgAAAA0ADAAAAAAAAAAAQKSBAAAAAMOpLeaXpeacrC50eHRVWAgATlKlak5SpWpQSwECFQMUAAgACADteixdIDA6NggAAAAGAAAACQAMAAAAAAAAAABApIFTAAAAcGxhaW4udHh0VVgIAE5SpWpOUqVqUEsFBgAAAAACAAIAigAAAKIAAAAAAA==";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });

	// zip.js itself writes UTF-8 with the bit clear when useUnicodeFileNames is false
	let [entry] = await readEntries(await writeZip({ useUnicodeFileNames: false }, FILENAME, { comment: COMMENT }));
	assertEntry(entry, { filename: FILENAME, comment: COMMENT, filenameUTF8: true, commentUTF8: true, languageEncodingFlag: false });

	// a name that is not valid UTF-8 is still decoded as CP437
	[entry] = await readEntries(await writeZip({ useUnicodeFileNames: false, encodeText: encodeFilenameAs(CP437_FILENAME) }, "é.txt"));
	assertEntry(entry, { filename: "é.txt", filenameUTF8: false, languageEncodingFlag: false });

	// an explicit encoding wins over the detection
	[entry] = await readEntries(await writeZip({ useUnicodeFileNames: false, encodeText: encodeFilenameAs(UTF8_FILENAME) }, "é.txt"), { filenameEncoding: "cp437" });
	assertEntry(entry, { filename: "├⌐.txt", filenameUTF8: false, languageEncodingFlag: false });

	// the archive written by macOS
	const entries = await readEntries(new Blob([Uint8Array.from(atob(DITTO_ZIP), character => character.charCodeAt(0))]));
	assertEntry(entries[0], { filename: FILENAME, filenameUTF8: true, languageEncodingFlag: false });
	assertEntry(entries[1], { filename: "plain.txt", filenameUTF8: false, languageEncodingFlag: false });
	if (entries[0].versionMadeBy >> 8 != 3) {
		throw new Error(`Expected the fixture to be made by Unix, got host ${entries[0].versionMadeBy >> 8}`);
	}
	await zip.terminateWorkers();
}

function encodeFilenameAs(bytes) {
	return (text, type) => type == "filename" ? bytes : undefined;
}

async function writeZip(writerOptions, filename, addOptions) {
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), writerOptions);
	await zipWriter.add(filename, new zip.BlobReader(new Blob([TEXT_CONTENT])), addOptions);
	return zipWriter.close();
}

async function readEntries(blob, readerOptions) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob), readerOptions);
	const entries = await zipReader.getEntries();
	for (const entry of entries) {
		const text = await entry.getData(new zip.TextWriter());
		if (text != TEXT_CONTENT) {
			throw new Error(`Expected ${JSON.stringify(entry.filename)} to hold ${JSON.stringify(TEXT_CONTENT)}, got ${JSON.stringify(text)}`);
		}
	}
	await zipReader.close();
	return entries;
}

function assertEntry(entry, expected) {
	for (const [name, value] of Object.entries(expected)) {
		const actual = name == "languageEncodingFlag" ? entry.bitFlag.languageEncodingFlag : entry[name];
		if (actual !== value) {
			throw new Error(`Expected ${name} to be ${JSON.stringify(value)}, got ${JSON.stringify(actual)}`);
		}
	}
}
