import * as zip from "../../index.js";

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
				const blobWriter = new zip.BlobWriter("application/zip");
				const zipWriter = new zip.ZipWriter(blobWriter);
				const options = { compressionMethod: 0, uid: c.uid, gid: c.uid, unixExtraFieldType: type };
				if (type === "unix") options.unixMode = 0o100755;
				await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), options);
				await zipWriter.close();
				const dataBlob = await blobWriter.getData();
				const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
				const entries = await zipReader.getEntries();
				if (!entries || entries.length !== 1) throw new Error(`${c.name}:${type} expected 1 entry`);
				const entry = entries[0];
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