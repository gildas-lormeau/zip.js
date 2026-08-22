// The central directory records of prepended entries are rebuilt from the source records. A source
// entry written with `zip64: true` stores its sizes in the zip64 extra field and the 0xFFFFFFFF
// sentinel in the 32-bit fields; the rebuilt record must keep that layout instead of writing the
// actual sizes next to a stale zip64 extra field, so that appending to a zip file produces the same
// bytes as writing all its entries directly.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const ADDED_TEXT_CONTENT = "Sed non risus. Suspendisse lectus tortor, dignissim sit amet.";
const ZIP64_FILENAME = "entry.txt";
const ADDED_FILENAME = "added.txt";
const LAST_MOD_DATE = new Date(2026, 0, 1, 12, 0, 0);

export { test };

async function test() {
	await keepsTheZip64LayoutOfTheSource();
	await zip.terminateWorkers();
}

async function keepsTheZip64LayoutOfTheSource() {
	const directOutput = await buildZipFile(true);
	const source = await buildZipFile(false);
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.prependZip(new zip.Uint8ArrayReader(source));
	await zipWriter.add(ADDED_FILENAME, new zip.TextReader(ADDED_TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	const output = await zipWriter.close();
	if (!equalBytes(output, directOutput)) {
		throw new Error("expected the same bytes as a direct write, got " + output.length + " vs " + directOutput.length + " bytes");
	}
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(output), { strictness: "strict", checkCrc32: true });
	const entries = await zipReader.getEntries();
	const contents = await Promise.all(entries.map(entry => entry.getData(new zip.TextWriter())));
	await zipReader.close();
	const [zip64Entry] = entries;
	if (entries.length != 2 || contents[0] != TEXT_CONTENT || contents[1] != ADDED_TEXT_CONTENT ||
		!zip64Entry.zip64 || zip64Entry.uncompressedSize != TEXT_CONTENT.length) {
		throw new Error("expected 2 readable entries with a zip64 first entry, got " + entries.length + " entries");
	}
}

async function buildZipFile(withAddedEntry) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(ZIP64_FILENAME, new zip.TextReader(TEXT_CONTENT), { lastModDate: LAST_MOD_DATE, zip64: true });
	if (withAddedEntry) {
		await zipWriter.add(ADDED_FILENAME, new zip.TextReader(ADDED_TEXT_CONTENT), { lastModDate: LAST_MOD_DATE });
	}
	return zipWriter.close();
}

function equalBytes(first, second) {
	return first.length == second.length && first.every((byte, index) => byte == second[index]);
}
