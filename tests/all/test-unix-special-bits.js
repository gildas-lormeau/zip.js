import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	try {
		// Test combinations: each flag individually and all together
		const cases = [
			{ name: "none", options: { compressionMethod: 0 } },
			{ name: "setuid", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix", setuid: true } },
			{ name: "setgid", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix", setgid: true } },
			{ name: "sticky", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix", sticky: true } },
			{ name: "all", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "unix", setuid: true, setgid: true, sticky: true } },
			// Info-ZIP variant: Info-ZIP extra field (0x7875) with special bits set — mode will be stored in external attributes
			{ name: "all-infozip", options: { compressionMethod: 0, unixMode: 0o100755, uid: 1000, gid: 1000, unixExtraFieldType: "infozip", setuid: true, setgid: true, sticky: true } }
		];

		for (const c of cases) {
			const blobWriter = new zip.BlobWriter("application/zip");
			const zipWriter = new zip.ZipWriter(blobWriter);
			await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), c.options);
			await zipWriter.close();
			const dataBlob = await blobWriter.getData();
			const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
			const entries = await zipReader.getEntries();
			if (!entries || entries.length !== 1) throw new Error(`${c.name} expected 1 entry`);
			const entry = entries[0];
			// default case: none should be false
			if (c.name === "none") {
				if (entry.setuid || entry.setgid || entry.sticky) throw new Error("none: expected no special bits set");
			} else {
				if (c.options.setuid && !entry.setuid) throw new Error(`${c.name}: expected setuid`);
				if (c.options.setgid && !entry.setgid) throw new Error(`${c.name}: expected setgid`);
				if (c.options.sticky && !entry.sticky) throw new Error(`${c.name}: expected sticky`);
				// ensure mode in external attributes matches (upper 16 bits), including special bits when requested
				const upper = (entry.externalFileAttributes >> 16) & 0xFFFF;
				let expected = c.options.unixMode & 0xFFFF;
				if (c.options.setuid) expected |= 0o4000;
				if (c.options.setgid) expected |= 0o2000;
				if (c.options.sticky) expected |= 0o1000;
				if ((upper & 0xFFFF) !== expected) throw new Error(`${c.name}: externalFileAttributes mode mismatch (got ${upper.toString(8)}, expected ${expected.toString(8)})`);
			}
			await zipReader.close();
		}
	} finally {
		await zip.terminateWorkers();
	}
}