/* global Blob, URL */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const UNIX_TYPE1_EXTRA_FIELD_TYPE = 0x5855;
const PKWARE_UNIX_EXTRA_FIELD_TYPE = 0x000d;
const ATIME = new Date(Date.UTC(2026, 2, 4, 5, 6, 7));
const MTIME = new Date(Date.UTC(2026, 0, 2, 3, 4, 5));
const PRE_EPOCH_ATIME = new Date(Date.UTC(1960, 2, 4, 5, 6, 7));
const PRE_EPOCH_MTIME = new Date(Date.UTC(1960, 0, 2, 3, 4, 5));
const UID = 1234;
const GID = 4321;
const LAST_MOD_DATE = new Date(2030, 5, 15, 10, 20, 24);
const MACOS_FIXTURE_URL = new URL("./../data/lorem-macos.zip", import.meta.url).href;
const MACOS_FIXTURE_MTIME = 1767319445000;
const MACOS_FIXTURE_ATIME = 1772597167000;
const MACOS_FIXTURE_UID = 501;
const MACOS_FIXTURE_GID = 0;
const MACOS_FIXTURE_UNCOMPRESSED_SIZE = 1162;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testUnixType1();
		await testExtendedTimestampPrecedence();
		await testPkwareUnix();
		await testPreEpochDates();
		await testMacOSFixture();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testUnixType1() {
	const entry = await readFirstEntry(await writeEntry(UNIX_TYPE1_EXTRA_FIELD_TYPE, { extendedTimestamp: false }));
	if (entry.lastModDate.getTime() != MTIME.getTime() ||
		entry.lastAccessDate.getTime() != ATIME.getTime() ||
		entry.uid != UID || entry.gid != GID ||
		entry.extraFieldUnixType1.type != UNIX_TYPE1_EXTRA_FIELD_TYPE ||
		entry.extraFieldUnixType1.lastModDate.getTime() != MTIME.getTime()) {
		throw new Error();
	}
}

async function testExtendedTimestampPrecedence() {
	const entry = await readFirstEntry(await writeEntry(UNIX_TYPE1_EXTRA_FIELD_TYPE, {}));
	if (entry.lastModDate.getTime() != LAST_MOD_DATE.getTime() ||
		entry.lastAccessDate.getTime() != ATIME.getTime() ||
		entry.uid != UID || entry.gid != GID) {
		throw new Error();
	}
}

async function testPkwareUnix() {
	const entry = await readFirstEntry(await writeEntry(PKWARE_UNIX_EXTRA_FIELD_TYPE, { extendedTimestamp: false }));
	if (entry.lastModDate.getTime() != MTIME.getTime() ||
		entry.lastAccessDate.getTime() != ATIME.getTime() ||
		entry.uid != UID || entry.gid != GID ||
		entry.extraFieldPkwareUnix.type != PKWARE_UNIX_EXTRA_FIELD_TYPE) {
		throw new Error();
	}
}

async function testPreEpochDates() {
	for (const extraFieldType of [UNIX_TYPE1_EXTRA_FIELD_TYPE, PKWARE_UNIX_EXTRA_FIELD_TYPE]) {
		const blob = await writeEntry(extraFieldType, { extendedTimestamp: false }, PRE_EPOCH_ATIME, PRE_EPOCH_MTIME);
		const entry = await readFirstEntry(blob);
		if (entry.lastModDate.getTime() != PRE_EPOCH_MTIME.getTime() ||
			entry.lastAccessDate.getTime() != PRE_EPOCH_ATIME.getTime()) {
			throw new Error();
		}
	}
}

async function testMacOSFixture() {
	const zipReader = new zip.ZipReader(new zip.HttpReader(MACOS_FIXTURE_URL, { preventHeadRequest: true }));
	try {
		const entries = await zipReader.getEntries();
		const entry = entries[0];
		if (entry.filename != FILENAME ||
			entry.lastModDate.getTime() != MACOS_FIXTURE_MTIME ||
			entry.lastAccessDate.getTime() != MACOS_FIXTURE_ATIME ||
			entry.uid !== undefined || entry.gid !== undefined ||
			entry.extraFieldUnixType1.data.length != 8) {
			throw new Error();
		}
		const text = await entry.getData(new zip.TextWriter());
		if (text.length != MACOS_FIXTURE_UNCOMPRESSED_SIZE || !text.startsWith("Lorem ipsum dolor sit amet")) {
			throw new Error();
		}
		const localExtraField = entry.localDirectory.extraFieldUnixType1;
		if (localExtraField.data.length != 12 ||
			localExtraField.uid != MACOS_FIXTURE_UID || localExtraField.gid != MACOS_FIXTURE_GID ||
			localExtraField.lastModDate.getTime() != MACOS_FIXTURE_MTIME ||
			localExtraField.lastAccessDate.getTime() != MACOS_FIXTURE_ATIME) {
			throw new Error();
		}
	} finally {
		await zipReader.close();
	}
}

async function writeEntry(extraFieldType, options, atime = ATIME, mtime = MTIME) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	const data = new Uint8Array(12);
	const dataView = new DataView(data.buffer);
	dataView.setInt32(0, atime.getTime() / 1000, true);
	dataView.setInt32(4, mtime.getTime() / 1000, true);
	dataView.setUint16(8, UID, true);
	dataView.setUint16(10, GID, true);
	const extraField = new Map([[extraFieldType, data]]);
	await zipWriter.add(FILENAME, new zip.BlobReader(new Blob([TEXT_CONTENT])), Object.assign({ lastModDate: LAST_MOD_DATE, extraField }, options));
	await zipWriter.close();
	return await blobWriter.getData();
}

async function readFirstEntry(blob) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	try {
		const entries = await zipReader.getEntries();
		return entries[0];
	} finally {
		await zipReader.close();
	}
}