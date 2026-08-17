// Locks the aggregated progress of the exports writing a zip file. `onstart`, `onprogress` and
// `onend` are documented together, so they must all report the archive as a whole: one `onstart`
// with the total size of the entries, one monotonic series of progress events covering all of them,
// and one `onend`, whatever the number of entries and whether they are imported from a zip file.

import * as zip from "../zip-lib.js";

const TEXT_CONTENT = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
const LARGE_CONTENT = new Uint8Array(256 * 1024).fill(65);
const SMALL_CONTENT = new Uint8Array(1024).fill(66);
const EXPECTED_SIZE = LARGE_CONTENT.length + SMALL_CONTENT.length * 2 + TEXT_CONTENT.length;

export { test };

async function test() {
	try {
		for (const options of [
			{ level: 0 },
			{ level: 9 },
			{ level: 0, bufferedWrite: false },
			{ level: 0, keepOrder: false },
			{ level: 0, password: "password" }
		]) {
			await testProgress(options);
		}
		await testImportedProgress();
	} finally {
		await zip.terminateWorkers();
	}
}

async function testProgress(options) {
	const watcher = createProgressWatcher(JSON.stringify(options));
	await createTree().exportUint8Array(Object.assign({}, options, watcher.options));
	watcher.assertCompleted(7);
}

async function testImportedProgress() {
	const data = await createTree().exportUint8Array({ level: 9 });
	const zipFs = new zip.fs.FS();
	await zipFs.importUint8Array(data);
	const watcher = createProgressWatcher("imported");
	await zipFs.exportUint8Array(watcher.options);
	watcher.assertCompleted(4);
}

function createTree() {
	const zipFs = new zip.fs.FS();
	zipFs.root.addUint8Array("large.bin", LARGE_CONTENT);
	const directory = zipFs.root.addDirectory("docs");
	directory.addText("readme.txt", TEXT_CONTENT);
	directory.addUint8Array("small.bin", SMALL_CONTENT);
	directory.addDirectory("empty");
	zipFs.root.addUint8Array("empty.bin", new Uint8Array(0));
	zipFs.root.addUint8Array("last.bin", SMALL_CONTENT);
	return zipFs;
}

function createProgressWatcher(label) {
	const starts = [];
	const ends = [];
	const totalSizes = new Set();
	let previousProgress = 0;
	let lastProgress = 0;
	let progressCount = 0;
	return {
		options: {
			onstart: total => starts.push(total),
			onprogress: (progress, totalSize) => {
				if (!starts.length) {
					throw new Error("progress reported before onstart (" + label + ")");
				}
				if (progress < previousProgress || progress > totalSize) {
					throw new Error("inconsistent progress " + progress + "/" + totalSize + " (" + label + ")");
				}
				previousProgress = progress;
				lastProgress = progress;
				totalSizes.add(totalSize);
				progressCount++;
			},
			onend: computedSize => ends.push(computedSize)
		},
		assertCompleted(minimumProgressCount) {
			if (progressCount < minimumProgressCount || totalSizes.size != 1 || !totalSizes.has(EXPECTED_SIZE) || lastProgress != EXPECTED_SIZE) {
				throw new Error("progress stopped at " + lastProgress + " of " + [...totalSizes] +
					" after " + progressCount + " events, expected " + EXPECTED_SIZE + " (" + label + ")");
			}
			assertSingleEvent(starts, "onstart", label);
			assertSingleEvent(ends, "onend", label);
		}
	};
}

function assertSingleEvent(sizes, name, label) {
	if (sizes.length != 1 || sizes[0] != EXPECTED_SIZE) {
		throw new Error("expected one " + name + " with " + EXPECTED_SIZE + ", got [" + sizes + "] (" + label + ")");
	}
}
