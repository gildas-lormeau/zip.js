import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const ENTRY_SIZE = 4096;
const ENTRY_BYTE = 66;
const MAX_READS = 200;

class BinaryStringReader extends zip.Reader {

	constructor(binaryString) {
		super();
		this.binaryString = binaryString;
	}

	init() {
		super.init();
		this.size = this.binaryString.length;
	}

	readUint8Array(offset, length) {
		const result = new Uint8Array(length);
		let effectiveLength = 0;
		for (let indexCharacter = 0; indexCharacter < length && indexCharacter + offset < this.binaryString.length; indexCharacter++) {
			result[indexCharacter] = this.binaryString.charCodeAt(indexCharacter + offset) & 0xFF;
			effectiveLength++;
		}
		if (effectiveLength < length) {
			return result.slice(0, effectiveLength);
		} else {
			return result;
		}
	}
}

class BinaryStringWriter extends zip.Writer {

	constructor() {
		super();
		this.binaryString = "";
	}

	writeUint8Array(array) {
		for (let indexCharacter = 0; indexCharacter < array.length; indexCharacter++) {
			this.binaryString += String.fromCharCode(array[indexCharacter]);
		}
	}

	getData() {
		return this.binaryString;
	}
}

// a reader that declares its size and never returns a short read. The writer must bound the stream
// with that size: waiting for an empty array to end it instead would read this one forever.
class FixedSizeReader extends zip.Reader {

	constructor(size, byte) {
		super();
		this.declaredSize = size;
		this.byte = byte;
		this.reads = 0;
	}

	init() {
		super.init();
		this.size = this.declaredSize;
	}

	readUint8Array(offset, length) {
		this.reads++;
		if (this.reads > MAX_READS) {
			throw new Error("read " + this.reads + " times for " + this.declaredSize + " bytes");
		}
		return new Uint8Array(length).fill(this.byte);
	}
}

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	try {
		await testCustomReaderWriter();
		await testDeclaredSizeEndsTheStream();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testCustomReaderWriter() {
	const binaryStringWriter = new BinaryStringWriter();
	const zipWriter = new zip.ZipWriter(binaryStringWriter);
	await zipWriter.add(FILENAME, new BinaryStringReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new BinaryStringReader(await binaryStringWriter.getData()));
	const entries = await zipReader.getEntries();
	const data = await entries[0].getData(new BinaryStringWriter());
	await zipReader.close();
	if (TEXT_CONTENT != data) {
		throw new Error();
	}
}

async function testDeclaredSizeEndsTheStream() {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter);
	await zipWriter.add(FILENAME, new FixedSizeReader(ENTRY_SIZE, ENTRY_BYTE));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()), { checkCrc32: true });
	const entries = await zipReader.getEntries();
	const data = await entries[0].getData(new zip.Uint8ArrayWriter());
	await zipReader.close();
	if (data.length != ENTRY_SIZE || !data.every(value => value == ENTRY_BYTE)) {
		throw new Error("entry holds " + data.length + " bytes");
	}
}