import { getConfiguration } from "../../lib/core/configuration.js";
import { parseZip } from "./parse.js";

const EXTRAFIELD_TYPE_ZIP64 = 0x0001;
const EXTRAFIELD_TYPE_NTFS = 0x000a;
const EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP = 0x5455;
const EXTRAFIELD_TYPE_UNIX = 0x7855;
const EXTRAFIELD_TYPE_INFOZIP = 0x7875;
const EXTRAFIELD_TYPE_AES = 0x9901;
const COMPRESSION_METHOD_STORE = 0;
const COMPRESSION_METHOD_DEFLATE = 8;
const COMPRESSION_METHOD_AES = 99;
const BITFLAG_ENCRYPTED = 0x1;
const BITFLAG_LEVEL = 0x6;
const BITFLAG_DATA_DESCRIPTOR = 0x8;
const BITFLAG_LANG_ENCODING = 0x800;
const KNOWN_BITFLAGS = BITFLAG_ENCRYPTED | BITFLAG_LEVEL | BITFLAG_DATA_DESCRIPTOR | BITFLAG_LANG_ENCODING;
const LEVEL_BY_BITFLAG = new Map([[0, 8], [2, 9], [4, 5], [6, 3]]);
const MIN_UNIX_TIME = -2147483648;
const MAX_UNIX_TIME = 2147483647;
const MIN_DATE = new Date(1980, 0, 1, 0, 0, 0);
const MAX_DATE = new Date(2107, 11, 31, 23, 59, 58);
const NTFS_EPOCH_OFFSET = 11644473600000n;
const textDecoder = new TextDecoder("utf-8", { fatal: true });
const textEncoder = new TextEncoder();

export { rewriteZip, UnreproducibleError };

class UnreproducibleError extends Error {
	constructor(reason) {
		super(reason);
		this.unreproducible = true;
	}
}

async function rewriteZip(zip, data, { leg = "codec" } = {}) {
	const parsed = parseZip(data);
	if (parsed.zip64) {
		throw new UnreproducibleError("zip64 archive");
	}
	if (parsed.gaps.length) {
		throw new UnreproducibleError("gaps between records: " + parsed.gaps.map(gap => `${gap.start}-${gap.end}`).join(","));
	}
	if (parsed.eocd.diskNumber != 0 || parsed.eocd.directoryDiskNumber != 0) {
		throw new UnreproducibleError("split archive");
	}
	const plans = [];
	const failures = [];
	for (const entry of parsed.entries) {
		try {
			plans.push(planEntry(entry, leg));
		} catch (error) {
			if (error.unreproducible) {
				failures.push(error.message);
			} else {
				throw error;
			}
		}
	}
	if (failures.length) {
		throw new UnreproducibleError([...new Set(failures)].join("; "));
	}
	if (plans.some(plan => plan.mode == "codec")) {
		await extractPayloads(zip, data, parsed, plans);
	}
	const queue = plans
		.filter(plan => plan.mode == "codec" && plan.options.compressionMethod == COMPRESSION_METHOD_DEFLATE)
		.map(plan => data.slice(plan.entry.payload.start, plan.entry.payload.end));
	const configuration = getConfiguration();
	const RealCompressionStreamZlib = configuration.CompressionStreamZlib;
	class ReplayCompressionStream extends TransformStream {
		constructor() {
			const payload = queue.shift();
			super({
				transform() { },
				flush(controller) {
					if (payload && payload.length) {
						controller.enqueue(payload);
					}
				}
			});
		}
	}
	zip.configure({ CompressionStreamZlib: ReplayCompressionStream });
	try {
		const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { useWebWorkers: false, useCompressionStream: false });
		for (const plan of plans) {
			let reader;
			if (plan.mode == "passthrough") {
				reader = new zip.Uint8ArrayReader(data.slice(plan.entry.payload.start, plan.entry.payload.end));
			} else if (plan.mode == "codec") {
				reader = new zip.Uint8ArrayReader(plan.uncompressed);
			}
			await zipWriter.add(plan.name, reader, plan.options);
		}
		return await zipWriter.close(parsed.eocd.commentBytes.length ? parsed.eocd.commentBytes : undefined);
	} finally {
		zip.configure({ CompressionStreamZlib: RealCompressionStreamZlib });
	}
}

