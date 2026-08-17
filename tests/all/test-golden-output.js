/* global crypto, TextEncoder, Blob */

import * as zip from "../zip-lib.js";

// deterministic archive: any change to this hash means the serialization format changed
const EXPECTED_SHA256 = "2d4204564f11117c930e9e5ac75a753d1facc3c19ac0ec62b2ef9786ba53c0ac";
const SEGMENT_SIZE = 1500;
const LAST_MOD_DATE = new Date(2020, 0, 1, 12, 0, 0);

export { test };

async function test() {
	zip.configure({ chunkSize: 1024, useWebWorkers: false });
	const writers = [];
	function* blobWriterGenerator() {
		while (true) {
			const writer = new zip.BlobWriter();
			writer.maxSize = SEGMENT_SIZE;
			writers.push(writer);
			yield writer;
		}
	}
	const zipWriter = new zip.ZipWriter(blobWriterGenerator(), { extendedTimestamp: false, lastModDate: LAST_MOD_DATE, level: 0 });
	await zipWriter.add("text.txt", new zip.TextReader("Lorem ipsum dolor sit amet"), { comment: "entry comment" });
	await zipWriter.add("zip64.bin", new zip.TextReader("z".repeat(5000)), { zip64: true });
	await zipWriter.add("directory/", null, { directory: true });
	await zipWriter.add("empty.txt", new zip.TextReader(""));
	await zipWriter.add("unix.bin", new zip.TextReader("unix attributes"), { uid: 1000, gid: 100, unixMode: 0o644, unixExtraFieldType: "infozip" });
	await zipWriter.add("msdos.bin", new zip.TextReader("msdos attributes"), { msDosCompatible: true, msdosAttributes: { readOnly: true } });
	await zipWriter.add("buffered.bin", new zip.TextReader("no data descriptor"), { dataDescriptor: false, bufferedWrite: true });
	await zipWriter.add("signature.bin", new zip.TextReader("data descriptor signature"), { dataDescriptorSignature: true });
	await zipWriter.close(new TextEncoder().encode("archive comment"));
	const segments = await Promise.all(writers.map(writer => writer.getData()));
	const archive = new Uint8Array(await new Blob(segments).arrayBuffer());
	const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", archive)), byte => byte.toString(16).padStart(2, "0")).join("");
	await zip.terminateWorkers();
	if (hash != EXPECTED_SHA256) {
		throw new Error("hash: " + hash + ", size: " + archive.length + ", segments: " + segments.length);
	}
}
