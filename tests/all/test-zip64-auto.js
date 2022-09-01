/* global Blob */

import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

class CustomBlobWriter extends zip.Writer {

	constructor(contentType) {
		super();
		const writer = this;
		writer.contentType = contentType;
		writer.arrayBuffersMaxlength = 8;
		initArrayBuffers(writer);
	}

	writeUint8Array(array) {
		const writer = this;
		if (writer.arrayBuffers.length == writer.arrayBuffersMaxlength) {
			flushArrayBuffers(writer);
		}
		writer.arrayBuffers.push(array.buffer);
	}

	getData() {
		const writer = this;
		if (!writer.blob) {
			if (writer.arrayBuffers.length) {
				flushArrayBuffers(writer);
			}
			writer.blob = writer.pendingBlob;
			initArrayBuffers(writer);
		}
		return writer.blob;
	}
}

function initArrayBuffers(blobWriter) {
	blobWriter.pendingBlob = new Blob([], { type: blobWriter.contentType });
	blobWriter.arrayBuffers = [];
}

function flushArrayBuffers(blobWriter) {
	blobWriter.pendingBlob = new Blob([blobWriter.pendingBlob, ...blobWriter.arrayBuffers], { type: blobWriter.contentType });
	blobWriter.arrayBuffers = [];
}

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new CustomBlobWriter("application/zip");
	blobWriter.writable.size = 0;
	let array = new Uint8Array(64 * 1024 * 1024);
	for (let index = 0; index < 63; index++) {
		blobWriter.writeUint8Array(array);
		blobWriter.writable.size += array.length;
	}
	array = new Uint8Array((64 * 1024 * 1024) - 1265);
	blobWriter.writeUint8Array(array);
	blobWriter.writable.size += array.length;
	const zipWriter = new zip.ZipWriter(blobWriter, { keepOrder: true });
	await Promise.all([
		zipWriter.add(FILENAME, new zip.BlobReader(BLOB)),
		zipWriter.add(FILENAME + "1", new zip.BlobReader(BLOB)),
		zipWriter.add(FILENAME + "2", new zip.BlobReader(BLOB))
	]);
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	await zipReader.close();
	zip.terminateWorkers();
	if (entries[0].zip64 || entries[1].zip64 || !entries[2].zip64) {
		throw new Error();
	}
}