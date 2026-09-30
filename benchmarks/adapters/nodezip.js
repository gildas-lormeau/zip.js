// Adapter for the ZIP API of node:zlib (ZipEntry, ZipBuffer, createZipArchive), added in Node.js
// 26.8.0 and experimental: using it prints one ExperimentalWarning on stderr, which the parent
// ignores. The API has no compression level option, so every entry is deflated at zlib's default,
// level 6, like the other libraries here. ZipEntry.create() runs the deflate on the libuv
// threadpool, so the parallel mode issues every create() at once, the same shape as concurrent
// add() in zip.js; only bench-backends.js uses it, on 8 entries, since thousands of deflates in
// flight are the pattern the zlib documentation warns against, and the API has no streaming path
// that could be parallelized: every created entry stays in memory until createZipArchive()
// serializes it. Reading goes through ZipBuffer, a zero-copy view over the archive, with the
// CRC-32 check off like the other decompression rows.
import { ZipEntry, ZipBuffer, createZipArchive } from "node:zlib";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";

export const name = "node:zlib";
export const supports = { compress: true, decompress: true, disk: true };

export async function compress(files, { concurrency = "sequential" } = {}) {
	const entries = [];
	const fileEntries = Object.entries(files);
	if (concurrency === "parallel") {
		entries.push(...await Promise.all(fileEntries.map(([entryName, data]) => ZipEntry.create(entryName, data))));
	} else {
		for (const [entryName, data] of fileEntries) {
			entries.push(await ZipEntry.create(entryName, data));
		}
	}
	let outputSize = 0;
	for await (const chunk of createZipArchive(entries)) {
		outputSize += chunk.length;
	}
	return { outputSize };
}

export async function decompress(zipped) {
	const zip = new ZipBuffer(zipped);
	let total = 0;
	for (const [, entry] of zip) {
		if (entry.isFile) {
			const data = await entry.content({ verify: false });
			total += data.length;
		}
	}
	return { outputSize: total };
}

// Disk-to-disk: a streaming entry deflates the file as the archive is serialized, so neither the
// input nor the output is resident.
export async function compressDisk(inputPath, outputPath) {
	const entry = ZipEntry.createStream("data.bin", createReadStream(inputPath));
	await pipeline(createZipArchive([entry]), createWriteStream(outputPath));
	return { outputSize: statSync(outputPath).size };
}
