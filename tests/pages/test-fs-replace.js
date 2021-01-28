/* eslint-disable no-console */
/* global zip, document */

"use strict";

const NEW_TEXT_CONTENT = "This is not the same text";
const url = "../data/lorem.zip";

test().catch(error => console.error(error));

async function test() {
	document.body.innerHTML = "...";
	zip.configure({
		chunkSize: 128
	});
	let zipFs = new zip.fs.FS();
	let directory = zipFs.addDirectory("import");
	await directory.importHttpContent(url);
	let firstEntry = directory.children[0];
	firstEntry.replaceText(NEW_TEXT_CONTENT);
	const blob = await zipFs.exportBlob();
	zipFs = new zip.fs.FS();
	await zipFs.importBlob(blob);
	directory = zipFs.getChildByName("import");
	firstEntry = directory.children[0];
	const text = await firstEntry.getText();
	if (text == NEW_TEXT_CONTENT && firstEntry.uncompressedSize == NEW_TEXT_CONTENT.length) {
		document.body.innerHTML = "ok";
	}
}

// eslint-disable-next-line no-unused-vars
function logText(text) {
	console.log(text);
	console.log("--------------");
}