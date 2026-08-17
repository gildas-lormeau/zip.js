/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.";
const BINARY_CONTENT = new Uint8Array(4096).fill(65);
const LAST_MOD_DATE = new Date(Date.UTC(2024, 4, 6, 7, 8, 9));
const PRE_EPOCH_DATE = new Date(Date.UTC(1900, 0, 1));

export { test };

async function test() {
	try {
		await testStoredEntries();
		await testNestedTree();
		await testEntryOptions();
		await testEncrypted();
		await testRelativePath();
		await testPassThrough();
		await testUndeterminedSize();
		await testNoReaderCreated();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testStoredEntries() {
	await assertExportedSize(root => {
		root.addText("text.txt", TEXT_CONTENT);
		root.addUint8Array("empty.bin", new Uint8Array(0));
		root.addUint8Array("binary.bin", BINARY_CONTENT);
		root.addText("café-日本語.txt", TEXT_CONTENT);
	}, { level: 0 });
}

async function testNestedTree() {
	await assertExportedSize(root => {
		const directory = root.addDirectory("docs");
		directory.addText("readme.txt", TEXT_CONTENT);
		directory.addDirectory("img").addUint8Array("logo.png", BINARY_CONTENT);
		root.addUint8Array("root.bin", BINARY_CONTENT);
	}, { level: 0 });
}

async function testEntryOptions() {
	await assertExportedSize(root => {
		root.addUint8Array("plain.bin", BINARY_CONTENT, { lastModDate: LAST_MOD_DATE });
		root.addUint8Array("dated.bin", BINARY_CONTENT, { lastAccessDate: LAST_MOD_DATE, creationDate: LAST_MOD_DATE });
		root.addUint8Array("old.bin", BINARY_CONTENT, { lastModDate: PRE_EPOCH_DATE });
		root.addUint8Array("owned.bin", BINARY_CONTENT, { uid: 501, gid: 20 });
		root.addUint8Array("noted.bin", BINARY_CONTENT, { comment: "a comment" });
		root.addUint8Array("nodd.bin", BINARY_CONTENT, { dataDescriptor: false });
	}, { level: 0 });
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), { level: 0, zip64: true });
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), { level: 0, extendedTimestamp: false });
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), { level: 0, bufferedWrite: false });
}

async function testEncrypted() {
	for (const options of [
		{ password: "password" },
		{ password: "password", encryptionStrength: 1 },
		{ password: "password", zipCrypto: true }
	]) {
		await assertExportedSize(root => {
			root.addText("text.txt", TEXT_CONTENT);
			root.addUint8Array("binary.bin", BINARY_CONTENT);
		}, Object.assign({ level: 0 }, options));
	}
}

async function testRelativePath() {
	const zipFs = new zip.fs.FS();
	const directory = zipFs.root.addDirectory("wrapper");
	directory.addText("a.txt", TEXT_CONTENT);
	directory.addUint8Array("b.bin", BINARY_CONTENT);
	const options = { level: 0, relativePath: true };
	const predictedSize = await directory.getExportedSize(options);
	const blob = await directory.exportBlob(options);
	if (blob.size != predictedSize) {
		throw new Error();
	}
}

async function testPassThrough() {
	const source = new zip.fs.FS();
	source.root.addText("compressed.txt", TEXT_CONTENT.repeat(50));
	source.root.addUint8Array("stored.bin", BINARY_CONTENT, { level: 0 });
	const deflated = await source.exportBlob({ level: 9 });
	const zipFs = new zip.fs.FS();
	await zipFs.importBlob(deflated, { passThrough: true });
	const options = { passThrough: true };
	const predictedSize = await zipFs.getExportedSize(options);
	const blob = await zipFs.exportBlob(options);
	if (blob.size != predictedSize) {
		throw new Error();
	}
}

async function testUndeterminedSize() {
	await assertUndeterminedSize(root => root.addText("text.txt", TEXT_CONTENT), {});
	await assertUndeterminedSize(root => root.addText("text.txt", TEXT_CONTENT), { compressionMethod: 8 });
	await assertUndeterminedSize(root => root.addReadable("stream.txt", new Blob([TEXT_CONTENT]).stream()), { level: 0 });
	await assertUndeterminedSize(root => {
		const zipFs = new zip.fs.FS();
		zipFs.root.addReadable("stream.txt", new Blob([TEXT_CONTENT]).stream());
		const clonedEntry = zipFs.root.children[0].clone();
		clonedEntry.parent = root;
		root.children.push(clonedEntry);
	}, { level: 0 });
}

async function testNoReaderCreated() {
	const zipFs = new zip.fs.FS();
	zipFs.root.addUint8Array("binary.bin", BINARY_CONTENT);
	await zipFs.getExportedSize({ level: 0 });
	if (zipFs.root.children[0].reader !== undefined) {
		throw new Error();
	}
	await assertExportedSize(root => root.addUint8Array("binary.bin", BINARY_CONTENT), { level: 0 });
}

async function assertExportedSize(build, options) {
	const zipFs = new zip.fs.FS();
	build(zipFs.root);
	const predictedSize = await zipFs.getExportedSize(options);
	const blob = await zipFs.exportBlob(options);
	if (blob.size != predictedSize) {
		throw new Error();
	}
}

async function assertUndeterminedSize(build, options) {
	const zipFs = new zip.fs.FS();
	build(zipFs.root);
	let errorMessage;
	try {
		await zipFs.getExportedSize(options);
	} catch (error) {
		errorMessage = error.message;
	}
	if (errorMessage != zip.ERR_UNDETERMINED_SIZE) {
		throw new Error();
	}
}
