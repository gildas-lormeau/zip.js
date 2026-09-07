import * as zip from "../zip-lib.js";

export { test };

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ".repeat(64);

// terminateWorkers() is declared to return a promise resolved once the pool is empty. The entry
// points wrapping it must keep that contract, otherwise awaiting it resolves on the same tick and
// the caller cannot know when the workers are gone.
async function test() {
	zip.configure({ useWebWorkers: true });
	const result = zip.terminateWorkers();
	assert(result !== undefined && typeof result.then == "function",
		"terminateWorkers() must return a promise, got " + typeof result);
	await result;
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("lorem.txt", new zip.TextReader(TEXT_CONTENT));
	const data = await zipWriter.close();
	await zip.terminateWorkers();
	const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(data));
	try {
		const [entry] = await zipReader.getEntries();
		const content = await entry.getData(new zip.TextWriter());
		assert(content == TEXT_CONTENT, "the data must stay readable after the workers are terminated");
	} finally {
		await zipReader.close();
		await zip.terminateWorkers();
	}
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}
