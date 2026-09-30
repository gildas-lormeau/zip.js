import * as zip from "../zip-lib.js";

const END_OF_CENTRAL_DIR_SIGNATURE = 0x06054b50;
const MAX_32_BITS = 0xffffffff;
const MAX_16_BITS = 0xffff;

export { test };

// An end of central directory record whose offset, size or disk field holds the Zip64 sentinel promises a
// Zip64 locator in front of it. Without one the archive cannot be read, and must be rejected with a clear
// error rather than opened with shifted entries and a misleading warning.
async function test() {
	zip.configure({ useWebWorkers: false });
	try {
		const archive = await buildArchive();
		const endOfDirectoryOffset = findEndOfCentralDirectory(archive);
		const cases = [
			["offset", endOfDirectoryOffset + 16, 4, MAX_32_BITS],
			["size", endOfDirectoryOffset + 12, 4, MAX_32_BITS],
			["disk number", endOfDirectoryOffset + 6, 2, MAX_16_BITS]
		];
		for (const [label, offset, width, sentinel] of cases) {
			const data = archive.slice();
			const view = new DataView(data.buffer);
			if (width == 4) {
				view.setUint32(offset, sentinel, true);
			} else {
				view.setUint16(offset, sentinel, true);
			}
			for (const strictness of ["strict", "balanced", "tolerant"]) {
				const error = await getEntriesError(data, strictness);
				if (!error || error.message != zip.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND) {
					throw new Error("a Zip64 sentinel in the " + label + " field without a locator must be rejected under " +
						strictness + ", got " + (error ? error.message : "no error"));
				}
			}
		}
		const control = new zip.ZipReader(new zip.Uint8ArrayReader(archive));
		if ((await control.getEntries()).length != 2) {
			throw new Error("the archive must be readable before the sentinel is written");
		}
		await control.close();
	} finally {
		await zip.terminateWorkers();
	}
}

async function getEntriesError(data, strictness) {
	const reader = new zip.ZipReader(new zip.Uint8ArrayReader(data), { strictness });
	try {
		await reader.getEntries();
	} catch (error) {
		return error;
	} finally {
		await reader.close();
	}
}

async function buildArchive() {
	const writer = new zip.ZipWriter(new zip.Uint8ArrayWriter(), { level: 0 });
	await writer.add("aa.txt", new zip.TextReader("first content"));
	await writer.add("bb.txt", new zip.TextReader("second content"));
	return writer.close();
}

function findEndOfCentralDirectory(data) {
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	for (let offset = data.length - 22; offset >= 0; offset--) {
		if (view.getUint32(offset, true) == END_OF_CENTRAL_DIR_SIGNATURE) {
			return offset;
		}
	}
	throw new Error("end of central directory record not found");
}
