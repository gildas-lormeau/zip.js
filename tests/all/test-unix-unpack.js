import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const cases = [
		{ name: "uid1", uid: 0x7f },
		{ name: "uid2", uid: 0x1234 },
		{ name: "uid3", uid: 0x123456 },
		{ name: "uid4", uid: 0x12345678 }
	];

	try {
		for (const c of cases) {
			for (const type of ["infozip", "unix"]) {
				const options = { compressionMethod: 0, uid: c.uid, gid: c.uid, unixExtraFieldType: type };
				if (type === "unix") options.unixMode = 0o100755;
				// the Info-ZIP Unix "Ux" field (0x7855) stores fixed 2-byte ids; ids larger than
				// 16 bits must be rejected (the "infozip" / 0x7875 field is required for those)
				if (type === "unix" && c.uid > 0xFFFF) {
					const blobWriter = new zip.BlobWriter("application/zip");
					const zipWriter = new zip.ZipWriter(blobWriter);
					let rejected = false;
					try {
						await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), options);
					} catch {
						rejected = true;
					}
					await zipWriter.close();
					if (!rejected) throw new Error(`${c.name}:${type} expected a >16-bit id to be rejected`);
					continue;
				}
				const blobWriter = new zip.BlobWriter("application/zip");
				const zipWriter = new zip.ZipWriter(blobWriter);
				await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), options);
				await zipWriter.close();
				const dataBlob = await blobWriter.getData();
				const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
				const entries = await zipReader.getEntries();
				if (!entries || entries.length !== 1) throw new Error(`${c.name}:${type} expected 1 entry`);
				const entry = entries[0];
				if (type === "unix") {
					// the 0x7855 ids live in the local file header, so they are known once the data is read
					await entry.getData(new zip.Uint8ArrayWriter());
				}
				if (entry.uid !== c.uid || entry.gid !== c.uid) {
					throw new Error(`${c.name}:${type} uid/gid mismatch: got ${entry.uid}/${entry.gid}`);
				}
				if (type === "unix") {
					if ((entry.unixMode & 0xFFFF) !== (0o100755 & 0xFFFF)) {
						throw new Error(`${c.name}:${type} mode mismatch: got ${entry.unixMode}`);
					}
				}
				await zipReader.close();
			}
		}
	} finally {
		await zip.terminateWorkers();
	}
}