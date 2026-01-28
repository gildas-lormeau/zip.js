/* global Blob */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	await testBasicPrependZip();
	await testPrependZipWithCompression();
	await testPrependZipWithEncryption();
	await testPrependZipPreservesDates();
	await testPrependZipPreservesAttributes();
	await testPrependZipWithZip64();
	await testPrependZipDuplicateNameError();
	await testPrependZipThenRemove();
	await testPrependZipWithDataDescriptor();
	await testPrependZipWithExtendedTimestamp();
	await zip.terminateWorkers();
}

async function testBasicPrependZip() {
	// Create initial archive
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("original.txt", new zip.BlobReader(new Blob([TEXT_CONTENT])));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend and add new file
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.add("added.txt", new zip.BlobReader(new Blob(["New content"])));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();

	if (entries.length !== 2) {
		throw new Error("testBasicPrependZip: Expected 2 entries, got " + entries.length);
	}

	const originalEntry = entries.find(e => e.filename === "original.txt");
	const addedEntry = entries.find(e => e.filename === "added.txt");

	if (!originalEntry || !addedEntry) {
		throw new Error("testBasicPrependZip: Missing expected entries");
	}

	const originalContent = await originalEntry.getData(new zip.TextWriter());
	if (originalContent !== TEXT_CONTENT) {
		throw new Error("testBasicPrependZip: Original content mismatch");
	}

	await zipReader.close();
}

async function testPrependZipWithCompression() {
	// Create with max compression
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1, { level: 9 });
	await zipWriter1.add("compressed.txt", new zip.BlobReader(new Blob([TEXT_CONTENT.repeat(10)])));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend and add with different level
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2, { level: 1 });
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.add("fast.txt", new zip.BlobReader(new Blob(["Fast compression"])));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify both decompress correctly
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();

	if (entries.length !== 2) {
		throw new Error("testPrependZipWithCompression: Expected 2 entries, got " + entries.length);
	}

	for (const entry of entries) {
		const content = await entry.getData(new zip.TextWriter());
		if (!content || content.length === 0) {
			throw new Error("testPrependZipWithCompression: Failed to decompress " + entry.filename);
		}
	}

	await zipReader.close();
}

async function testPrependZipWithEncryption() {
	const password = "secret123";

	// Create encrypted archive using zipCrypto (traditional ZIP encryption)
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("secret.txt", new zip.BlobReader(new Blob(["Encrypted content"])), { password, zipCrypto: true });
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend and add another encrypted file
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.add("secret2.txt", new zip.BlobReader(new Blob(["More secrets"])), { password, zipCrypto: true });
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify decryption works
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();

	if (entries.length !== 2) {
		throw new Error("testPrependZipWithEncryption: Expected 2 encrypted entries, got " + entries.length);
	}

	for (const entry of entries) {
		if (!entry.encrypted) {
			throw new Error("testPrependZipWithEncryption: Entry " + entry.filename + " should be encrypted");
		}
		const content = await entry.getData(new zip.TextWriter(), { password });
		if (!content) {
			throw new Error("testPrependZipWithEncryption: Failed to decrypt " + entry.filename);
		}
	}

	await zipReader.close();
}

async function testPrependZipPreservesDates() {
	const originalDate = new Date(2020, 5, 15, 10, 30, 0);

	// Create with specific date
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("dated.txt", new zip.BlobReader(new Blob(["content"])), {
		lastModDate: originalDate
	});
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify date preserved
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();
	await zipReader.close();

	const entry = entries[0];
	// DOS date has 2-second resolution, so check within tolerance
	const timeDiff = Math.abs(entry.lastModDate.getTime() - originalDate.getTime());
	if (timeDiff > 2000) {
		throw new Error("testPrependZipPreservesDates: Date not preserved: expected " + originalDate + ", got " + entry.lastModDate);
	}
}

