import * as zip from "../zip-lib.js";

const EXPECTED_MIME_TYPES = {
	"lorem.txt": "text/plain",
	"lorem.atom": "application/atom+xml",
	"lorem.davmount": "application/davmount+xml",
	"lorem.msi": "application/x-ms-installer",
	"lorem.vrm": "x-world/x-vrml",
	"lorem.xof": "x-world/x-vrml",
	"lorem.avif": "image/avif",
	"lorem.plb": "application/vnd.3gpp.pic-bw-large",
	"lorem.psb": "application/vnd.3gpp.pic-bw-small",
	"lorem.PNG": "image/png",
	"lorem.unknownext": "application/octet-stream",
	"lorem": "application/octet-stream",
	"lorem.constructor": "application/octet-stream"
};

export { test };

async function test() {
	for (const [filename, expectedMimeType] of Object.entries(EXPECTED_MIME_TYPES)) {
		if (zip.getMimeType(filename) != expectedMimeType) {
			throw new Error(filename + ": " + zip.getMimeType(filename));
		}
	}
	if (zip.getMimeType() != "application/octet-stream") {
		throw new Error();
	}
}