async function extractPayloads(zip, data, parsed, plans) {
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { useWebWorkers: false, useCompressionStream: false });
	const zipEntries = await zipReader.getEntries();
	if (zipEntries.length != plans.length) {
		throw new UnreproducibleError("entry count mismatch between parser and reader");
	}
	for (let indexEntry = 0; indexEntry < plans.length; indexEntry++) {
		const plan = plans[indexEntry];
		if (plan.mode == "codec") {
			plan.uncompressed = await zipEntries[indexEntry].getData(new zip.Uint8ArrayWriter());
		}
	}
}

function planEntry(entry, leg) {
	const { local, cd } = entry;
	const fail = reason => {
		throw new UnreproducibleError(`entry ${entry.index}: ${reason}`);
	};
	checkLocalDirectoryConsistency(entry, fail);
	const bitFlag = local.bitFlag;
	if (bitFlag & ~KNOWN_BITFLAGS) {
		fail(`unsupported bit flags 0x${bitFlag.toString(16)}`);
	}
	const encrypted = Boolean(bitFlag & BITFLAG_ENCRYPTED);
	const dataDescriptor = Boolean(bitFlag & BITFLAG_DATA_DESCRIPTOR);
	const useUnicodeFileNames = Boolean(bitFlag & BITFLAG_LANG_ENCODING);
	const name = decodeStrict(local.filenameBytes, fail, "filename");
	if (name.trim() != name) {
		fail("filename with leading or trailing whitespace");
	}
	const directory = name.endsWith("/");
	const comment = cd.commentBytes.length ? decodeStrict(cd.commentBytes, fail, "comment") : undefined;
	const fields = classifyExtraFields(entry, fail);
	const timestamps = resolveTimestamps(entry, fields, fail);
	let compressionMethod = local.compressionMethod;
	let level;
	let encryptionOptions = {};
	if (compressionMethod == COMPRESSION_METHOD_AES) {
		if (!encrypted || !fields.aes) {
			fail("AES compression method without encryption");
		}
		compressionMethod = fields.aes.compressionMethod;
		encryptionOptions = { encryptionStrength: fields.aes.strength };
	} else if (encrypted) {
		if (!dataDescriptor) {
			fail("zipcrypto without data descriptor");
		}
		encryptionOptions = { zipCrypto: true };
	}
	if (dataDescriptor && (local.crc32 || local.compressedSize || local.uncompressedSize)) {
		fail("populated local header with data descriptor");
	}
	if (compressionMethod == COMPRESSION_METHOD_DEFLATE) {
		level = LEVEL_BY_BITFLAG.get(bitFlag & BITFLAG_LEVEL);
	} else if (compressionMethod == COMPRESSION_METHOD_STORE) {
		if (bitFlag & BITFLAG_LEVEL) {
			fail("level bit flags on stored entry");
		}
	} else {
		fail(`unsupported compression method ${compressionMethod}`);
	}
	if (directory && (cd.compressedSize || cd.uncompressedSize || compressionMethod != COMPRESSION_METHOD_STORE)) {
		fail("directory entry with data");
	}
	const options = {
		...timestamps.options,
		...encryptionOptions,
		useUnicodeFileNames,
		dataDescriptor,
		dataDescriptorSignature: dataDescriptor ? entry.dataDescriptor.signaturePresent : false,
		compressionMethod,
		level,
		version: local.versionNeeded,
		versionMadeBy: cd.versionMadeBy,
		internalFileAttributes: cd.internalFileAttributes,
		externalFileAttributes: cd.externalFileAttributes,
		msDosCompatible: true,
		comment
	};
	if (fields.unix) {
		if ((cd.versionMadeBy >> 8) != 3) {
			fail("unix extra field without unix versionMadeBy");
		}
		Object.assign(options, fields.unix);
	}
	if (fields.user.length) {
		options.extraField = new Map(fields.user.map(field => [field.type, field.data]));
	}
	let mode;
	if (directory) {
		mode = "directory";
	} else if (leg == "passthrough" || encrypted) {
		mode = "passthrough";
		Object.assign(options, {
			passThrough: true,
			encrypted,
			uncompressedSize: cd.uncompressedSize,
			crc32: fields.aes && fields.aes.vendorVersion != 1 ? undefined : cd.crc32
		});
	} else {
		mode = "codec";
	}
	return { entry, name, options, mode };
}

