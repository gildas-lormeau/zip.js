import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";
const FILENAME = "lorem.txt";
const PASSWORD = "password";
const WRONG_PASSWORD = "notagoodpassword";
// ZipCrypto verifies a password against a single byte, so a wrong password is accepted by chance once in
// 256 archives, and the archive differs every run because the 12-byte encryption header is random (AES uses
// two bytes, i.e. once in 65536). The fixture is therefore built until the wrong password is really
// rejected, which is a property of the archive and not of the code under test. A reader that never checks
// the password exhausts the attempts and fails, which is the regression these assertions exist for, where a
// correct one needs a second attempt once in 256 runs and eight in a row are out of reach.
const MAX_FIXTURE_ATTEMPTS = 8;

export { test };

async function test() {
	zip.configure({ chunkSize: 128, useWebWorkers: true });
	const zipReader = new zip.ZipReader(new zip.BlobReader(await buildCheckedArchive({}, "AES")), { checkPasswordOnly: true });
	const entries = await zipReader.getEntries();
	let data, undefinedData;
	try {
		undefinedData = await entries[0].getData();
	} catch (error) {
		if (error.message == zip.ERR_ENCRYPTED) {
			try {
				undefinedData = await entries[0].getData(null, { password: WRONG_PASSWORD });
			} catch (error) {
				if (error.message == zip.ERR_INVALID_PASSWORD) {
					undefinedData = await entries[0].getData(null, { password: PASSWORD, checkCrc32: true });
					const textWriter = new zip.TextWriter();
					data = await entries[0].getData(textWriter, { password: PASSWORD, checkPasswordOnly: false });
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
		const label = writerOptions.zipCrypto ? "ZipCrypto" : "AES";
		const data = await buildCheckedArchive(writerOptions, label);
		for (const passThrough of [true, "compressed"]) {
			await assertPasswordChecked(data, { passThrough, password: WRONG_PASSWORD },
				zip.ERR_INVALID_PASSWORD, label + " with passThrough " + passThrough);
			await assertPasswordChecked(data, { passThrough, password: PASSWORD },
				undefined, label + " with passThrough " + passThrough);
		}
	}
}

async function buildCheckedArchive(writerOptions, label) {
	for (let attempt = 0; attempt < MAX_FIXTURE_ATTEMPTS; attempt++) {
		const blobWriter = new zip.BlobWriter("application/zip");
		const zipWriter = new zip.ZipWriter(blobWriter, Object.assign({ password: PASSWORD }, writerOptions));
		await zipWriter.add(FILENAME, new zip.TextReader(TEXT_CONTENT));
		await zipWriter.close();
		const data = await blobWriter.getData();
		const thrownMessage = await getPasswordCheckMessage(data, { password: WRONG_PASSWORD });
		if (thrownMessage == zip.ERR_INVALID_PASSWORD) {
			return data;
		}
	}
	throw new Error("expected one of " + MAX_FIXTURE_ATTEMPTS + " " + label +
		" archives to reject the password " + JSON.stringify(WRONG_PASSWORD) + ", none did");
}

async function assertPasswordChecked(data, options, expectedMessage, label) {
	const thrownMessage = await getPasswordCheckMessage(data, options);
	if (thrownMessage != expectedMessage) {
		throw new Error("expected " + label + " and the password " + JSON.stringify(options.password) +
			" to give " + expectedMessage + ", got " + thrownMessage);
	}
}

async function getPasswordCheckMessage(data, options) {
	const zipReader = new zip.ZipReader(new zip.BlobReader(data), { checkPasswordOnly: true });
	const [entry] = await zipReader.getEntries();
	let thrownMessage;
	try {
		await entry.getData(null, options);
	} catch (error) {
		thrownMessage = error.message;
	}
	await zipReader.close();
	return thrownMessage;
}