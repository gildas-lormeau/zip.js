/* global URL */

import * as zip from "../../index.js";

const PATHS = [
	"./../data/lorem-split.z01",
	"./../data/lorem-split.z02",
	"./../data/lorem-split.z03",
	"./../data/lorem-split.z04",
	"./../data/lorem-split.z05",
	"./../data/lorem-split.z06",
	"./../data/lorem-split.z07",
	"./../data/lorem-split.zip",
];
const UNCOMPRESSED_SIZES = [
	1162,
	204946,
	603889,
	809738
];

export { test };

async function test() {
	zip.configure({ chunkSize: 16 * 1024, useWebWorkers: true });
	const readers = PATHS.map(url => new zip.HttpReader(new URL(url, import.meta.url).href, { preventHeadRequest: true }));
	const zipReader = new zip.ZipReader(new zip.SplitDataReader(readers));
	const entries = await zipReader.getEntries();
	const results = await Promise.all(UNCOMPRESSED_SIZES.map(async (uncompressedSize, indexEntry) =>
		(await entries[indexEntry].getData(new zip.TextWriter())).length == uncompressedSize
	));
	await zipReader.close();
	zip.terminateWorkers();
	if (results.includes(false)) {
		throw new Error();
	}
}