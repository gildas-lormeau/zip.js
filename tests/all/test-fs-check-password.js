/* global URL */

import * as zip from "../../index.js";

const url = new URL("./../data/lorem.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	let zipFs = new zip.fs.FS();
	let directory = zipFs.addDirectory("import");
	await directory.importHttpContent(url, { preventHeadRequest: true });
	let result;
	if (!zipFs.isPasswordProtected()) {
		const blob = await zipFs.exportBlob({ password: "password" });
		zipFs = new zip.fs.FS();
		await zipFs.importBlob(blob);
		if (zipFs.isPasswordProtected()) {
			result = await zipFs.checkPassword("notagoodpassword");
			if (!result) {
				result = await zipFs.checkPassword("password");
			} else {
				throw new Error();
			}
		} else {
			throw new Error();
		}
	} else {
		throw new Error();
	}
	zip.terminateWorkers();
	if (!result) {
		throw new Error();
	}
}