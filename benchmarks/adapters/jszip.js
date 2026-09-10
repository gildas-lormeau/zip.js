// Adapter for jszip. In-memory compression and decompression go through generateAsync and
// loadAsync. The disk-to-disk mode hands jszip a Node readable stream as the entry's content and
// pipes generateNodeStream({ streamFiles: true }) to the output file, jszip's streaming path: with
// streamFiles: false jszip buffers each compressed entry to write its sizes in the local header.
import JSZip from "jszip";
import { createReadStream, createWriteStream, statSync } from "node:fs";

export const name = "jszip";
export const supports = { compress: true, decompress: true, disk: true };

export async function compress(files, { level = 6 } = {}) {
	const zip = new JSZip();
	for (const [entryName, data] of Object.entries(files)) {
		zip.file(entryName, data);
	}
	const out = await zip.generateAsync({
		type: "uint8array",
		compression: "DEFLATE",
		compressionOptions: { level }
	});
	return { outputSize: out.length };
}

export async function decompress(zipped) {
	const zip = await JSZip.loadAsync(zipped);
	let total = 0;
	const names = Object.keys(zip.files);
	for (const entryName of names) {
		const file = zip.files[entryName];
		if (!file.dir) {
			const data = await file.async("uint8array");
			total += data.length;
		}
	}
	return { outputSize: total };
}

export async function compressDisk(inputPath, outputPath, { level = 6 } = {}) {
	const zip = new JSZip();
	zip.file("data.bin", createReadStream(inputPath));
	await new Promise((resolve, reject) => {
		zip.generateNodeStream({ type: "nodebuffer", streamFiles: true, compression: "DEFLATE", compressionOptions: { level } })
			.pipe(createWriteStream(outputPath))
			.on("finish", resolve)
			.on("error", reject);
	});
	return { outputSize: statSync(outputPath).size };
}
