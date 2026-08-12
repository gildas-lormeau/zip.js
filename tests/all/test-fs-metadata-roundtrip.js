import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const CUSTOM_FIELD_TYPE = 0x6666;
const CUSTOM_FIELD_DATA = new Uint8Array([1, 2, 3, 4]);
const UID = 501;
const GID = 20;
const INTERNAL_FILE_ATTRIBUTES = 1;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), {
		extraField: new Map([[CUSTOM_FIELD_TYPE, CUSTOM_FIELD_DATA]]),
		uid: UID,
		gid: GID,
		unixExtraFieldType: "infozip",
		internalFileAttributes: INTERNAL_FILE_ATTRIBUTES
	});
	await zipWriter.close();
	const sourceBlob = await blobWriter.getData();
	for (const passThrough of [false, true]) {
		const zipFs = new zip.fs.FS();
		await zipFs.importBlob(sourceBlob, passThrough ? { passThrough: true } : {});
		const exportedBlob = await zipFs.exportBlob();
		const zipReader = new zip.ZipReader(new zip.BlobReader(exportedBlob));
		const [entry] = await zipReader.getEntries();
		const customField = entry.extraField.get(CUSTOM_FIELD_TYPE);
		if (!customField ||
			customField.data.join() != CUSTOM_FIELD_DATA.join() ||
			entry.uid != UID ||
			entry.gid != GID ||
			entry.internalFileAttributes != INTERNAL_FILE_ATTRIBUTES) {
			throw new Error();
		}
		const fieldTypeCounts = getFieldTypeCounts(entry.rawExtraField);
		if (Array.from(fieldTypeCounts.values()).some(count => count != 1)) {
			throw new Error();
		}
		const text = await entry.getData(new zip.TextWriter(), { checkCrc32: true });
		await zipReader.close();
		if (text != TEXT_CONTENT) {
			throw new Error();
		}
	}
	await zip.terminateWorkers();
}

function getFieldTypeCounts(rawExtraField) {
	const view = new DataView(rawExtraField.buffer, rawExtraField.byteOffset, rawExtraField.byteLength);
	const counts = new Map();
	let offset = 0;
	while (offset < rawExtraField.length) {
		const type = view.getUint16(offset, true);
		const size = view.getUint16(offset + 2, true);
		counts.set(type, (counts.get(type) || 0) + 1);
		offset += 4 + size;
	}
	return counts;
}