function checkLocalDirectoryConsistency({ local, cd }, fail) {
	const fields = ["versionNeeded", "bitFlag", "compressionMethod", "rawLastModDate"];
	for (const field of fields) {
		if (local[field] != cd[field]) {
			fail(`local/central ${field} mismatch (${local[field]} != ${cd[field]})`);
		}
	}
	if (!bytesEqual(local.filenameBytes, cd.filenameBytes)) {
		fail("local/central filename mismatch");
	}
}

function classifyExtraFields(entry, fail) {
	const { local, cd } = entry;
	if (local.extraFields.some(field => field.type === null) || cd.extraFields.some(field => field.type === null)) {
		fail("malformed extra field");
	}
	if (local.extraFields.some(field => field.type == EXTRAFIELD_TYPE_ZIP64) || cd.extraFields.some(field => field.type == EXTRAFIELD_TYPE_ZIP64)) {
		fail("zip64 extra field");
	}
	const knownOrder = [EXTRAFIELD_TYPE_AES, EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP, EXTRAFIELD_TYPE_NTFS, EXTRAFIELD_TYPE_UNIX, EXTRAFIELD_TYPE_INFOZIP];
	const localInfozipField = local.extraFields.find(field => field.type == EXTRAFIELD_TYPE_INFOZIP);
	let infozipUnix;
	if (localInfozipField) {
		infozipUnix = parseInfozipField(localInfozipField.data, fail);
		if (!bytesEqual(serializeInfozipField(infozipUnix), localInfozipField.data)) {
			infozipUnix = undefined;
			knownOrder.splice(knownOrder.indexOf(EXTRAFIELD_TYPE_INFOZIP), 1);
		}
	}
	const checkOrder = fields => {
		const knownTypes = fields.filter(field => knownOrder.includes(field.type)).map(field => field.type);
		const sortedTypes = [...knownTypes].sort((typeA, typeB) => knownOrder.indexOf(typeA) - knownOrder.indexOf(typeB));
		if (knownTypes.join() != sortedTypes.join()) {
			fail("extra field order differs from writer order");
		}
		const firstUserIndex = fields.findIndex(field => !knownOrder.includes(field.type));
		if (firstUserIndex != -1 && fields.slice(firstUserIndex).some(field => knownOrder.includes(field.type))) {
			fail("known extra field after user extra field");
		}
	};
	checkOrder(local.extraFields);
	checkOrder(cd.extraFields);
	const localByType = type => local.extraFields.find(field => field.type == type);
	const cdByType = type => cd.extraFields.find(field => field.type == type);
	const result = { user: local.extraFields.filter(field => !knownOrder.includes(field.type)) };
	const cdUser = cd.extraFields.filter(field => !knownOrder.includes(field.type));
	if (result.user.length != cdUser.length ||
		result.user.some((field, indexField) => field.type != cdUser[indexField].type || !bytesEqual(field.data, cdUser[indexField].data))) {
		fail("user extra fields differ between local and central directory");
	}
	const timestampField = localByType(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP);
	if (timestampField) {
		result.timestamp = parseTimestampField(timestampField.data, fail);
	}
	const ntfsField = localByType(EXTRAFIELD_TYPE_NTFS);
	if (ntfsField) {
		result.ntfs = parseNTFSField(ntfsField.data, fail);
	}
	const aesField = localByType(EXTRAFIELD_TYPE_AES);
	if (aesField) {
		result.aes = parseAESField(aesField.data, fail);
	}
	const unixField = localByType(EXTRAFIELD_TYPE_UNIX);
	if (infozipUnix) {
		result.unix = infozipUnix;
	} else if (unixField) {
		result.unix = parseUnixField(unixField.data, fail);
	}
	if (Boolean(timestampField) != Boolean(cdByType(EXTRAFIELD_TYPE_EXTENDED_TIMESTAMP)) ||
		Boolean(ntfsField) != Boolean(cdByType(EXTRAFIELD_TYPE_NTFS))) {
		fail("timestamp extra fields differ between local and central directory");
	}
	return result;
}

