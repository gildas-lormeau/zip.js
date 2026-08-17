import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.".repeat(100);

export { test };

async function test() {
	await testSizes({});
	await testSizes({ level: 0 });
	await testSizes({ password: "password" });
	await testSizes({ password: "password", zipCrypto: true });
	await zip.terminateWorkers();
}

async function testSizes(options) {
	let zipFs = new zip.fs.FS();
	zipFs.addText("text.txt", TEXT_CONTENT);
	const blob = await zipFs.exportBlob(options);
	zipFs = new zip.fs.FS();
	await zipFs.importBlob(blob, { passThrough: true });
	const entry = zipFs.getChildByName("text.txt");
	const compressedSize = entry.data.compressedSize;
	if (entry.uncompressedSize != compressedSize) {
		throw new Error();
	}
	const data = await entry.getData(new zip.Uint8ArrayWriter(), { passThrough: true });
	if (data.length != compressedSize || entry.reader.size != compressedSize || entry.uncompressedSize != compressedSize) {
		throw new Error();
	}
	let lastIndex, lastTotal;
	await zipFs.exportBlob({
		passThrough: true,
		onprogress: (index, total) => {
			lastIndex = index;
			lastTotal = total;
		}
	});
	if (lastIndex != compressedSize || lastTotal != compressedSize) {
		throw new Error();
	}
}
