/* global Blob */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
const ERR_DUPLICATE_IMPORTED_ENTRY = "Duplicate entry filename in the imported zip file";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testImplicitDirectoryMetadata();
		await testExplicitDirectoryMetadata();
		await testDirectoryWithoutSlash();
		await testFileUsedAsDirectory();
		await testReadOptionsPrecedence();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testDirectoryWithoutSlash() {
	// a directory entry stored without a trailing slash (directory flag set via
	// the external attributes) must be imported as a directory, not dropped
	const blob = await writeZip(zipWriter => zipWriter.add("folder/", undefined, { directory: true }));
	const array = new Uint8Array(await blob.arrayBuffer());
	for (let index = 0; index < array.length - 7; index++) {
		if (String.fromCharCode(...array.subarray(index, index + 7)) == "folder/") {
			array[index + 6] = 0x78;
		}
	}
	const fs = new zip.ZipFS();
	await fs.importBlob(new Blob([array]));
	const folder = fs.find("folderx");
	if (!folder || !folder.directory || !folder.data) {
		throw new Error();
	}
}

async function testImplicitDirectoryMetadata() {
	// an auto-created parent directory must not inherit the metadata of the file it contains
	const blob = await writeZip(zipWriter =>
		zipWriter.add("folder/file.txt", new zip.TextReader(TEXT_CONTENT), { comment: "FILECOMMENT" }));
	const fs = new zip.ZipFS();
	await fs.importBlob(blob);
	const folder = fs.find("folder");
	if (!folder || !folder.directory || folder.data || !fs.find("folder/file.txt")) {
		throw new Error();
	}
}

async function testExplicitDirectoryMetadata() {
	// an explicit directory entry keeps its metadata, whether imported before
	// or after the files it contains
	for (const directoryFirst of [true, false]) {
		const blob = await writeZip(async zipWriter => {
			if (directoryFirst) {
				await zipWriter.add("folder/", undefined, { directory: true, comment: "DIRCOMMENT" });
			}
			await zipWriter.add("folder/file.txt", new zip.TextReader(TEXT_CONTENT));
			if (!directoryFirst) {
				await zipWriter.add("folder/", undefined, { directory: true, comment: "DIRCOMMENT" });
			}
		});
		const fs = new zip.ZipFS();
		await fs.importBlob(blob);
		const folder = fs.find("folder");
		if (!folder || !folder.data || folder.data.comment != "DIRCOMMENT") {
			throw new Error();
		}
	}
}

async function testFileUsedAsDirectory() {
	// a name used both as a file and as a directory prefix must fail with a
	// controlled error instead of a TypeError
	const blob = await writeZip(async zipWriter => {
		await zipWriter.add("collision", new zip.TextReader(TEXT_CONTENT));
		await zipWriter.add("collision/file.txt", new zip.TextReader(TEXT_CONTENT));
	});
	const fs = new zip.ZipFS();
	try {
		await fs.importBlob(blob);
		throw new Error();
	} catch (error) {
		if (error.message != ERR_DUPLICATE_IMPORTED_ENTRY || !error.cause || error.cause.entry.filename != "collision/file.txt") {
			throw error;
		}
	}
}

async function testReadOptionsPrecedence() {
	// options given when reading an entry must override the options given at import time
	const blob = await writeZip(zipWriter =>
		zipWriter.add("secret.txt", new zip.TextReader(TEXT_CONTENT), { password: "good" }));
	const fs = new zip.ZipFS();
	await fs.importBlob(blob, { password: "bad" });
	const text = await fs.find("secret.txt").getText(undefined, { password: "good" });
	// options given at import time still apply when reading without options
	const fsDefault = new zip.ZipFS();
	await fsDefault.importBlob(blob, { password: "good" });
	const textDefault = await fsDefault.find("secret.txt").getText();
	if (text != TEXT_CONTENT || textDefault != TEXT_CONTENT) {
		throw new Error();
	}
}

async function writeZip(addEntries) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await addEntries(zipWriter);
	await zipWriter.close();
	return blobWriter.getData();
}
