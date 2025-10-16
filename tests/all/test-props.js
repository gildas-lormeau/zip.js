import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const CASES = [
		{ name: "no-unix", options: { compressionMethod: 0 } },
		{ name: "mode-only", options: { compressionMethod: 0, unixMode: 0o100755 } },
		{ name: "infozip", options: { compressionMethod: 0, unixMode: 0o100644, uid: 1000, gid: 1000, unixExtraFieldType: "infozip" } },
		{ name: "unix", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix" } },
		{ name: "msdos-compatible", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix", msDosCompatible: true } }
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
			// basic checks
			if (entry.filename !== "hello.txt") {
				await zipReader.close();
				throw new Error(`case ${c.name}: filename mismatch`);
			}
			// versionMadeBy: if unix metadata present, high byte should be 3 (Unix)
			const hasUnixMeta = c.options.uid !== undefined || c.options.gid !== undefined || c.options.unixMode !== undefined || c.options.unixExtraFieldType !== undefined;
			if (hasUnixMeta) {
				if (((entry.versionMadeBy >> 8) & 0xff) !== 3) {
					await zipReader.close();
					throw new Error(`case ${c.name}: expected versionMadeBy high byte == 3`);
				}
			}
			// externalFileAttributes upper 16 bits should reflect mode when provided
			if (typeof c.options.unixMode === "number") {
				const upper = (entry.externalFileAttributes >> 16) & 0xFFFF;
				if ((upper & 0xFFFF) !== (c.options.unixMode & 0xFFFF)) {
					await zipReader.close();
					throw new Error(`case ${c.name}: externalFileAttributes mode mismatch`);
				}
			}
			// extra fields: when infozip/unix requested, ZipReader sets directory.extraField and directory.rawExtraFieldUnix
			if (c.options.unixExtraFieldType === "infozip") {
				// ensure extra-field objects exist
				if (!entry.extraFieldInfoZip) {
					await zipReader.close();
					throw new Error(`case ${c.name}: expected entry.extraFieldInfoZip to be present`);
				}
				// prefer parsed fields on the entry when available
				if (entry.uid !== 1000 || entry.gid !== 1000) {
					await zipReader.close();
					throw new Error(`case ${c.name}: uid/gid mismatch (from entry)`);
				}
			}
			if (c.options.unixExtraFieldType === "unix") {
				// ensure extra-field objects exist
				if (!entry.extraFieldUnix) {
					await zipReader.close();
					throw new Error(`case ${c.name}: expected entry.extraFieldUnix to be present`);
				}
				if (!entry.extraFieldUnix && !entry.extraField.has(zip.EXTRAFIELD_TYPE_UNIX)) {
					await zipReader.close();
					throw new Error(`case ${c.name}: expected extraFieldUnix alias or map entry`);
				}
				// prefer parsed fields on the entry when available
				if (entry.uid !== 1000 || entry.gid !== 1000) {
					await zipReader.close();
					throw new Error(`case ${c.name}: uid/gid mismatch (from entry)`);
				}
				if (typeof c.options.unixMode === "number") {
					if ((entry.unixMode & 0xFFFF) !== (c.options.unixMode & 0xFFFF)) {
						await zipReader.close();
						throw new Error(`case ${c.name}: mode mismatch (from entry)`);
					}
				}
			}
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}