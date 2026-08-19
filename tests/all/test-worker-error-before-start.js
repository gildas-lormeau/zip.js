import * as zip from "../zip-lib.js";

// the error event of a worker can fire before the codec pool calls run() on the interface it just built,
// which leaves the pool holding an interface whose worker has already been set to null. the pool used to
// throw "Cannot read properties of null (reading 'postMessage')" there instead of falling back to the
// main scope. the worker below reproduces that ordering deterministically: it reports its error in a
// microtask, i.e. in the gap between the creation of the interface and the first message sent to it.

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const FILENAME = "lorem.txt";
const ERROR_MESSAGE = "simulated worker load error";

export { test };

async function test() {
	zip.configure({ useWebWorkers: true, createWorker: createFailingWorker });
	try {
		const text = await roundTrip();
		if (text != TEXT_CONTENT) {
			throw new Error("expected the content to survive the fallback to the main scope");
		}
	} finally {
		await zip.terminateWorkers();
	}
}

function createFailingWorker() {
	const listeners = new Map();
	Promise.resolve().then(() => {
		const listener = listeners.get("error");
		if (listener) {
			listener({ message: ERROR_MESSAGE, preventDefault: () => undefined });
		}
	});
	return {
		addEventListener: (type, listener) => listeners.set(type, listener),
		removeEventListener: type => listeners.delete(type),
		postMessage: () => undefined,
		terminate: () => undefined
	};
}

async function roundTrip() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const text = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();
	return text;
}
