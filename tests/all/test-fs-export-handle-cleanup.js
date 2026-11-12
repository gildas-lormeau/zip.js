/* global WritableStream */

// Locks the cleanup of `exportFileSystemHandle` when reading an entry fails before its data is
// piped, e.g. on a wrong password: the destination opened for the entry must be aborted and
// unlocked rather than left open with its writer held by the progress wrapper.

import * as zip from "../zip-lib.js";

const PASSWORD = "read-password";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	try {
		const fs = new zip.ZipFS();
		fs.addText(FILENAME, "Lorem ipsum dolor sit amet");
		const encryptedBlob = await fs.exportBlob({ password: PASSWORD });
		const importedFs = new zip.ZipFS();
		await importedFs.importBlob(encryptedBlob);
		const target = createMockWriteDirectory();
		let caught;
		try {
			await importedFs.exportFileSystemHandle(target.handle, { readerOptions: { password: "wrong" } });
		} catch (error) {
			caught = error;
		}
		if (!caught || caught.message != zip.ERR_INVALID_PASSWORD) {
			throw new Error("expected an invalid password error, got " + (caught && caught.message));
		}
		if (!target.writable) {
			throw new Error("the destination was not opened");
		}
		if (target.writable.locked) {
			throw new Error("the destination is still locked");
		}
		if (target.calls.join() != "abort") {
			throw new Error("unexpected destination calls: " + (target.calls.join() || "none"));
		}
	} finally {
		await zip.terminateWorkers();
	}
}

function createMockWriteDirectory() {
	const target = { calls: [], writable: null };
	target.handle = {
		async getFileHandle() {
			return {
				async createWritable() {
					target.writable = new WritableStream({
						write() {
							target.calls.push("write");
						},
						close() {
							target.calls.push("close");
						},
						abort() {
							target.calls.push("abort");
						}
					});
					return target.writable;
				}
			};
		}
	};
	return target;
}
