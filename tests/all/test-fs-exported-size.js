/* global Blob, TextEncoder */

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
		await testExtraFields();
		await testEncrypted();
		await testRelativePath();
		await testPassThrough();
		await testUsdz();
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

async function testExtraFields() {
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), { level: 0, ntfsTimestamp: true });
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), { level: 0, useUnicodeFileNames: false });
	await assertExportedSize(root => root.addText("café.txt", TEXT_CONTENT), { level: 0, useUnicodeFileNames: false });
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), {
		level: 0,
		localExtraField: new Map([[64768, new Uint8Array(6).fill(1)]])
	});
	await assertExportedSize(root => root.addText("text.txt", TEXT_CONTENT), {
		level: 0,
		extraField: new Map([[64769, new Uint8Array(10).fill(2)]])
	});
	await assertExportedSize(root => root.addText("café.txt", TEXT_CONTENT), {
		level: 0,
		encodeText: text => new TextEncoder().encode(text.normalize("NFD"))
	});
}

async function testUsdz() {
	await assertExportedSize(root => {
		root.addUint8Array("a.bin", BINARY_CONTENT);
		root.addUint8Array("b.bin", new Uint8Array(37).fill(66));
	}, { level: 0, usdz: true });
	await assertExportedSize(root => {
		const directory = root.addDirectory("docs");
		directory.addUint8Array("readme.bin", BINARY_CONTENT);
		directory.addDirectory("img").addUint8Array("logo.bin", BINARY_CONTENT);
		root.addUint8Array("root.bin", new Uint8Array(7).fill(66));
	}, { level: 0, usdz: true, bufferedWrite: false });
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
	for (const sourceOptions of [
		{ level: 9 },
		{ level: 9, password: "password" },
		{ level: 9, password: "password", zipCrypto: true }
	]) {
		const source = new zip.fs.FS();
		source.root.addText("compressed.txt", TEXT_CONTENT.repeat(50));
		source.root.addUint8Array("stored.bin", BINARY_CONTENT, { level: 0 });
		const deflated = await source.exportBlob(sourceOptions);
		const zipFs = new zip.fs.FS();
		await zipFs.importBlob(deflated, { passThrough: true });
		const options = { passThrough: true };
		const predictedSize = await zipFs.getExportedSize(options);
		const blob = await zipFs.exportBlob(options);
		if (blob.size != predictedSize) {
			throw new Error();
		}
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
	await assertUndeterminedSize(root => root.addText("text.txt", TEXT_CONTENT), {
		level: 0,
		signCentralDirectory: () => new Uint8Array(64)
	});
	await assertUndeterminedSize(root => {
		root.addDirectory("docs").addText("readme.txt", TEXT_CONTENT);
		root.addText("root.txt", TEXT_CONTENT);
	}, { level: 0, usdz: true });
	await assertUndeterminedSize(root => root.addText("text.txt", TEXT_CONTENT), { level: 0, usdz: true, keepOrder: false });
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
