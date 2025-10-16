import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const CASES = [
		{ name: "infozip", options: { compressionMethod: 0, unixMode: 0o100644, uid: 1000, gid: 1000, unixExtraFieldType: "infozip" } },
		{ name: "unix", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix" } }
	];

	try {
		for (const c of CASES) {
			const blobWriter = new zip.BlobWriter("application/zip");
			const zipWriter = new zip.ZipWriter(blobWriter);
			await zipWriter.add("hello.txt", new zip.Uint8ArrayReader(new Uint8Array([0x48, 0x69])), c.options);
			await zipWriter.close();
			const dataBlob = await blobWriter.getData();
			const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
			const entries = await zipReader.getEntries();
			if (!entries || entries.length !== 1) {
				await zipReader.close();
				throw new Error(`case ${c.name}: expected 1 entry`);
			}
			const entry = entries[0];
			if (c.name === "infozip") {
				if (!entry.extraFieldInfoZip && !entry.extraField.has(zip.EXTRAFIELD_TYPE_INFOZIP)) {
					await zipReader.close();
					throw new Error(`case ${c.name}: expected extraFieldInfoZip alias or map entry`);
				}
			} else if (c.name === "unix") {
				if (!entry.extraFieldUnix && !entry.extraField.has(zip.EXTRAFIELD_TYPE_UNIX)) {
					await zipReader.close();
					throw new Error(`case ${c.name}: expected extraFieldUnix alias or map entry`);
				}
			}
			if (entry.uid !== 1000 || entry.gid !== 1000) {
				await zipReader.close();
				throw new Error(`case ${c.name}: uid/gid mismatch (from entry)`);
			}
			if ((entry.unixMode & 0xFFFF) !== (c.options.unixMode & 0xFFFF)) {
				await zipReader.close();
				throw new Error(`case ${c.name}: mode mismatch (from entry)`);
			}
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}