function parseTimestampField(data, fail) {
	if (data.length < 5) {
		fail("truncated extended timestamp field");
	}
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const flags = data[0];
	if (!(flags & 0x1)) {
		fail("extended timestamp without modification time");
	}
	const result = { flags, mtime: view.getInt32(1, true) };
	let offset = 5;
	if (flags & 0x2) {
		result.atime = view.getInt32(offset, true);
		offset += 4;
	}
	if (flags & 0x4) {
		result.ctime = view.getInt32(offset, true);
		offset += 4;
	}
	if (offset != data.length) {
		fail("unexpected extended timestamp length");
	}
	return result;
}

function parseNTFSField(data, fail) {
	if (data.length != 32) {
		fail("unexpected NTFS field length");
	}
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	if (view.getUint16(4, true) != 0x0001 || view.getUint16(6, true) != 24) {
		fail("unexpected NTFS field layout");
	}
	return {
		mtime: view.getBigUint64(8, true),
		atime: view.getBigUint64(16, true),
		ctime: view.getBigUint64(24, true)
	};
}

function parseAESField(data, fail) {
	if (data.length != 7) {
		fail("unexpected AES field length");
	}
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const vendorVersion = view.getUint16(0, true);
	if (vendorVersion != 1 && vendorVersion != 2) {
		fail("unsupported AES vendor version");
	}
	return { vendorVersion, strength: data[4], compressionMethod: view.getUint16(5, true) };
}

function parseInfozipField(data, fail) {
	if (data.length < 3 || data[0] != 1) {
		fail("unsupported infozip unix field version");
	}
	let offset = 1;
	const readId = () => {
		const size = data[offset++];
		if (size > 4 || offset + size > data.length) {
			fail("unsupported infozip unix id size");
		}
		let value = 0;
		for (let indexByte = size - 1; indexByte >= 0; indexByte--) {
			value = value * 256 + data[offset + indexByte];
		}
		offset += size;
		return size ? value : undefined;
	};
	const uid = readId();
	const gid = readId();
	if (offset != data.length) {
		fail("unexpected infozip unix field length");
	}
	return { uid, gid, unixExtraFieldType: "infozip" };
}

function serializeInfozipField({ uid, gid }) {
	const packId = value => {
		if (value === undefined) {
			return new Uint8Array(0);
		}
		const bytes = new Uint8Array(4);
		new DataView(bytes.buffer).setUint32(0, value, true);
		let length = 4;
		while (length > 1 && bytes[length - 1] === 0) {
			length--;
		}
		return bytes.subarray(0, length);
	};
	const uidBytes = packId(uid);
	const gidBytes = packId(gid);
	const data = new Uint8Array(3 + uidBytes.length + gidBytes.length);
	data[0] = 1;
	data[1] = uidBytes.length;
	data.set(uidBytes, 2);
	data[2 + uidBytes.length] = gidBytes.length;
	data.set(gidBytes, 3 + uidBytes.length);
	return data;
}

function parseUnixField(data, fail) {
	if (data.length != 4) {
		fail("unexpected unix field length");
	}
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	return { uid: view.getUint16(0, true), gid: view.getUint16(2, true), unixExtraFieldType: "unix" };
}

