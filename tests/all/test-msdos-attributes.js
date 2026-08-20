import * as zip from "../zip-lib.js";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: false });

	const cases = [
		{ name: "numeric-all", msdosAttributesRaw: 0x33 }, // readOnly + archive + hidden (0x01 + 0x20 + 0x02)
		{ name: "numeric-none", msdosAttributesRaw: 0x00 },
		{ name: "numeric-dir", msdosAttributesRaw: 0x10 }, // directory
		{ name: "numeric-system", msdosAttributesRaw: 0x04 }, // system
		{ name: "object-all", msdosAttributes: { readOnly: true, hidden: true, system: true, directory: false, archive: true } },
		{ name: "object-none", msdosAttributes: { readOnly: false, hidden: false, system: false, directory: false, archive: false } },
		{ name: "object-dir", msdosAttributes: { readOnly: false, hidden: false, system: false, directory: true, archive: false } }
	];

	try {
		for (const c of cases) {
			const blobWriter = new zip.BlobWriter("application/zip");
			const zipWriter = new zip.ZipWriter(blobWriter);
			const options = { compressionMethod: 0 };
			options.msdosAttributesRaw = c.msdosAttributesRaw;
			options.msdosAttributes = c.msdosAttributes;
			await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), options);
			await zipWriter.close();
			const dataBlob = await blobWriter.getData();
			const zipReader = new zip.ZipReader(new zip.BlobReader(dataBlob));
			const entries = await zipReader.getEntries();
			if (!entries || entries.length !== 1) throw new Error(`${c.name} expected 1 entry`);
			const entry = entries[0];
			if (c.msdosAttributesRaw !== undefined) {
				if (entry.msdosAttributesRaw !== c.msdosAttributesRaw) throw new Error(`${c.name} msdosAttributesRaw mismatch: got ${entry.msdosAttributesRaw}`);
				const flags = {
					readOnly: Boolean(c.msdosAttributesRaw & 0x01),
					hidden: Boolean(c.msdosAttributesRaw & 0x02),
					system: Boolean(c.msdosAttributesRaw & 0x04),
					directory: Boolean(c.msdosAttributesRaw & 0x10),
					archive: Boolean(c.msdosAttributesRaw & 0x20)
				};
				Object.keys(flags).forEach(k => {
					if (entry.msdosAttributes[k] !== flags[k]) throw new Error(`${c.name} ${k} mismatch`);
				});
			} else {
				Object.keys(c.msdosAttributes).forEach(k => {
					if (entry.msdosAttributes[k] !== Boolean(c.msdosAttributes[k])) throw new Error(`${c.name} ${k} mismatch`);
				});
			}
			await zipReader.close();
		}
		await testPlatformSelection();
	} finally {
		await zip.terminateWorkers();
	}
}

// Providing either MS-DOS attribute option selects the MS-DOS platform for the entry, which drops the Unix
// mode and the Unix byte of versionMadeBy, and overrides an explicit msDosCompatible: false. Any Unix
// metadata option takes precedence and keeps them, with the MS-DOS attributes in the low byte. An explicit
// externalFileAttributes is preserved as well. Documented on ZipWriterConstructorOptions#msdosAttributesRaw.
// executable counts as Unix metadata like unixMode does, since it means a mode of 0o755: it used to be the
// only one taking the opposite branch, so the executable bit was dropped without a word.
async function testPlatformSelection() {
	const cases = [
		{ name: "omitted", options: {}, platform: 3, externalFileAttributes: 0x81a40000, unixMode: 0o100644 },
		{ name: "empty flags", options: { msdosAttributes: {} }, platform: 0, externalFileAttributes: 0x00000000 },
		{ name: "raw zero", options: { msdosAttributesRaw: 0 }, platform: 0, externalFileAttributes: 0x00000000 },
		{ name: "explicit msDosCompatible false", options: { msDosCompatible: false, msdosAttributes: { readOnly: true } }, platform: 0, externalFileAttributes: 0x00000001 },
		{ name: "unix mode wins", options: { unixMode: 0o600, msdosAttributes: { readOnly: true } }, platform: 3, externalFileAttributes: 0x81800001, unixMode: 0o100600 },
		{ name: "uid wins", options: { uid: 1000, msdosAttributes: { readOnly: true } }, platform: 3, externalFileAttributes: 0x81a40001, unixMode: 0o100644 },
		{ name: "external attributes preserved", options: { externalFileAttributes: 0x81a40000, msdosAttributes: { readOnly: true } }, platform: 0, externalFileAttributes: 0x81a40001, unixMode: 0o100644 },
		{ name: "executable", options: { executable: true }, platform: 3, externalFileAttributes: 0x81ed0000, unixMode: 0o100755 },
		{ name: "executable wins over flags", options: { executable: true, msdosAttributes: { readOnly: true } }, platform: 3, externalFileAttributes: 0x81ed0001, unixMode: 0o100755 },
		{ name: "executable wins over raw", options: { executable: true, msdosAttributesRaw: 1 }, platform: 3, externalFileAttributes: 0x81ed0001, unixMode: 0o100755 },
		{ name: "executable wins over msDosCompatible", options: { executable: true, msDosCompatible: true }, platform: 3, externalFileAttributes: 0x81ed0000, unixMode: 0o100755 },
		{ name: "executable false changes nothing", options: { executable: false, msdosAttributes: { readOnly: true } }, platform: 0, externalFileAttributes: 0x00000001 }
	];
	for (const testCase of cases) {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter);
		await zipWriter.add("file.txt", new zip.Uint8ArrayReader(new Uint8Array([0x41])), testCase.options);
		await zipWriter.close();
		const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
		const [entry] = await zipReader.getEntries();
		await zipReader.close();
		if (entry.versionMadeBy >> 8 !== testCase.platform) {
			throw new Error(`${testCase.name} expected platform ${testCase.platform} got ${entry.versionMadeBy >> 8}`);
		}
		if (entry.externalFileAttributes !== testCase.externalFileAttributes) {
			throw new Error(`${testCase.name} expected externalFileAttributes 0x${testCase.externalFileAttributes.toString(16)} got 0x${entry.externalFileAttributes.toString(16)}`);
		}
		if (entry.unixMode !== testCase.unixMode) {
			throw new Error(`${testCase.name} expected unixMode ${testCase.unixMode} got ${entry.unixMode}`);
		}
	}
}
