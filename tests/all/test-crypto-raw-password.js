/* global Blob, setTimeout, clearTimeout */

// The last case reads an entry with a string password next to an empty raw password, which means
// "no raw password" like an empty string does: the AES stream used to wait forever for a key it
// never derived, because the empty array was normalized to 0 instead of undefined.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const BLOB = new Blob([TEXT_CONTENT], { type: zip.getMimeType(FILENAME) });

export { test };

const PASSWORD = "password";
const TIMEOUT = 10000;

async function test() {
	zip.configure({ useWebWorkers: true });
	await testRawPassword(false);
	await testRawPassword(true);
	await testEmptyRawPassword(false);
	await testEmptyRawPassword(true);
}

async function testEmptyRawPassword(zipCrypto) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { password: PASSWORD, zipCrypto });
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const [entry] = await zipReader.getEntries();
	let timeout;
	const data = await Promise.race([
		entry.getData(new zip.BlobWriter(), { password: PASSWORD, rawPassword: new Uint8Array(0) }),
		new Promise((_, reject) => timeout = setTimeout(() => reject(new Error("read with an empty raw password timed out")), TIMEOUT))
	]).finally(() => clearTimeout(timeout));
	await zipReader.close();
	await zip.terminateWorkers();
	if (TEXT_CONTENT != await data.text()) {
		throw new Error();
	}
}

async function testRawPassword(zipCrypto) {
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { rawPassword: new Uint8Array([0xce, 0xd2, 0xca, 0xc7, 0xc3, 0xdc, 0xb4, 0x61]), encryptionStrength: 3, zipCrypto });
	await zipWriter.add(FILENAME, new zip.BlobReader(BLOB));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()));
	const entries = await zipReader.getEntries();
	const dataBlobWriter = new zip.BlobWriter(zip.getMimeType(entries[0].filename));
	const data = await entries[0].getData(dataBlobWriter, { rawPassword: new Uint8Array([0xce, 0xd2, 0xca, 0xc7, 0xc3, 0xdc, 0xb4, 0x61]) });
	await zipReader.close();
	await zip.terminateWorkers();
	if (TEXT_CONTENT != await data.text()) {
		throw new Error();
	}
}