function resolveTimestamps(entry, fields, fail) {
	const { timestamp, ntfs } = fields;
	let lastModDate, lastAccessDate, creationDate;
	if (ntfs) {
		lastModDate = ntfsToDate(ntfs.mtime);
		const atimeDate = ntfsToDate(ntfs.atime);
		const ctimeDate = ntfsToDate(ntfs.ctime);
		const hasAtime = timestamp ? Boolean(timestamp.flags & 0x2) : ntfs.atime != ntfs.mtime;
		const hasCtime = timestamp ? Boolean(timestamp.flags & 0x4) : ntfs.ctime != ntfs.mtime;
		if (hasAtime) {
			lastAccessDate = atimeDate;
		}
		if (hasCtime) {
			creationDate = ctimeDate;
		}
	} else if (timestamp) {
		lastModDate = new Date(timestamp.mtime * 1000);
		if (timestamp.flags & 0x2) {
			lastAccessDate = new Date(timestamp.atime * 1000);
		}
		if (timestamp.flags & 0x4) {
			creationDate = new Date(timestamp.ctime * 1000);
		}
	} else {
		lastModDate = decodeDosDateTime(entry.local.rawLastModDate);
	}
	const extendedTimestamp = Boolean(timestamp || ntfs);
	const mtimeUnix = Math.floor(lastModDate.getTime() / 1000);
	const mtimeUnixInRange = mtimeUnix >= MIN_UNIX_TIME && mtimeUnix <= MAX_UNIX_TIME;
	if (ntfs && !timestamp && mtimeUnixInRange) {
		fail("NTFS field without extended timestamp for in-range date");
	}
	if (timestamp && !mtimeUnixInRange) {
		fail("extended timestamp with out-of-range date");
	}
	if (encodeDosDateTime(lastModDate) != entry.local.rawLastModDate) {
		const fractionalDate = new Date(lastModDate.getTime() + 500);
		if (!ntfs && timestamp && encodeDosDateTime(fractionalDate) == entry.local.rawLastModDate) {
			lastModDate = fractionalDate;
		} else {
			fail("dos date does not match timestamp extra field");
		}
	}
	return {
		options: {
			lastModDate,
			lastAccessDate,
			creationDate,
			extendedTimestamp,
			ntfsTimestamp: Boolean(ntfs)
		}
	};
}

function ntfsToDate(value) {
	return new Date(Number(value / 10000n - NTFS_EPOCH_OFFSET));
}

function decodeDosDateTime(rawValue) {
	const time = rawValue & 0xffff;
	const date = rawValue >>> 16;
	return new Date(
		1980 + (date >> 9),
		((date >> 5) & 0xf) - 1,
		date & 0x1f,
		time >> 11,
		(time >> 5) & 0x3f,
		(time & 0x1f) * 2);
}

function encodeDosDateTime(date) {
	const ceiledDate = new Date(Math.ceil(Math.floor(date.getTime() / 1000) / 2) * 2000);
	const clampedDate = ceiledDate < MIN_DATE ? MIN_DATE : ceiledDate > MAX_DATE ? MAX_DATE : ceiledDate;
	const time = (clampedDate.getHours() << 11) | (clampedDate.getMinutes() << 5) | (clampedDate.getSeconds() >> 1);
	const day = (((clampedDate.getFullYear() - 1980) << 4) | (clampedDate.getMonth() + 1)) << 5 | clampedDate.getDate();
	return ((day << 16) | time) >>> 0;
}

function decodeStrict(bytes, fail, label) {
	let value;
	try {
		value = textDecoder.decode(bytes);
	} catch {
		fail(`${label} is not valid UTF-8`);
	}
	if (!bytesEqual(textEncoder.encode(value), bytes)) {
		fail(`${label} does not round-trip through UTF-8`);
	}
	return value;
}

function bytesEqual(bytesA, bytesB) {
	if (bytesA.length != bytesB.length) {
		return false;
	}
	for (let indexByte = 0; indexByte < bytesA.length; indexByte++) {
		if (bytesA[indexByte] != bytesB[indexByte]) {
			return false;
		}
	}
	return true;
}
