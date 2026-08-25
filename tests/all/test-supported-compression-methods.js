import * as zip from "../zip-lib.js";

export { test };

const COMPRESSION_METHOD_STORE = 0;
const COMPRESSION_METHOD_DEFLATE = 8;
const COMPRESSION_METHOD_DEFLATE_64 = 9;

async function test() {
	const supportedMethods = zip.getSupportedCompressionMethods();
	checkMethod(supportedMethods, COMPRESSION_METHOD_STORE, true, true);
	checkMethod(supportedMethods, COMPRESSION_METHOD_DEFLATE, true, true);
	checkMethod(supportedMethods, COMPRESSION_METHOD_DEFLATE_64, false, true);
}

function checkMethod(supportedMethods, compressionMethod, expectedCompression, expectedDecompression) {
	const supportedMethod = supportedMethods.find(method => method.compressionMethod == compressionMethod);
	if (!supportedMethod || supportedMethod.registered ||
		supportedMethod.compression !== expectedCompression || supportedMethod.decompression !== expectedDecompression) {
		throw new Error("unexpected support for compression method " + compressionMethod);
	}
}
