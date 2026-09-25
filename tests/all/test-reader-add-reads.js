// A Reader passed to ZipWriter#add must only be read for its data. Its `readable` getter builds a new
// stream on each access and such a stream pulls its first chunk as soon as it exists, so evaluating the
// getter for a truthiness test costs a discarded read of a whole chunk, a range request for a remote
// reader. The reads are checked by their bounds and their total so the test holds for any chunk size.
import * as zip from "../zip-lib.js";

const CONTENT_LENGTH = 1024;

export { test };

async function test() {
	zip.configure({ useWebWorkers: false });
	const calls = [];
	class CountingReader extends zip.Reader {
		init() {
			super.init();
			this.size = CONTENT_LENGTH;
		}
		readUint8Array(index, length) {
			calls.push([index, length]);
			return new Uint8Array(Math.min(length, CONTENT_LENGTH - index)).fill(65);
		}
	}
	const zipWriter = new zip.ZipWriter(new zip.Uint8ArrayWriter());
	await zipWriter.add("data.bin", new CountingReader(), { level: 0 });
	await zipWriter.close();
	const outOfBounds = calls.some(([index, length]) => index + length > CONTENT_LENGTH);
	const totalLength = calls.reduce((total, [, length]) => total + length, 0);
	if (outOfBounds || totalLength != CONTENT_LENGTH) {
		throw new Error("unexpected reads during add(): " + JSON.stringify(calls));
	}
}
