// The compression options used to describe data written as-is by accident. `compressionMethod` was optional,
// so forgetting it stamped a deflate entry over stored data and produced an archive no reader could extract,
// silently. Requiring it is what fixed that, and it also settles `level`: with the method declared, `level`
// no longer selects anything, it only feeds the level bits of the general purpose bit flag.
//
// Those bits describe how the data reaching the writer was already compressed, so they follow the same rule
// as `compressionMethod`. Declared on the entry they are metadata the caller is stating, which is how an
// archive-copying tool reproduces the flag of a source entry. Inherited from the writer options they are a
// compression instruction for the entries the writer compresses itself, and stamping them on a verbatim copy
// would describe data the writer never produced, so they stop at the entry.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.".repeat(20);
const FILENAME = "lorem.txt";
const DEFLATED_FILENAME = "deflated.txt";
const LOCAL_HEADER_BITFLAG_OFFSET = 6;
const LOCAL_HEADER_COMPRESSION_METHOD_OFFSET = 8;
const BITFLAG_LEVEL_MASK = 0b110;

export { test };

async function test() {
	await compressionMethodIsRequired();
	await compressionMethodIsTakenFromTheWriterOptions();
	await directoriesIgnorePassThrough();
	await levelIsNotInheritedFromTheWriterOptions();
	await levelDeclaresTheLevelBitsOfTheEntry();
	await storedEntriesNeverCarryLevelBits();
	await levelKeepsApplyingToTheOtherEntries();
	await zip.terminateWorkers();
}

async function compressionMethodIsRequired() {
	const { data, uncompressedSize, compressionMethod } = await getPassThroughData();
	let thrownError;
	try {
		await buildZip({}, { passThrough: true, uncompressedSize }, data);
	} catch (error) {
		thrownError = error;
	}
	if (!thrownError || thrownError.message != zip.ERR_UNDEFINED_COMPRESSION_METHOD) {
		throw new Error("expected the undefined compression method error, got " + thrownError);
	}
	const zipData = await buildZip({}, { passThrough: true, uncompressedSize, compressionMethod }, data);
	if (getLocalCompressionMethod(zipData) != compressionMethod) {
		throw new Error("expected the declared compression method in the local header");
	}
}

async function compressionMethodIsTakenFromTheWriterOptions() {
	const { data, uncompressedSize, compressionMethod } = await getPassThroughData();
	const zipData = await buildZip({ compressionMethod }, { passThrough: true, uncompressedSize }, data);
	if (getLocalCompressionMethod(zipData) != compressionMethod) {
		throw new Error("expected the compression method set on the writer to be used");
	}
}

async function directoriesIgnorePassThrough() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { passThrough: true });
	await zipWriter.add("folder", null, { directory: true });
	const [entry] = await readEntries(await zipWriter.close());
	if (!entry.directory || entry.compressionMethod != 0) {
		throw new Error("expected a stored directory entry");
	}
}

async function levelIsNotInheritedFromTheWriterOptions() {
	const { data, uncompressedSize, compressionMethod } = await getPassThroughData();
	const entryOptions = { passThrough: true, uncompressedSize, compressionMethod };
	const reference = await buildZip({}, entryOptions, data);
	for (const level of [0, 1, 6, 9]) {
		const zipData = await buildZip({ level }, entryOptions, data);
		if (getLocalCompressionMethod(zipData) != compressionMethod) {
			throw new Error("level " + level + " changed the compression method written as-is");
		}
		if (getLocalBitFlag(zipData) & BITFLAG_LEVEL_MASK) {
			throw new Error("level " + level + " of the writer options set the level bits of an entry written as-is");
		}
		if (zipData.length != reference.length) {
			throw new Error("level " + level + " changed the entry written as-is");
		}
	}
}

// The mapping is the one the writer applies to every deflate entry: 0 to 3 super fast, 4 and 5 fast, 9
// maximum, 6 to 8 nothing. Reading a source entry back gives the level the bits stand for, not the level it
// was compressed at, so the pairs below are what a copy has to reproduce.
async function levelDeclaresTheLevelBitsOfTheEntry() {
	const { data, uncompressedSize, compressionMethod } = await getPassThroughData();
	const entryOptions = { passThrough: true, uncompressedSize, compressionMethod };
	const reference = await buildZip({}, entryOptions, data);
	for (const [level, expectedBits] of [[0, 0b110], [3, 0b110], [4, 0b100], [5, 0b100], [8, 0], [9, 0b010]]) {
		const zipData = await buildZip({}, Object.assign({ level }, entryOptions), data);
		const bits = getLocalBitFlag(zipData) & BITFLAG_LEVEL_MASK;
		if (getLocalCompressionMethod(zipData) != compressionMethod) {
			throw new Error("level " + level + " changed the compression method written as-is");
		}
		if (bits != expectedBits) {
			throw new Error("expected level " + level + " to set the bits " + expectedBits.toString(2) + ", got " + bits.toString(2));
		}
		if (zipData.length != reference.length) {
			throw new Error("level " + level + " changed the size of the entry written as-is");
		}
	}
}

// A stored entry never carries level bits, whichever level is declared, because they describe a deflate
// stream. This is what the filesystem export used to force by setting the level to 0 itself.
async function storedEntriesNeverCarryLevelBits() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT), { level: 0 });
	const [storedEntry] = await readEntries(await zipWriter.close());
	const stored = await storedEntry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	for (const level of [0, 3, 9]) {
		const zipData = await buildZip({}, {
			passThrough: true,
			level,
			uncompressedSize: storedEntry.uncompressedSize,
			compressionMethod: storedEntry.compressionMethod
		}, stored);
		if (getLocalBitFlag(zipData) & BITFLAG_LEVEL_MASK) {
			throw new Error("level " + level + " set the level bits of a stored entry");
		}
	}
}

async function levelKeepsApplyingToTheOtherEntries() {
	const { data, uncompressedSize, compressionMethod } = await getPassThroughData();
	const sizes = [];
	for (const level of [1, 9]) {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level });
		await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(data), { passThrough: true, uncompressedSize, compressionMethod });
		await zipWriter.add(DEFLATED_FILENAME, new zip.TextReader(TEXT_CONTENT));
		const entries = await readEntries(await zipWriter.close());
		const [passThroughEntry, deflatedEntry] = entries;
		if (passThroughEntry.compressedSize != data.length) {
			throw new Error("expected the data written as-is to keep its size at level " + level);
		}
		sizes.push(deflatedEntry.compressedSize);
	}
	if (sizes[0] <= sizes[1]) {
		throw new Error("expected the level to keep compressing the other entries, got " + sizes);
	}
}

async function getPassThroughData() {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 1 });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	const [entry] = await readEntries(await zipWriter.close());
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	return { data, uncompressedSize: entry.uncompressedSize, compressionMethod: entry.compressionMethod };
}

async function buildZip(writerOptions, entryOptions, data) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), writerOptions);
	await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(data), entryOptions);
	return await zipWriter.close();
}

async function readEntries(data) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	return await zipReader.getEntries();
}

function getLocalCompressionMethod(zipData) {
	return getUint16(zipData, LOCAL_HEADER_COMPRESSION_METHOD_OFFSET);
}

function getLocalBitFlag(zipData) {
	return getUint16(zipData, LOCAL_HEADER_BITFLAG_OFFSET);
}

function getUint16(zipData, offset) {
	return zipData[offset] | (zipData[offset + 1] << 8);
}
