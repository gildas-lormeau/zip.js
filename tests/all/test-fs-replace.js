/* global URL */

import * as zip from "../../index.js";

const NEW_TEXT_CONTENT = "This is not the same text";
const url = new URL("./../data/lorem.zip", import.meta.url).href;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	let zipFs = new zip.fs.FS();
	let directory = zipFs.addDirectory("import");
	await directory.importHttpContent(url, { preventHeadRequest: true });
	let firstEntry = directory.children[0];
	firstEntry.replaceText(NEW_TEXT_CONTENT);
	const blob = await zipFs.exportBlob();
	zipFs = new zip.fs.FS();
	await zipFs.importBlob(blob);
	directory = zipFs.getChildByName("import");
	firstEntry = directory.children[0];
	const text = await firstEntry.getText();
	zip.terminateWorkers();
	if (text != NEW_TEXT_CONTENT) {
		throw new Error();
	}
}