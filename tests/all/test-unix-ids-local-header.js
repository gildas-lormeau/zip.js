/* global Blob */

import * as zip from "../zip-lib.js";

export { test };

// Info-ZIP writes the Unix type 2 extra field (0x7855) with its uid/gid in the local file header and a
// zero-length copy in the central directory, which is what the corpus shows. The reader works from the
// central directory, so those ids used to be invisible: the entry reported uid/gid undefined and, worse,
// the empty central copy shadowed a 0x7875 field carrying the real ids, because 0x7855 was tried first and
// 0x7875 only in its else branch. The local header is already parsed and its fields already interpreted
// when the entry data is read, so the ids are now taken from there when the central directory has none.
// They must not go the other way: 0x7855 truncates ids to 16 bits, so a local value never overwrites one
// read from the central directory.

const CONTENT = "content";
const UID = 501;
const GID = 20;
const LARGE_UID = 70000;
const TRUNCATED_UID = LARGE_UID & 0xFFFF;

async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		await idsComeFromTheLocalHeader();
		await emptyType2DoesNotShadowNewUnix();
		await localIdsDoNotOverwriteCentralOnes();
	} finally {
		await zip.terminateWorkers();
	}
}

// The layout Info-ZIP actually produces: ids in the local header, nothing in the central directory.
async function idsComeFromTheLocalHeader() {
	const data = await write({ localExtraField: type2Field(UID, GID) });
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([data])));
	const [entry] = await reader.getEntries();
	if (entry.uid !== undefined || entry.gid !== undefined) {
		throw new Error("expected no ids from the central directory, got " + entry.uid + "/" + entry.gid);
	}
	await entry.getData(new zip.TextWriter());
	await reader.close();
	if (entry.uid != UID || entry.gid != GID) {
		throw new Error("expected " + UID + "/" + GID + " from the local header, got " + entry.uid + "/" + entry.gid);
	}
	const fs = new zip.ZipFS();
	await fs.importUint8Array(data);
	const exportedEntry = await readEntry(await fs.exportUint8Array());
	if (exportedEntry.uid != UID || exportedEntry.gid != GID) {
		throw new Error("ids lost when re-exporting, got " + exportedEntry.uid + "/" + exportedEntry.gid);
	}
}

async function emptyType2DoesNotShadowNewUnix() {
	const data = await write({ uid: UID, gid: GID, unixExtraFieldType: "infozip", extraField: new Map([[0x7855, new Uint8Array()]]) });
	const entry = await readEntry(data);
	if (!entry.extraFieldUnix || !entry.extraFieldInfoZip) {
		throw new Error("expected both Unix extra fields to be reported");
	}
	if (entry.uid != UID || entry.gid != GID) {
		throw new Error("expected the 0x7875 ids, got " + entry.uid + "/" + entry.gid);
	}
}

// 0x7855 holds 16-bit ids, so an id that does not fit comes back truncated. The central directory value
// wins whenever it has one.
async function localIdsDoNotOverwriteCentralOnes() {
	const data = await write({
		uid: LARGE_UID,
		gid: GID,
		unixExtraFieldType: "infozip",
		localExtraField: type2Field(TRUNCATED_UID, GID)
	});
	const reader = new zip.ZipReader(new zip.BlobReader(new Blob([data])));
	const [entry] = await reader.getEntries();
	await entry.getData(new zip.TextWriter());
	await reader.close();
	if (entry.uid != LARGE_UID) {
		throw new Error("expected the central directory uid " + LARGE_UID + ", got " + entry.uid);
	}
	if (entry.localDirectory.uid != TRUNCATED_UID) {
		throw new Error("expected the local header to still report " + TRUNCATED_UID + ", got " + entry.localDirectory.uid);
	}
}

function type2Field(uid, gid) {
	const data = new Uint8Array(4);
	const view = new DataView(data.buffer);
	view.setUint16(0, uid, true);
	view.setUint16(2, gid, true);
	return new Map([[0x7855, data]]);
}

async function write(options) {
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("file.txt", new zip.TextReader(CONTENT), options);
	return zipWriter.close();
}

async function readEntry(data) {
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	const [entry] = await reader.getEntries();
	await reader.close();
	return entry;
}
