import * as zip from "../../index.js";

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
	} finally {
		await zip.terminateWorkers();
	}
}
