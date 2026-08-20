/* global CompressionStream, DecompressionStream */

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const PASSWORD = "password";
const RAW_DEFLATE_FORMATS = ["deflate-raw", "deflate64-raw"];

let rejectedRawDeflateCount = 0;

class CompressionStreamWithoutRawDeflate {
	constructor(format) {
		if (RAW_DEFLATE_FORMATS.includes(format)) {
			rejectedRawDeflateCount++;
			throw new TypeError("Unsupported compression format: " + format);
		}
		return new CompressionStream(format);
	}
}

class DecompressionStreamWithoutRawDeflate {
	constructor(format) {
		if (RAW_DEFLATE_FORMATS.includes(format)) {
			rejectedRawDeflateCount++;
			throw new TypeError("Unsupported compression format: " + format);
		}
		return new DecompressionStream(format);
	}
}

export { test };

async function test() {
	rejectedRawDeflateCount = 0;
	zip.configure({
		useWebWorkers: false,
		CompressionStream: CompressionStreamWithoutRawDeflate,
		DecompressionStream: DecompressionStreamWithoutRawDeflate
	});
	const text = await roundTrip();
	const encryptedText = await roundTrip({ password: PASSWORD, encryptionStrength: 3 });
	await zip.terminateWorkers();
	if (text != TEXT_CONTENT || encryptedText != TEXT_CONTENT || rejectedRawDeflateCount < 3) {
		throw new Error();
	}
}

async function roundTrip(options = {}) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, options);
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const text = await entries[0].getData(new zip.TextWriter(), { checkCrc32: true, password: options.password });
	await zipReader.close();
	return text;
}
