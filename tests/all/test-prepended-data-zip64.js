import * as zip from "../zip-lib.js";

const CONTENTS = ["alpha-content", "beta-content!"];
const PREPENDED_DATA_LENGTH = 100;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { level: 0, dataDescriptor: false, extendedTimestamp: false });
	for (let indexContent = 0; indexContent < CONTENTS.length; indexContent++) {
		await zipWriter.add("file" + indexContent + ".txt", new zip.TextReader(CONTENTS[indexContent]));
	}
	await zipWriter.close();
	const array = new Uint8Array(await (await blobWriter.getData()).arrayBuffer());
	const view = new DataView(array.buffer);
	const directoryOffset = view.getUint32(array.length - 22 + 16, true);
	// rewrite the central directory with saturated offsets resolved via zip64 extra fields
	const records = [];
	let offset = directoryOffset;
	for (let indexRecord = 0; indexRecord < CONTENTS.length; indexRecord++) {
		const recordLength = 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
		const record = new Uint8Array(recordLength + 12);
		record.set(array.subarray(offset, offset + recordLength));
		const recordView = new DataView(record.buffer);
		const extraFieldZip64View = new DataView(record.buffer, recordLength);
		extraFieldZip64View.setUint16(0, 0x0001, true);
		extraFieldZip64View.setUint16(2, 8, true);
		extraFieldZip64View.setBigUint64(4, BigInt(recordView.getUint32(42, true)), true);
		recordView.setUint16(6, 45, true);
		recordView.setUint32(42, 0xFFFFFFFF, true);
		recordView.setUint16(30, recordView.getUint16(30, true) + 12, true);
		records.push(record);
		offset += recordLength;
	}
	const directoryDataLength = records.reduce((length, record) => length + record.length, 0);
	const prependedArray = new Uint8Array(PREPENDED_DATA_LENGTH + directoryOffset + directoryDataLength + 22);
	prependedArray.fill(0x5a, 0, PREPENDED_DATA_LENGTH);
	prependedArray.set(array.subarray(0, directoryOffset), PREPENDED_DATA_LENGTH);
	offset = PREPENDED_DATA_LENGTH + directoryOffset;
	for (const record of records) {
		prependedArray.set(record, offset);
		offset += record.length;
	}
	prependedArray.set(array.subarray(array.length - 22), offset);
	new DataView(prependedArray.buffer).setUint32(offset + 12, directoryDataLength, true);
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(prependedArray), { extractPrependedData: true });
	try {
		const entries = await zipReader.getEntries();
		if (entries.length != CONTENTS.length) {
			throw new Error();
		}
		if (zipReader.prependedData.length != PREPENDED_DATA_LENGTH) {
			throw new Error();
		}
		for (let indexEntry = 0; indexEntry < entries.length; indexEntry++) {
			const data = await entries[indexEntry].getData(new zip.TextWriter(), { checkCrc32: true });
			if (data != CONTENTS[indexEntry]) {
				throw new Error();
			}
		}
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}
