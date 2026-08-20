import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, héllo wörld, consectetuer adipiscing elit.";
const FILENAME = "lorem.txt";
const LATIN1_ENCODING = "iso-8859-1";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const latin1Content = Uint8Array.from(TEXT_CONTENT, character => character.charCodeAt(0));
	const zipWriter = new zip.ZipWriter(new zip.BlobWriter());
	await zipWriter.add(FILENAME, new zip.Uint8ArrayReader(latin1Content));
	const blob = await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
	const [entry] = await zipReader.getEntries();
	const decoded = await entry.getData(new zip.TextWriter(LATIN1_ENCODING));
	const decodedAsUtf8 = await entry.getData(new zip.TextWriter());
	await zipReader.close();
	await zip.terminateWorkers();
	if (decoded != TEXT_CONTENT) {
		throw new Error(`expected ${JSON.stringify(TEXT_CONTENT)}, got ${JSON.stringify(decoded)}`);
	}
	if (decodedAsUtf8 == TEXT_CONTENT) {
		throw new Error("the utf-8 reading must differ, otherwise the encoding is never exercised");
	}
}