async function testPrependZipPreservesAttributes() {
	// Create with executable attribute
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("script.sh", new zip.BlobReader(new Blob(["#!/bin/bash"])), {
		executable: true
	});
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify executable attribute preserved
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();
	await zipReader.close();

	const entry = entries[0];
	if (!entry.executable) {
		throw new Error("testPrependZipPreservesAttributes: executable attribute not preserved");
	}
}

async function testPrependZipWithZip64() {
	// Create ZIP64 archive
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1, { zip64: true });
	await zipWriter1.add("zip64.txt", new zip.BlobReader(new Blob([TEXT_CONTENT])));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2, { zip64: true });
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.add("zip64-2.txt", new zip.BlobReader(new Blob(["More content"])));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();
	await zipReader.close();

	if (entries.length !== 2) {
		throw new Error("testPrependZipWithZip64: Expected 2 ZIP64 entries, got " + entries.length);
	}
}

async function testPrependZipDuplicateNameError() {
	// Create initial archive
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("duplicate.txt", new zip.BlobReader(new Blob(["original"])));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend and try to add same filename
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));

	let errorThrown = false;
	try {
		await zipWriter2.add("duplicate.txt", new zip.BlobReader(new Blob(["duplicate"])));
	} catch (error) {
		if (error.message === zip.ERR_DUPLICATED_NAME) {
			errorThrown = true;
		}
	}

	if (!errorThrown) {
		throw new Error("testPrependZipDuplicateNameError: Should throw ERR_DUPLICATED_NAME for duplicate filename");
	}

	await zipWriter2.close();
}

async function testPrependZipThenRemove() {
	// Create with 2 files
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1);
	await zipWriter1.add("keep.txt", new zip.BlobReader(new Blob(["keep"])));
	await zipWriter1.add("remove.txt", new zip.BlobReader(new Blob(["remove"])));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend and remove one
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	const removed = zipWriter2.remove("remove.txt");

	if (!removed) {
		throw new Error("testPrependZipThenRemove: remove() should return true");
	}

	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify only one entry remains
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();
	await zipReader.close();

	if (entries.length !== 1 || entries[0].filename !== "keep.txt") {
		throw new Error("testPrependZipThenRemove: Should have only keep.txt after remove");
	}
}

async function testPrependZipWithDataDescriptor() {
	// Create with data descriptor
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1, { dataDescriptor: true });
	await zipWriter1.add("descriptor.txt", new zip.BlobReader(new Blob([TEXT_CONTENT])));
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify content intact
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();
	const content = await entries[0].getData(new zip.TextWriter());
	await zipReader.close();

	if (content !== TEXT_CONTENT) {
		throw new Error("testPrependZipWithDataDescriptor: Content mismatch with data descriptor entry");
	}
}

async function testPrependZipWithExtendedTimestamp() {
	const lastModDate = new Date(2023, 0, 15, 8, 30, 0);

	// Create with extended timestamps
	const blobWriter1 = new zip.BlobWriter("application/zip");
	const zipWriter1 = new zip.ZipWriter(blobWriter1, { extendedTimestamp: true });
	await zipWriter1.add("timestamps.txt", new zip.BlobReader(new Blob(["content"])), {
		lastModDate
	});
	await zipWriter1.close();
	const blob1 = await blobWriter1.getData();

	// Prepend
	const blobWriter2 = new zip.BlobWriter("application/zip");
	const zipWriter2 = new zip.ZipWriter(blobWriter2);
	await zipWriter2.prependZip(new zip.BlobReader(blob1));
	await zipWriter2.close();
	const blob2 = await blobWriter2.getData();

	// Verify timestamps preserved
	const zipReader = new zip.ZipReader(new zip.BlobReader(blob2));
	const entries = await zipReader.getEntries();
	await zipReader.close();

	const entry = entries[0];

	// Check within 1 second tolerance
	if (Math.abs(entry.lastModDate.getTime() - lastModDate.getTime()) > 1000) {
		throw new Error("testPrependZipWithExtendedTimestamp: lastModDate not preserved");
	}
}
