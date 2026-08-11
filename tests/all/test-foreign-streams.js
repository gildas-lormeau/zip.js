/* global Blob, WritableStream, TextDecoder */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128 });
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
	await zipWriter.add(FILENAME, foreignReadable(new Blob([TEXT_CONTENT]).stream()));
	await zipWriter.add("copy-" + FILENAME, { readable: foreignReadable(new Blob([TEXT_CONTENT]).stream()) });
	const zipBlob = await zipWriter.close();
	const zipReader = new zip.ZipReader(foreignReadable(zipBlob.stream()));
	const entries = await zipReader.getEntries();
	const chunks = [];
	await entries[0].getData(foreignWritable(chunks));
	const text = new TextDecoder().decode(concat(chunks));
	const copyText = new TextDecoder().decode(await entries[1].getData(new zip.Uint8ArrayWriter()));
	await zipReader.close();
	await zip.terminateWorkers();
	if (TEXT_CONTENT != text || TEXT_CONTENT != copyText) {
		throw new Error();
	}
}

function foreignReadable(readable) {
	return {
		getReader: () => readable.getReader()
	};
}

function foreignWritable(chunks) {
	const writable = new WritableStream({
		write(chunk) {
			chunks.push(chunk);
		}
	});
	return {
		getWriter: () => writable.getWriter()
	};
}

function concat(chunks) {
	const result = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}
