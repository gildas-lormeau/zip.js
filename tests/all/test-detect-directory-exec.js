import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const CASES = [
		{
			name: "option-directory",
			options: { compressionMethod: 0, directory: true },
			expect: { directory: true, executable: true }
		},
		{
			name: "filename-slash",
			addArgs: ["dir/", null, { compressionMethod: 0 }],
			expect: { directory: true, executable: true }
		},
		{
			name: "msdos-raw-dir",
			options: { compressionMethod: 0, msdosAttributesRaw: 0x10 },
			expect: { directory: true, executable: false }
		},
		{
			name: "external-upper-dir",
			// set upper 16-bit to unix dir type (0o040000) -> shift into upper word
			options: { compressionMethod: 0, versionMadeBy: (3 << 8), externalFileAttributes: (0o040000 & 0xFFFF) << 16 },
			expect: { directory: true, executable: false }
		},
		{
			name: "mode-executable",
			options: { compressionMethod: 0, unixMode: 0o100755, unixExtraFieldType: "unix" },
			expect: { directory: false, executable: true }
		},
		{
			name: "external-exec-only",
			options: { compressionMethod: 0, versionMadeBy: (3 << 8), externalFileAttributes: (0o111 & 0xFFFF) << 16 },
			expect: { directory: false, executable: true }
		},
		{
			name: "mode-non-exec",
			options: { compressionMethod: 0, unixMode: 0o100644, unixExtraFieldType: "unix" },
			expect: { directory: false, executable: false }
		}
	];

	try {
		for (const c of CASES) {
			const blobWriter = new zip.BlobWriter("application/zip");
			const zipWriter = new zip.ZipWriter(blobWriter);
			if (c.addArgs) {
				await zipWriter.add(...c.addArgs);
			} else {
				await zipWriter.add("testfile", new zip.Uint8ArrayReader(new Uint8Array([0x41])), c.options);
			}
			await zipWriter.close();
			const dataBlob = await blobWriter.getData();
			const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
			const entries = await zipReader.getEntries();
			if (!entries || entries.length !== 1) throw new Error(`${c.name}: expected 1 entry`);
			const entry = entries[0];
			if (entry.directory !== c.expect.directory) {
				await zipReader.close();
				throw new Error(`${c.name}: directory mismatch (got ${entry.directory}, expected ${c.expect.directory})`);
			}
			if (entry.executable !== c.expect.executable) {
				await zipReader.close();
				throw new Error(`${c.name}: executable mismatch (got ${entry.executable}, expected ${c.expect.executable})`);
			}
			// msdos raw check for that case
			if (c.name === "msdos-raw-dir" && entry.msdosAttributesRaw !== 0x10) {
				throw new Error(`${c.name}: msdosAttributesRaw mismatch`);
			}
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}