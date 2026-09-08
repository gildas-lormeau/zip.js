import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const blobWriter = new zip.BlobWriter("application/zip");
	const zipWriter = new zip.ZipWriter(blobWriter, { password: "password" });
	await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
	await zipWriter.close();
	const zipReader = new zip.ZipReader(new zip.BlobReader(await blobWriter.getData()), { checkPasswordOnly: true });
	const entries = await zipReader.getEntries();
	let data, undefinedData;
	try {
		undefinedData = await entries[0].getData();
	} catch (error) {
		if (error.message == zip.ERR_ENCRYPTED) {
			try {
				undefinedData = await entries[0].getData(null, { password: "notagoodpassword" });
			} catch (error) {
				if (error.message == zip.ERR_INVALID_PASSWORD) {
					undefinedData = await entries[0].getData(null, { password: "password", checkCrc32: true });
					const textWriter = new zip.TextWriter();
					data = await entries[0].getData(textWriter, { password: "password", checkPasswordOnly: false });
				} else {
					throw error;
				}
			}
		} else {
			throw error;
		}
	}
	await zipReader.close();
	await checksThePasswordUnderPassThrough();
	await zip.terminateWorkers();
	if (undefinedData !== undefined || data !== TEXT_CONTENT) {
		throw new Error();
	}
}

// Verifying a password needs the decryption stream, since the sentinel meaning "the password is correct" is
// raised by that stream. passThrough normally skips the encryption stage, which used to leave nothing able to
// raise it: every password, wrong ones included, was reported as valid and the whole entry was streamed.
async function checksThePasswordUnderPassThrough() {
	for (const writerOptions of [{}, { zipCrypto: true }]) {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter, Object.assign({ password: "password" }, writerOptions));
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
		await zipWriter.close();
		const data = await blobWriter.getData();
		const label = writerOptions.zipCrypto ? "ZipCrypto" : "AES";
		for (const passThrough of [true, "compressed"]) {
			await assertPasswordChecked(data, { passThrough, password: "notagoodpassword" },
				zip.ERR_INVALID_PASSWORD, label + " with passThrough " + passThrough);
			await assertPasswordChecked(data, { passThrough, password: "password" },
				undefined, label + " with passThrough " + passThrough);
		}
	}
}

async function assertPasswordChecked(data, options, expectedMessage, label) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(data), { checkPasswordOnly: true });
	const [entry] = await zipReader.getEntries();
	let thrownMessage;
	try {
		await entry.getData(null, options);
	} catch (error) {
		thrownMessage = error.message;
	}
	await zipReader.close();
	if (thrownMessage != expectedMessage) {
		throw new Error("expected " + label + " and the password " + JSON.stringify(options.password) +
			" to give " + expectedMessage + ", got " + thrownMessage);
	}
}