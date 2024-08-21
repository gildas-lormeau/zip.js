import * as zip from "../../index.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.";

export { test };

async function test() {
	let zipFs = new zip.fs.FS();
	zipFs.addText("text.txt", TEXT_CONTENT);
	let blobEncryptedLevel1 = await zipFs.exportBlob({ password: "password", encryptionStrength: 1 });
	zipFs = new zip.fs.FS();
	zipFs.addText("text.txt", TEXT_CONTENT);
	let blobEncrypted = await zipFs.exportBlob({ password: "password" });
	zipFs = new zip.fs.FS();
	zipFs.addText("text.txt", TEXT_CONTENT);
	let blobZipCrypto = await zipFs.exportBlob({ password: "password", zipCrypto: true });
	zipFs = new zip.fs.FS();
	zipFs.addText("text.txt", TEXT_CONTENT);
	let blobUncompressed = await zipFs.exportBlob({ level: 0 });
	zipFs = new zip.fs.FS();
	let directory = zipFs.addDirectory("import-encrypted-level1");
	await directory.importBlob(blobEncryptedLevel1, { passThrough: true });
	directory = zipFs.addDirectory("import-encrypted");
	await directory.importBlob(blobEncrypted, { passThrough: true });
	directory = zipFs.addDirectory("import-zip-crypto");
	await directory.importBlob(blobZipCrypto, { passThrough: true });
	directory = zipFs.addDirectory("import-uncompressed");
	await directory.importBlob(blobUncompressed, { passThrough: true });
	const blob = await zipFs.exportBlob();
	zipFs = new zip.fs.FS();
	await zipFs.importBlob(blob);
	directory = zipFs.getChildByName("import-encrypted-level1");
	let firstEntry = directory.children[0];
	let text = await firstEntry.getText(null, { password: "password" });
	if (text != TEXT_CONTENT || firstEntry.uncompressedSize != TEXT_CONTENT.length) {
		throw new Error();
	}
	directory = zipFs.getChildByName("import-encrypted");
	firstEntry = directory.children[0];
	text = await firstEntry.getText(null, { password: "password" });
	if (text != TEXT_CONTENT || firstEntry.uncompressedSize != TEXT_CONTENT.length) {
		throw new Error();
	}
	directory = zipFs.getChildByName("import-zip-crypto");
	firstEntry = directory.children[0];
	text = await firstEntry.getText(null, { password: "password", checkSignature: true });
	if (text != TEXT_CONTENT || firstEntry.uncompressedSize != TEXT_CONTENT.length) {
		throw new Error();
	}
	directory = zipFs.getChildByName("import-uncompressed");
	firstEntry = directory.children[0];
	text = await firstEntry.getText(null, { checkSignature: true });
	await zip.terminateWorkers();
	if (text != TEXT_CONTENT || firstEntry.uncompressedSize != TEXT_CONTENT.length) {
		throw new Error();
	}
}