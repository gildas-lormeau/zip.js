import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, ".repeat(40);
const ENTRY_COMMENT = "per entry comment";

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const exported = await reexportWithForcedEntryOptions(await buildSourceArchive());
		const entries = await new zip.ZipReader(new zip.Uint8ArrayReader(exported)).getEntries();
		if (entries.length != 2) {
			throw new Error("unexpected entry count");
		}
		const [deflated, stored] = entries;
		if (deflated.compressionMethod != 0x08 || stored.compressionMethod != 0x00) {
			throw new Error("entry options overrode the passThrough compression method");
		}
		for (const entry of entries) {
			if (await entry.getData(new zip.TextWriter()) != TEXT_CONTENT) {
				throw new Error("entry options corrupted the passThrough content");
			}
			if (entry.uncompressedSize != TEXT_CONTENT.length) {
				throw new Error("entry options overrode the passThrough uncompressed size");
			}
			if (entry.comment != ENTRY_COMMENT) {
				throw new Error("entry options no longer reach the exported entry");
			}
		}
	} finally {
		await zip.terminateWorkers();
	}
}

async function buildSourceArchive() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("deflated.txt", new zip.TextReader(TEXT_CONTENT), { level: 9 });
	await zipWriter.add("stored.txt", new zip.TextReader(TEXT_CONTENT), { level: 0 });
	return await zipWriter.close();
}

async function reexportWithForcedEntryOptions(source) {
	const zipFs = new zip.fs.FS();
	await zipFs.importUint8Array(source, { passThrough: true });
	for (const child of zipFs.root.children) {
		child.options = {
			compressionMethod: 0x00,
			crc32: 0,
			uncompressedSize: 1,
			comment: ENTRY_COMMENT
		};
	}
	return await zipFs.exportUint8Array({ passThrough: true });
}
