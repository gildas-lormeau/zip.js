import * as zip from "../../index.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	try {
		const TYPES = ["unix", "infozip"];
		const cases = [
			{ name: "setuid", flag: "setuid" },
			{ name: "setgid", flag: "setgid" },
			{ name: "sticky", flag: "sticky" },
			{ name: "all", flags: ["setuid", "setgid", "sticky"] }
		];

		for (const type of TYPES) {
			for (const c of cases) {
				const options = { compressionMethod: 0, uid: 1000, gid: 1000, unixExtraFieldType: type };
				if (c.flag) options[c.flag] = true;
				if (c.flags) c.flags.forEach(f => options[f] = true);
				const blobWriter = new zip.BlobWriter("application/zip");
				const zipWriter = new zip.ZipWriter(blobWriter);
				await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), options);
				await zipWriter.close();
				const dataBlob = await blobWriter.getData();
				const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
				const entries = await zipReader.getEntries();
				if (!entries || entries.length !== 1) throw new Error(`${type}:${c.name} expected 1 entry`);
				const entry = entries[0];
				if (c.flag && !entry[c.flag]) throw new Error(`${type}:${c.name} expected ${c.flag}`);
				if (c.flags) {
					for (const f of c.flags) {
						if (!entry[f]) throw new Error(`${type}:${c.name} expected ${f}`);
					}
				}
				// check upper 16 bits include special bits
				const upper = (entry.externalFileAttributes >> 16) & 0xFFFF;
				let expected = 0;
				if (options.setuid) expected |= 0o4000;
				if (options.setgid) expected |= 0o2000;
				if (options.sticky) expected |= 0o1000;
				if (expected && ((upper & expected) !== expected)) throw new Error(`${type}:${c.name} external upper missing special bits`);
				await zipReader.close();

				// Now verify MS-DOS compatible mode prevents special bits
				// For MS-DOS compatible test we must NOT provide unix metadata (uid/gid/unixExtraFieldType)
				// otherwise writer will flip msDosCompatible back to false. Only set msDosCompatible and flags.
				const optionsMsDos = { msDosCompatible: true, compressionMethod: 0 };
				if (c.flag) optionsMsDos[c.flag] = true;
				if (c.flags) c.flags.forEach(f => optionsMsDos[f] = true);
				const blobWriter2 = new zip.BlobWriter("application/zip");
				const zipWriter2 = new zip.ZipWriter(blobWriter2);
				await zipWriter2.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), optionsMsDos);
				await zipWriter2.close();
				const dataBlob2 = await blobWriter2.getData();
				const zipReader2 = new zip.ZipReader(new zip.BlobReader(dataBlob2));
				const entries2 = await zipReader2.getEntries();
				if (!entries2 || entries2.length !== 1) throw new Error(`${type}:${c.name}:msdos expected 1 entry`);
				const entry2 = entries2[0];
				// msdos-compatible entries should not expose unix special bits
				if (entry2.setuid || entry2.setgid || entry2.sticky) throw new Error(`${type}:${c.name}:msdos special bits should not be set`);
				await zipReader2.close();
			}
		}
	} finally {
		await zip.terminateWorkers();
	}
}