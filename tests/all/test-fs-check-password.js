/* global URL */

import * as zip from "../zip-lib.js";

const url = new URL("./../data/lorem.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	let zipFs = new zip.ZipFS();
	const directory = zipFs.addDirectory("import");
	await directory.importHttpContent(url, { preventHeadRequest: true });
	let result;
	if (!zipFs.isPasswordProtected()) {
		const blob = await zipFs.exportBlob({ password: "password" });
		zipFs = new zip.ZipFS();
		await zipFs.importBlob(blob);
		if (zipFs.isPasswordProtected()) {
			// checkPassword must not mutate the caller-supplied options object
			const options = {};
			result = await zipFs.checkPassword("notagoodpassword", options);
			if (Object.keys(options).length) {
				throw new Error("checkPassword mutated the options object");
			}
			if (!result) {
				result = await zipFs.checkPassword("password", options);
				if (Object.keys(options).length) {
					throw new Error("checkPassword mutated the options object");
				}
			} else {
				throw new Error();
			}
		} else {
			throw new Error();
		}
	} else {
		throw new Error();
	}
	await zip.terminateWorkers();
	if (!result) {
		throw new Error();
	}
}